import { useState } from 'react';
import { getStateInstance, setSettings  } from "@/api/greenApi";
import type { Credentials } from "@/types/chat";
import styles from './login.module.css';
import eyeOpen from '@/assets/icons/eye_open.svg';
import eyeClosed from '@/assets/icons/eye_crossed_out.svg';

type Props ={
    onLogin: (creds: Credentials) => void;
}

export function Login({ onLogin }: Props) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTokenVisible, setIsTokenVisible] = useState(false);

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedId = idInstance.trim();
        const trimmedToken = apiTokenInstance.trim();

        if (!trimmedId || !trimmedToken) {
            setError('Заполните оба поля');
            return;
        }

        if (!/^\d+$/.test(trimmedId)) {
            setError('idInstance должен состоять только из цифр');
            return;
        }

        setIsLoading(true);

        try {
            const creds: Credentials = {
                idInstance: trimmedId,
                apiTokenInstance: trimmedToken,
            };

            const { stateInstance } = await getStateInstance(creds);

            if (stateInstance !== 'authorized') {
                setError(`Инстанс не авторизован: ${stateInstance}`);
                return;
            }

            await setSettings(creds, { webhookUrl: '', incomingWebhook: 'yes' });

            onLogin(creds);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Чат МАКС</h1>
                <p className={styles.subtitle}>Введите данные из GREEN-API</p>

                <label className={styles.field}>
                    <span className={styles.label}>idInstance</span>
                    <input
                        className={styles.formInput}
                        type="text"
                        inputMode="numeric"
                        value={idInstance}
                        onChange={(e) => setIdInstance(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        placeholder="Ваш idInstance"
                        autoComplete="off"
                        disabled={isLoading}
                    />
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>apiTokenInstance</span>
                    <div className={styles.inputWrapper}>
                        <input
                            className={styles.formInput}
                            type={isTokenVisible ? 'text' : 'password'}
                            value={apiTokenInstance}
                            onChange={(e) => setApiTokenInstance(e.target.value.replace(/[^a-fA-F0-9]/g, ''))}
                            placeholder="Ваш apiTokenInstance"
                            autoComplete="off"
                            disabled={isLoading}
                        />
                        <button 
                            type='button' 
                            className={styles.toggleButton}
                            onClick={() => setIsTokenVisible((v) => !v)}
                            aria-label='Показать/ скрыть токен'
                        >
                            {isTokenVisible ? 
                                <img src={eyeOpen} className={styles.tokenShowImg} width={20} height={20} alt=""/>
			                :
				                <img src={eyeClosed} width={20} height={20} className={styles.tokenHiddenImg} alt=""/>
                            }
                        </button>
                    </div>
                </label>

                {error && <p className={styles.loginError}>{error}</p>}

                <button className={styles.loginButton} type='submit' disabled={isLoading}>
                    {isLoading ? 'Проверяем...' : 'Войти'}
                </button>
            </form>
        </div>
    )
}