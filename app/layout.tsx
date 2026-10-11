import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Placement Season Simulator | Prepare. Interview. Get Hired.",
  description:
    "Experience campus placement season from drive announcement to final interview. Build your profile under pressure in this gamified web simulation.",
  keywords: [
    "placement",
    "simulator",
    "campus hiring",
    "interview prep",
    "resume",
    "game",
  ],
  authors: [{ name: "Placement Season Team" }],
  openGraph: {
    title: "Placement Season Simulator",
    description: "Prepare. Interview. Get Hired. A gamified campus placement experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <nav className="fixed bottom-3 right-3 z-50 flex gap-2 font-mono text-[10px]">
          <Link href="/interview" className="bg-neutral-900 text-white px-2.5 py-1.5 rounded shadow">MOCK INTERVIEW</Link>
          <Link href="/resume" className="bg-white text-neutral-900 border border-neutral-300 px-2.5 py-1.5 rounded shadow">RESUME CHECK</Link>
        </nav>
        <Analytics />
      </body>
    </html>
  );
}
