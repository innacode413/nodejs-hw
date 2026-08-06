export type Role = "admin" | "user" | "guest";

export interface UserPreferences {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
}

export interface User {
  readonly id: number;
  readonly createdAt: Date;
  email: string;
  phone?: string;
  role: Role;
  preferences: UserPreferences;
}

// ============ Завдання 1 ============

export const admin: User = {
  id: 1,
  createdAt: new Date(),
  email: "admin@example.com",
  phone: "+380000000000",
  role: "admin",
  preferences: { emailEnabled: true, smsEnabled: true },
};

export const guest: User = {
  id: 2,
  createdAt: new Date(),
  email: "guest@example.com",
  role: "guest",
  preferences: {},
};

// Рядки, які не скомпілюються:
// admin.id = 100;
// > Cannot assign to 'id' because it is a read-only property.
// admin.role = "superadmin";
// > Type '"superadmin"' is not assignable to type 'Role'.
// admin.email = null;
// > Type 'null' is not assignable to type 'string'.

// ============ Завдання 2 ============

export interface Admin extends User {
  readonly permissions: readonly string[];
  role: "admin";
}

export const boss: Admin = {
  id: 3,
  createdAt: new Date(),
  email: "boss@example.com",
  phone: "+380111111111",
  role: "admin",
  preferences: { emailEnabled: true, smsEnabled: false },
  permissions: ["users:read", "users:write"],
};

// boss.permissions.push("x");
// > Property 'push' does not exist on type 'readonly string[]'.

// ============ Завдання 3 ============

type WithStringId = { id: string; label: string };
type WithNumberId = { id: number; count: number };

type Broken = WithStringId & WithNumberId;

// const broken: Broken = { id: "abc", label: "x", count: 1 };
// > Type 'string' is not assignable to type 'never'.
// (id стає string & number = never, тобто такому об'єкту неможливо задовольнити обидва типи)

export type SafeMerge<A, B> = Omit<A, keyof B> & B;

const merged: SafeMerge<WithStringId, WithNumberId> = { id: 1, label: "x", count: 2 };

// ============ Завдання 9: Branded types ============

export type UserId = number & { readonly __brand: "UserId" };
export type OrderId = number & { readonly __brand: "OrderId" };

export function getUser(id: UserId): void {
  console.log(`Користувач ${id}`);
}

const myUserId = 7 as UserId;
getUser(myUserId);

// const orderId: OrderId = 42;
// getUser(orderId);
// > Argument of type 'OrderId' is not assignable to parameter of type 'UserId'.
// >   Type 'OrderId' is not assignable to type '{ readonly __brand: "UserId"; }'.
