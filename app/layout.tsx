import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://dsa-vault.shop";
const DESCRIPTION =
  "A Socratic AI coach for DSA interview prep, built on the Striver's A2Z DSA Sheet. Talk through your intuition before seeing the answer, convert solutions to any language, get graded, and watch step-by-step dry runs — all through the Claude subscription you already pay for. One-time payment, ₹199, lifetime access.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DSA Vault — AI-Assisted DSA Interview Prep",
    template: "%s — DSA Vault",
  },
  description: DESCRIPTION,
  keywords: [
    "DSA interview prep",
    "Striver A2Z DSA Sheet",
    "AI coding interview coach",
    "data structures and algorithms practice",
    "Claude AI DSA trainer",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "DSA Vault",
    title: "DSA Vault — AI-Assisted DSA Interview Prep",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Vault — AI-Assisted DSA Interview Prep",
    description: DESCRIPTION,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
