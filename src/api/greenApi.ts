import { GREEN_API_BASE_URL } from "@/api/constants";
import type {
    Credentials, SendMessageRequest, SendMessageResponse, ReceiveNotificationResponse, GetStateInstanceResponse,
} from '../types/chat';

const instanceUrl = ({ idInstance }: Credentials) => 
    `${GREEN_API_BASE_URL}/waInstance${idInstance}`;

export interface CheckAccountResponse {
  exist: boolean;
  chatId?: string;
}

export async function checkAccount(
  creds: Credentials,
  phoneNumber: string
): Promise<CheckAccountResponse> {
  const result = await fetch(`${instanceUrl(creds)}/checkAccount/${creds.apiTokenInstance}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
  });
  if (!result.ok) throw new Error(`Не удалось проверить номер (HTTP ${result.status})`);
  return result.json();
}

export interface SetSettingsRequest {
    webhookUrl?: string;
    incomingWebhook?: 'yes' | 'no';
}

export async function setSettings(creds: Credentials, settings: SetSettingsRequest): Promise<void> {
    const result = await fetch(`${instanceUrl(creds)}/setSettings/${creds.apiTokenInstance}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    if (!result.ok) throw new Error(`Не удалось применить настройки (HTTP ${result.status})`);
}

export async function sendMessage(creds: Credentials, payload: SendMessageRequest): Promise<SendMessageResponse> {
    const result = await fetch(`${instanceUrl(creds)}/sendMessage/${creds.apiTokenInstance}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!result.ok) throw new Error(`Ошибка отправки (HTTP ${result.status})`);

    return result.json();
}

export async function receiveNotification(creds: Credentials, signal?: AbortSignal): Promise<ReceiveNotificationResponse | null> {
    const result = await fetch(`${instanceUrl(creds)}/receiveNotification/${creds.apiTokenInstance}?receiveTimeout=5`, {signal});

    if (result.status === 408) return null;

    if (!result.ok) throw new Error(`HTTP ${result.status}`);
    const text = await result.text();
    return text ? JSON.parse(text) : null;
}

export async function deleteNotification(creds: Credentials, receiptId: number): Promise<boolean> {
    const result = await fetch(`${instanceUrl(creds)}/deleteNotification/${creds.apiTokenInstance}/${receiptId}`, {method: 'DELETE',});
    if (!result.ok) throw new Error(`HTTP ${result.status}`);
    const data = await result.json();
    return data.result;
}


export async function getStateInstance(creds: Credentials): Promise<GetStateInstanceResponse> {
    const result = await fetch(`${instanceUrl(creds)}/getStateInstance/${creds.apiTokenInstance}`);

    if (!result.ok) throw new Error(`Не удалось проверить инстанс(HTTP ${result.status})`);

    return result.json();
}

export interface GetSettingsResponse {
  wid: string;
  webhookUrl: string;
  incomingWebhook: 'yes' | 'no';
  outgoingWebhook: 'yes' | 'no';
  outgoingAPIMessageWebhook: 'yes' | 'no';
  stateWebhook: 'yes' | 'no';
  [key: string]: unknown;
}

export async function getSettings(creds: Credentials): Promise<GetSettingsResponse> {
  const result = await fetch(`${instanceUrl(creds)}/getSettings/${creds.apiTokenInstance}`);
  if (!result.ok) throw new Error(`HTTP ${result.status}`);
  return result.json();
}