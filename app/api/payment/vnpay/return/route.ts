import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/payment/result", request.url);

  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  if (!redirectUrl.searchParams.has("status")) {
    redirectUrl.searchParams.set("status", "pending");
  }

  return NextResponse.redirect(redirectUrl);
}
