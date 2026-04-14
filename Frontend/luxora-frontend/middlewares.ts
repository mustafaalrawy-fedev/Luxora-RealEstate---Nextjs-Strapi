import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // A. Allow the complete-profile page to load WITHOUT redirecting to itself
    if (pathname === "/complete-profile") return NextResponse.next();

    // B. If logged in but incomplete, force them to complete
    if (token && !token.user_type) {
      return NextResponse.redirect(new URL("/complete-profile", req.url));
    }

    // C. Handle role-based dashboard protection
    if (pathname.startsWith("/agent") && token?.user_type !== "Agent") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/buyer") && token?.user_type !== "Buyer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/agent/:path*", "/buyer/:path*", "/complete-profile"],
};