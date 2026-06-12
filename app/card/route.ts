import { redirect } from 'next/navigation';

// Stable landing URL for the QR code printed on business cards. The printed QR
// encodes `https://terrafieldworks.com/card` and never needs to change — repoint
// the campaign anytime by editing DESTINATION below (e.g. to a promo or a special
// launch page). `redirect()` issues a 307 *temporary* redirect, so browsers and
// search engines won't cache it and the target stays changeable.
//
// The UTM parameters let analytics (e.g. GA4) attribute these visits to the
// business card separately from organic search traffic.
const DESTINATION = '/?utm_source=business-card&utm_medium=qr&utm_campaign=card';

export function GET() {
  redirect(DESTINATION);
}
