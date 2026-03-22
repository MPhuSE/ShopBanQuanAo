"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const links = [
    { href: "/admin/orders", label: "Đơn hàng" },
    { href: "/admin/products", label: "Sản phẩm" }
  ] as const;

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <header className="border-b border-white/10 bg-[rgba(15,23,42,0.88)] text-white backdrop-blur-xl">
      <div className="container-shell py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">
              Khu vực quản trị
            </p>
            <p className="mt-2 text-3xl font-semibold">Vận hành và doanh thu</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  pathname.startsWith(link.href)
                    ? "bg-white text-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.2)]"
                    : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
            <AdminSignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
