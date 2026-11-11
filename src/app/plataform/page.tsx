"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PlataformPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const topics = [
    { id: "intro", title: "Introdução" },
    { id: "sec-i", title: "I. O que é a Nuvi" },
    { id: "sec-ii", title: "II. Uma nova forma de criar influência" },
    { id: "sec-iii", title: "III. Como funciona" },
    { id: "sec-iv", title: "IV. A visão" },
    { id: "sec-v", title: "V. Por que estou a construir isto" },
  ];

  // Observer para detetar qual secção está visível no scroll e atualizar o traço lateral
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = topics.findIndex((t) => t.id === entry.target.id);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observerOptions = {
      root: document.querySelector(".platform-container"),
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    topics.forEach((topic) => {
      const el = document.getElementById(topic.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 20);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="platform-main" onDragStart={(e) => e.preventDefault()}>
      {/* 1. Imagem de Fundo Estática com camada azul */}
      <div className="platform-bg-wrapper">
        <Image
          src="/hero-bg.png"
          alt="Nuvi Background"
          fill
          priority
          draggable={false}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
        <div className="platform-bg-overlay" />
      </div>

      {/* 2. Topo: Header */}
      <header className="platform-header">
        <Link href="/">
          <img
            src="/logo.svg"
            alt="nuvi"
            draggable={false}
            className="platform-top-logo"
          />
        </Link>
      </header>

      {/* 3. Indicador Lateral Estilo Timeline com Estado Ativo Dinâmico */}
      <nav className="chapter-nav-sidebar">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className="chapter-nav-item"
            data-cursor="button"
            onClick={() => scrollToSection(topic.id)}
          >
            <div className={`chapter-dash ${activeSection === index ? "active" : ""}`} />
            <div className="chapter-tooltip">{topic.title}</div>
          </div>
        ))}
      </nav>

      {/* 4. Conteúdo Principal com Scroll */}
      <section className="platform-container" onScroll={handleScroll}>
        <div className="platform-content-inner">
          
          {/* Título e Data no Topo */}
          <div id="intro" className="platform-title-area">
            <h1 className="main-title">
              Antes de nos encontrarmos,<br />
              algumas palavras.
            </h1>
            <span className="date-label">Novembro de 2026</span>
          </div>

          {/* Parágrafo Inicial com o T grande */}
          <p className="intro-paragraph">
            <span className="drop-cap">T</span>udo começou com um amigo que queria promover o seu negócio. Decidiu investir numa divulgação com um influencer conhecido, pagou caro, mas os resultados ficaram muito aquém das expectativas.
          </p>
          
          <p className="body-text">
            Aquilo fez-me questionar: será que promover um negócio precisa de ser tão caro? E será que ter milhões de seguidores significa necessariamente criar mais valor?
          </p>

          <p className="body-text">
            Percebi que existem pequenos negócios à procura de visibilidade e creators talentosos à procura de oportunidades. Mas nem sempre conseguem encontrar-se.
          </p>

          <p className="body-text last-intro">
            Foi assim que nasceu a Nuvi.
          </p>

          {/* Secção I */}
          <div id="sec-i" className="section-block">
            <h2 className="roman-title">I. O que é a Nuvi</h2>
            <p className="body-text">
              A Nuvi é uma plataforma que conecta marcas e creators, facilitando a descoberta de talentos, a criação de conteúdo UGC e as campanhas de influência. Quero tornar estas colaborações mais acessíveis, simples e estratégicas, independentemente da dimensão do negócio ou da audiência do creator.
            </p>
          </div>

          {/* Secção II */}
          <div id="sec-ii" className="section-block">
            <h2 className="roman-title">II. Uma nova forma de criar influência</h2>
            <p className="body-text">
              Acredito que a influência vai muito além do número de seguidores. Está na autenticidade, na criatividade e na capacidade de criar ligações reais com as pessoas. Quero ajudar a dar visibilidade a novos talentos e criar mais oportunidades para negócios que procuram comunicar de forma diferente.
            </p>
          </div>

          {/* Secção III */}
          <div id="sec-iii" className="section-block">
            <h2 className="roman-title">III. Como funciona</h2>
            <p className="body-text">
              <strong>Para as marcas:</strong> descobrir creators, criar campanhas e encontrar talento alinhado com os seus objetivos e orçamento.
            </p>
            <p className="body-text">
              <strong>Para os creators:</strong> apresentar o seu trabalho, encontrar oportunidades e colaborar com marcas. Um espaço onde ambos podem crescer através de parcerias mais transparentes.
            </p>
          </div>

          {/* Secção IV */}
          <div id="sec-iv" className="section-block">
            <h2 className="roman-title">IV. A visão</h2>
            <p className="body-text">
              Estou a começar em Angola, mas quero construir algo que vá além das fronteiras. Imagino um mercado onde pequenos negócios tenham acesso a talento, creators emergentes encontrem oportunidades e boas ideias consigam chegar às pessoas certas.
            </p>
          </div>

          {/* Secção V */}
          <div id="sec-v" className="section-block">
            <h2 className="roman-title">V. Por que estou a construir isto</h2>
            <p className="body-text">
              A Nuvi nasceu de uma experiência, mas representa uma convicção: não precisamos de ser famosos para criar influência. Estou a construir a Nuvi para aproximar dois mundos que têm muito a ganhar quando se encontram. Porque acredito que existe talento suficiente. O que falta, muitas vezes, é a conexão certa.
            </p>
          </div>

          {/* Assinatura e Link Final com Underline */}
          <div className="signature-area">
            <p className="signature-subtitle">Com carinho,</p>
            <p className="signature-author">
              <a
                href="https://www.instagram.com/sandro_joyboy/"
                target="_blank"
                rel="noopener noreferrer"
                className="signature-author-link"
                data-cursor="button"
              >
                Sandro :)
              </a>
            </p>
            
            <div className="waitlist-link-wrapper">
              <Link href="/" className="waitlist-link">
                Entrar na lista de Espera &gt;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Estilos CSS */}
      <style>{`
        img, svg {
          -webkit-user-drag: none !important;
          user-drag: none !important;
          user-select: none !important;
        }

        .platform-main {
          position: relative;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          box-sizing: border-box;
          user-select: none;
          padding: clamp(16px, 3.5vh, 28px) 20px clamp(14px, 2.5vh, 24px);
        }

        .platform-bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
        }

        .platform-bg-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 130, 245, 0.55);
        }

        .platform-header {
          position: relative;
          z-index: 50;
          width: 100%;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .platform-top-logo {
          height: 18px;
          width: auto;
          display: block;
          cursor: pointer;
        }

        /* --- Barra Lateral de Tópicos (Com estado ativo destacado) --- */
        .chapter-nav-sidebar {
          position: fixed;
          right: 36px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          display: flex;
          flex-direction: column;
          gap: 14px;
          pointer-events: auto;
        }

        .chapter-nav-item {
          position: relative;
          cursor: pointer;
          padding: 4px 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .chapter-dash {
          width: 22px;
          height: 2px;
          background-color: rgba(255, 255, 255, 0.35);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Estado ativo (ênfase quando a secção está visível) ou no hover */
        .chapter-dash.active,
        .chapter-nav-item:hover .chapter-dash {
          width: 36px;
          background-color: #FFFFFF;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.75);
        }

        .chapter-tooltip {
          position: absolute;
          right: 32px;
          background: rgba(15, 25, 45, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #FFFFFF;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.15);
          opacity: 0;
          transform: translateX(6px);
          transition: all 0.2s ease;
          pointer-events: none;
        }

        .chapter-nav-item:hover .chapter-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        .platform-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 820px;
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px;
          box-sizing: border-box;
          scroll-behavior: smooth;

          mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
          
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .platform-container::-webkit-scrollbar {
          display: none;
        }

        .platform-content-inner {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .platform-title-area {
          text-align: center;
          margin-bottom: 42px;
        }

        .main-title {
          font-family: var(--font-gt-mechanik), sans-serif;
          font-size: 40px;
          line-height: 1.15;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 12px 0;
          letter-spacing: -0.01em;
        }

        .date-label {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.75);
          letter-spacing: 0.02em;
        }

        .body-text {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 20px;
          line-height: 1.6;
          font-weight: 400;
          color: #FFFFFF;
          margin: 0 0 24px 0;
        }

        .intro-paragraph {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 20px;
          line-height: 1.6;
          font-weight: 400;
          color: #FFFFFF;
          margin: 0 0 24px 0;
        }

        .drop-cap {
          font-size: 40px;
          font-weight: 700;
          line-height: 1;
          float: left;
          margin-right: 6px;
          margin-top: 4px;
        }

        .last-intro {
          margin-bottom: 48px;
        }

        .section-block {
          margin-bottom: 44px;
        }

        .roman-title {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 40px;
          line-height: 1.2;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 18px 0;
          letter-spacing: -0.02em;
        }

        .signature-area {
          margin-top: 20px;
          margin-bottom: 40px;
        }

        .signature-subtitle {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 20px;
          font-style: italic;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        .signature-author {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 36px 0;
        }

        .signature-author-link {
          color: inherit;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
        }

        .signature-author-link:hover {
          transform: translateY(-1.5px) scale(1.03);
          opacity: 0.9;
        }

        .waitlist-link-wrapper {
          text-align: left;
        }

        .waitlist-link {
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #FFFFFF;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: opacity 0.2s ease;
        }

        .waitlist-link:hover {
          opacity: 0.8;
        }

        @media (min-width: 1024px) {
          .platform-top-logo {
            height: 32px;
          }
        }

        @media (max-width: 900px) {
          .chapter-nav-sidebar {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .main-title {
            font-size: 32px;
          }
          .roman-title {
            font-size: 32px;
          }
          .body-text, .intro-paragraph {
            font-size: 18px;
          }
          .drop-cap {
            font-size: 36px;
          }
          .platform-container {
            padding: 16px 12px;
          }
        }
      `}</style>
    </main>
  );
}