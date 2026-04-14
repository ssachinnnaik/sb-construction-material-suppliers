import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SB Construction | Material Suppliers Hyderabad",
  description: "Hyderabad's most trusted construction material suppliers. Direct supply of premium Karimnagar bricks, sand, and stone with 100% transparency and honesty.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body style={{ backgroundColor: '#0f172a', margin: 0, overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
