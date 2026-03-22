"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { ADMIN_MUTABLE_ORDER_STATUSES } from "@/lib/constants";
import type { AdminMutableOrderStatus } from "@/types/db";

type Props = {
  orderId: string;
  currentStatus: string;
};

export function AdminOrderStatusForm({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<AdminMutableOrderStatus>(
    (ADMIN_MUTABLE_ORDER_STATUSES.includes(
      currentStatus as AdminMutableOrderStatus
    )
      ? currentStatus
      : "processing") as AdminMutableOrderStatus
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status, note })
    });

    const data = (await response.json()) as { error?: string; success?: boolean };

    if (!response.ok || !data.success) {
      setTone("error");
      setMessage(data.error || "Cập nhật thất bại.");
      setLoading(false);
      return;
    }

    setTone("success");
    setMessage("Cập nhật thành công.");
    setLoading(false);
    setNote("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[34px] p-6 md:p-7">
      <Toast open={Boolean(message)} message={message} tone={tone} />
      <h3 className="text-xl font-semibold text-[color:var(--text)]">
        Cập nhật trạng thái
      </h3>
      <div className="mt-5 grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          Trạng thái mới
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AdminMutableOrderStatus)
            }
            className="field-select"
          >
            {ADMIN_MUTABLE_ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Ghi chú
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="field-area min-h-24"
            placeholder="Ví dụ: Đã cấp thông tin đăng nhập qua email."
          />
        </label>
      </div>

      <Button type="submit" loading={loading} className="mt-6" size="lg">
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
