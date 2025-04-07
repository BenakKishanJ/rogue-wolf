import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function middleware(req) {
  const session = await getServerSession(authOptions);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!session || !["admin", "superadmin"].includes(session.user.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname === "/admin/users" && session.user.role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
