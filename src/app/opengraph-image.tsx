import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Chart Analysis - AI-Powered Forex Trading Insights'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: 20,
          }}
        >
          Chart Analysis
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#888888',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 80,
          }}
        >
          AI-Powered Trading Insights
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginBottom: 60,
          }}
        >
          {/* Red candlestick */}
          <div
            style={{
              width: 30,
              height: 80,
              background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: 4,
            }}
          />
          {/* Green candlestick */}
          <div
            style={{
              width: 30,
              height: 110,
              background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 4,
            }}
          />
          {/* Red candlestick */}
          <div
            style={{
              width: 30,
              height: 70,
              background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: 4,
            }}
          />
          {/* Green candlestick */}
          <div
            style={{
              width: 30,
              height: 120,
              background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 4,
            }}
          />
          {/* Green candlestick */}
          <div
            style={{
              width: 30,
              height: 100,
              background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#666666',
          }}
        >
          Technical Analysis • Trade Signals • Risk Management
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
