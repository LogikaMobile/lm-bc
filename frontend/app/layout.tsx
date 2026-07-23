import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import BrandingProvider from "@/components/BrandingProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMBC | LogikaMobile Business Center",
  description: "B2B Support and Ticketing Portal for LogikaMobile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-primary/30">
        <BrandingProvider>
          {children}
        </BrandingProvider>
      </body>
    </html>
  );
}
