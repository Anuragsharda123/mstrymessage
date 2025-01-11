import { NextRequest, NextResponse } from "next/server";
import { default } from 'next-auth/middleware';
import { getToken } from "next-auth/jwt";

export const middleware = async(request:NextRequest) => {
    const token = await getToken({req:request});
    const url = request.nextUrl

    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
          url.pathname.startsWith('/sign-up') ||
          url.pathname.startsWith('/verify') ||
          url.pathname === '/')
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    
      if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    return NextResponse.next();
}


// write routes on which middleware should work
export const config = {
    matcher: [
        '/sign-in',
        // '/sign-up',
        '/',
        // '/dashboard/:path/*',
        // '/verify/*',
    ]
}