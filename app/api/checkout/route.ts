import { NextRequest, NextResponse } from "next/server";

import { assertSupabaseEnv, getManualQrConfig, hasManualQrConfig } from "@/lib/env";
import { createOrderPaymentBundle, getProductBySlug } from "@/lib/queries";
import { generateOrderCode, generateTxnRef } from "@/lib/order";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    assertSupabaseEnv();

    if (!hasManualQrConfig()) {
      return NextResponse.json(
        {
          error:
            "Chưa cấu hình QR thanh toán. Thêm PAYMENT_QR_IMAGE_URL và thông tin tài khoản trong .env.local."
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const product = await getProductBySlug(parsed.data.productSlug);

    if (!product) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại." }, { status: 404 });
    }

    const soldCount = product.sold_count ?? 0;
    const remainingStock = Math.max((product.stock_quantity ?? 0) - soldCount, 0);

    if (remainingStock <= 0) {
      return NextResponse.json(
        { error: "Sản phẩm đã hết hàng, chưa thể tạo đơn mới." },
        { status: 409 }
      );
    }

    const orderCode = generateOrderCode();
    const txnRef = generateTxnRef();

    await createOrderPaymentBundle({
      customerEmail: parsed.data.email,
      customerName: parsed.data.customerName,
      customerNote: parsed.data.customerNote,
      product,
      orderCode,
      txnRef
    });

    const qrConfig = getManualQrConfig(orderCode);

    return NextResponse.json({
      orderCode,
      trackUrl: `/track-order/${orderCode}?email=${encodeURIComponent(
        parsed.data.email.trim().toLowerCase()
      )}`,
      qrConfig
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không thể tạo đơn hàng lúc này."
      },
      { status: 500 }
    );
  }
}
