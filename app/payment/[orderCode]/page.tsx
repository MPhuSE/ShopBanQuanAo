import Link from "next/link";

import { ConfigNotice } from "@/components/config-notice";
import { OrderTimeline } from "@/components/order-timeline";
import { PaymentQrCard } from "@/components/payment-qr-card";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getManualQrConfig, hasManualQrConfig, hasSupabaseEnv } from "@/lib/env";
import { getTrackableOrder } from "@/lib/queries";
import { formatCurrency, formatDateTime, readSearchParam } from "@/lib/utils";

export default async function PaymentPage({
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
      <ConfigNotice message="Trang thanh toán cần Supabase env để tải lại đúng thông tin đơn hàng." />
    );
  }

  if (!email) {
    return (
      <section className="surface-card mx-auto max-w-3xl rounded-[34px] p-8">
        <p className="section-kicker">Trang thanh toán</p>
        <h1 className="mt-3 text-3xl font-semibold text-[color:var(--text)]">
          Cần email để mở trang thanh toán
        </h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
          Vui lòng quay lại checkout hoặc trang tra cứu để mở đúng trang thanh toán của đơn.
        </p>
        <Link href="/track-order" className={buttonVariants({ className: "mt-6" })}>
          Quay lại tra cứu
        </Link>
      </section>
    );
  }

  const order = await getTrackableOrder(resolvedParams.orderCode, email);

  if (!order) {
    return (
      <section className="surface-card mx-auto max-w-3xl rounded-[34px] p-8">
        <p className="section-kicker">Trang thanh toán</p>
        <h1 className="mt-3 text-3xl font-semibold text-[color:var(--text)]">
          Không tìm thấy đơn hàng
        </h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
          Kiểm tra lại mã đơn và email. Chỉ đúng chủ sở hữu đơn mới xem được trang
          thanh toán.
        </p>
      </section>
    );
  }

  const isPaid = order.payment_status === "paid";
  const qrConfig = getManualQrConfig(order.order_code);
  const trackUrl = `/track-order/${order.order_code}?email=${encodeURIComponent(email)}`;

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[34px] p-7 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="section-kicker">Thanh toán</p>
            <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
              Đơn {order.order_code}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[color:var(--text-soft)]">
              {isPaid
                ? "Đơn hàng này đã được xác nhận thanh toán. Bạn có thể theo dõi tiếp trạng thái xử lý."
                : "Hãy quét QR và ghi đúng nội dung chuyển khoản. Sau đó admin sẽ đối soát và chuyển đơn sang đang xử lý."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatusBadge status={order.payment_status} />
            <StatusBadge status={order.order_status} />
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
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="space-y-6">
          {!isPaid && hasManualQrConfig() ? (
            <PaymentQrCard {...qrConfig} />
          ) : (
            <div className="surface-card rounded-[34px] p-7">
              <p className="section-kicker">Trạng thái thanh toán</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
                {isPaid ? "Thanh toán đã được xác nhận" : "Chưa có cấu hình QR"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                {isPaid
                  ? "Bạn có thể dùng trang tra cứu để theo dõi bước xử lý tiếp theo cho đơn hàng này."
                  : "Hãy bổ sung thông tin tài khoản ngân hàng trong env. Ảnh QR đang được cố định từ /public/qr.jpg."}
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <section className="surface-card rounded-[34px] p-6 md:p-7">
            <h2 className="text-2xl font-semibold text-[color:var(--text)]">
              Tiếp theo sẽ là gì?
            </h2>
            <div className="mt-6">
              <OrderTimeline
                items={[
                  {
                    id: "created",
                    title: "Đơn đã được tạo",
                    description: "Hệ thống đã tạo mã đơn và lưu thông tin checkout.",
                    tone: "success"
                  },
                  {
                    id: "payment",
                    title: isPaid ? "Đã nhận thanh toán" : "Chờ bạn chuyển khoản",
                    description: isPaid
                      ? "Admin đã đối soát và xác nhận đã nhận tiền."
                      : "Quét QR, chuyển khoản đúng nội dung và đợi admin xác nhận.",
                    tone: isPaid ? "success" : "warning"
                  },
                  {
                    id: "fulfillment",
                    title:
                      order.order_status === "completed"
                        ? "Đã hoàn tất bàn giao"
                        : "Đang chờ xử lý cấp phát",
                    description:
                      order.order_status === "completed"
                        ? "Đơn hàng đã được chuyển đến trạng thái hoàn tất."
                        : "Sau khi thanh toán được xác nhận, admin sẽ xử lý và cập nhật tiếp.",
                    tone: order.order_status === "completed" ? "success" : "info"
                  }
                ]}
              />
            </div>
          </section>

          <section className="surface-card rounded-[34px] p-6 md:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--text)]">
              Thao tác nhanh
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={trackUrl} className={buttonVariants()}>
                Theo dõi đơn
              </Link>
              <Link
                href="/products"
                className={buttonVariants({ variant: "secondary" })}
              >
                Xem thêm sản phẩm
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
