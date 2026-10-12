import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'B2B Lead Finder & Scraper',
  description: 'Find local B2B leads instantly and monetize via Paystack.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
