import { useState } from "react";
import { Login } from "@/components/login/Login";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatList } from "@/components/chatList/ChatList";
import { ChatPanel } from "@/components/chatPanel/ChatPanel";
import type { Chat, Credentials } from "@/types/chat";
import styles from './app.module.css';

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  if (!credentials) {
    return <Login onLogin={setCredentials} />;
  }

  const activeChat = chats.find((c) => c.chatId === activeChatId) ?? null;

  const handleLogout = () => {
    setCredentials(null);
    setChats([]);
    setActiveChatId(null);
  };

  return (
    <AppLayout
      phone={credentials.idInstance}
      onLogout={handleLogout}
    >
      <div className={`${styles.chatWrapper} ${activeChat ? styles.hasActiveChat : ''}`}>
        <ChatList
          credentials={credentials}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onCreateChat={(chat) => {
            setChats((prev) => [...prev, chat]);
            setActiveChatId(chat.chatId);
          }}
        />
        <div className={styles.panelWrapper}>
          {activeChat ? 
            <ChatPanel
              key={activeChat.chatId}
              credentials={credentials}
              chatId={activeChat.chatId}
              chatName={activeChat.name}
              onBack={() => setActiveChatId(null)}
              onContactName={(name) => {
                setChats((prev) =>
                  prev.map((c) =>
                    c.chatId === activeChat.chatId
                      ? { ...c, name }
                      : c
                  )
                );
              }}
            />
             : 
              <div className={styles.chatPanelPlug}>Выберите или создайте новый чат</div>
            }
        </div>
      </div>
    </AppLayout>
  )
}

export default App
