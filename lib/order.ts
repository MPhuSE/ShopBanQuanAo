import crypto from "node:crypto";

import type { OrderStatus } from "@/types/db";

export function generateOrderCode() {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");
  const rand = crypto.randomInt(100000, 999999);

  return `OD${datePart}${rand}`;
}

export function generateTxnRef() {
  return `VNP${Date.now()}${crypto.randomInt(1000, 9999)}`;
}

export function createStatusLogPayload(
  orderId: string,
  toStatus: OrderStatus,
  options?: {
    fromStatus?: OrderStatus | null;
    note?: string | null;
    createdBy?: string;
  }
) {
  return {
    order_id: orderId,
    from_status: options?.fromStatus ?? null,
    to_status: toStatus,
    note: options?.note ?? null,
    created_by: options?.createdBy ?? "system"
  };
}
