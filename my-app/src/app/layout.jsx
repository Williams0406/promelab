import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const siteUrl = "https://corporacionpromelab.com";
const siteName = "Corporación Promelab";
const title =
  "Corporación Promelab | Herramientas de laboratorio, equipo médico e instrumentos científicos";
const description =
  "Corporación Promelab es una empresa peruana dedicada a la venta de herramientas de laboratorio, equipo médico e instrumentos científicos para laboratorios, instituciones de salud, investigación e industria.";
const logoUrl = `${siteUrl}/logo-promelab.svg`;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Corporación Promelab",
  },
  description,
  keywords: [
    "Corporación Promelab",
    "Promelab",
    "herramientas de laboratorio",
    "equipos de laboratorio",
    "equipo médico",
    "instrumentos científicos",
    "materiales de laboratorio",
    "insumos de laboratorio",
    "laboratorio Perú",
    "equipamiento médico Perú",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: "/logo-promelab.svg",
        width: 1200,
        height: 630,
        alt: "Corporación Promelab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/logo-promelab.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo-promelab.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/logo-promelab.svg" }],
  },
  manifest: "/manifest.webmanifest",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: siteName,
  url: siteUrl,
  logo: logoUrl,
  description,
  sameAs: [
    "https://www.instagram.com/promelabeirl/",
    "https://www.facebook.com/profile.php?id=100065149624575",
  ],
  areaServed: "Peru",
  knowsAbout: [
    "Herramientas de laboratorio",
    "Equipo médico",
    "Instrumentos científicos",
    "Materiales de laboratorio",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#374151] antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
