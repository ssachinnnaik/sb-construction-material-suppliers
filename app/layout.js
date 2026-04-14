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
    "construction materials Hyderabad",
    "bricks supplier Hyderabad",
    "sand supplier Hyderabad",
    "Karimnagar red bricks",
    "river sand Hyderabad",
    "M-sand supplier Hyderabad",
    "building materials Hyderabad",
    "construction material dealers Hyderabad",
    "brick supplier near me Hyderabad",
    "sand for construction Hyderabad",
    "coarse sand supplier",
    "stone gravel supplier Hyderabad",
    "SB Construction",
    "construction materials wholesale Hyderabad",
    "lorry supply construction materials",
    "cheap bricks Hyderabad",
    "quality bricks sand Hyderabad",
    "construction material price Hyderabad",
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

// JSON-LD Structured Data for Local Business
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      "name": "SB Construction Materials Suppliers",
      "description": "Hyderabad's most trusted construction material suppliers. Direct supply of premium Karimnagar red bricks, river sand, M-sand, coarse sand and stone with 100% transparency and honesty.",
      "url": siteUrl,
      "telephone": "+919490057579",
      "email": "sbmcontsct5886@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN",
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 17.3850,
          "longitude": 78.4867,
        },
        "geoRadius": "80000",
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "07:00",
          "closes": "20:00",
        }
      ],
      "sameAs": [`https://wa.me/919490057579`],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Construction Materials",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Karimnagar Red Bricks",
              "description": "Premium quality Karimnagar red bricks for construction. Sourced directly from top quarries.",
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "River Sand",
              "description": "High-grade river sand for plastering and construction.",
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "M-Sand (Manufactured Sand)",
              "description": "Quality manufactured sand suitable for concrete and masonry work.",
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Coarse Sand",
              "description": "Coarse sand for foundation and concrete mixing.",
            }
          },
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "SB Construction Materials Suppliers",
      "publisher": { "@id": `${siteUrl}/#business` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      }
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
