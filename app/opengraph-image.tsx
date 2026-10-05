import { ImageResponse } from 'next/og';
import { OG_CARD_BACKGROUND, OG_CARD_WIDTH, OG_CARD_HEIGHT } from '@/lib/og-card';

export const alt = 'Terra Fieldworks — Solutions for the Field.';
export const size = { width: OG_CARD_WIDTH, height: OG_CARD_HEIGHT };
export const contentType = 'image/png';

// The link-preview card: what Slack, iMessage, LinkedIn, X and the rest show
// when someone pastes a Terra URL. Built to read as the homepage hero does —
// same crop of the same photograph, same gradient, same copy.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', background: '#000000' }}>
        {/* Pre-cropped to exactly these dimensions by npm run images, so it
            needs no fitting here. */}
        <img src={OG_CARD_BACKGROUND} width={size.width} height={size.height} style={{ position: 'absolute', top: 0, left: 0 }} />

        {/* The crop's lower left is the lit ground. Darkening left-to-right
            holds the type legible over it without flattening the figure. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.25) 72%, rgba(0,0,0,0) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '80px',
          }}
        >
          <p
            style={{
              color: '#888888',
              fontSize: '24px',
              fontFamily: 'system-ui',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: '0 0 24px 0',
            }}
          >
            Terra Fieldworks
          </p>

          {/* Two elements rather than a newline: Satori does not honour \n
              without an explicit whiteSpace, and the homepage breaks the
              headline at the same point. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#ffffff',
              fontSize: '80px',
              fontFamily: 'system-ui',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              margin: '0 0 32px 0',
            }}
          >
            <span>Solutions for</span>
            <span>the Field.</span>
          </div>

          <p style={{ color: '#aaaaaa', fontSize: '28px', fontFamily: 'system-ui', margin: 0 }}>
            Innovative tools, gear, and everyday carry
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
