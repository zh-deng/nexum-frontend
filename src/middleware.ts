import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const token = request.cookies.get("access_token")?.value;
  // const isLoginPage = request.nextUrl.pathname === "/login";
  // const isSignupPage = request.nextUrl.pathname === "/signup";
  // const isHomePage = request.nextUrl.pathname === "/";

  // // If no token and not on login/signup/home page, redirect to login page
  // if (!token && !isLoginPage && !isSignupPage && !isHomePage) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
