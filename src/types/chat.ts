export interface Credentials {
    idInstance: string;
    apiTokenInstance: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    out: boolean;
    time: number; // Unix timestamp в СЕКУНДАХ (как отдаёт GREEN-API) 
    status: 'pending' | 'sent' | 'failed' | 'received';
}

export interface Chat {
    chatId: string;
    name: string;
    phone?: string;
    lastMessage?: string;
}

export interface SendMessageRequest {
    chatId: string;
    message: string;
}

export interface SendMessageResponse {
    idMessage: string;
}

export interface ReceiveNotificationResponse {
    receiptId: number;
    body: {
        typeWebhook: string;
        instanceData: {
            idInstance: number;
            wid: string;
            typeInstance: string;
        };
        timestamp?: number;
        idMessage?: string;
        senderData?: {
            chatId: string;
            chatName?: string;
            sender?: string;
            senderName?: string;
            senderContactName?: string;
        };
        messageData?: {
            typeMessage: string;
            textMessageData?: {
                textMessage: string
            };
            extendedTextMessageData?: {
                text: string
            };
        };
    };
}

export interface GetStateInstanceResponse {
    stateInstance: 'authorized' | 'notAuthorized' | 'blocked' | 'sleepMode' | 'starting' | 'yelloCard' | 'suspended';
}