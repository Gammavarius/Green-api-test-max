import { useCallback, useState } from "react";
import { sendMessage as sendMessageApi } from "@/api/greenApi";
import { useIncomingMessages, type IncomingMessage } from "@/hooks/useIncomingMessages";
import type { ChatMessage, Credentials } from "@/types/chat";
import { generateId } from "@/utils/uuid";

export function useChat(creds: Credentials, chatId: string, onContactName: (name: string) => void) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    useIncomingMessages(creds, useCallback((incoming: IncomingMessage) => {
        if (incoming.chatId !== chatId) return;

        if (incoming.name && incoming.name !== incoming.chatId) {
            onContactName(incoming.name);
        }
        setMessages((prev) => [
            ...prev,
            {
                id: incoming.id,
                text: incoming.text,
                out: false,
                time: incoming.time,
                status: 'received',
            }
        ]);
    }, [chatId, onContactName]));

    const sendMessage = useCallback(async(text: string) => {
        const tempId = generateId();
        const optimistic: ChatMessage = {
            id: tempId,
            text,
            out: true,
            time: Math.floor(Date.now() / 1000),
            status: 'pending',
        };

        setMessages((prev) => [...prev, optimistic]);

        try {
            const { idMessage } = await sendMessageApi(creds, { chatId, message: text});
            setMessages((prev) => 
                prev.map((message) =>
                message.id === tempId ? { ...message, id: idMessage, status: 'sent'} : message
            )   
        );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка отправки');
            setMessages((prev) =>
                prev.map((message) => (message.id === tempId ? { ...message, status: 'failed'} : message))
            );
        }
    }, [creds, chatId]);

    return {messages, sendMessage, error };
}