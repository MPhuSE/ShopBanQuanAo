import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "manual_qr",
    message: "VNPay IPN is not active in this storefront. Manual QR flow is enabled."
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    mode: "manual_qr",
    message: "VNPay IPN is not active in this storefront. Manual QR flow is enabled."
  });
}
