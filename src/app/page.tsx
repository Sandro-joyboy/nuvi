"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, QrCode } from "lucide-react";
import { track } from "@vercel/analytics";
import { joinWaitlistAction } from "@/app/actions/waitlist";
import { QRCodeSVG } from "@/components/QRCodeSVG";
import { LaunchCountdown } from "@/components/LaunchCountdown";

export default function HeroPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const [showInlineQR, setShowInlineQR] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [showInputState, setShowInputState] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFormError("Por favor, introduza o seu e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setFormError("Por favor, introduza um e-mail com formato válido.");
      return;
    }

    setIsLoading(true);

    try {
      // Obter source de parâmetros UTM ou referrer
      const urlParams = new URLSearchParams(window.location.search);
      const source =
        urlParams.get("utm_source") ||
        urlParams.get("ref") ||
        (document.referrer
          ? new URL(document.referrer, window.location.origin).hostname
          : "direct");

      const formData = new FormData(e.currentTarget);
      formData.set("email", trimmed);
      formData.set("source", source);

      const res = await joinWaitlistAction(formData);

      if (res.success && typeof res.position !== "undefined") {
        track("waitlist_signup", {
          alreadyRegistered: Boolean(res.alreadyRegistered),
          source,
        });
        setPosition(res.position);
        setAlreadyRegistered(Boolean(res.alreadyRegistered));
        setIsSubmitted(true);
      } else {
        setFormError(res.error || "Ocorreu um erro ao registar o e-mail. Tente novamente.");
      }
    } catch {
      setFormError("Erro de ligação. Verifique a sua ligação à internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const inviteCode = position ? `nuvi-${position}` : "vip";
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}?ref=${inviteCode}`
      : "https://nuvi.app";

  const handleCopyInvite = () => {
    track("invite_link_copied");
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(inviteUrl);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2400);
    }
  };

  const shareWhatsApp = () => {
    track("share_whatsapp");
    const text = `Olha o que está a chegar a Angola: a Nuvi, o lugar onde marcas e creators se encontram para fechar parcerias de verdade. Garante já o teu acesso prioritário antes de abrir ao público: ${inviteUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    track("native_share");
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Nuvi',
        text: 'Junta-te à Nuvi, o lugar onde marcas encontram creators em Angola!',
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <main className="hero-main" onDragStart={(e) => e.preventDefault()}>
      {/* 1. Fundo Estático + Camada Azul */}
      <div className="hero-bg-wrapper">
        <Image
          src="/hero-bg.png"
          alt="Nuvi Background"
          fill
          priority
          draggable={false}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* 2. Topo: Logótipo */}
      <header className="hero-header">
        <img
          src="/logo.svg"
          alt="nuvi"
          draggable={false}
          className="hero-top-logo"
          data-cursor="component"
        />
      </header>

      {/* 3. Centro: Conteúdo e Transição Elástica */}
      <section className="hero-center">
        <div className="hero-badge-wrapper" data-cursor="component">
          <img
            src="/Frame.svg"
            alt="3,5000 + Brevemente, criadores angolanos irão ganhar com vídeos para marcas."
            draggable={false}
            className="hero-badge-img"
          />
        </div>

        <h1 className="hero-title">
          O lugar onde marcas <br />
          encontram creators.
        </h1>

        <p className="hero-subtitle">
          Ganha com o que já sabes fazer: gravar, editar e contar histórias.
        </p>

        <div className="interaction-container">
          <AnimatePresence mode="wait">
            {!showInputState ? (
              <motion.button
                key="start-btn"
                type="button"
                className="btn-comecar"
                onClick={() => {
                  track("click_start_now");
                  setShowInputState(true);
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                  scaleY: 1,
                  transition: { type: "spring", stiffness: 320, damping: 22 },
                }}
                exit={{
                  scaleX: [1, 1.45, 1.75],
                  scaleY: [1, 0.82, 0.95],
                  opacity: [1, 0.9, 0],
                  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Começar agora
              </motion.button>
            ) : !isSubmitted ? (
              <motion.div
                key="input-component"
                className="waitlist-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.form
                  onSubmit={handleSubmit}
                  className="liquid-input-pill"
                  initial={{ scaleX: 0.48, scaleY: 0.86, opacity: 0.6 }}
                  animate={{
                    scaleX: [0.48, 1.06, 0.98, 1],
                    scaleY: [0.86, 0.94, 1.02, 1],
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.52,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="bot_field"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Insira seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    disabled={isLoading}
                    className="liquid-email-input"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="liquid-submit-btn"
                    style={{ opacity: isLoading ? 0.75 : 1 }}
                  >
                    {isLoading ? (
                      <span>A registar...</span>
                    ) : (
                      <>
                        <span>Obtenha acesso antecipado</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="chevron-icon"
                        >
                          <path
                            d="M6 3.5L10.5 8L6 12.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>

                {formError ? (
                  <motion.p
                    className="waitlist-error-text"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formError}
                  </motion.p>
                ) : (
                  <motion.p
                    className="waitlist-sf-text"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    Seja um dos primeiros a conhecer Nuvi.
                  </motion.p>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Modal de Sucesso (Fecha ao clicar fora) */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSubmitted(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão Fechar (X) da Confirmação */}
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsSubmitted(false);
                  setIsShareExpanded(false);
                }}
                aria-label="Fechar confirmação"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="modal-icon-wrapper">
                <img src="/Tick.svg" alt="Sucesso" draggable={false} className="modal-tick-img" />
              </div>

              <h2 className="modal-title">
                {alreadyRegistered ? "Já estás na lista!" : "Agora fazes parte!"}
              </h2>
              
              <p className="modal-desc">
                {alreadyRegistered
                  ? "O teu e-mail já se encontra registado com acesso prioritário. Avisamos-te assim que chegarem novidades!"
                  : "Estamos a preparar o lugar onde marcas e criadores angolanos se encontram. Avisamos-te assim que chegar."}
              </p>

              <div className="modal-badge-number">
                {alreadyRegistered ? (
                  <>
                    A tua posição confirmada: <strong>nº {position}</strong> da lista Nuvi.
                  </>
                ) : (
                  <>
                    És o inscrito <strong>nº {position}</strong> da lista Nuvi.
                  </>
                )}
              </div>

              <div className="modal-btn-container">
                <AnimatePresence mode="wait">
                  {!isShareExpanded ? (
                    <motion.button
                      key="invite-btn"
                      type="button"
                      className="btn-comecar modal-action-btn"
                      onClick={() => setIsShareExpanded(true)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      Convidar creators e marcas
                    </motion.button>
                  ) : (
                    <motion.div
                      key="share-expanded"
                      className="nuvi-share-expanded"
                      initial={{ opacity: 0, y: 14, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 14, scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    >
                      {/* Input de Copiar no Estilo do Design Nuvi */}
                      <div className="nuvi-copy-pill">
                        <span className="nuvi-copy-url">{inviteUrl}</span>
                        <button
                          type="button"
                          className="nuvi-copy-btn"
                          onClick={handleCopyInvite}
                          title="Copiar link"
                          aria-label="Copiar link de convite"
                        >
                          {copiedInvite ? (
                            <>
                              <Check size={16} strokeWidth={2.5} />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={15} strokeWidth={2.2} />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Apenas WhatsApp e QR Code */}
                      <div className="nuvi-actions-row">
                        {/* WhatsApp */}
                        <button
                          type="button"
                          className="nuvi-action-pill btn-wa"
                          onClick={shareWhatsApp}
                          title="Partilhar no WhatsApp"
                          aria-label="Partilhar no WhatsApp"
                        >
                          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.201.301-.777.98-1.028 1.282-.25.301-.502.351-.803.201-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.785-1.676-2.086-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.15-.677-1.631-.928-2.233-.245-.586-.494-.507-.677-.516-.176-.009-.377-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.51 0 1.48 1.079 2.91 1.23 3.111.15.201 2.122 3.24 5.14 4.544.718.31 1.278.496 1.715.635.721.229 1.377.197 1.895.12.578-.087 1.78-.727 2.031-1.43.25-.703.25-1.306.175-1.431-.075-.125-.276-.2-.577-.35z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 21.602l4.57-1.353A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.62 0-3.132-.47-4.412-1.284l-.316-.198-2.92.864.868-2.853-.213-.339A8.17 8.17 0 013.8 12c0-4.529 3.671-8.2 8.2-8.2 4.529 0 8.2 3.671 8.2 8.2 0 4.529-3.671 8.2-8.2 8.2z"
                              fill="currentColor"
                            />
                          </svg>
                          <span>WhatsApp</span>
                        </button>

                        {/* QR Code */}
                        <button
                          type="button"
                          className={`nuvi-action-pill btn-qr ${showInlineQR ? "active-qr" : ""}`}
                          onClick={() => {
                            setShowInlineQR((prev) => {
                              if (!prev) track("view_qr_code");
                              return !prev;
                            });
                          }}
                          title="Mostrar ou ocultar QR Code"
                          aria-label="Mostrar ou ocultar QR Code"
                        >
                          <QrCode size={18} strokeWidth={2.2} />
                          <span>QR Code</span>
                        </button>
                      </div>

                      {/* Expansão do QR Code (sem fundo e sem texto) */}
                      <AnimatePresence>
                        {showInlineQR && (
                          <motion.div
                            className="nuvi-qr-expand"
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.24 }}
                          >
                            <QRCodeSVG
                              value={inviteUrl}
                              size={175}
                              fgColor="#111111"
                              bgColor="transparent"
                              className="nuvi-qr-svg"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Arco Orbital (Linha criada com código de ponta a ponta) */}
      <div className="orbit-arc-box">
        <svg
          viewBox="0 0 1000 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="orbit-line"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="nuviOrbitLineGrad"
              x1="500"
              y1="24"
              x2="500"
              y2="260"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#8FD0FF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#26A0FF" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M -150 389 Q 500 -341 1150 389"
            stroke="url(#nuviOrbitLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="orbit-node node-yt" data-cursor="component">
          <img src="/YT.png" alt="YouTube" draggable={false} className="float-icon float-1 icon-social" />
        </div>
        <div className="orbit-node node-calendary" data-cursor="component">
          <img src="/CALENDARY.png" alt="Calendário" draggable={false} className="float-icon float-2 icon-asset" />
        </div>
        <div className="orbit-node node-ig" data-cursor="component">
          <img src="/IG.png" alt="Instagram" draggable={false} className="float-icon float-3 icon-ig" />
        </div>
        <div className="orbit-node node-money" data-cursor="component">
          <img src="/MONEY.png" alt="Dinheiro" draggable={false} className="float-icon float-4 icon-asset" />
        </div>
        <div className="orbit-node node-tk" data-cursor="component">
          <img src="/TK.png" alt="TikTok" draggable={false} className="float-icon float-5 icon-social" />
        </div>
      </div>

      {/* 6. Rodapé */}
      <footer className="hero-footer">
        <div className="hero-footer-inner">
          <div className="footer-left">
            <a
              href="https://www.instagram.com/sandro_joyboy/"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-pill"
              data-cursor="button"
              onClick={() => track("click_by_sandro_instagram")}
              aria-label="Instagram de Sandro (@sandro_joyboy)"
            >
              <span className="liquid-glass-text">by Sandro :)</span>
            </a>
          </div>

          <div className="footer-center">
            <Link href="/plataform">
              <button type="button" className="footer-link">
                Conhece a plataforma
              </button>
            </Link>
          </div>

          <div className="footer-right">
            <span className="footer-date">Desde 1 de Novembro de 2026.</span>
          </div>
        </div>
      </footer>

      {/* 7. Contagem Decrescente (Lado Inferior Direito) */}
      <LaunchCountdown />

      {/* Estilos CSS */}
      <style>{`
        img, svg {
          -webkit-user-drag: none !important;
          user-drag: none !important;
          user-select: none !important;
        }

        .hero-main {
          position: relative;
          height: 100vh;
          height: 100dvh;
          min-height: 100dvh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
          padding: clamp(16px, 3.5vh, 28px) 20px clamp(14px, 2.5vh, 24px);
          box-sizing: border-box;
          user-select: none;
        }

        .hero-bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 145, 255, 0.25);
        }

        .hero-header {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-top-logo {
          height: clamp(20px, 2.8vh, 25px);
          width: auto;
          display: block;
          pointer-events: auto;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-top-logo:hover {
          transform: scale(1.06);
        }

        .hero-center {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 1200px;
          margin: auto 0;
          padding: 0;
          flex-shrink: 0;
        }

        .hero-badge-wrapper {
          margin-bottom: clamp(12px, 2vh, 18px);
          display: flex;
          justify-content: center;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-badge-wrapper:hover {
          transform: translateY(-2px) scale(1.03);
        }

        .hero-badge-img {
          height: clamp(30px, 4.2vh, 38px);
          width: auto;
          max-width: calc(100vw - 32px);
          object-fit: contain;
          display: block;
          pointer-events: none;
        }

        .hero-title {
          font-family: var(--font-gt-mechanik), sans-serif;
          font-size: clamp(34px, 9.2vw, 48px);
          line-height: 1.06;
          font-weight: 700;
          color: #FFFFFF;
          text-align: center;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .hero-subtitle {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: clamp(14px, 3.8vw, 16.5px);
          line-height: 1.42;
          font-weight: 400;
          color: #FFFFFF;
          text-align: center;
          margin-top: clamp(10px, 1.6vh, 16px);
          margin-bottom: clamp(18px, 2.8vh, 26px);
          max-width: 340px;
        }

        .interaction-container {
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
        }

        .btn-comecar {
          height: 80px;
          padding: 0 42px;
          border-radius: 9999px;
          background-color: #4EA7EB;
          border: 2px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            inset 0 0 16px rgba(255, 255, 255, 0.55),
            inset 0 2px 3px rgba(255, 255, 255, 0.65);
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 32px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          outline: none;
          transform-origin: center;
        }

        .waitlist-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .liquid-input-pill {
          height: 80px;
          width: 100%;
          max-width: 590px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid rgba(255, 255, 255, 0.28);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px 10px 32px;
          box-sizing: border-box;
          transform-origin: center;
        }

        .liquid-email-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          padding-right: 16px;
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }

        .liquid-email-input::placeholder {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 400;
        }

        .liquid-submit-btn {
          height: 58px;
          padding: 0 26px;
          border-radius: 9999px;
          background-color: #4EA7EB;
          border: 1.5px solid rgba(255, 255, 255, 0.38);
          box-shadow:
            inset 0 0 12px rgba(255, 255, 255, 0.42),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.5);
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
          flex-shrink: 0;
          outline: none;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .liquid-submit-btn:hover {
          filter: brightness(1.06);
          transform: scale(1.01);
        }

        .liquid-submit-btn:active {
          transform: scale(0.98);
        }

        .chevron-icon {
          display: block;
          flex-shrink: 0;
        }

        .waitlist-sf-text {
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #FFFFFF;
          margin: 14px 0 0 0;
          text-align: center;
          letter-spacing: -0.01em;
        }

        .waitlist-error-text {
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #FFB4B4;
          background: rgba(220, 38, 38, 0.3);
          border: 1px solid rgba(239, 68, 68, 0.4);
          padding: 8px 18px;
          border-radius: 9999px;
          margin: 14px 0 0 0;
          text-align: center;
          letter-spacing: -0.01em;
          backdrop-filter: blur(8px);
        }

        /* --- Estilos do Modal de Sucesso --- */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(10, 20, 35, 0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          position: relative;
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 36px;
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: #666666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #111111;
          transform: scale(1.06);
        }

        .modal-close-btn:active {
          transform: scale(0.95);
        }

        .modal-icon-wrapper {
          margin-bottom: 24px;
        }

        .modal-tick-img {
          width: 88px;
          height: auto;
          display: block;
        }

        .modal-title {
          font-family: var(--font-gt-mechanik), var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 34px;
          font-weight: 700;
          color: #111111;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .modal-desc {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 400;
          color: #555555;
          margin: 0 0 28px 0;
          max-width: 400px;
        }

        .modal-badge-number {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #222222;
          background: rgba(0, 0, 0, 0.05);
          padding: 10px 20px;
          border-radius: 9999px;
          margin-bottom: 28px;
        }

        .modal-badge-number strong {
          color: #0082F6;
        }

        .modal-btn-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .modal-action-btn {
          height: 72px;
          width: 100%;
          max-width: 400px;
          font-size: 18px;
          padding: 0 24px;
          gap: 12px;
        }

        .copy-toast {
          position: absolute;
          bottom: -45px;
          background: #111111;
          color: #FFFFFF;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 9999px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
        }

        /* --- Estilos da Ação de Partilha (Design Nuvi) --- */
        .nuvi-share-expanded {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }

        .nuvi-copy-pill {
          height: 64px;
          width: 100%;
          max-width: 440px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px 6px 22px;
          box-sizing: border-box;
          margin-bottom: 12px;
        }

        .nuvi-copy-url {
          flex: 1;
          min-width: 0;
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14.5px;
          font-weight: 500;
          color: #111111;
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          padding-right: 12px;
        }

        .nuvi-copy-btn {
          height: 50px;
          padding: 0 22px;
          border-radius: 9999px;
          background-color: #4EA7EB;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            inset 0 0 12px rgba(255, 255, 255, 0.45),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.55);
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
          outline: none;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .nuvi-copy-btn:hover {
          filter: brightness(1.06);
          transform: scale(1.02);
        }

        .nuvi-copy-btn:active {
          transform: scale(0.97);
        }

        .nuvi-actions-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: 440px;
        }

        .nuvi-action-pill {
          flex: 1;
          height: 50px;
          border-radius: 9999px;
          font-family: var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14.5px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          border: none;
        }

        .nuvi-action-pill:hover {
          transform: translateY(-1.5px);
          filter: brightness(1.06);
        }

        .nuvi-action-pill:active {
          transform: scale(0.97);
        }

        .nuvi-action-pill.btn-wa {
          background-color: #25D366;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.28);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
        }

        .nuvi-action-pill.btn-qr {
          background-color: rgba(0, 0, 0, 0.05);
          color: #111111;
          border: 1.5px solid rgba(0, 0, 0, 0.08);
        }

        .nuvi-action-pill.btn-qr:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }

        .nuvi-action-pill.btn-qr.active-qr {
          background-color: #0082F6;
          color: #FFFFFF;
          border-color: #0082F6;
          box-shadow: 0 4px 14px rgba(0, 130, 246, 0.35);
        }

        .nuvi-qr-expand {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          margin-top: 18px;
        }

        .nuvi-qr-svg {
          display: block;
        }

        /* Responsividade Mobile */
        @media (max-width: 639px) {
          .hero-main {
            padding: clamp(18px, 3vh, 26px) 16px clamp(14px, 2.2vh, 20px);
          }
          .btn-comecar {
            height: 60px;
            font-size: 22px;
            padding: 0 32px;
          }
          .liquid-input-pill {
            height: 58px;
            width: 100%;
            max-width: 100%;
            padding: 5px 6px 5px 16px;
          }
          .liquid-submit-btn {
            height: 46px;
            padding: 0 13px;
            font-size: 12.5px;
            gap: 4px;
          }
          .liquid-email-input {
            font-size: 13.5px;
            padding-right: 8px;
          }
          .waitlist-sf-text {
            font-size: 14px;
            margin-top: 12px;
          }
          .modal-card {
            padding: 36px 20px;
            border-radius: 28px;
          }
          .modal-title {
            font-size: 28px;
          }
          .modal-action-btn {
            height: 60px;
            font-size: 16px;
          }
          .nuvi-copy-pill {
            height: 56px;
            padding: 4px 6px 4px 16px;
          }
          .nuvi-copy-url {
            font-size: 13px;
          }
          .nuvi-copy-btn {
            height: 44px;
            padding: 0 16px;
            font-size: 13px;
          }
          .nuvi-action-pill {
            height: 44px;
            font-size: 13px;
          }
        }

        /* --- Arco Orbital (Colado às paredes dos dois cantos de ponta a ponta) --- */
        .orbit-arc-box {
          position: relative;
          width: calc(100% + 40px);
          max-width: none;
          margin: clamp(16px, 2.8vh, 28px) -20px clamp(4px, 1vh, 12px);
          align-self: center;
          pointer-events: none;
          user-select: none;
          z-index: 5;
          flex-shrink: 0;
          overflow: visible;
        }

        .orbit-line {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible !important;
          pointer-events: none;
        }

        .orbit-node {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .orbit-node:hover {
          transform: translate(-50%, -50%) scale(1.14) translateY(-4px);
        }

        /* Coordenadas exatas da curva quadrática M 0 240 Q 500 -192 1000 240 (viewBox 1000x240) */
        .node-yt { left: 11%; top: 64.75%; }
        .node-calendary { left: 29%; top: 25.88%; }
        .node-ig { left: 50%; top: 10%; }
        .node-money { left: 71%; top: 25.88%; }
        .node-tk { left: 89%; top: 64.75%; }

        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .float-icon {
          display: block;
          width: auto;
          max-width: none;
          object-fit: contain;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.16));
          will-change: transform;
          pointer-events: none;
        }

        .float-1 { animation: floatGentle 3.6s ease-in-out infinite 0s; }
        .float-2 { animation: floatGentle 4.2s ease-in-out infinite 0.6s; }
        .float-3 { animation: floatGentle 3.8s ease-in-out infinite 0.3s; }
        .float-4 { animation: floatGentle 4.4s ease-in-out infinite 0.9s; }
        .float-5 { animation: floatGentle 3.9s ease-in-out infinite 0.4s; }

        .icon-social { height: clamp(26px, 7.2vw, 34px); }
        .icon-ig { height: clamp(28px, 7.6vw, 36px); }
        .icon-asset { height: clamp(38px, 10.4vw, 50px); }

        @media (max-height: 700px) and (max-width: 639px) {
          .orbit-arc-box {
            margin: 12px 0 4px;
          }
          .icon-social { height: clamp(22px, 6vw, 28px); }
          .icon-ig { height: clamp(24px, 6.4vw, 30px); }
          .icon-asset { height: clamp(32px, 8.8vw, 42px); }
        }

        /* --- Rodapé --- */
        .hero-footer {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          flex-shrink: 0;
        }

        .hero-footer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 1.2vh, 10px);
          width: 100%;
        }

        .footer-left {
          display: inline-flex;
          align-items: center;
        }

        .liquid-glass-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          padding: 0 15px;
          border-radius: 9999px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.26) 0%,
            rgba(255, 255, 255, 0.07) 50%,
            rgba(255, 255, 255, 0.16) 100%
          );
          backdrop-filter: blur(18px) saturate(190%) brightness(1.04);
          -webkit-backdrop-filter: blur(18px) saturate(190%) brightness(1.04);
          box-shadow:
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.7),
            inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.22),
            inset 0 0 10px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.24s ease,
            box-shadow 0.24s ease;
        }

        .liquid-glass-pill:hover {
          transform: translateY(-2px) scale(1.05);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.36) 0%,
            rgba(255, 255, 255, 0.14) 50%,
            rgba(255, 255, 255, 0.24) 100%
          );
          box-shadow:
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.85),
            inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.32),
            inset 0 0 12px 0 rgba(255, 255, 255, 0.16),
            0 6px 18px rgba(0, 0, 0, 0.14);
        }

        .liquid-glass-pill:active {
          transform: translateY(0) scale(0.96);
        }

        .liquid-glass-text {
          position: relative;
          z-index: 1;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 13.5px;
          line-height: 1;
          font-weight: 500;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .footer-link {
          background: transparent;
          border: none;
          padding: 0;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 14.5px;
          line-height: 20px;
          font-weight: 400;
          color: #FFFFFF;
          text-decoration: underline;
          text-underline-offset: 4px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .footer-link:hover {
          opacity: 0.8;
        }

        .footer-date {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.92);
        }

        /* --- Tablet --- */
        @media (min-width: 640px) {
          .hero-main {
            padding: 32px 32px 24px;
          }
          .hero-badge-img {
            height: 36px;
          }
          .hero-title {
            font-size: 60px;
            line-height: 64px;
          }
          .hero-subtitle {
            font-size: 18px;
            line-height: 26px;
            max-width: 520px;
          }
          .orbit-arc-box {
            width: 100vw;
            max-width: 100vw;
          }
          .icon-social { height: 38px; }
          .icon-ig { height: 40px; }
          .icon-asset { height: 56px; }
        }

        /* --- Desktop --- */
        @media (min-width: 1024px) {
          .hero-main {
            padding: 38px 48px 30px;
          }
          .hero-top-logo {
            height: 32px;
          }
          .hero-center {
            padding-bottom: 150px;
          }
          .hero-badge-wrapper {
            margin-bottom: 18px;
          }
          .hero-badge-img {
            height: 40px;
          }
          .hero-title {
            font-size: 96px;
            line-height: 100px;
          }
          .hero-subtitle {
            font-size: 20px;
            line-height: 28px;
            margin-top: 16px;
            margin-bottom: 24px;
            max-width: none;
          }
          .orbit-arc-box {
            position: fixed;
            bottom: -65px;
            left: 50%;
            transform: translateX(-50%);
            width: 100vw;
            max-width: 1280px;
            margin: 0;
            overflow: visible;
          }
          .icon-social { height: 46px; }
          .icon-ig { height: 48px; }
          .icon-asset { height: 74px; }
          .hero-footer-inner {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
          }
          .liquid-glass-pill {
            height: 32px;
            padding: 0 16px;
          }
          .liquid-glass-text {
            font-size: 14px;
          }
          .footer-link,
          .footer-date {
            font-size: 16px;
            line-height: 22px;
          }
          .footer-left {
            justify-self: start;
          }
          .footer-center {
            justify-self: center;
          }
          .footer-right {
            justify-self: end;
          }
        }
      `}</style>
    </main>
  );
}