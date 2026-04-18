import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Philo Blog — Цифровизация философии",
  description:
    "Philo Blog explores the digital future of philosophy through essays, criticism, and editorial reflections in Kazakh and Russian contexts.",
  openGraph: {
    title: "Philo Blog — Цифровизация философии",
    description:
      "Editorial essays and philosophical criticism about digital culture, ideas, and public thought.",
    images: [
      {
        url: "/og-preview.svg",
        width: 1200,
        height: 630,
        alt: "Philo Blog open graph preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700;900&family=Source+Serif+4:opsz,wght@8..60,300..700&display=swap"
        />
      </head>
      <body className="font-body min-h-full flex flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-[color:var(--color-surface)] focus:px-4 focus:py-3 focus:font-ui focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-[color:var(--color-text)] focus:no-underline"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1 py-8 md:py-12">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
