# notification-service

Сервіс сповіщень на чистому TypeScript. Жодного Express, бази чи мережі — лише система типів, у якій неможливо зробити помилку.

## Правила
- `strict: true` у `tsconfig.json`
- Без `any` і без `as` (окрім `as const`) — тільки `unknown`
- Без зовнішніх бібліотек
- Проєкт компілюється: `npx tsc --noEmit`

## Структура
```
src/
├── domain.ts        # завдання 1–3, 9
├── payload.ts       # завдання 4–5, 10
├── senders.ts       # завдання 6
├── validation.ts    # завдання 7
├── vendor.d.ts      # завдання 8 (імітація node_modules)
├── vendor-augment.ts# завдання 8 (злиття оголошень)
└── index.ts         # демо: все разом
```

## Що всередині
1. **User** — об'єкт з `readonly id`/`createdAt`, роль як union-літерали. Три рядки, що не компілюються, — з текстом помилок.
2. **Admin extends User** — `role: "admin"` (звужено) і `readonly permissions: readonly string[]` (без `push`).
3. **Broken** (`&` конфліктує id) + `SafeMerge<A,B>` через `Omit`.
4. **NotificationPayload** — дискриміноване об'єднання `channel: "email" | "sms" | "push" | "telegram"` + `describe` через `switch`.
5. **never** у `default` — додали `telegram` без гілки і побачили, де компілятор вказує на незакритий випадок.
6. **Sender** — інтерфейс із сигнатурою виклику, `channel`, `isAvailable()`; три відправники + `sendWithLogging`.
7. **isNotificationPayload** — чесна рантайм-валідація `unknown` без `as`.
8. **Злиття оголошень** — додали `user?: User` у `VendorSDK.Context` через `declare global`.
9. **Branded types** — `UserId` і `OrderId` не взаємозамінні, хоча обидва — числа.
10. **Похідний union** — `Channel` виводиться з `CHANNELS` через `as const` + `typeof`.

## Перевірка
```bash
npm run typecheck   # npx tsc --noEmit
npx tsc src/index.ts --noEmit --ignoreConfig --strict --target ES2022 --module commonjs
```
