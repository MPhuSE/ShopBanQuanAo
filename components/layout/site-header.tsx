"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SHOP_EMAIL, SHOP_HOTLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/products", label: "Sản phẩm" },
    { href: "/track-order", label: "Tra cứu đơn" }
  ] as const;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  function isActiveLink(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-white/88 backdrop-blur-xl">
      <div className="hidden bg-[linear-gradient(90deg,var(--brand-from),var(--brand-to))] text-white md:block">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
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

      <div className="container-shell py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-5">
          <Link href="/" className="min-w-0 flex-1 lg:flex-none">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-from),#59d7ff)] text-base font-extrabold text-white shadow-[0_14px_28px_rgba(124,77,255,0.24)] md:h-12 md:w-12">
                BT
              </div>
              <div className="min-w-0">
                <p className="truncate bg-[linear-gradient(135deg,#41d4ff,var(--brand-from))] bg-clip-text text-lg font-extrabold uppercase tracking-tight text-transparent md:text-xl">
                  bantkgiare
                </p>
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--text-soft)] md:text-xs">
                  Cửa hàng tài khoản số
                </p>
              </div>
            </div>
          </Link>

          <form action="/products" className="hidden flex-1 lg:block">
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

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <a
              href={`tel:${SHOP_HOTLINE}`}
              className="hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-2 text-sm font-semibold text-[color:var(--text)] sm:inline-flex lg:hidden"
            >
              {SHOP_HOTLINE}
            </a>

            <div className="hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-2 xl:block">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                Hotline 24/7
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                {SHOP_HOTLINE}
              </p>
            </div>

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] shadow-sm transition hover:border-[color:var(--line-strong)] lg:hidden"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        <form action="/products" className="mt-4 lg:hidden">
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

        {isMenuOpen ? (
          <div className="mt-4 rounded-[28px] border border-[color:var(--line)] bg-white p-4 shadow-[0_22px_50px_rgba(15,23,42,0.08)] lg:hidden">
            <nav className="grid gap-2">
              <Link
                href="/"
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActiveLink("/")
                    ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                    : "bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:text-[color:var(--brand)]"
                )}
              >
                Trang chủ
              </Link>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActiveLink(link.href)
                      ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                      : "bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:text-[color:var(--brand)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${SHOP_HOTLINE}`}
                className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[color:var(--text)]"
              >
                Hotline: {SHOP_HOTLINE}
              </a>
              <a
                href={`mailto:${SHOP_EMAIL}`}
                className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[color:var(--text)]"
              >
                Email: {SHOP_EMAIL}
              </a>
            </div>

            <div className="mt-4 rounded-2xl bg-[linear-gradient(135deg,var(--brand-soft),rgba(255,255,255,0.9))] px-4 py-4 text-sm text-[color:var(--text-soft)]">
              Hỗ trợ nhanh 24/7, giao diện gọn trên điện thoại và thao tác mua hàng ngắn gọn hơn.
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden border-t border-[color:var(--line)] bg-white lg:block">
        <div className="container-shell flex items-center justify-between gap-6 py-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-[color:var(--text)]">
            <Link
              href="/"
              className={cn(
                "rounded-full px-4 py-2 transition",
                isActiveLink("/")
                  ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                  : "hover:text-[color:var(--brand)]"
              )}
            >
              Trang chủ
            </Link>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 transition",
                  isActiveLink(link.href)
                    ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                    : "hover:text-[color:var(--brand)]"
                )}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6 text-sm text-[color:var(--text-soft)]">
            <p className="font-medium text-[color:var(--text)]">
              Hỗ trợ nhanh qua hotline và email
            </p>
            <div className="h-8 w-px bg-[color:var(--line)]" />
            <a href={`tel:${SHOP_HOTLINE}`} className="transition hover:text-[color:var(--brand)]">
              {SHOP_HOTLINE}
            </a>
            <a href={`mailto:${SHOP_EMAIL}`} className="transition hover:text-[color:var(--brand)]">
              {SHOP_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
