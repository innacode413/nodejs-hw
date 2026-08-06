import type { User } from "./domain";

// ============ Завдання 8: злиття оголошень ============

declare global {
  namespace VendorSDK {
    interface Context {
      user?: User;
    }
  }
}

export function readContext(ctx: VendorSDK.Context): string {
  const userPart = ctx.user
    ? `, user: ${ctx.user.email} (id ${ctx.user.id})`
    : ", user: відсутній";
  return `requestId: ${ctx.requestId}${userPart}`;
}
