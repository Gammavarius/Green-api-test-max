import styles from './header.module.css';

type Props = {
    phone: string;
    onLogout: () => void;
};

export function Header({ phone, onLogout }: Props) {
    return (
        <header className={styles.pageHeader}>
            <h1 className={styles.logo}>МАКС</h1>
            <span className={styles.phone}>{phone}</span>
            <button className={styles.logoutButton} onClick={onLogout}>Выйти</button>
        </header>
    )
}