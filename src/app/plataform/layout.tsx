import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conheça a Plataforma",
  description:
    "Descubra como a Nuvi liga criadores de conteúdo e marcas em Angola para criar campanhas autênticas e monetizar vídeos.",
  alternates: {
    canonical: "/plataform",
  },
};

export default function PlataformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
