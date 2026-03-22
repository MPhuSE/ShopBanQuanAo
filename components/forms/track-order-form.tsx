"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function TrackOrderForm() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = orderCode.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();
    router.push(
      `/track-order/${encodeURIComponent(normalizedCode)}?email=${encodeURIComponent(normalizedEmail)}`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[30px] p-6 md:p-7">
      <p className="section-kicker">Tra cứu đơn</p>
      <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
        Tra cứu đơn hàng
      </h2>
      <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
        Nhập mã đơn hàng và email đã dùng khi đặt mua để xem tiến độ xử lý.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Mã đơn hàng
          <input
            value={orderCode}
            onChange={(event) => setOrderCode(event.target.value)}
            required
            className="field"
            placeholder="OD20260322123456"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="field"
            placeholder="lhmp8686@gmail.com"
          />
        </label>
      </div>

      <div className="mt-6 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[color:var(--text-soft)]">
        Gợi ý: nếu đơn hàng chưa được xác nhận thanh toán, trang chi tiết sẽ hiển
        thị lại QR để bạn thanh toán ngay.
      </div>

      <Button type="submit" size="lg" className="mt-6">
        Xem tiến độ đơn hàng
      </Button>
    </form>
  );
}
