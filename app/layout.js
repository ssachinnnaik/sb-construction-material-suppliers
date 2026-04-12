import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import UniqueLoader from "@/components/UniqueLoader";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SB Construction | Premium Material Suppliers Hyderabad",
  description: "Hyderabad's most trusted construction material suppliers. Direct supply of premium Karimnagar bricks, sand, and stone with 100% transparency and honesty.",
  keywords: ["construction materials Hyderabad", "Karimnagar bricks Hyderabad", "sand suppliers Hyderabad", "SB Construction Hyderabad", "building materials"],
  authors: [{ name: "SB Construction Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body style={{ fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}>
        <UniqueLoader />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
