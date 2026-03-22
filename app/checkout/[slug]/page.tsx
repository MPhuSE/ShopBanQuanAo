import { notFound } from "next/navigation";

import { ConfigNotice } from "@/components/config-notice";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { OrderTimeline } from "@/components/order-timeline";
import { SHOP_HOTLINE } from "@/lib/constants";
import { hasManualQrConfig, hasSupabaseEnv } from "@/lib/env";
import { getProductBySlug } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const soldCount = product.sold_count ?? 0;
  const remainingStock = Math.max((product.stock_quantity ?? 0) - soldCount, 0);
  const canCheckout = hasSupabaseEnv() && hasManualQrConfig();
  const canPurchase = remainingStock > 0;

  return (
    <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="space-y-6">
        <section className="surface-card rounded-[34px] p-7 md:p-8">
          <p className="section-kicker">Thanh toán</p>
          <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
            Hoàn tất thông tin đơn hàng
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--text-soft)]">
            Flow này được tối ưu để khách đi từ chọn sản phẩm sang thanh toán nhanh
            nhất có thể. Không có giỏ hàng, không có bước dư thừa.
          </p>
        </section>

        {canCheckout && canPurchase ? (
          <CheckoutForm product={product} />
        ) : !canPurchase ? (
          <ConfigNotice message="Sản phẩm này hiện đã hết tồn kho nên chưa thể tạo đơn mới." />
        ) : (
          <ConfigNotice message="Trang checkout đã sẵn sàng, nhưng bạn cần thêm Supabase env và bộ PAYMENT_QR_* trong .env.local để tạo đơn và hiển thị QR thanh toán." />
        )}
      </div>

      <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
        <section className="surface-card overflow-hidden rounded-[34px]">
          <div className="relative h-56 bg-[color:var(--brand-soft)]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                Tóm tắt đơn hàng
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{product.name}</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-[color:var(--text-soft)]">Tổng thanh toán</p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">
              {formatCurrency(product.price, product.currency)}
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              Tồn kho còn lại: {remainingStock}
            </p>
          </div>
        </section>

        <section className="surface-card rounded-[34px] p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">
            Quy trình xử lý
          </h2>
          <div className="mt-6">
            <OrderTimeline
              items={[
                {
                  id: "step-1",
                  title: "Tạo đơn bằng email",
                  description: "Khách chỉ cần email để nhận mã đơn và tiếp tục thanh toán.",
                  tone: "info"
                },
                {
                  id: "step-2",
                  title: "Quét QR thanh toán",
                  description: "Trang thanh toán riêng hiển thị thông tin ngân hàng và nội dung chuyển khoản.",
                  tone: "warning"
                },
                {
                  id: "step-3",
                  title: "Theo dõi và nhận bàn giao",
                  description: "Admin xác nhận tiền thủ công, sau đó chuyển đơn sang hoàn tất.",
                  tone: "success"
                }
              ]}
            />
          </div>
          <div className="mt-6 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4 text-sm text-[color:var(--text-soft)]">
            Hotline hỗ trợ: {SHOP_HOTLINE}
          </div>
        </section>
      </aside>
    </div>
  );
}
