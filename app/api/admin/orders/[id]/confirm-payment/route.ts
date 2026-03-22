import { NextResponse } from "next/server";

import { assertSupabaseEnv } from "@/lib/env";
import { confirmManualPaymentByAdmin } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
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

    const { id } = await context.params;
    await confirmManualPaymentByAdmin({
      orderId: id,
      createdBy: user.email || user.id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể xác nhận thanh toán."
      },
      { status: 500 }
    );
  }
}
