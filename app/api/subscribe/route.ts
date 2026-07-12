import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isValidEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    let apiKey: string;
    let audienceId: string;

    try {
      const { env } = await getCloudflareContext({ async: true });
      apiKey = (env as Record<string, string>).RESEND_API_KEY;
      audienceId = (env as Record<string, string>).RESEND_AUDIENCE_ID;
    } catch {
      apiKey = process.env.RESEND_API_KEY ?? '';
      audienceId = process.env.RESEND_AUDIENCE_ID ?? '';
    }

    if (!apiKey || !audienceId) {
      console.error('Subscribe: RESEND_API_KEY or RESEND_AUDIENCE_ID is not set in the runtime environment.');
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.contacts.create({
      email: email.trim(),
      audienceId,
      unsubscribed: false,
    });

    // Resend's message can name our audience or key, so it's logged but never returned to the browser.
    if (error) {
      console.error('Subscribe: contact create failed:', error);
      return NextResponse.json({ error: 'Could not add you to the list. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Subscribe error:', message);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
