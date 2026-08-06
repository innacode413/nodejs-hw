import { describe } from "./payload";
import { CHANNELS } from "./payload";
import type { NotificationPayload } from "./payload";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

// ============ Завдання 7 ============

export function isNotificationPayload(value: unknown): value is NotificationPayload {
  if (!isRecord(value)) return false;

  const channel = value.channel;
  if (!isString(channel)) return false;
  if (!CHANNELS.some((c) => c === channel)) return false;

  const priority = value.priority;
  if (priority !== "low" && priority !== "normal" && priority !== "high") return false;

  switch (channel) {
    case "email":
      return (
        isString(value.to) &&
        isString(value.subject) &&
        isString(value.body) &&
        (value.attachments === undefined ||
          (Array.isArray(value.attachments) && value.attachments.every(isString)))
      );
    case "sms":
      return isString(value.to) && isString(value.text);
    case "push":
      return (
        isString(value.deviceToken) &&
        isString(value.title) &&
        isString(value.body) &&
        (value.badge === undefined || typeof value.badge === "number")
      );
    case "telegram":
      return isString(value.chatId) && isString(value.text);
    default:
      return false;
  }
}

export function handleIncoming(raw: unknown): void {
  if (isNotificationPayload(raw)) {
    console.log("Валідно:", describe(raw));
  } else {
    console.log("Невалідно:", JSON.stringify(raw));
  }
}
