import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const apiKey = (env as Record<string, string>).RESEND_API_KEY;
    const audienceId = (env as Record<string, string>).RESEND_AUDIENCE_ID;

    console.log('RESEND_API_KEY present:', !!apiKey);
    console.log('RESEND_AUDIENCE_ID present:', !!audienceId);

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Subscribe handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
