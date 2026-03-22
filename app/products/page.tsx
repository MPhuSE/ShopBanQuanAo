import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/queries";
import { getCategoryList, getProductCategory } from "@/lib/storefront";
import { readSearchParam } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const products = await getProducts();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const q = (readSearchParam(resolvedSearchParams.q) ?? "").trim().toLowerCase();
  const category = readSearchParam(resolvedSearchParams.category) ?? "Tất cả";
  const sort = readSearchParam(resolvedSearchParams.sort) ?? "default";
  const min = Number(readSearchParam(resolvedSearchParams.min) ?? "");
  const max = Number(readSearchParam(resolvedSearchParams.max) ?? "");

  const categories = getCategoryList(products);

  let filtered = products.filter((product) => {
    const text = `${product.name} ${product.short_description ?? ""} ${
      product.description ?? ""
    }`.toLowerCase();

    if (q && !text.includes(q)) {
      return false;
    }

    if (category !== "Tất cả" && getProductCategory(product) !== category) {
      return false;
    }

    if (!Number.isNaN(min) && min > 0 && product.price < min) {
      return false;
    }

    if (!Number.isNaN(max) && max > 0 && product.price > max) {
      return false;
    }

    return true;
  });

  if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[24px] bg-[linear-gradient(90deg,var(--brand-from),#a08091,var(--brand-to))] text-white">
        <div className="container-shell relative py-10">
          <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-white/10 blur-sm" />
          <div className="absolute right-0 top-3 h-44 w-44 rounded-full bg-white/8" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/85">
              <Link href="/" className="hover:text-white">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="font-semibold text-white">Sản phẩm</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
              Tất cả sản phẩm
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              Khám phá bộ sưu tập sản phẩm chất lượng cao được chọn lọc dành riêng
              cho bạn. Giao nhanh, thanh toán rõ ràng và theo dõi đơn dễ dàng.
            </p>
          </div>
        </div>
      </section>

      <section className="market-toolbar rounded-[14px] p-4">
        <form className="grid gap-4 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.9fr_auto]">
          <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
            Danh mục
            <select name="category" defaultValue={category} className="field-select min-h-11 rounded-xl">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
            Từ khóa
            <input
              type="text"
              name="q"
              defaultValue={q}
              className="field min-h-11 rounded-xl"
              placeholder="Tìm tên sản phẩm"
            />
          </label>

          <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
            Mức giá từ
            <input
              type="number"
              name="min"
              defaultValue={Number.isNaN(min) ? "" : min}
              className="field min-h-11 rounded-xl"
              placeholder="Mức giá từ"
            />
          </label>

          <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
            Mức giá đến
            <input
              type="number"
              name="max"
              defaultValue={Number.isNaN(max) ? "" : max}
              className="field min-h-11 rounded-xl"
              placeholder="Mức giá đến"
            />
          </label>

          <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
            Sắp xếp
            <select name="sort" defaultValue={sort} className="field-select min-h-11 rounded-xl">
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name">Tên A-Z</option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="h-11 rounded-xl bg-[linear-gradient(135deg,var(--brand-from),var(--brand))] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,77,255,0.18)]"
            >
              Lọc
            </button>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 text-sm font-semibold text-[color:var(--text-soft)]"
            >
              Đặt lại
            </Link>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-[color:var(--text)]">
            {filtered.length} sản phẩm
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--text-soft)]">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">Tài khoản AI</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">Streaming</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">Văn phòng</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!filtered.length ? (
          <div className="rounded-[16px] border border-dashed border-[color:var(--line)] bg-white px-5 py-10 text-center text-sm text-[color:var(--text-soft)]">
            Không có sản phẩm phù hợp với bộ lọc hiện tại.
          </div>
        ) : null}
      </section>
    </div>
  );
}
