import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const pretendard = localFont({
  src: '../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mindot-map.vercel.app'),
  title: 'Mindot',
  description: '생각을 연결하고 시각화하는 마인드맵 도구',
  openGraph: {
    title: 'Mindot',
    description: '생각을 연결하고 시각화하는 마인드맵 도구',
    url: 'https://mindot-map.vercel.app',
    siteName: 'Mindot',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
