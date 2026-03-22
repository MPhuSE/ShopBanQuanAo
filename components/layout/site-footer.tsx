import Link from "next/link";

import { SHOP_EMAIL, SHOP_HOTLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-white/35 py-10">
      <div className="container-shell grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand)]">
            bantkgiare
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
            Bán tài khoản số với trải nghiệm ngắn gọn, rõ trạng thái, dễ tin tưởng.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            Tối ưu cho digital product, subscription package và manual fulfillment:
            email là đủ để checkout, QR để thanh toán, tracking để theo dõi.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-[color:var(--text-soft)] sm:grid-cols-2">
          <div className="surface-muted rounded-[24px] p-5">
            <p className="font-semibold text-[color:var(--text)]">Giao nhanh</p>
            <p className="mt-2 leading-7">Cập nhật trạng thái rõ ràng, giao thông tin nhanh.</p>
          </div>
          <div className="surface-muted rounded-[24px] p-5">
            <p className="font-semibold text-[color:var(--text)]">Minh bạch</p>
            <p className="mt-2 leading-7">Thanh toán QR, mã đơn hàng riêng, có trang tra cứu.</p>
          </div>
        </div>
      </div>

      <div className="container-shell mt-8 flex flex-col gap-3 border-t border-[color:var(--line)] pt-6 text-sm text-[color:var(--text-soft)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p>Hotline hỗ trợ: {SHOP_HOTLINE}</p>
          <p>Email hỗ trợ: {SHOP_EMAIL}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/track-order" className="transition hover:text-[color:var(--text)]">
            Tra cứu đơn
          </Link>
          <Link href="/admin/login" className="transition hover:text-[color:var(--text)]">
            Quản trị
          </Link>
        </div>
      </div>
    </footer>
  );
}
