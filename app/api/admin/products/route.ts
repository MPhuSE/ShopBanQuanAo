import { NextResponse } from "next/server";

import { assertSupabaseEnv } from "@/lib/env";
import { createAdminProduct } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminProductSchema } from "@/lib/validation";

export async function POST(request: Request) {
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
    const parsed = adminProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const product = await createAdminProduct(parsed.data);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không thể tạo sản phẩm mới."
      },
      { status: 500 }
    );
  }
}
