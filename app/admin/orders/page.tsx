import Link from "next/link";

import { AdminConfirmPaymentButton } from "@/components/admin/admin-confirm-payment-button";
import { ConfigNotice } from "@/components/config-notice";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getAdminDashboardStats, getAdminOrders } from "@/lib/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminOrdersPage() {
  if (!hasSupabaseEnv()) {
    return (
      <ConfigNotice message="Trang admin cần Supabase Auth và service role key để bảo vệ route và đọc dữ liệu đơn hàng." />
    );
  }

  await requireAdminUser();
  const [orders, stats] = await Promise.all([
    getAdminOrders(),
    getAdminDashboardStats()
  ]);
  const pendingOrders = orders.filter((order) => order.payment_status !== "paid");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-kicker">Bảng điều khiển</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Quản lý đơn hàng
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Theo dõi doanh thu, đơn chờ thanh toán và xử lý nhanh các đơn đang vận
            hành trong hệ thống.
          </p>
        </div>
        <Link href="/admin/products" className={buttonVariants({ variant: "secondary" })}>
          Quản lý sản phẩm
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card rounded-[30px] p-5">
          <p className="text-sm text-[color:var(--text-soft)]">Doanh thu đã thu</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            {formatCurrency(stats.paidRevenue)}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            {stats.paidOrders} đơn đã xác nhận thanh toán
          </p>
        </div>
        <div className="surface-card rounded-[30px] p-5">
          <p className="text-sm text-[color:var(--text-soft)]">Doanh thu hoàn tất</p>
          <p className="mt-2 text-3xl font-semibold text-[color:var(--brand-strong)]">
            {formatCurrency(stats.completedRevenue)}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            {stats.completedOrders} đơn đã hoàn tất
          </p>
        </div>
        <div className="surface-card rounded-[30px] p-5">
          <p className="text-sm text-[color:var(--text-soft)]">Chờ thanh toán</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">
            {stats.pendingPayments}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            Đơn đang đối soát QR thủ công
          </p>
        </div>
        <div className="surface-card rounded-[30px] p-5">
          <p className="text-sm text-[color:var(--text-soft)]">Tổng đơn hàng</p>
          <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">
            {stats.totalOrders}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            Toàn bộ đơn đã tạo trong hệ thống
          </p>
        </div>
      </div>

      {pendingOrders.length ? (
        <div className="surface-card rounded-[30px] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-kicker">Duyệt nhanh thanh toán</p>
              <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">
                {pendingOrders.length} đơn đang chờ xác nhận tiền
              </h2>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">
                Bạn có thể bấm duyệt ngay tại đây, không cần mở từng đơn chi tiết.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {pendingOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="surface-muted flex flex-col gap-3 rounded-[22px] px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-[color:var(--brand-strong)]"
                    >
                      {order.order_code}
                    </Link>
                    <StatusBadge status={order.payment_status} />
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--text)]">
                    {order.product_name_snapshot}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--text-soft)]">
                    {order.customer_email} • {formatCurrency(order.total_amount, order.currency)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <AdminConfirmPaymentButton orderId={order.id} size="sm" />
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="surface-card overflow-hidden rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color:var(--surface-muted)] text-[color:var(--text-soft)]">
              <tr>
                <th className="px-5 py-4 font-medium">Mã đơn</th>
                <th className="px-5 py-4 font-medium">Sản phẩm</th>
                <th className="px-5 py-4 font-medium">Khách hàng</th>
                <th className="px-5 py-4 font-medium">Tổng tiền</th>
                <th className="px-5 py-4 font-medium">Đơn hàng</th>
                <th className="px-5 py-4 font-medium">Thanh toán</th>
                <th className="px-5 py-4 font-medium">Tạo lúc</th>
                <th className="px-5 py-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[color:var(--line)]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-[color:var(--brand-strong)]"
                    >
                      {order.order_code}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{order.product_name_snapshot}</td>
                  <td className="px-5 py-4">{order.customer_email}</td>
                  <td className="px-5 py-4">
                    {formatCurrency(order.total_amount, order.currency)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.order_status} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.payment_status} />
                  </td>
                  <td className="px-5 py-4">{formatDateTime(order.created_at)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {order.payment_status !== "paid" ? (
                        <AdminConfirmPaymentButton orderId={order.id} size="sm" />
                      ) : (
                        <span className="text-xs font-medium text-emerald-600">
                          Đã duyệt
                        </span>
                      )}
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={buttonVariants({ variant: "secondary", size: "sm" })}
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
