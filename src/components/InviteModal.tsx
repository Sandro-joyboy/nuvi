"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "./QRCodeSVG";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode?: string;
}

export function InviteModal({ isOpen, onClose, inviteCode = "4ZHUZ9W" }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Link de convite da Nuvi
  const origin = typeof window !== "undefined" ? window.location.origin : "https://nuvi.app";
  const inviteUrl = `${origin}/invite/${inviteCode}`;

  const shareText = "Junta-te a mim na Nuvi — o lugar onde marcas encontram creators em Angola! Regista-te e garante o teu acesso prioritário:";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${inviteUrl}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(inviteUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareEmail = () => {
    const subject = encodeURIComponent("Convite exclusivo para a Nuvi");
    const body = encodeURIComponent(
      `Olá,\n\nEstou a convidar-te para a Nuvi — o ecossistema onde marcas e criadores de conteúdo se encontram em Angola.\n\nPodes garantir o teu acesso antecipado através deste link:\n${inviteUrl}\n\nAté breve!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="invite-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="invite-card"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar (X) */}
            <button
              type="button"
              className="invite-close-btn"
              onClick={onClose}
              aria-label="Fechar modal de convite"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Ilustração Flor / Sparkle Nuvi Glowing */}
            <div className="invite-glow-art">
              <svg
                width="120"
                height="100"
                viewBox="0 0 120 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="invite-svg-flower"
              >
                <defs>
                  {/* Gradiente da flor central */}
                  <linearGradient id="nuviFlowerGrad1" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF3399" />
                    <stop offset="45%" stopColor="#FF5544" />
                    <stop offset="100%" stopColor="#FFAA00" />
                  </linearGradient>
                  
                  {/* Gradiente da flor secundária direita */}
                  <linearGradient id="nuviFlowerGrad2" x1="50" y1="0" x2="110" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFA033" />
                    <stop offset="50%" stopColor="#FF3366" />
                    <stop offset="100%" stopColor="#9B4BFF" />
                  </linearGradient>

                  {/* Gradiente da mini flor inferior */}
                  <linearGradient id="nuviFlowerGrad3" x1="60" y1="50" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF4593" />
                    <stop offset="100%" stopColor="#8A38FF" />
                  </linearGradient>

                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Brilho de fundo */}
                <ellipse cx="60" cy="46" rx="38" ry="30" fill="#FF3377" opacity="0.22" filter="blur(16px)" />

                {/* Flor Principal (Esquerda / Centro) */}
                <g filter="url(#softGlow)">
                  {/* Pétala Superior */}
                  <circle cx="50" cy="30" r="14" fill="url(#nuviFlowerGrad1)" />
                  {/* Pétala Direita */}
                  <circle cx="64" cy="44" r="14" fill="url(#nuviFlowerGrad1)" />
                  {/* Pétala Inferior */}
                  <circle cx="50" cy="58" r="14" fill="url(#nuviFlowerGrad1)" />
                  {/* Pétala Esquerda */}
                  <circle cx="36" cy="44" r="14" fill="url(#nuviFlowerGrad1)" />
                  {/* Centro Diamante / Estrela da Flor Principal */}
                  <path
                    d="M50 34C50 41 43 44 43 44C43 44 50 47 50 54C50 47 57 44 57 44C57 44 50 41 50 34Z"
                    fill="#450A20"
                    opacity="0.8"
                  />
                </g>

                {/* Flor Média (Superior Direita) */}
                <g opacity="0.95">
                  <circle cx="82" cy="20" r="10" fill="url(#nuviFlowerGrad2)" />
                  <circle cx="92" cy="30" r="10" fill="url(#nuviFlowerGrad2)" />
                  <circle cx="82" cy="40" r="10" fill="url(#nuviFlowerGrad2)" />
                  <circle cx="72" cy="30" r="10" fill="url(#nuviFlowerGrad2)" />
                  <path
                    d="M82 23C82 28 77 30 77 30C77 30 82 32 82 37C82 32 87 30 87 30C87 30 82 28 82 23Z"
                    fill="#3D061A"
                    opacity="0.75"
                  />
                </g>

                {/* Flor Pequena (Inferior Direita) */}
                <g opacity="0.85">
                  <circle cx="88" cy="54" r="7" fill="url(#nuviFlowerGrad3)" />
                  <circle cx="95" cy="61" r="7" fill="url(#nuviFlowerGrad3)" />
                  <circle cx="88" cy="68" r="7" fill="url(#nuviFlowerGrad3)" />
                  <circle cx="81" cy="61" r="7" fill="url(#nuviFlowerGrad3)" />
                </g>

                {/* Brilhos / Estrelas Cintilantes (Sparkles) */}
                {/* Sparkle 1 Superior */}
                <path
                  d="M57 14C57 17 55 18 55 18C55 18 57 19 57 22C57 19 59 18 59 18C59 18 57 17 57 14Z"
                  fill="#FFD2E5"
                />
                {/* Sparkle 2 Direita */}
                <path
                  d="M102 38C102 40 100 41 100 41C100 41 102 42 102 44C102 42 104 41 104 41C104 41 102 40 102 38Z"
                  fill="#FFCC66"
                />
                {/* Sparkle 3 Esquerda */}
                <path
                  d="M26 48C26 50.5 24 51.5 24 51.5C24 51.5 26 52.5 26 55C26 52.5 28 51.5 28 51.5C28 51.5 26 50.5 26 48Z"
                  fill="#E0B7FF"
                />
              </svg>
            </div>

            {/* Título Principal */}
            <h2 className="invite-title">Ganha até 400 créditos por convite</h2>

            {/* Descrição */}
            <p className="invite-desc">
              Partilha o teu link para ofereceres 10 créditos. Recebe 100 quando subscreverem ao Pro (100+ créditos) ou Business, mais 25 por cada mês que permanecerem.
            </p>

            {/* Caixa do Link com Botão Copiar */}
            <div className="invite-link-box">
              <span className="invite-url-text">{inviteUrl}</span>
              <button
                type="button"
                className="invite-copy-btn"
                onClick={handleCopy}
                title="Copiar link"
                aria-label="Copiar link de convite"
              >
                {copied ? (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4EA7EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Feedback quando copiado */}
            {copied && (
              <motion.div
                className="invite-copy-badge"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Link copiado para a área de transferência!
              </motion.div>
            )}

            {/* Linha de Ícones Sociais (WhatsApp, X, LinkedIn, Email, QR Code) */}
            <div className="invite-social-row">
              {/* WhatsApp */}
              <button
                type="button"
                className="social-circle-btn btn-whatsapp"
                onClick={shareWhatsApp}
                title="Partilhar no WhatsApp"
                aria-label="Partilhar no WhatsApp"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
              </button>

              {/* X (Twitter) */}
              <button
                type="button"
                className="social-circle-btn btn-x"
                onClick={shareTwitter}
                title="Partilhar no X"
                aria-label="Partilhar no X"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                className="social-circle-btn btn-linkedin"
                onClick={shareLinkedIn}
                title="Partilhar no LinkedIn"
                aria-label="Partilhar no LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74V9.93H5.06v8.57h2.8z" />
                </svg>
              </button>

              {/* Email */}
              <button
                type="button"
                className="social-circle-btn btn-email"
                onClick={shareEmail}
                title="Partilhar por E-mail"
                aria-label="Partilhar por E-mail"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </button>

              {/* QR Code */}
              <button
                type="button"
                className={`social-circle-btn btn-qr ${showQR ? "active-qr" : ""}`}
                onClick={() => setShowQR((prev) => !prev)}
                title={showQR ? "Esconder QR Code" : "Mostrar QR Code"}
                aria-label="Gerar e mostrar QR Code"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>

            {/* Painel Expansível de QR Code */}
            <AnimatePresence>
              {showQR && (
                <motion.div
                  className="invite-qr-container"
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="invite-qr-card">
                    <QRCodeSVG
                      value={inviteUrl}
                      size={180}
                      fgColor="#0E131F"
                      bgColor="#FFFFFF"
                      className="invite-qr-code"
                    />
                    <p className="invite-qr-hint">
                      Aponta a câmara do telemóvel para abrir diretamente
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rodapé / Nota Final */}
            <p className="invite-footer-note">
              Se escolherem um plano anual, recebes todos os 400 créditos de uma só vez.
            </p>

            <button
              type="button"
              className="invite-terms-link"
              onClick={() => setShowTerms((v) => !v)}
            >
              Termos e condições
            </button>

            {showTerms && (
              <motion.div
                className="invite-terms-popup"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p>
                  Os créditos acumulados através de convites são intransferíveis e aplicam-se a subscrições ativas na plataforma Nuvi. O acesso antecipado prioritário é atribuído de forma sequencial após a confirmação do registo dos teus convidados.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
