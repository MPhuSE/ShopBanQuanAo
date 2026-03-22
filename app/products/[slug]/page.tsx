import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { SHOP_HOTLINE } from "@/lib/constants";
import { getProductBySlug } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const heroImage = product.banner_image_url || product.image_url;
  const soldCount = product.sold_count ?? 0;
  const stock = product.stock_quantity ?? 0;
  const remainingStock = Math.max(stock - soldCount, 0);
  const isSoldOut = remainingStock <= 0;

  return (
    <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
      <section className="space-y-6">
        <div className="surface-card overflow-hidden rounded-[34px]">
          <div className="relative h-80 bg-[color:var(--brand-soft)] sm:h-[420px]">
            {heroImage ? (
              <img
                src={heroImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                Chưa có ảnh sản phẩm
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(15,23,42,0.72)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Gói truy cập premium
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">
                {product.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="surface-card rounded-[34px] p-7 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={isSoldOut ? "inactive" : product.status} />
          </div>

          <p className="mt-5 whitespace-pre-line text-base leading-8 text-[color:var(--text-soft)]">
            {product.description || product.short_description}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Tồn kho còn lại", `${remainingStock} sản phẩm`],
              ["Đã bán", `${soldCount} sản phẩm`],
              ["Quy trình rõ ràng", "Trạng thái thanh toán và xử lý được hiển thị minh bạch."],
              ["Không cần username", "Khách chỉ cần email để tạo đơn và tra cứu."]
            ].map(([title, description]) => (
              <div key={title} className="surface-muted rounded-[24px] p-5">
                <p className="font-semibold text-[color:var(--text)]">{title}</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
        <section className="surface-card rounded-[34px] p-7 md:p-8">
          <p className="text-sm text-[color:var(--text-soft)]">Giá hiện tại</p>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--text)]">
            {formatCurrency(product.price, product.currency)}
          </p>
          <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
            Checkout tối giản, QR thanh toán rõ ràng và có trang tra cứu riêng ngay
            sau khi tạo đơn.
          </p>

          <div className="mt-6 grid gap-3">
            {isSoldOut ? (
              <div className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-200 px-5 text-sm font-semibold text-slate-600">
                Sản phẩm đang hết hàng
              </div>
            ) : (
              <Link href={`/checkout/${product.slug}`} className={buttonVariants({ size: "lg" })}>
                Mua ngay
              </Link>
            )}
            <Link
              href="/track-order"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Đã mua? Tra cứu đơn
            </Link>
            <a
              href={`tel:${SHOP_HOTLINE}`}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Hotline: {SHOP_HOTLINE}
            </a>
          </div>
        </section>

        <section className="surface-card rounded-[34px] p-7">
          <h2 className="text-xl font-semibold text-[color:var(--text)]">
            Vì sao flow này dễ chuyển đổi?
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[color:var(--text-soft)]">
            <p>Email là đủ để bắt đầu, không có form dài dòng.</p>
            <p>Trang thanh toán tách riêng giúp khách tập trung vào thao tác chuyển khoản.</p>
            <p>Mã đơn và trạng thái giúp tăng độ tin cậy sau khi thanh toán.</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
