import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { SITE_URL } from '@/lib/site';

const OWNER_EMAIL = 'support@terrafieldworks.com';
const FROM = 'Terra Fieldworks <noreply@terrafieldworks.com>';

// Guard against HTML injection when interpolating values (esp. user-supplied email) into email bodies.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  try {
    const { email, productTitle, productHandle, variantId, color } = await request.json();

    if (!email || !productTitle || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email and product are required.' }, { status: 400 });
    }

    let apiKey: string;
    try {
      const { env } = await getCloudflareContext({ async: true });
      apiKey = (env as Record<string, string>).RESEND_API_KEY;
    } catch {
      apiKey = process.env.RESEND_API_KEY ?? '';
    }

    if (!apiKey) {
      console.error('Notify me: RESEND_API_KEY is not set in the runtime environment.');
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const productUrl = productHandle ? `${SITE_URL}/shop/${productHandle}` : null;
    const label = `${productTitle}${color ? ` (${color})` : ''}`;

    // Owner notification — the business-critical send. If this fails, surface it.
    const { error: ownerError } = await resend.emails.send({
      from: FROM,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Back in Stock Request — ${label}`,
      html: `
        <p>A customer wants to be notified when a product is back in stock.</p>
        <table cellpadding="4">
          <tr><td><strong>Product:</strong></td><td>${esc(productTitle)}</td></tr>
          ${color ? `<tr><td><strong>Color:</strong></td><td>${esc(color)}</td></tr>` : ''}
          ${variantId ? `<tr><td><strong>Variant ID:</strong></td><td>${esc(variantId)}</td></tr>` : ''}
          <tr><td><strong>Customer:</strong></td><td>${esc(email)}</td></tr>
          ${productUrl ? `<tr><td><strong>Link:</strong></td><td><a href="${esc(productUrl)}">${esc(productUrl)}</a></td></tr>` : ''}
        </table>
      `,
    });

    if (ownerError) {
      console.error('Notify me: owner email failed:', ownerError);
      return NextResponse.json({ error: 'Could not save your request. Please try again.' }, { status: 502 });
    }

    // Customer confirmation — best effort. A failure here must not fail the request,
    // since we've already captured the lead above.
    const { error: customerError } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `We'll let you know — ${productTitle}`,
      html: `
        <p>Hey,</p>
        <p>We got your request. We'll email you as soon as <strong>${esc(label)}</strong> is back in stock.</p>
        <p>— Terra Fieldworks</p>
      `,
    });
    if (customerError) {
      console.error('Notify me: customer confirmation failed (lead was still captured):', customerError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Notify me error:', message);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
