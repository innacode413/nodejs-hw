import { admin, boss, type Admin, type User } from "./domain";
import { describe } from "./payload";
import type { NotificationPayload } from "./payload";
import { consoleLogger, emailSender, smsSender, sendWithLogging } from "./senders";
import { handleIncoming } from "./validation";
import { readContext } from "./vendor-augment";

async function main(): Promise<void> {
  console.log("=== Завдання 1-2: користувачі ===");
  const users: User[] = [admin, boss];
  const onlyAdmin: Admin = boss;
  console.log(users.map((u) => `${u.email} [${u.role}]`).join(", "));
  console.log("boss permissions:", onlyAdmin.permissions.join(", "));

  console.log("\n=== Завдання 4-5: describe ===");
  const email: NotificationPayload = {
    channel: "email",
    to: "user@example.com",
    subject: "Знижки",
    body: "Деталі",
    priority: "high",
    attachments: ["price.pdf"],
  };
  const sms: NotificationPayload = {
    channel: "sms",
    to: "+380000000000",
    text: "Ваше замовлення відправлено",
    priority: "low",
  };
  const push: NotificationPayload = {
    channel: "push",
    deviceToken: "tok123",
    title: "Новина",
    body: "Текст",
    badge: 3,
    priority: "normal",
  };
  const telegram: NotificationPayload = {
    channel: "telegram",
    chatId: "@inna",
    text: "Вітаю!",
    priority: "high",
  };
  console.log(describe(email));
  console.log(describe(sms));
  console.log(describe(push));
  console.log(describe(telegram));

  console.log("\n=== Завдання 6: sendWithLogging ===");
  await sendWithLogging(email, emailSender, consoleLogger);
  await sendWithLogging(sms, smsSender, consoleLogger);

  console.log("\n=== Завдання 7: валідація unknown ===");
  handleIncoming({ channel: "sms", to: "+380", text: "hi", priority: "low" });
  handleIncoming({ channel: "sms", to: "+380", priority: "low" });
  handleIncoming({ channel: "carrier-pigeon", text: "hi" });
  handleIncoming(null);
  handleIncoming("просто рядок");

  console.log("\n=== Завдання 8: VendorSDK.Context ===");
  console.log(readContext({ requestId: "req-1" }));
  console.log(readContext({ requestId: "req-2", user: admin }));
}

main();
