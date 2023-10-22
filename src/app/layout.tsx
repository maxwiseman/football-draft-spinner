import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { AxiomWebVitals } from "next-axiom";
import { ThemeProvider } from "./_components/ui/themeProvider";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Football Draft Picker",
  description: "Created by Max Wiseman and Ian Steiger",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="m-0 h-full p-0">
      <AxiomWebVitals />
      <body className={`m-0 h-full p-0 font-sans ${inter.variable}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
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
