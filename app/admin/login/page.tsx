import { redirect } from "next/navigation";

import { ConfigNotice } from "@/components/config-notice";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { getAdminUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminLoginPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-xl">
        <ConfigNotice message="Thêm NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY và SUPABASE_SERVICE_ROLE_KEY để đăng nhập admin bằng Supabase Auth." />
      </div>
    );
  }

  const user = await getAdminUser();

  if (user) {
    redirect("/admin/orders");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="surface-card rounded-[34px] p-7 md:p-8">
        <p className="section-kicker">Vận hành</p>
        <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)]">
          Dashboard để quản lý đơn, thanh toán và sản phẩm.
        </h1>
        <div className="mt-6 grid gap-4">
          {[
            ["Bảng đơn hàng", "Xem danh sách đơn và lọc nhanh trạng thái."],
            ["Xác nhận thanh toán", "Xác nhận QR thanh toán thủ công chỉ trong vài click."],
            ["Quản lý sản phẩm", "Tạo và cập nhật gói bán trong cùng giao diện."]
          ].map(([title, description]) => (
            <div key={title} className="surface-muted rounded-[24px] p-5">
              <p className="font-semibold text-[color:var(--text)]">{title}</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl">
        <AdminLoginForm />
      </div>
    </div>
  );
}
