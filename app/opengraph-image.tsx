import { ImageResponse } from 'next/og';

export const alt = 'Terra Fieldworks — Rugged by design. Ready for anything.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
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
        <p
          style={{
            color: '#ffffff',
            fontSize: '80px',
            fontFamily: 'system-ui',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: '0 0 32px 0',
          }}
        >
          User Driven.{'\n'}Purpose Built.
        </p>
        <p
          style={{
            color: '#888888',
            fontSize: '28px',
            fontFamily: 'system-ui',
            margin: 0,
          }}
        >
          Innovative tools, gear, and everyday carry — engineered for the field.
        </p>
      </div>
    ),
    { ...size }
  );
}
