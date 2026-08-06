export type Priority = "low" | "normal" | "high";

// ============ Завдання 10: похідний union ============

export const CHANNELS = ["email", "sms", "push", "telegram"] as const;
export type Channel = (typeof CHANNELS)[number];

// ============ Завдання 4: дискриміноване об'єднання ============

export type NotificationPayload =
  | { channel: "email"; to: string; subject: string; body: string; attachments?: string[]; priority: Priority }
  | { channel: "sms"; to: string; text: string; priority: Priority }
  | { channel: "push"; deviceToken: string; title: string; body: string; badge?: number; priority: Priority }
  | { channel: "telegram"; chatId: string; text: string; priority: Priority };

export function describe(payload: NotificationPayload): string {
  switch (payload.channel) {
    case "email":
      return `Email для ${payload.to}: "${payload.subject}" (${payload.priority})`;
    case "sms":
      return `SMS для ${payload.to}: "${payload.text}" (${payload.priority})`;
    case "push":
      return `Push на ${payload.deviceToken}: "${payload.title}"${payload.badge !== undefined ? `, badge ${payload.badge}` : ""} (${payload.priority})`;
    case "telegram":
      return `Telegram для ${payload.chatId}: "${payload.text}" (${payload.priority})`;
    default: {
      const exhaustive: never = payload;
      throw new Error(`Невідомий канал: ${JSON.stringify(exhaustive)}`);
    }
  }
}

// У гілці "sms" звернення до payload.subject не скомпілюється:
// case "sms":
//   return `... ${payload.subject}`;
// > Property 'subject' does not exist on type '{ channel: "sms"; to: string; text: string; priority: Priority; }'.

// Якби ми забули гілку "telegram", default давав би:
// > Type '{ channel: "telegram"; chatId: string; text: string; priority: Priority; }' is not assignable to type 'never'.
