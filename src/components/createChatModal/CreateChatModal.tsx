import { useState } from 'react';
import { checkAccount } from '@/api/greenApi';
import type { Chat, Credentials } from '@/types/chat';
import styles from './createChatModal.module.css';

type Props = {
    credentials: Credentials;
    chats: Chat[];
    onClose: () => void;
    onCreate: (chat: Chat) => void;
    onSelectExisting: (chatId: string) => void;
};

export function CreateChatModal({ credentials, chats, onClose, onCreate, onSelectExisting }: Props) {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        const digits = phone.replace(/\D/g, '');

        if (digits.length < 10) {
        setError('Введите номер телефона (минимум 10 цифр)');
        return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { exist, chatId } = await checkAccount(credentials, digits);

            if (!exist || !chatId) {
                setError('На этом номере нет аккаунта MAX');
                return;
            }

            const existing = chats.find((c) => c.chatId === chatId);
            if (existing) {
                onSelectExisting(existing.chatId);
                return;
            }

            onCreate({ chatId, name: name.trim() || `+${digits}` });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка проверки номера');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleCreate();
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <header className={styles.header}>
                <h2 className={styles.title}>Новый чат</h2>
                <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">×</button>
                </header>

                <div className={styles.body}>
                <label className={styles.field}>
                    <span className={styles.label}>Номер телефона</span>
                    <input
                    className={styles.input}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 903 123 45 67"
                    autoFocus
                    disabled={isLoading}
                    />
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>Имя (необязательно)</span>
                    <input
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Имя"
                    disabled={isLoading}
                    />
                </label>

                {error && <p className={styles.error}>{error}</p>}
                </div>

                <footer className={styles.footer}>
                <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
                    Отмена
                </button>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Проверяем...' : 'Создать'}
                </button>
                </footer>
            </form>
        </div>
    );
}