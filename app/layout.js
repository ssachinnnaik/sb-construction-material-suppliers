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

const siteUrl = 'https://sb-construction.onrender.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SB Construction | Bricks, Sand & Building Materials Suppliers Hyderabad",
    template: "%s | SB Construction Hyderabad",
  },
  description: "SB Construction — Hyderabad's most trusted construction material suppliers. Buy premium Karimnagar red bricks, river sand, M-sand, coarse sand, stone and gravel. Direct lorry supply, zero middlemen. Call +91 9490 057 579.",
  keywords: [
    // Primary product + location
    "construction materials Hyderabad",
    "bricks supplier Hyderabad",
    "sand supplier Hyderabad",
    "Karimnagar red bricks Hyderabad",
    "river sand Hyderabad",
    "M-sand supplier Hyderabad",
    "building materials Hyderabad",
    // Long-tail low-competition (price intent)
    "bricks for low price in Hyderabad",
    "cheap bricks Hyderabad",
    "bricks at lowest price Hyderabad",
    "affordable bricks Hyderabad",
    "sand and bricks for less price Hyderabad",
    "construction materials at low price Hyderabad",
    "bricks and sand very less price",
    // Long-tail buying intent
    "best bricks to buy in Hyderabad",
    "best bricks supplier in Hyderabad",
    "where to buy bricks in Hyderabad",
    "buy bricks online Hyderabad",
    "buy river sand Hyderabad",
    "top construction material supplier Hyderabad",
    // Long-tail quality intent
    "quality Karimnagar bricks Hyderabad",
    "red bricks wholesale Hyderabad",
    "Karimnagar bricks price Hyderabad",
    "best quality bricks Hyderabad",
    // Delivery/service intent
    "construction material home delivery Hyderabad",
    "lorry supply bricks sand Hyderabad",
    "direct supply construction materials Hyderabad",
    "construction material dealers Hyderabad",
    // Area-specific
    "brick supplier near me Hyderabad",
    "sand supplier near me Hyderabad",
    "SB Construction Hyderabad",
  ],
  authors: [{ name: "SB Construction Materials Suppliers", url: siteUrl }],
  creator: "SB Construction",
  publisher: "SB Construction Materials Suppliers",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "SB Construction Materials Suppliers",
    title: "SB Construction | Premium Bricks, Sand & Building Materials — Hyderabad",
    description: "Direct lorry supply of Karimnagar red bricks, river sand, M-sand & stone. 100% honest pricing. Serving Hyderabad. Call +91 9490 057 579.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SB Construction Materials Suppliers Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SB Construction | Bricks, Sand & Building Materials Hyderabad",
    description: "Buy premium Karimnagar bricks, river sand, M-sand & stone. Direct lorry delivery across Hyderabad. 100% transparent pricing.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "construction",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// JSON-LD Structured Data for Local Business + FAQ + Reviews
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      "name": "SB Construction Materials Suppliers",
      "description": "Hyderabad's most trusted and affordable construction material suppliers. Direct supply of premium Karimnagar red bricks at lowest price, river sand, M-sand, coarse sand and stone with 100% transparency.",
      "url": siteUrl,
      "telephone": "+919490057579",
      "email": "sbmcontsct5886@gmail.com",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN",
      },
      "areaServed": [
        { "@type": "City", "name": "Hyderabad" },
        { "@type": "City", "name": "Secunderabad" },
        { "@type": "City", "name": "Warangal" },
        { "@type": "State", "name": "Telangana" },
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          "opens": "07:00",
          "closes": "20:00",
        }
      ],
      "sameAs": [`https://wa.me/919490057579`],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Construction Materials at Best Price Hyderabad",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Karimnagar Red Bricks",
              "description": "Premium quality Karimnagar red bricks at lowest price in Hyderabad. Best bricks for construction, direct supply.",
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "River Sand",
              "description": "High-grade river sand for plastering and construction. Affordable river sand supply in Hyderabad.",
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "M-Sand (Manufactured Sand)",
              "description": "Quality manufactured sand for concrete and masonry. Best M-sand price in Hyderabad.",
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Coarse Sand",
              "description": "Coarse sand for foundation and concrete mixing at the lowest price in Hyderabad.",
            }
          },
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Where can I buy bricks at the lowest price in Hyderabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SB Construction Materials Suppliers offers Karimnagar red bricks at the lowest price in Hyderabad with direct lorry supply and zero middlemen. Call +91 9490 057 579."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best bricks supplier in Hyderabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SB Construction is Hyderabad's most trusted bricks and sand supplier with 15+ years of experience, 100% honest counting, and direct delivery across Hyderabad and Telangana."
          }
        },
        {
          "@type": "Question",
          "name": "Where to buy affordable sand and bricks for construction in Hyderabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At SB Construction, you can buy both sand and bricks for very less price in Hyderabad. We supply river sand, M-sand, coarse sand, and Karimnagar red bricks directly at wholesale prices."
          }
        },
        {
          "@type": "Question",
          "name": "Do you deliver construction materials at home in Hyderabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! SB Construction provides home delivery of bricks, sand and construction materials directly to your construction site in Hyderabad using our own lorry fleet."
          }
        },
        {
          "@type": "Question",
          "name": "What is the price of Karimnagar bricks in Hyderabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SB Construction offers Karimnagar red bricks at competitive and transparent prices in Hyderabad. Contact us at +91 9490 057 579 to get the latest price per 1000 bricks."
          }
        },
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "SB Construction Materials Suppliers",
      "publisher": { "@id": `${siteUrl}/#business` },
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ backgroundColor: "#0f172a", margin: 0, overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
