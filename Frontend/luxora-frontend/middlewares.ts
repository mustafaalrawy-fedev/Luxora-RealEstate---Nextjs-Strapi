import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // 1. إذا كان المستخدم غير مسجل ويحاول دخول الداشبورد، NextAuth سيتكفل بتحويله للـ Login تلقائياً

    // 2. حماية مسارات الـ Agent
    if (pathname.startsWith("/agent") && token?.user_type !== "Agent") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 3. حماية مسارات الـ Buyer
    if (pathname.startsWith("/buyer") && token?.user_type !== "Buyer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // يسمح بالمرور فقط إذا وجد Token
    },
  }
);

// تحديد المسارات التي سيطبق عليها الـ Middleware
export const config = {
  matcher: ["/agent/:path*", "/buyer/:path*"],
};