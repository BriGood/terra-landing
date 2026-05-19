import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_AUDIENCE_ID present:', !!process.env.RESEND_AUDIENCE_ID);
    console.log('Available env keys:', Object.keys(process.env).join(', '));

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
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
