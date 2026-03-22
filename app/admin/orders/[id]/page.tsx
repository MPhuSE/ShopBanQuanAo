import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminConfirmPaymentButton } from "@/components/admin/admin-confirm-payment-button";
import { AdminOrderStatusForm } from "@/components/admin/admin-order-status-form";
import { ConfigNotice } from "@/components/config-notice";
import { OrderTimeline } from "@/components/order-timeline";
import { getStatusMeta, StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getOrderById } from "@/lib/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <ConfigNotice message="Cần Supabase env để mở trang chi tiết đơn hàng." />
    );
  }

  await requireAdminUser();
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const payment = order.payments?.[0];
  const logs = [...(order.order_status_logs ?? [])].sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/orders"
          className={buttonVariants({ variant: "secondary" })}
        >
          Quay lại danh sách đơn
        </Link>
      </div>

      <section className="surface-card rounded-[34px] p-7 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="section-kicker">Chi tiết đơn hàng</p>
            <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
              {order.order_code}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status={order.order_status} />
            <StatusBadge status={order.payment_status} />
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Sản phẩm</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {order.product_name_snapshot}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Khách hàng</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {order.customer_email}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Tổng tiền</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {formatCurrency(order.total_amount, order.currency)}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">TxnRef</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {order.vnp_txn_ref}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <AdminOrderStatusForm orderId={order.id} currentStatus={order.order_status} />

          <section className="surface-card rounded-[34px] p-6 md:p-7">
            <h3 className="text-xl font-semibold text-[color:var(--text)]">
              Đối soát thanh toán
            </h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
              Đơn QR thanh toán thủ công cần admin xác nhận đã nhận tiền trước khi
              xử lý cấp phát.
            </p>
            <div className="mt-5">
              <AdminConfirmPaymentButton
                orderId={order.id}
                disabled={order.payment_status === "paid"}
              />
            </div>
          </section>
        </div>

        <section className="surface-card rounded-[34px] p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">
            Lịch sử và thanh toán
          </h2>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--text-soft)]">
            <div className="surface-muted rounded-[22px] p-4">
              <p>Trạng thái thanh toán: {payment?.status || order.payment_status}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Phương thức thanh toán: {order.payment_method}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Mã giao dịch: {payment?.transaction_no || "-"}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Mã ngân hàng: {payment?.bank_code || "-"}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Thanh toán lúc: {formatDateTime(payment?.paid_at)}</p>
            </div>
            <div className="surface-muted rounded-[22px] p-4">
              <p>Tạo lúc: {formatDateTime(order.created_at)}</p>
            </div>
          </div>

          <div className="mt-6">
            <OrderTimeline
              items={logs.map((log) => ({
                id: log.id,
                title: getStatusMeta(log.to_status).label,
                description: `${log.note || "Không có ghi chú."} (${log.created_by})`,
                meta: formatDateTime(log.created_at),
                tone: getStatusMeta(log.to_status).tone
              }))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
