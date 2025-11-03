import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface CustomToken {
  user?: {
    role?: string;
  };
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Optional debug: log when no token is found
  console.log("Middleware URL:", url.pathname);

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })) as CustomToken | null;

  // If we didn’t get a token, user is not logged in
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/profile")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const role = token.user?.role;
    if (url.pathname.startsWith("/admin") && role !== "admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
