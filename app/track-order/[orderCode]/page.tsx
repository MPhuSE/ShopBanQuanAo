import Link from "next/link";

import { ConfigNotice } from "@/components/config-notice";
import { OrderTimeline } from "@/components/order-timeline";
import { PaymentQrCard } from "@/components/payment-qr-card";
import { getStatusMeta, StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getManualQrConfig, hasManualQrConfig, hasSupabaseEnv } from "@/lib/env";
import { getTrackableOrder } from "@/lib/queries";
import { formatCurrency, formatDateTime, readSearchParam } from "@/lib/utils";

export default async function TrackOrderDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ orderCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const email = readSearchParam(resolvedSearchParams.email);

  if (!hasSupabaseEnv()) {
    return (
      <ConfigNotice message="Trang tra cứu đã sẵn sàng, nhưng bạn cần cấu hình Supabase để tra cứu đơn hàng thật theo mã đơn và email." />
    );
  }

  if (!email) {
    return (
      <section className="surface-card mx-auto max-w-3xl rounded-[34px] p-8">
        <p className="section-kicker">Tra cứu</p>
        <h1 className="mt-3 text-3xl font-semibold text-[color:var(--text)]">
          Cần email để tra cứu đơn
        </h1>
        <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)]">
          Vui lòng quay lại trang tra cứu và nhập đúng mã đơn cùng email đã đặt hàng.
        </p>
        <Link href="/track-order" className={buttonVariants({ className: "mt-6" })}>
          Quay lại form tra cứu
        </Link>
      </section>
    );
  }

  const order = await getTrackableOrder(resolvedParams.orderCode, email);

  if (!order) {
    return (
      <section className="surface-card mx-auto max-w-3xl rounded-[34px] p-8">
        <p className="section-kicker">Tra cứu</p>
        <h1 className="mt-3 text-3xl font-semibold text-[color:var(--text)]">
          Không tìm thấy đơn hàng
        </h1>
        <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)]">
          Kiểm tra lại mã đơn và email. Hệ thống chỉ hiển thị đơn khi hai thông tin
          này khớp nhau.
        </p>
      </section>
    );
  }

  const payment = order.payments?.[0];
  const logs = [...(order.order_status_logs ?? [])].sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );
  const shouldShowQr = order.payment_status !== "paid" && hasManualQrConfig();
  const qrConfig = getManualQrConfig(order.order_code);
  const paymentUrl = `/payment/${order.order_code}?email=${encodeURIComponent(email)}`;

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[34px] p-7 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="section-kicker">Đơn hàng {order.order_code}</p>
            <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
              {order.product_name_snapshot}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[color:var(--text-soft)]">
              Đơn đã được tạo cho {order.customer_email}. Bạn có thể theo dõi trạng
              thái xử lý và quay lại trang thanh toán nếu cần.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status={order.order_status} />
            <StatusBadge status={order.payment_status} />
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Tổng tiền</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {formatCurrency(order.total_amount, order.currency)}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Email</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {order.customer_email}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Tạo lúc</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {formatDateTime(order.created_at)}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Mã tham chiếu</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {order.vnp_txn_ref}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {order.payment_status !== "paid" ? (
            <Link href={paymentUrl} className={buttonVariants()}>
              Thanh toán ngay
            </Link>
          ) : null}
          <Link
            href="/products"
            className={buttonVariants({ variant: "secondary" })}
          >
            Xem thêm sản phẩm
          </Link>
        </div>
      </section>

      {shouldShowQr ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[color:var(--text)]">
                Đơn này vẫn đang chờ thanh toán
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Bạn có thể quét lại QR ngay tại đây hoặc mở trang thanh toán riêng để
                thao tác nhanh hơn.
              </p>
            </div>
            <Link
              href={paymentUrl}
              className={buttonVariants({ variant: "secondary" })}
            >
              Mở trang thanh toán
            </Link>
          </div>
          <PaymentQrCard {...qrConfig} />
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card rounded-[34px] p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">
            Lịch sử trạng thái
          </h2>
          <div className="mt-6">
            <OrderTimeline
              items={logs.map((log) => ({
                id: log.id,
                title: getStatusMeta(log.to_status).label,
                description: log.note || "Không có ghi chú.",
                meta: formatDateTime(log.created_at),
                tone: getStatusMeta(log.to_status).tone
              }))}
            />
          </div>
        </div>

        <div className="surface-card rounded-[34px] p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">
            Thông tin thanh toán
          </h2>
          <div className="mt-6 grid gap-3 text-sm leading-7 text-[color:var(--text-soft)]">
            <div className="surface-muted rounded-[22px] p-4">
              <p>Trạng thái thanh toán: {payment?.status || order.payment_status}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Phương thức: {order.payment_method.toUpperCase()}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Mã giao dịch ngân hàng: {payment?.transaction_no || "-"}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Mã ngân hàng: {payment?.bank_code || "-"}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Thanh toán lúc: {formatDateTime(payment?.paid_at)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
