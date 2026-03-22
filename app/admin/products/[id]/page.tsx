import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProductForm } from "@/components/admin/admin-product-form";
import { ConfigNotice } from "@/components/config-notice";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getAdminProductById } from "@/lib/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <ConfigNotice message="Can Supabase env de mo trang chinh sua san pham." />
    );
  }

  await requireAdminUser();
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/products"
          className={buttonVariants({ variant: "secondary" })}
        >
          Quay lại danh sách sản phẩm
        </Link>
        <div className="flex items-center gap-3">
          <StatusBadge status={product.status} />
          <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-strong)]">
            {formatCurrency(product.price, product.currency)}
          </span>
        </div>
      </div>

      <section className="surface-card rounded-[34px] p-6 md:p-7">
        <p className="section-kicker">Chi tiết sản phẩm</p>
        <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
          {product.name}
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Slug</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">{product.slug}</p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Tạo lúc</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {formatDateTime(product.created_at)}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Cập nhật</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {formatDateTime(product.updated_at)}
            </p>
          </div>
          <div className="surface-muted rounded-[24px] p-4">
            <p className="text-sm text-[color:var(--text-soft)]">Đã bán / tồn kho</p>
            <p className="mt-2 font-semibold text-[color:var(--text)]">
              {product.sold_count ?? 0} / {Math.max((product.stock_quantity ?? 0) - (product.sold_count ?? 0), 0)}
            </p>
          </div>
        </div>
        {(product.image_url || product.banner_image_url) ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="surface-panel overflow-hidden rounded-[24px]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-sm text-[color:var(--text-soft)]">
                  Chưa có ảnh sản phẩm
                </div>
              )}
            </div>
            <div className="surface-panel overflow-hidden rounded-[24px]">
              {product.banner_image_url ? (
                <img
                  src={product.banner_image_url}
                  alt={`${product.name} banner`}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-sm text-[color:var(--text-soft)]">
                  Chưa có banner
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

      <AdminProductForm
        mode="edit"
        productId={product.id}
        initialValues={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.short_description || "",
          description: product.description || "",
          imageUrl: product.image_url || "",
          bannerImageUrl: product.banner_image_url || "",
          price: product.price,
          stockQuantity: product.stock_quantity ?? 0,
          currency: product.currency,
          status: (product.status as "active" | "draft" | "inactive") || "active"
        }}
      />
    </div>
  );
}
