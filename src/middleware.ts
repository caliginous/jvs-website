import { NextResponse } from "next/server";

export function middleware(req: Request) {
  // your existing logic (auth, i18n, etc)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"
  ]
};
