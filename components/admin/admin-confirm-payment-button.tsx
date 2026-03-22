"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

type Props = {
  orderId: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

export function AdminConfirmPaymentButton({
  orderId,
  disabled,
  size = "lg"
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function handleConfirm() {
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, {
      method: "POST"
    });
    const data = (await response.json()) as { error?: string; success?: boolean };

    if (!response.ok || !data.success) {
      setTone("error");
      setMessage(data.error || "Xác nhận thanh toán thất bại.");
      setLoading(false);
      return;
    }

    setTone("success");
    setMessage("Đã xác nhận thanh toán.");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Toast open={Boolean(message)} message={message} tone={tone} />
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={disabled}
        loading={loading}
        variant="success"
        size={size}
      >
        {loading ? "Đang cập nhật..." : "Xác nhận đã nhận tiền"}
      </Button>

      {message ? (
        <p className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text-soft)]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
