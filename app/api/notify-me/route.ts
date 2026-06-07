import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(request: Request) {
  try {
    let apiKey: string;

    try {
      const { env } = await getCloudflareContext({ async: true });
      apiKey = (env as Record<string, string>).RESEND_API_KEY;
    } catch {
      apiKey = process.env.RESEND_API_KEY ?? '';
    }

    const { email, productTitle, color } = await request.json();

    if (!email || !productTitle) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const resend = new Resend(apiKey);

    // Notify Brian
    await resend.emails.send({
      from: 'Terra Fieldworks <noreply@terrafieldworks.com>',
      to: 'support@terrafieldworks.com',
      subject: `Back in Stock Request — ${productTitle}${color ? ` (${color})` : ''}`,
      html: `
        <p>A customer wants to be notified when a product is back in stock.</p>
        <table>
          <tr><td><strong>Product:</strong></td><td>${productTitle}</td></tr>
          ${color ? `<tr><td><strong>Color:</strong></td><td>${color}</td></tr>` : ''}
          <tr><td><strong>Customer Email:</strong></td><td>${email}</td></tr>
        </table>
      `,
    });

    // Confirm to customer
    await resend.emails.send({
      from: 'Terra Fieldworks <noreply@terrafieldworks.com>',
      to: email,
      subject: `We'll let you know — ${productTitle}`,
      html: `
        <p>Hey,</p>
        <p>We got your request. We'll email you as soon as <strong>${productTitle}${color ? ` in ${color}` : ''}</strong> is back in stock.</p>
        <p>— Terra Fieldworks</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Notify me error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
