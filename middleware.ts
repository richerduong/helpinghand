// middleware.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

// Enable the middleware for specific routes
export const config = {
  matcher: ['/settings'], // Specify the routes where middleware should be applied
};
