import type { Metadata } from "next";
import Link from "next/link";
import { Dancing_Script, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { OpeningLoader } from "@/components/OpeningLoader";
import { AppProviders } from "@/components/providers/AppProviders";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import { buildSiteMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildSiteMetadata(businessName);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const businessName = await getBusinessName();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dancingScript.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <Link href="/" className="skip-link">
          Skip to main content
        </Link>
        <AppProviders businessName={businessName}>
          <OpeningLoader />
          <ScrollToTopOnNavigate />
          {children}
          <ScrollToTop />
        </AppProviders>
      </body>
    </html>
  );
}
