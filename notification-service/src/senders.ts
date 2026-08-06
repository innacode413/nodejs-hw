import type { Channel, NotificationPayload } from "./payload";

export type SendResult =
  | { ok: true; messageId: string; sentAt: Date }
  | { ok: false; error: string; retryable: boolean };

// ============ Завдання 6 ============

export interface Sender {
  (payload: NotificationPayload): Promise<SendResult>;
  channel: Channel;
  isAvailable(): boolean;
}

export interface SendLogger {
  (result: SendResult): void;
}

export async function sendWithLogging(
  payload: NotificationPayload,
  sender: Sender,
  logger: SendLogger
): Promise<SendResult> {
  const result = await sender(payload);
  logger(result);
  return result;
}

const now = (): Date => new Date();

export const emailSender: Sender = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    if (payload.channel !== "email") {
      return { ok: false, error: `emailSender не вміє ${payload.channel}`, retryable: false };
    }
    console.log(`[email] → ${payload.to} subject: ${payload.subject}`);
    return { ok: true, messageId: `em_${Date.now()}`, sentAt: now() };
  },
  { channel: "email" as Channel, isAvailable: () => true }
);

export const smsSender: Sender = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    if (payload.channel !== "sms") {
      return { ok: false, error: `smsSender не вміє ${payload.channel}`, retryable: false };
    }
    console.log(`[sms] → ${payload.to}: ${payload.text}`);
    return { ok: true, messageId: `sm_${Date.now()}`, sentAt: now() };
  },
  { channel: "sms" as Channel, isAvailable: () => true }
);

export const pushSender: Sender = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    if (payload.channel !== "push") {
      return { ok: false, error: `pushSender не вміє ${payload.channel}`, retryable: false };
    }
    console.log(`[push] → ${payload.deviceToken}: ${payload.title}`);
    return { ok: true, messageId: `pu_${Date.now()}`, sentAt: now() };
  },
  { channel: "push" as Channel, isAvailable: () => true }
);

export const telegramSender: Sender = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    if (payload.channel !== "telegram") {
      return { ok: false, error: `telegramSender не вміє ${payload.channel}`, retryable: false };
    }
    console.log(`[telegram] → ${payload.chatId}: ${payload.text}`);
    return { ok: true, messageId: `tg_${Date.now()}`, sentAt: now() };
  },
  { channel: "telegram" as Channel, isAvailable: () => true }
);

export const consoleLogger: SendLogger = (result: SendResult) => {
  if (result.ok) {
    console.log(`Лог: успіх ${result.messageId} о ${result.sentAt.toISOString()}`);
  } else {
    console.log(`Лог: помилка "${result.error}"${result.retryable ? " (можна повторити)" : ""}`);
  }
};
