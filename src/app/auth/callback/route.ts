import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const isPopup = searchParams.get('popup') === 'true';

  if (error || !code) {
    return NextResponse.redirect(origin);
  }

  const supabase = await createClient();
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    console.error('OAuth 세션 교환 실패:', sessionError.message);
    return NextResponse.redirect(origin);
  }

  return NextResponse.redirect(isPopup ? `${origin}/auth/close` : origin);
}
