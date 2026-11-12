import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const gtMechanik = localFont({
  src: [
    {
      path: "../fonts/GT-Mechanik-Poly-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GT-Mechanik-Poly-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GT-Mechanik-Poly-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gt-mechanik",
  display: "swap",
});

const sfPro = localFont({
  src: [
    {
      path: "../fonts/SFPRODISPLAYREGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SFPRODISPLAYMEDIUM.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/SFPRODISPLAYBOLD.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Nuvi — O lugar onde marcas encontram creators",
    template: "%s | Nuvi",
  },
  description:
    "Ganha com o que já sabes fazer: gravar, editar e contar histórias. A plataforma onde criadores e marcas em Angola colaboram em campanhas UGC.",
  applicationName: "Nuvi",
  keywords: [
    "Nuvi",
    "creators Angola",
    "criadores de conteúdo Angola",
    "UGC Angola",
    "marcas e influenciadores",
    "marketing de influência Angola",
    "monetizar vídeos",
    "parcerias com marcas",
  ],
  authors: [
    { name: "Sandro", url: "https://www.instagram.com/sandro_joyboy/" },
  ],
  creator: "Nuvi",
  publisher: "Nuvi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    alternateLocale: ["pt_PT", "pt_BR"],
    url: "/",
    siteName: "Nuvi",
    title: "Nuvi — O lugar onde marcas encontram creators",
    description:
      "Ganha com o que já sabes fazer: gravar, editar e contar histórias. Garante já o teu lugar na lista de espera.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuvi — O lugar onde marcas encontram creators",
    description:
      "Ganha com o que já sabes fazer: gravar, editar e contar histórias. Garante já o teu lugar na lista de espera.",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${gtMechanik.variable} ${sfPro.variable}`}>
      <body className="antialiased text-white">
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}