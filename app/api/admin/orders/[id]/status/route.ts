import { NextRequest, NextResponse } from "next/server";

import { assertSupabaseEnv } from "@/lib/env";
import { getOrderById, updateOrderStatusByAdmin } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminUpdateOrderSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    assertSupabaseEnv();

    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Bạn chưa đăng nhập." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = adminUpdateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const { id } = await context.params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Đơn hàng không tồn tại." }, { status: 404 });
    }

    if (parsed.data.status === "completed" && order.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Chỉ được hoàn tất khi đơn đã thanh toán." },
        { status: 400 }
      );
    }

    await updateOrderStatusByAdmin({
      orderId: id,
      nextStatus: parsed.data.status,
      note: parsed.data.note,
      createdBy: user.email || user.id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật đơn." },
      { status: 500 }
    );
  }
}
