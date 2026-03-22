import Link from "next/link";

import { AdminProductForm } from "@/components/admin/admin-product-form";
import { ConfigNotice } from "@/components/config-notice";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getAdminProducts } from "@/lib/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminProductsPage() {
  if (!hasSupabaseEnv()) {
    return (
      <ConfigNotice message="Can Supabase env de doc du lieu san pham admin." />
    );
  }

  await requireAdminUser();
  const products = await getAdminProducts();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Quản trị sản phẩm</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Danh sách sản phẩm
          </h1>
        </div>
        <Link href="/admin/orders" className={buttonVariants({ variant: "secondary" })}>
          Quản lý đơn
        </Link>
      </div>

      <AdminProductForm mode="create" />

      <div className="grid gap-4">
        {products.map((product) => (
          <article key={product.id} className="surface-card rounded-[30px] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[color:var(--text)]">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                  {product.short_description || product.description}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                  /products/{product.slug}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={product.status} />
                <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-strong)]">
                  {formatCurrency(product.price, product.currency)}
                </span>
                <span className="rounded-full bg-[color:var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--text)]">
                  Tồn kho: {Math.max((product.stock_quantity ?? 0) - (product.sold_count ?? 0), 0)}
                </span>
                <span className="rounded-full bg-[color:var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--text)]">
                  Đã bán: {product.sold_count ?? 0}
                </span>
                <Link
                  href={`/admin/products/${product.id}`}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Chỉnh sửa
                </Link>
              </div>
            </div>
            {product.image_url ? (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-52 w-full object-cover"
                />
              </div>
            ) : null}
            <p className="mt-4 text-sm text-[color:var(--text-soft)]">
              Tạo lúc {formatDateTime(product.created_at)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
