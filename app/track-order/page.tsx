import { TrackOrderForm } from "@/components/forms/track-order-form";

export default function TrackOrderPage() {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
      <section className="space-y-6">
        <div className="surface-card rounded-[34px] p-7 md:p-8">
          <p className="section-kicker">Tra cứu</p>
          <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
            Tra cứu tiến độ đơn hàng
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--text-soft)]">
            Trang này giúp khách tự xem lại đơn đã tạo, kiểm tra xem đã được xác
            nhận thanh toán chưa và đơn đang ở bước xử lý nào.
          </p>
        </div>

        <TrackOrderForm />
      </section>

      <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
        <section className="surface-card rounded-[34px] p-7">
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">
            Bạn cần gì để tra cứu?
          </h2>
          <div className="mt-5 grid gap-4">
            {[
              ["Mã đơn hàng", "Được tạo ngay sau khi khách hoàn tất checkout."],
              ["Email đặt mua", "Dùng email này để xác thực đúng chủ sở hữu đơn hàng."],
              ["Trang thanh toán", "Nếu chưa trả tiền, bạn sẽ được nhắc quay lại QR thanh toán."]
            ].map(([title, description]) => (
              <div key={title} className="surface-muted rounded-[24px] p-5">
                <p className="font-semibold text-[color:var(--text)]">{title}</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
