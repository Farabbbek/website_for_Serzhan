"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/PageTransition";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <main
        id="main-content"
        className="mx-0 flex min-h-0 w-full max-w-none flex-1 flex-col bg-background"
      >
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-8 md:py-12">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
