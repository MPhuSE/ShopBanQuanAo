"use client";

import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

type PaymentQrCardProps = {
  qrImageUrl: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  transferContent: string;
};

export function PaymentQrCard({
  qrImageUrl,
  bankName,
  accountName,
  accountNumber,
  transferContent
}: PaymentQrCardProps) {
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  async function handleCopy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast({ tone: "success", message: `Đã sao chép ${label}.` });
    } catch {
      setToast({ tone: "error", message: "Không sao chép được. Bạn thử lại giúp mình." });
    }

    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <>
      <Toast open={Boolean(toast)} message={toast?.message ?? null} tone={toast?.tone} />
      <div className="surface-card rounded-[30px] p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div className="surface-panel overflow-hidden rounded-[28px] p-3 md:p-4">
            <div className="rounded-[24px] bg-white p-3 md:p-4">
              <img
                src={qrImageUrl}
                alt="QR thanh toán"
                className="mx-auto aspect-square w-full max-w-[26rem] object-contain md:max-w-[30rem]"
              />
            </div>
          </div>

          <div>
            <p className="section-kicker">Thanh toán QR</p>
            <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
              Quét QR và chuyển khoản đúng nội dung
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
              Đơn sẽ được admin đối soát thủ công. Dùng đúng nội dung chuyển khoản để
              hệ thống xử lý nhanh và ít sai sót hơn.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                { label: "Ngân hàng", value: bankName, copyable: false },
                { label: "Chủ tài khoản", value: accountName, copyable: false },
                { label: "Số tài khoản", value: accountNumber, copyable: true },
                { label: "Nội dung CK", value: transferContent, copyable: true }
              ].map((item) => (
                <div
                  key={item.label}
                  className="surface-muted flex flex-col gap-3 rounded-[22px] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--text)]">
                      {item.value}
                    </p>
                  </div>
                  {item.copyable ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.value, item.label.toLowerCase())}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      Sao chép
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--brand-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--text-soft)]">
              Sau khi chuyển khoản, bạn có thể mở trang tra cứu để theo dõi trạng
              thái mà không cần nhập lại đơn.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
