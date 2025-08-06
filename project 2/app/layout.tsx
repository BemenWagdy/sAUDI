import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Visit Saudi Concierge - AI Travel Planner',
  description: 'Create personalized Saudi Arabia itineraries with AI-powered recommendations, weather forecasts, cultural tips, and more.',
  keywords: 'Saudi Arabia, travel, itinerary, AI, tourism, visit saudi, travel planner',
  authors: [{ name: 'Visit Saudi' }],
  openGraph: {
    title: 'Visit Saudi Concierge - AI Travel Planner',
    description: 'Create personalized Saudi Arabia itineraries with AI-powered recommendations',
    url: 'https://visit-saudi-concierge.vercel.app',
    siteName: 'Visit Saudi Concierge',
    images: [
      {
        url: 'https://i.ibb.co/99z3ZqR/images.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visit Saudi Concierge - AI Travel Planner',
    description: 'Create personalized Saudi Arabia itineraries with AI-powered recommendations',
    images: ['https://i.ibb.co/99z3ZqR/images.png'],
  },
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
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://i.ibb.co/99z3ZqR/images.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}