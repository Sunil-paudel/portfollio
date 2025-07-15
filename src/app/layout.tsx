
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/components/providers';

// If you are using the Inter font, you can uncomment this and configure it.
// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Your actual deployed domain
const siteUrl = 'https://sunilpaudel.vercel.app';
const profileImageUrl = `${siteUrl}/resume photo.jpg`; // Assuming resume photo.jpg is in /public

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // Important for resolving relative image paths for OG
  title: {
    default: "Sunil Paudel (Sunny) | Full-Stack Developer Portfolio",
    template: "%s | Sunil Paudel (Sunny)",
  },
  description: 'The professional portfolio of Sunil Paudel (Sunny), a skilled Full-Stack Developer graduate specializing in Next.js, React, TypeScript, and modern web technologies. View projects, skills, and professional experience.',
  keywords: ['Sunil Paudel', 'Sunny', 'Sunil Paudel Portfolio', 'Full-Stack Developer', 'Web Developer', 'Next.js', 'React', 'JavaScript', 'TypeScript', 'Node.js', 'Portfolio', 'Software Engineer', 'Australia', 'IT Graduate'],
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
  alternates: {
    canonical: '/', // Sets the canonical URL for the homepage
  },
  openGraph: {
    title: "Sunil Paudel (Sunny) | Full-Stack Developer Portfolio",
    description: 'Explore the portfolio of Sunil Paudel (Sunny), a skilled Full-Stack Developer graduate.',
    url: '/',
    siteName: "Sunil Paudel (Sunny)'s Portfolio",
    images: [
      {
        url: profileImageUrl, // Must be an absolute URL
        width: 800, // Provide image dimensions
        height: 600,
        alt: 'Sunil Paudel (Sunny) - Profile Picture',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sunil Paudel (Sunny) | Full-Stack Developer Portfolio",
    description: 'The professional portfolio of Sunil Paudel (Sunny), a skilled Full-Stack Developer.',
    images: [profileImageUrl], // Must be an absolute URL
    // creator: '@yourTwitterHandle', // Optional: Add your Twitter handle
  },
  // Optional: Add more specific manifest if you plan to make it a PWA
  // manifest: "/manifest.json",
  // Optional: Add icons
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
