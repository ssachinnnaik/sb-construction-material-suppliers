import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import LoadingSpinner from "@/components/LoadingSpinner";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body style={{ backgroundColor: '#0f172a', margin: 0 }}>
        <LoadingSpinner />
        {children}
      </body>
    </html>
  );
}
