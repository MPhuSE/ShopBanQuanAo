import { SHOP_QR_IMAGE_URL } from "@/lib/constants";

const requiredServerEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

export function hasSupabaseEnv() {
  return requiredServerEnv.every((key) => Boolean(process.env[key]));
}

export function hasManualQrConfig() {
  return Boolean(
    process.env.PAYMENT_BANK_NAME &&
      process.env.PAYMENT_ACCOUNT_NAME &&
      process.env.PAYMENT_ACCOUNT_NUMBER
  );
}

export function getManualQrConfig(orderCode?: string) {
  const notePrefix = process.env.PAYMENT_NOTE_PREFIX || "DH";
  const transferContent = orderCode ? `${notePrefix} ${orderCode}` : notePrefix;

  return {
    qrImageUrl: SHOP_QR_IMAGE_URL,
    bankName: process.env.PAYMENT_BANK_NAME || "",
    accountName: process.env.PAYMENT_ACCOUNT_NAME || "",
    accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || "",
    transferContent
  };
}

export function assertSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error(
      "Missing Supabase environment variables. Fill in .env.local before running data mutations."
    );
  }
}
