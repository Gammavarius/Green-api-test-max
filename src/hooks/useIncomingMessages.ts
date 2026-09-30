import { useEffect, useRef } from "react";
import { receiveNotification, deleteNotification } from "@/api/greenApi";
import { generateId } from "@/utils/uuid";
import type { Credentials } from "@/types/chat";

export interface IncomingMessage {
    id: string;
    chatId: string;
    name: string;
    text: string;
    time: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useIncomingMessages(
    creds: Credentials,
    onMessage: (m: IncomingMessage) => void
) {
    const { idInstance, apiTokenInstance } = creds;

    const handlerRef = useRef(onMessage);
    useEffect(() => { handlerRef.current = onMessage; });

    useEffect(() => {
        const controller = new AbortController();

        const safeCreds: Credentials = { idInstance, apiTokenInstance };

        (async () => {
            while(!controller.signal.aborted) {
                try {
                    const notification = await receiveNotification(safeCreds, controller.signal);
                    if (!notification) continue;

                    const { body } = notification;
                    if (body.typeWebhook === 'incomingMessageReceived' && body.senderData) {
                        const text = 
                            body.messageData?.textMessageData?.textMessage ??
                            body.messageData?.extendedTextMessageData?.text;
                        
                        if (text) {
                            handlerRef.current({
                                id: body.idMessage ?? generateId(),
                                chatId: body.senderData.chatId,
                                name: 
                                    body.senderData.senderContactName ||
                                    body.senderData.senderName ||
                                    body.senderData.chatName ||
                                    body.senderData.chatId,
                                text,
                                time: body.timestamp ?? Math.floor(Date.now() / 1000),
                            });
                        }
                    }

                    await deleteNotification(safeCreds, notification.receiptId);
                } catch  {
                    if (controller.signal.aborted) return;
                    await sleep(3000);
                }
            }
        })();

        return () => controller.abort();
    }, [idInstance, apiTokenInstance]);
}