import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "nuvi — O lugar onde marcas encontram creators",
  description:
    "Ganha com o que já sabes fazer: gravar, editar e contar histórias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${gtMechanik.variable} ${sfPro.variable}`}>
      <body className="antialiased text-white">{children}</body>
    </html>
  );
}