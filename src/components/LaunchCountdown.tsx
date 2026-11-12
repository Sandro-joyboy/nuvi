"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Data prevista para o lançamento da primeira versão: 1 de Janeiro de 2027 (00:00 WAT - Angola)
const TARGET_DATE_MS = new Date("2027-01-01T00:00:00+01:00").getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const diff = Math.max(0, TARGET_DATE_MS - Date.now());

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLaunched: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isLaunched: false,
  };
}

export function LaunchCountdown() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLaunched: false,
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          key="nuvi-launch-countdown"
          className="nuvi-countdown-container"
          data-cursor="component"
          aria-label="Contagem decrescente para o lançamento da Nuvi em 1 de Janeiro"
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {/* Cabeçalho discreto + botão fechar (X) */}
          <div className="nuvi-cd-header">
            <div className="nuvi-cd-tag">
              <span className="nuvi-cd-dot" aria-hidden="true" />
              <span>1ª Versão • 1 de Jan</span>
            </div>

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="nuvi-cd-close"
              data-cursor="button"
              aria-label="Fechar contagem decrescente"
              title="Fechar"
            >
              <X size={13} strokeWidth={2.4} />
            </button>
          </div>

          {/* Layout em grelha igual à referência: Números + ":" em cima, legendas por baixo */}
          <div className="nuvi-cd-grid">
            <span className="nuvi-cd-num">{timeLeft.days}</span>
            <span className="nuvi-cd-sep" aria-hidden="true">
              :
            </span>
            <span className="nuvi-cd-num">{pad(timeLeft.hours)}</span>
            <span className="nuvi-cd-sep" aria-hidden="true">
              :
            </span>
            <span className="nuvi-cd-num">{pad(timeLeft.minutes)}</span>
            <span className="nuvi-cd-sep" aria-hidden="true">
              :
            </span>
            <span className="nuvi-cd-num">{pad(timeLeft.seconds)}</span>

            <span className="nuvi-cd-label">Dias</span>
            <span aria-hidden="true" />
            <span className="nuvi-cd-label">Horas</span>
            <span aria-hidden="true" />
            <span className="nuvi-cd-label">Minutos</span>
            <span aria-hidden="true" />
            <span className="nuvi-cd-label">Segundos</span>
          </div>

          <style>{`
            .nuvi-countdown-container {
              position: fixed;
              bottom: 16px;
              right: 16px;
              z-index: 45;
              padding: 12px 16px 14px;
              border-radius: 22px;
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.25) 0%,
                rgba(255, 255, 255, 0.09) 50%,
                rgba(255, 255, 255, 0.17) 100%
              );
              backdrop-filter: blur(22px) saturate(190%) brightness(1.04);
              -webkit-backdrop-filter: blur(22px) saturate(190%) brightness(1.04);
              border: 1.5px solid rgba(255, 255, 255, 0.36);
              box-shadow:
                inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.68),
                inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.22),
                inset 0 0 12px 0 rgba(255, 255, 255, 0.1),
                0 14px 36px rgba(0, 60, 140, 0.2);
              color: #FFFFFF;
              user-select: none;
              box-sizing: border-box;
            }

            .nuvi-cd-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              margin-bottom: 10px;
            }

            .nuvi-cd-tag {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.01em;
              color: rgba(255, 255, 255, 0.92);
              white-space: nowrap;
            }

            .nuvi-cd-dot {
              width: 6px;
              height: 6px;
              border-radius: 9999px;
              background-color: #FFFFFF;
              box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
              animation: nuviPulseDot 2.2s ease-in-out infinite;
            }

            @keyframes nuviPulseDot {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.55;
                transform: scale(0.85);
              }
            }

            .nuvi-cd-close {
              width: 24px;
              height: 24px;
              border-radius: 9999px;
              background: rgba(255, 255, 255, 0.18);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: #FFFFFF;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              padding: 0;
              outline: none;
              flex-shrink: 0;
              transition: background-color 0.2s ease, transform 0.2s ease;
            }

            .nuvi-cd-close:hover {
              background: rgba(255, 255, 255, 0.34);
              transform: scale(1.08);
            }

            .nuvi-cd-close:active {
              transform: scale(0.92);
            }

            .nuvi-cd-grid {
              display: grid;
              grid-template-columns: minmax(36px, auto) auto minmax(36px, auto) auto minmax(36px, auto) auto minmax(36px, auto);
              grid-template-rows: auto auto;
              column-gap: 6px;
              row-gap: 3px;
              align-items: center;
              justify-items: center;
            }

            .nuvi-cd-num {
              font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 25px;
              font-weight: 600;
              line-height: 1.05;
              letter-spacing: -0.025em;
              color: #FFFFFF;
              font-variant-numeric: tabular-nums;
              text-shadow: 0 2px 10px rgba(0, 60, 140, 0.12);
            }

            .nuvi-cd-sep {
              font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 20px;
              font-weight: 500;
              line-height: 1;
              color: rgba(255, 255, 255, 0.7);
              padding-bottom: 2px;
            }

            .nuvi-cd-label {
              font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 10.5px;
              font-weight: 500;
              line-height: 1.2;
              letter-spacing: -0.005em;
              color: rgba(255, 255, 255, 0.84);
            }

            @media (min-width: 640px) {
              .nuvi-countdown-container {
                bottom: 24px;
                right: 24px;
                padding: 14px 20px 16px;
                border-radius: 24px;
              }
              .nuvi-cd-grid {
                grid-template-columns: minmax(42px, auto) auto minmax(42px, auto) auto minmax(42px, auto) auto minmax(42px, auto);
                column-gap: 8px;
                row-gap: 4px;
              }
              .nuvi-cd-num {
                font-size: 30px;
              }
              .nuvi-cd-sep {
                font-size: 23px;
              }
              .nuvi-cd-label {
                font-size: 11.5px;
              }
            }

            @media (min-width: 1024px) {
              .nuvi-countdown-container {
                bottom: 68px;
                right: 32px;
              }
            }
          `}</style>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
