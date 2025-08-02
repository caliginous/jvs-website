import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JVS - Jewish, Vegan, Sustainable",
  description: "Jewish Vegetarian Society - Promoting Jewish veganism and sustainability",
  keywords: ["Jewish", "Vegan", "Vegetarian", "Sustainability", "Community"],
  authors: [{ name: "Jewish Vegetarian Society" }],
  openGraph: {
    title: "JVS - Jewish, Vegan, Sustainable",
    description: "Jewish Vegetarian Society - Promoting Jewish veganism and sustainability",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JVS - Jewish, Vegan, Sustainable",
    description: "Jewish Vegetarian Society - Promoting Jewish veganism and sustainability",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
