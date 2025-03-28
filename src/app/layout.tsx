import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { appConfig } from '../app-config';
import { Header } from './_header/header';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { getCurrentUser } from '@/lib/session';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Footer } from '@/components/footer';
import { ReactScan } from '@/components/ReactScan';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GigCanvas',
  description:
    'GigCanvas is a Clinet Management, Project Management, and Task Management tool for small businesses.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <ReactScan /> */}

      <body className={cn(inter.className, 'dark')}>
        <NextTopLoader color="#dbb73f" />
        <TooltipProvider>
          <div className="flex flex-col w-full">
            {appConfig.mode === 'live' && <Header />}
            <div>
              {children}
              <Toaster />
            </div>
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
