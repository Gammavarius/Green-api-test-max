import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import type { Credentials } from '@/types/chat';
import { formatTime } from '@/utils/time';
import styles from './chatPanel.module.css';

type Props = {
    credentials: Credentials;
    chatId: string;
    chatName: string;
    onBack: () => void;
    onContactName: (name: string) => void;
}

export function ChatPanel({ credentials, chatId, chatName, onBack, onContactName}: Props) {
    const { messages, sendMessage, error } = useChat(credentials, chatId, onContactName);
    const [ input, setInput ] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isSending = messages.some((message) => message.out && message.status === 'pending' );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
        }, [chatId]);

    const handleSend = () => {
        const text = input.trim()
        if (!text || isSending) return;
        sendMessage(text);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <section className={styles.chatPanel}>
            <header className={styles.chatPanelHeader}>
                <button className={styles.backButton} onClick={onBack} aria-label="Назад к списку чатов">←</button>
                <h2 className={styles.chatNameHeader}>{chatName}</h2>
            </header>
            <div className={styles.chatMessages}>
                {messages.length === 0 && (
                    <p className={styles.emptyChat}>Сообщений пока нет. Напишите первым!</p>
                )}
                {messages.map((message) => (
                    <div key={message.id} className={`${styles.message} ${message.out ? styles.messageOut : styles.messageIn}`}>
                        <span className={styles.text}>{message.text}</span>
                        <span className={styles.time}>
                            {formatTime(message.time)}
                            {message.out && message.status === 'sent' && 
                                <span className={styles.sent}>✓</span>}
                            {message.out && message.status === 'pending' && 
                                <span className={styles.pending}>.</span>}
                            {message.out && message.status === 'failed' && 
                                <span className={styles.failed}>X</span>}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
                {error && <p className={styles.error}>{error}</p>}
            <footer className={styles.chatPanelFooter}>
                <input 
                    className={styles.input} 
                    type="text"
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Сообщение'
                    autoComplete='off'
                    ref={inputRef}
                    disabled={isSending} 
                />
                <button 
                    className={styles.sendButton}
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                >
                    {isSending ? 'Отправка...' : 'Отправить'}
                </button>
            </footer>
        </section>
    );
}