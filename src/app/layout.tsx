import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { AxiomWebVitals } from 'next-axiom';
import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from './_components/ui/theme-provider';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Football Draft Picker',
  description: 'Created by Max Wiseman and Ian Steiger',
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html className="m-0 h-full p-0" lang="en">
      <AxiomWebVitals />
      <body className={`m-0 h-full p-0 font-sans ${inter.variable}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <TRPCReactProvider headers={headers()}>
              {children}
            </TRPCReactProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
