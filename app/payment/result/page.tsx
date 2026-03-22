import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { readSearchParam } from "@/lib/utils";

export default async function PaymentResultPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const status = readSearchParam(resolvedSearchParams.status) || "pending";

  const copy =
    status === "success"
      ? {
          title: "Thanh toán đã được tiếp nhận",
          description:
            "Hệ thống đã nhận callback thanh toán. Bạn có thể mở trang tra cứu để xem trạng thái cập nhật."
        }
      : {
          title: "Kết quả thanh toán",
          description:
            "Trang này được giữ lại để tương thích với các callback payment cũ. Flow hiện tại ưu tiên QR thủ công và trang tra cứu."
        };

  return (
    <section className="surface-card mx-auto max-w-3xl rounded-[34px] p-8">
      <p className="section-kicker">Kết quả thanh toán</p>
      <h1 className="mt-3 text-3xl font-semibold text-[color:var(--text)]">
        {copy.title}
      </h1>
      <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)]">
        {copy.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/track-order" className={buttonVariants()}>
          Tra cứu đơn
        </Link>
        <Link
          href="/products"
          className={buttonVariants({ variant: "secondary" })}
        >
          Quay lại sản phẩm
        </Link>
      </div>
    </section>
  );
}
