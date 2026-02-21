import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Chart Analysis - AI-Powered Forex Trading Insights',
    template: '%s | Chart Analysis'
  },
  description: 'Advanced AI-powered chart analysis tool for forex trading. Get instant technical analysis, trade signals, support/resistance levels, and risk management insights for GBP/JPY, EUR/USD, XAU/USD and more.',
  keywords: [
    'forex trading',
    'chart analysis',
    'technical analysis',
    'AI trading',
    'trading signals',
    'forex analysis',
    'candlestick analysis',
    'support resistance',
    'risk management',
    'GBP/JPY',
    'EUR/USD',
    'XAU/USD',
    'trading insights'
  ],
  authors: [{ name: 'Chart Analysis' }],
  creator: 'Chart Analysis',
  publisher: 'Chart Analysis',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: '512x512' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trading-chart-analysis.vercel.app',
    title: 'Chart Analysis - AI-Powered Forex Trading Insights',
    description: 'Advanced AI-powered chart analysis tool for forex trading. Get instant technical analysis, trade signals, and risk management insights.',
    siteName: 'Chart Analysis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chart Analysis - AI-Powered Forex Trading Insights',
    description: 'Advanced AI-powered chart analysis tool for forex trading. Get instant technical analysis, trade signals, and risk management insights.',
    creator: '@chartanalysis',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://trading-chart-analysis.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chart Analysis",
    "description": "Advanced AI-powered chart analysis tool for forex trading with instant technical analysis and trade signals.",
    "url": "https://trading-chart-analysis.vercel.app",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI-Powered Chart Analysis",
      "Technical Analysis",
      "Trade Signal Generation",
      "Support and Resistance Levels",
      "Risk Management Insights",
      "Multiple Forex Pairs",
      "Real-time Market Data"
    ],
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Modern browser recommended."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
