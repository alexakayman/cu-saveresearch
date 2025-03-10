import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/student-narratives-qr-code") {
    return NextResponse.redirect("https://forms.gle/11e5DHnS6mVLcNhe9");
  }
  
  return NextResponse.next(); // Continue with normal processing
}
