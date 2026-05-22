import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavStats } from "@/components/NavStats";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Writing Gym",
  description: "Deliberate practice for nonfiction writers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950">
        <header className="border-b border-zinc-800/60">
          <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-sm font-bold text-zinc-100 hover:text-white transition-colors tracking-tight">
                The Writing Gym
              </Link>
              <nav className="flex items-center gap-1">
                {[
                  { href: "/", label: "Practice" },
                  { href: "/daily", label: "Daily Drill" },
                  { href: "/projects", label: "Projects" },
                  { href: "/clinic", label: "Clinic" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <NavStats />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
