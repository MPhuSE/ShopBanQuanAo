import Link from "next/link";

import { getProductCategory } from "@/lib/storefront";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/db";

export function ProductCard({ product }: { product: Product }) {
  const category = getProductCategory(product);
  const sold = product.sold_count ?? 0;
  const stock = product.stock_quantity ?? 0;
  const remainingStock = Math.max(stock - sold, 0);
  const isSoldOut = remainingStock <= 0;

  return (
    <article className="group overflow-hidden rounded-[14px] border border-[#dbe3ef] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#eef3fb]">
          <div className="absolute left-3 top-3 z-10 rounded-full bg-[rgba(17,24,39,0.82)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {category}
          </div>
          <div className="absolute left-3 top-11 z-10 rounded-full bg-[#0f766e] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            {isSoldOut ? "Hết hàng" : `Còn ${remainingStock}`}
          </div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-44 items-center justify-center text-sm font-semibold text-[color:var(--brand-strong)]">
              Chưa có ảnh sản phẩm
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-3.5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-11 text-[15px] font-semibold text-[color:var(--text)] transition group-hover:text-[color:var(--brand)]">
            {product.name}
          </h3>
        </Link>

        <div>
          <p className="text-[13px] font-bold text-[#f44336]">
            {formatCurrency(product.price, product.currency)}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-[color:var(--text-soft)]">
            {product.short_description || "Tài khoản premium giao nhanh, hỗ trợ trong ngày."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[color:var(--text-soft)]">Đã bán {sold}</span>
          <span className="text-[color:var(--text-soft)]">Tồn kho {remainingStock}</span>
          <span className="font-medium text-[#16a34a]">
            {isSoldOut ? "Tạm hết hàng" : "Đang mở bán"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#edf2f9] pt-3 text-xs">
          {isSoldOut ? (
            <span className="rounded-lg bg-slate-200 px-3 py-2 font-semibold text-slate-600">
              Hết hàng
            </span>
          ) : (
            <Link
              href={`/checkout/${product.slug}`}
              className="rounded-lg bg-[linear-gradient(135deg,var(--brand-from),var(--brand))] px-3 py-2 font-semibold text-white"
            >
              Mua ngay
            </Link>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="font-medium text-[color:var(--brand-strong)]"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
