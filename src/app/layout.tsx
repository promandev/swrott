import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { LangSync } from "./LangSync";
import { AccessibilitySync } from "./AccessibilitySync";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Star Wars: Rise of the Triumvirate",
  description:
    "A web CRPG set in the era of the Sith Triumvirate. Forge your path through power, treachery, or cunning.",
  applicationName: "SWROTT",
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="vignette">
        <LangSync />
        <AccessibilitySync />
        {children}
      </body>
    </html>
  );
}
