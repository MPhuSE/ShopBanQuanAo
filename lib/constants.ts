export const ORDER_STATUSES = [
  "pending_payment",
  "processing",
  "completed",
  "cancelled",
  "payment_failed"
] as const;

export const PAYMENT_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "failed"
] as const;

export const ADMIN_MUTABLE_ORDER_STATUSES = [
  "processing",
  "completed",
  "cancelled"
] as const;

export const SHOP_HOTLINE = "0981460071";
export const SHOP_EMAIL = "lhmp8686@gmail.com";
export const SHOP_QR_IMAGE_URL = "/qr.jpg";
