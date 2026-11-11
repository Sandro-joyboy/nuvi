"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="notfound-main" onDragStart={(e) => e.preventDefault()}>
      {/* 1. Fundo da Hero Section com o Azul da página Conheça a Plataforma */}
      <div className="notfound-bg-wrapper">
        <Image
          src="/hero-bg.png"
          alt="Nuvi Background"
          fill
          priority
          draggable={false}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
        <div className="notfound-bg-overlay" />
      </div>

      {/* 2. Conteúdo Central 404 */}
      <section className="notfound-center">
        <motion.div
          className="notfound-content"
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="notfound-code-row" data-cursor="component">
            <span className="notfound-digit">4</span>
            <div className="notfound-cloud-wrapper">
              <img
                src="/404%20img.png"
                alt="Nuvem chorando"
                draggable={false}
                className="notfound-cloud-img"
              />
            </div>
            <span className="notfound-digit">4</span>
          </div>

          <h1 className="notfound-oops">Oops!</h1>

          <p className="notfound-desc">
            Não foi possível encontrar o recurso solicitado
          </p>

          <Link href="/" className="notfound-home-link" data-cursor="button">
            <motion.span
              className="notfound-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Voltar para a Página Inicial
            </motion.span>
          </Link>
        </motion.div>
      </section>

      <style>{`
        img, svg {
          -webkit-user-drag: none !important;
          user-drag: none !important;
          user-select: none !important;
        }

        .notfound-main {
          position: relative;
          height: 100vh;
          height: 100dvh;
          min-height: 100dvh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          padding: 24px 20px;
          box-sizing: border-box;
          user-select: none;
        }

        .notfound-bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
        }

        .notfound-bg-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 130, 245, 0.55);
        }

        .notfound-center {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 680px;
        }

        .notfound-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .notfound-code-row {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 1.2vw, 12px);
          line-height: 1;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notfound-code-row:hover {
          transform: scale(1.03);
        }

        .notfound-digit {
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(78px, 16vw, 118px);
          font-weight: 500;
          line-height: 1;
          color: #FFFFFF;
          letter-spacing: -0.03em;
        }

        .notfound-cloud-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: cloudFloat 3.8s ease-in-out infinite;
        }

        @keyframes cloudFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .notfound-cloud-img {
          width: clamp(86px, 18vw, 132px);
          height: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 8px 18px rgba(0, 40, 100, 0.16));
        }

        .notfound-oops {
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(54px, 11vw, 84px);
          font-weight: 400;
          line-height: 1.04;
          color: #FFFFFF;
          letter-spacing: -0.025em;
          margin: 2px 0 0 0;
        }

        .notfound-desc {
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(14px, 3.5vw, 16px);
          font-weight: 500;
          line-height: 1.45;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          margin: clamp(14px, 2vh, 20px) 0 clamp(24px, 3.6vh, 32px) 0;
        }

        .notfound-home-link {
          text-decoration: none;
          display: inline-flex;
          outline: none;
        }

        .notfound-btn {
          height: clamp(54px, 7vh, 64px);
          padding: 0 clamp(28px, 5vw, 38px);
          border-radius: 9999px;
          background-color: rgba(78, 167, 235, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255, 255, 255, 0.48);
          box-shadow:
            inset 0 0 16px rgba(255, 255, 255, 0.52),
            inset 0 2px 3px rgba(255, 255, 255, 0.62),
            0 8px 24px rgba(0, 60, 140, 0.15);
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(16px, 4vw, 21px);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          transition: filter 0.2s ease, background-color 0.2s ease;
        }

        .notfound-btn:hover {
          background-color: rgba(78, 167, 235, 0.85);
          filter: brightness(1.04);
        }
      `}</style>
    </main>
  );
}
