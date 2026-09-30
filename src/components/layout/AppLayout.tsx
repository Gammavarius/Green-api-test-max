import type { ReactNode } from 'react';
import { Header } from "@/components/header/Header";
import styles from './appLayout.module.css';

type Props = {
    phone: string;
    onLogout: () => void;
    children: ReactNode;
}

export function AppLayout({ phone, onLogout, children}: Props) {
    return (
        <div className={styles.layout}>
            <Header phone={phone} onLogout={onLogout} />
            <main className={styles.main}>{children}</main>
        </div>
    )
}