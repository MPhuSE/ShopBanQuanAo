import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="surface-card mx-auto max-w-2xl rounded-[34px] p-8 text-center">
      <p className="section-kicker">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
        Không tìm thấy trang
      </h1>
      <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)]">
        Đường dẫn này không tồn tại hoặc sản phẩm đã bị ẩn.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        Quay về trang chủ
      </Link>
    </section>
  );
}
