import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/";
  const token = request.cookies.get("access")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/logHome", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/logHome",
    "/profile",
    "/post/:path*",
    "/userProfile/:path*",
    "/logInProfile",
  ],
};
