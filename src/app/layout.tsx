import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/artnest/theme-provider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Artnest BD — Home Décor & Lifestyle",
  description:
    "Artnest BD is a curated home décor and lifestyle store in Bangladesh. Vases, wall décor, table accents, plants and thoughtful details for beautiful spaces. Cash on Delivery available.",
  keywords: [
    "home decor Bangladesh",
    "Artnest BD",
    "vases",
    "wall decor",
    "table decor",
    "lifestyle store Dhaka",
  ],
  openGraph: {
    title: "Artnest BD — Make Space for Beautiful Things",
    description:
      "Thoughtfully selected décor and lifestyle pieces designed to bring warmth, character and beauty into your everyday spaces.",
    type: "website",
    siteName: "Artnest BD",
    images: [{ url: "/images/hero.png", width: 1472, height: 736 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artnest BD — Home Décor & Lifestyle",
    description:
      "Beautiful details for beautiful spaces. Shop curated home décor in Bangladesh.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
