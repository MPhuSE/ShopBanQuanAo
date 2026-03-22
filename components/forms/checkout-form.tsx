"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/db";

type RedirectState = {
  orderCode: string;
  paymentUrl: string;
  trackUrl: string;
};

export function CheckoutForm({ product }: { product: Product }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectState, setRedirectState] = useState<RedirectState | null>(null);
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setToast(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productSlug: product.slug,
          email,
          customerName,
          customerNote
        })
      });

      const data = (await response.json()) as {
        error?: string;
        orderCode?: string;
        trackUrl?: string;
      };

      if (!response.ok || !data.orderCode || !data.trackUrl) {
        throw new Error(data.error || "Không tạo được đơn hàng.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      const paymentUrl = `/payment/${data.orderCode}?email=${encodeURIComponent(
        normalizedEmail
      )}`;

      setRedirectState({
        orderCode: data.orderCode,
        paymentUrl,
        trackUrl: data.trackUrl
      });
      setToast({
        tone: "success",
        message: "Đơn hàng đã được tạo. Đang chuyển sang trang thanh toán."
      });
      startTransition(() => router.push(paymentUrl));
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Có lỗi xảy ra.";
      setError(message);
      setToast({ tone: "error", message });
    } finally {
      setLoading(false);
    }
  }

  if (redirectState) {
    return (
      <div className="space-y-5">
        <Toast open={Boolean(toast)} message={toast?.message ?? null} tone={toast?.tone} />
        <div className="surface-card rounded-[30px] p-6 md:p-7">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--brand)]/35 border-t-[color:var(--brand)]" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
              Đang chuyển trang
            </p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-[color:var(--text)]">
            Đơn {redirectState.orderCode} đã sẵn sàng để thanh toán
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
            Nếu trình duyệt chưa tự chuyển trang, bạn có thể mở ngay trang thanh toán
            hoặc trang tra cứu bằng các nút bên dưới.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={redirectState.paymentUrl}
              className={buttonVariants({ size: "lg" })}
            >
              Thanh toán ngay
            </Link>
            <Link
              href={redirectState.trackUrl}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Theo dõi đơn
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[30px] p-6 md:p-7">
      <Toast open={Boolean(toast)} message={toast?.message ?? null} tone={toast?.tone} />

      <div className="flex flex-col gap-4 border-b border-[color:var(--line)] pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-kicker">Thanh toán nhanh</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
            {product.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            Chỉ cần email để tạo đơn. Không có username. Tên và ghi chú chỉ là tùy
            chọn nếu bạn muốn shop hỗ trợ nhanh hơn.
          </p>
        </div>

        <div className="surface-muted rounded-[24px] px-4 py-4 sm:min-w-64">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
            Tổng thanh toán
          </p>
          <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">
            {formatCurrency(product.price, product.currency)}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            Thanh toán bằng QR chuyển khoản.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          Email nhận thông báo <span className="text-[color:var(--brand)]">*</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
            placeholder="lhmp8686@gmail.com"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Tên khách hàng
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="field"
              placeholder="Không bắt buộc"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Ghi chú
            <textarea
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
              className="field-area min-h-[120px]"
              placeholder="Ví dụ: cần giao trước 9h tối"
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[color:var(--text-soft)]">
        Sau khi tạo đơn, hệ thống sẽ đưa bạn đến trang thanh toán riêng có QR và nội
        dung chuyển khoản. Bạn luôn có thể quay lại tra cứu bằng mã đơn và email.
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? "Đang tạo đơn hàng..." : "Tạo đơn và đi đến trang thanh toán"}
        </Button>
      </div>
    </form>
  );
}
