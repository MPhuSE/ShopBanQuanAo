import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { SHOP_HOTLINE } from "@/lib/constants";
import { getProducts } from "@/lib/queries";
import { getCategoryList } from "@/lib/storefront";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 8);
  const categories = getCategoryList(products).slice(1, 5);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,var(--brand-from),#9b79b3,var(--brand-to))] text-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="relative px-7 py-10 md:px-10 md:py-14">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-sm" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-black/10" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
                Cửa hàng tài khoản số
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
                Mua tài khoản premium, AI tools và gói subscription chỉ trong vài bước.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 md:text-base">
                Giao diện theo hướng shop bán account: tìm nhanh, sản phẩm rõ
                ràng, thanh toán QR và có trang tra cứu đơn để khách an tâm hơn.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--brand-strong)]"
                >
                  Xem sản phẩm
                </Link>
                <Link
                  href="/track-order"
                  className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                >
                  Tra cứu đơn
                </Link>
                <a
                  href={`tel:${SHOP_HOTLINE}`}
                  className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                >
                  Hotline: {SHOP_HOTLINE}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="surface-card rounded-[24px] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
              Danh mục phổ biến
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="rounded-full bg-[color:var(--surface-muted)] px-3 py-2 text-sm font-medium text-[color:var(--text)]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div className="surface-card rounded-[24px] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
              Cam kết minh bạch
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text)]">
                Giao ngay sau khi xác nhận thanh toán
              </div>
              <div className="rounded-2xl bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text)]">
                QR thanh toán rõ nội dung chuyển khoản
              </div>
              <div className="rounded-2xl bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text)]">
                Tra cứu bằng mã đơn và email
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card rounded-[24px] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
              Sản phẩm nổi bật
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[color:var(--text)]">
              Chọn nhanh những gói đang được mua nhiều
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[color:var(--brand-strong)]">
            Xem tất cả
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
