// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ever Knitting",
  description: "Premium knitwear manufacturing for brands worldwide.",
};

import Header from "@/components/sections/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
