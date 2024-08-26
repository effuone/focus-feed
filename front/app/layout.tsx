import '../styles/global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Focus Feed',
  description: 'A social media platform for developers',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-background'>{children}</body>
    </html>
  );
}
