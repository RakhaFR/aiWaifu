import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoshino — AI Waifu",
  description: "Chat with Takanashi Hoshino from Blue Archive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="h-full bg-[#0a0e1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
