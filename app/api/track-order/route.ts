import { NextRequest, NextResponse } from "next/server";

import { assertSupabaseEnv } from "@/lib/env";
import { getTrackableOrder } from "@/lib/queries";
import { trackOrderSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    assertSupabaseEnv();

    const orderCode = request.nextUrl.searchParams.get("orderCode") || "";
    const email = request.nextUrl.searchParams.get("email") || "";
    const parsed = trackOrderSchema.safeParse({ orderCode, email });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const order = await getTrackableOrder(parsed.data.orderCode, parsed.data.email);

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tra cứu đơn." },
      { status: 500 }
    );
  }
}
