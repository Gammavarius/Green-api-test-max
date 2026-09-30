import { useState } from "react";
import type { Chat, Credentials } from "@/types/chat";
import { CreateChatModal } from "@/components/createChatModal/CreateChatModal";
import styles from './chatList.module.css';

type Props = {
    credentials: Credentials;
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onCreateChat: (chat: Chat) => void;
};

export function ChatList({ credentials, chats, activeChatId, onSelectChat, onCreateChat }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
     return (
    <aside className={styles.chatList}>
      <header className={styles.chatListHeader}>
        <h2 className={styles.title}>Чаты</h2>
        <button
          type="button"
          className={styles.createButton}
          aria-label="Создать чат"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </header>

      {chats.length === 0 ? (
        <div className={styles.noChats}>
          <p>Чатов пока нет</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {chats.map((chat) => (
            <li
              key={chat.chatId}
              className={`${styles.item} ${chat.chatId === activeChatId ? styles.active : ''}`}
              onClick={() => onSelectChat(chat.chatId)}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <CreateChatModal
            credentials={credentials}
            chats={chats}
            onClose={() => setIsModalOpen(false)}
            onCreate={(chat) => {
                onCreateChat(chat);
                setIsModalOpen(false);
          }}
          onSelectExisting={(chatId) => {
                onSelectChat(chatId);
                setIsModalOpen(false);
          }}
        />
      )}
    </aside>
  );
}