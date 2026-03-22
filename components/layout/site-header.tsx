"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SHOP_EMAIL, SHOP_HOTLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  const links = [
    { href: "/products", label: "Sản phẩm" },
    { href: "/track-order", label: "Tra cứu đơn" }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="bg-[linear-gradient(90deg,var(--brand-from),var(--brand-to))] text-white">
        <div className="container-shell flex flex-wrap items-center justify-between gap-2 py-2 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <Link href="/products" className="transition hover:text-white">
              Chính sách
            </Link>
            <Link href="/products" className="transition hover:text-white">
              FAQ
            </Link>
            <a href={`tel:${SHOP_HOTLINE}`} className="transition hover:text-white">
              Hotline: {SHOP_HOTLINE}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white/85">
            <span>Tiếng Việt</span>
            <span>VND</span>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>

      <div className="container-shell py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-from),#59d7ff)] text-lg font-extrabold italic text-white shadow-[0_14px_28px_rgba(124,77,255,0.24)]">
                FS
              </div>
              <div>
                <p className="bg-[linear-gradient(135deg,#41d4ff,var(--brand-from))] bg-clip-text text-xl font-extrabold uppercase tracking-tight text-transparent">
                  bantkgiare
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  Cửa hàng tài khoản số
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-3 lg:flex" />
          </div>

          <form action="/products" className="w-full max-w-[640px]">
            <div className="flex items-center overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <input
                type="search"
                name="q"
                placeholder="Tìm kiếm sản phẩm..."
                className="h-12 flex-1 bg-transparent px-4 text-sm outline-none"
              />
              <button
                type="submit"
                className="flex h-12 min-w-12 items-center justify-center border-l border-[color:var(--line)] px-4 text-sm font-semibold text-[color:var(--brand)]"
              >
                Tìm
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                Hotline 24/7
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                {SHOP_HOTLINE}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--line)] bg-white">
        <div className="container-shell flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-[color:var(--text)]">
            <Link
              href="/"
              className={cn(
                "transition hover:text-[color:var(--brand)]",
                pathname === "/" && "text-[color:var(--brand)]"
              )}
            >
              Trang chủ
            </Link>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 transition hover:text-[color:var(--brand)]",
                  pathname.startsWith(link.href) && "text-[color:var(--brand)]"
                )}
                >
                  <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[color:var(--text-soft)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em]">Hotline 24/7</p>
              <p className="mt-1 font-semibold text-[color:var(--text)]">{SHOP_HOTLINE}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em]">Email</p>
              <p className="mt-1 font-semibold text-[color:var(--text)]">
                {SHOP_EMAIL}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
