"use client";

import { useEffect, useRef, useState } from "react";

interface VenomButtonEffectProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
}

interface StrandSpec {
  arcOffset: number;
  reachFactor: number;
  rootHalfWidth: number;
  midHalfWidth: number;
  tipHalfWidth: number;
  bendBias: number;
  swaySpeed: number;
  swayPhase: number;
  swayAmp: number;
  staggerDelay: number;
  opacity: number;
}

const ENTER_RADIUS = 190;
const SNAP_RADIUS = 232;

const STRANDS: StrandSpec[] = [
  // Núcleo central (cabos principais mais fortes que disparam primeiro)
  {
    arcOffset: 0,
    reachFactor: 1.0,
    rootHalfWidth: 11,
    midHalfWidth: 1.55,
    tipHalfWidth: 2.8,
    bendBias: 0.04,
    swaySpeed: 2.6,
    swayPhase: 0.2,
    swayAmp: 3.5,
    staggerDelay: 0.0,
    opacity: 0.94,
  },
  {
    arcOffset: -11,
    reachFactor: 1.0,
    rootHalfWidth: 9.5,
    midHalfWidth: 1.15,
    tipHalfWidth: 2.3,
    bendBias: -0.11,
    swaySpeed: 3.1,
    swayPhase: 1.4,
    swayAmp: 4.5,
    staggerDelay: 0.04,
    opacity: 0.9,
  },
  {
    arcOffset: 12,
    reachFactor: 1.0,
    rootHalfWidth: 9.0,
    midHalfWidth: 1.2,
    tipHalfWidth: 2.2,
    bendBias: 0.12,
    swaySpeed: 2.9,
    swayPhase: 2.7,
    swayAmp: 4.2,
    staggerDelay: 0.05,
    opacity: 0.9,
  },
  // Fios secundários médios e finos em redor
  {
    arcOffset: -23,
    reachFactor: 1.0,
    rootHalfWidth: 7.5,
    midHalfWidth: 0.72,
    tipHalfWidth: 1.65,
    bendBias: -0.18,
    swaySpeed: 3.5,
    swayPhase: 0.9,
    swayAmp: 5.5,
    staggerDelay: 0.1,
    opacity: 0.84,
  },
  {
    arcOffset: 24,
    reachFactor: 1.0,
    rootHalfWidth: 7.5,
    midHalfWidth: 0.78,
    tipHalfWidth: 1.7,
    bendBias: 0.19,
    swaySpeed: 3.3,
    swayPhase: 3.8,
    swayAmp: 5.2,
    staggerDelay: 0.12,
    opacity: 0.84,
  },
  {
    arcOffset: -36,
    reachFactor: 1.0,
    rootHalfWidth: 6.2,
    midHalfWidth: 0.56,
    tipHalfWidth: 1.25,
    bendBias: -0.22,
    swaySpeed: 3.9,
    swayPhase: 2.1,
    swayAmp: 6.2,
    staggerDelay: 0.14,
    opacity: 0.78,
  },
  {
    arcOffset: 38,
    reachFactor: 1.0,
    rootHalfWidth: 5.8,
    midHalfWidth: 0.52,
    tipHalfWidth: 1.15,
    bendBias: 0.23,
    swaySpeed: 4.1,
    swayPhase: 4.6,
    swayAmp: 6.0,
    staggerDelay: 0.16,
    opacity: 0.76,
  },
  {
    arcOffset: -58,
    reachFactor: 1.0,
    rootHalfWidth: 5.0,
    midHalfWidth: 0.42,
    tipHalfWidth: 0.95,
    bendBias: -0.28,
    swaySpeed: 3.7,
    swayPhase: 5.3,
    swayAmp: 7.0,
    staggerDelay: 0.2,
    opacity: 0.68,
  },
  {
    arcOffset: 62,
    reachFactor: 1.0,
    rootHalfWidth: 4.8,
    midHalfWidth: 0.4,
    tipHalfWidth: 0.9,
    bendBias: 0.29,
    swaySpeed: 3.8,
    swayPhase: 1.1,
    swayAmp: 6.8,
    staggerDelay: 0.22,
    opacity: 0.66,
  },
  // Tentáculos curtos laterais / intermédios ("raízes" tentando agarrar)
  {
    arcOffset: -17,
    reachFactor: 0.48,
    rootHalfWidth: 6.0,
    midHalfWidth: 0.65,
    tipHalfWidth: 0.0,
    bendBias: -0.14,
    swaySpeed: 4.4,
    swayPhase: 1.7,
    swayAmp: 4.8,
    staggerDelay: 0.08,
    opacity: 0.8,
  },
  {
    arcOffset: 18,
    reachFactor: 0.42,
    rootHalfWidth: 5.8,
    midHalfWidth: 0.6,
    tipHalfWidth: 0.0,
    bendBias: 0.15,
    swaySpeed: 4.2,
    swayPhase: 5.1,
    swayAmp: 4.5,
    staggerDelay: 0.09,
    opacity: 0.78,
  },
  {
    arcOffset: -47,
    reachFactor: 0.36,
    rootHalfWidth: 5.2,
    midHalfWidth: 0.45,
    tipHalfWidth: 0.0,
    bendBias: -0.22,
    swaySpeed: 4.8,
    swayPhase: 3.2,
    swayAmp: 5.0,
    staggerDelay: 0.16,
    opacity: 0.68,
  },
  {
    arcOffset: 49,
    reachFactor: 0.32,
    rootHalfWidth: 5.0,
    midHalfWidth: 0.42,
    tipHalfWidth: 0.0,
    bendBias: 0.22,
    swaySpeed: 4.6,
    swayPhase: 0.5,
    swayAmp: 4.6,
    staggerDelay: 0.18,
    opacity: 0.65,
  },
  {
    arcOffset: -72,
    reachFactor: 0.24,
    rootHalfWidth: 4.2,
    midHalfWidth: 0.35,
    tipHalfWidth: 0.0,
    bendBias: -0.26,
    swaySpeed: 5.0,
    swayPhase: 2.6,
    swayAmp: 4.2,
    staggerDelay: 0.22,
    opacity: 0.56,
  },
  {
    arcOffset: 74,
    reachFactor: 0.22,
    rootHalfWidth: 4.0,
    midHalfWidth: 0.32,
    tipHalfWidth: 0.0,
    bendBias: 0.26,
    swaySpeed: 4.9,
    swayPhase: 4.1,
    swayAmp: 4.0,
    staggerDelay: 0.24,
    opacity: 0.54,
  },
];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getCapsuleClosestPoint(rect: DOMRect, mx: number, my: number) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const R = rect.height / 2;
  const halfSpine = Math.max(0, rect.width / 2 - R);

  const sx = clamp(mx, cx - halfSpine, cx + halfSpine);
  const sy = cy;

  let vx = mx - sx;
  let vy = my - sy;
  let distSpine = Math.hypot(vx, vy);

  if (distSpine < 0.0001) {
    vx = 0;
    vy = -1;
    distSpine = 0.0001;
  }

  const nx = vx / distSpine;
  const ny = vy / distSpine;

  const edgeX = sx + nx * R;
  const edgeY = sy + ny * R;
  const edgeDist = distSpine - R;

  // Comprimento de arco s0 no sentido horário a partir do topo esquerdo da reta superior
  const L1 = 2 * halfSpine;
  const L2 = Math.PI * R;
  const L3 = L1;
  const L4 = L2;
  const totalPerimeter = L1 + L2 + L3 + L4;

  let s0 = 0;
  if (sx > cx - halfSpine + 0.01 && sx < cx + halfSpine - 0.01) {
    if (ny <= 0) {
      s0 = sx - (cx - halfSpine);
    } else {
      s0 = L1 + L2 + (cx + halfSpine - sx);
    }
  } else if (mx >= cx + halfSpine) {
    const ang = Math.atan2(ny, nx); // [-PI/2, PI/2]
    s0 = L1 + (ang + Math.PI / 2) * R;
  } else {
    let ang = Math.atan2(ny, nx); // [PI/2, PI] ou [-PI, -PI/2]
    if (ang < 0) ang += Math.PI * 2; // [PI/2, 3*PI/2]
    s0 = L1 + L2 + L3 + (ang - Math.PI / 2) * R;
  }

  return { edgeX, edgeY, edgeDist, nx, ny, s0, totalPerimeter, R, halfSpine, cx, cy };
}

function getCapsulePointAtArc(
  cx: number,
  cy: number,
  R: number,
  halfSpine: number,
  totalPerimeter: number,
  arcS: number
) {
  const s = ((arcS % totalPerimeter) + totalPerimeter) % totalPerimeter;
  const L1 = 2 * halfSpine;
  const L2 = Math.PI * R;
  const L3 = L1;

  if (s <= L1) {
    return { x: cx - halfSpine + s, y: cy - R, nx: 0, ny: -1 };
  }
  if (s <= L1 + L2) {
    const ang = -Math.PI / 2 + (s - L1) / R;
    const nx = Math.cos(ang);
    const ny = Math.sin(ang);
    return { x: cx + halfSpine + nx * R, y: cy + ny * R, nx, ny };
  }
  if (s <= L1 + L2 + L3) {
    return { x: cx + halfSpine - (s - L1 - L2), y: cy + R, nx: 0, ny: 1 };
  }
  const ang = Math.PI / 2 + (s - L1 - L2 - L3) / R;
  const nx = Math.cos(ang);
  const ny = Math.sin(ang);
  return { x: cx - halfSpine + nx * R, y: cy + ny * R, nx, ny };
}

function quadPoint(
  p0x: number,
  p0y: number,
  cx: number,
  cy: number,
  p1x: number,
  p1y: number,
  t: number
) {
  const u = 1 - t;
  return {
    x: u * u * p0x + 2 * u * t * cx + t * t * p1x,
    y: u * u * p0y + 2 * u * t * cy + t * t * p1y,
  };
}

export function VenomButtonEffect({
  buttonRef,
  wrapperRef,
  active,
}: VenomButtonEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const wrapperNode = wrapperRef.current;

    if (!isDesktop || !active) {
      window.dispatchEvent(
        new CustomEvent("nuvi:cursor-pull", { detail: { dx: 0, dy: 0 } })
      );
      if (wrapperNode) {
        wrapperNode.style.transform = "";
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;
    let smoothVelX = 0;
    let smoothVelY = 0;
    let mouseInsideWindow = false;

    let isLatched = false;
    let masterProgress = 0; // 0 = recolhido, 1 = estendido
    let latchImpulse = 0; // pico curto ao agarrar o cursor
    let btnPullX = 0;
    let btnPullY = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseInsideWindow = true;
    };

    const onMouseLeave = () => {
      mouseInsideWindow = false;
      isLatched = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize, { passive: true });

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const timeSec = now * 0.001;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const btnEl = buttonRef.current;
      if (!btnEl || !mouseInsideWindow || mouseX < -500) {
        if (masterProgress > 0.001) {
          masterProgress = Math.max(0, masterProgress - dt * 6);
        }
        window.dispatchEvent(
          new CustomEvent("nuvi:cursor-pull", { detail: { dx: 0, dy: 0 } })
        );
        if (wrapperRef.current) wrapperRef.current.style.transform = "";
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Velocidade suavizada do cursor para curvatura orgânica de inércia
      if (prevMouseX > -500) {
        const vx = (mouseX - prevMouseX) / Math.max(dt, 0.008);
        const vy = (mouseY - prevMouseY) / Math.max(dt, 0.008);
        smoothVelX = smoothVelX * 0.82 + clamp(vx, -1800, 1800) * 0.18;
        smoothVelY = smoothVelY * 0.82 + clamp(vy, -1800, 1800) * 0.18;
      }
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      const rect = btnEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const cap = getCapsuleClosestPoint(rect, mouseX, mouseY);

      // Estado de alcance (ativa ANTES de passar o mouse sobre o botão)
      if (!isLatched) {
        if (cap.edgeDist > 2 && cap.edgeDist <= ENTER_RADIUS) {
          isLatched = true;
          latchImpulse = 1.0;
        }
      } else {
        if (cap.edgeDist <= 0 || cap.edgeDist > SNAP_RADIUS) {
          isLatched = false;
        }
      }

      const targetMaster = isLatched ? 1 : 0;
      const speed = isLatched ? 13.5 : 14.0;
      masterProgress += (targetMaster - masterProgress) * (1 - Math.exp(-speed * dt));
      latchImpulse = Math.max(0, latchImpulse - dt * 3.8);

      // Puxão elástico nos dois sentidos: fios puxam o cursor + ligeira inclinação do botão
      let cursorPullDx = 0;
      let cursorPullDy = 0;
      let targetBtnX = 0;
      let targetBtnY = 0;

      if (masterProgress > 0.02 && cap.edgeDist > 0) {
        const distNorm = clamp(cap.edgeDist / SNAP_RADIUS, 0, 1);
        // Pico de tração entre ~25px e ~165px; zera perto da borda para não atrapalhar clique
        const nearFade = clamp((cap.edgeDist - 3) / 26, 0, 1);
        const farFade = 1 - Math.pow(distNorm, 2.2);
        const pullMag =
          (12.5 * nearFade * farFade + 6.0 * latchImpulse * nearFade) *
          masterProgress;

        cursorPullDx = -cap.nx * pullMag;
        cursorPullDy = -cap.ny * pullMag;

        const btnLean = 3.2 * nearFade * farFade * masterProgress;
        targetBtnX = cap.nx * btnLean;
        targetBtnY = cap.ny * btnLean;
      }

      window.dispatchEvent(
        new CustomEvent("nuvi:cursor-pull", {
          detail: { dx: cursorPullDx, dy: cursorPullDy },
        })
      );

      btnPullX += (targetBtnX - btnPullX) * (1 - Math.exp(-12 * dt));
      btnPullY += (targetBtnY - btnPullY) * (1 - Math.exp(-12 * dt));
      if (wrapperRef.current) {
        if (Math.abs(btnPullX) > 0.05 || Math.abs(btnPullY) > 0.05) {
          wrapperRef.current.style.transform = `translate3d(${btnPullX.toFixed(2)}px, ${btnPullY.toFixed(2)}px, 0)`;
        } else {
          wrapperRef.current.style.transform = "";
        }
      }

      if (masterProgress < 0.015) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Alinhar com a posição exata renderizada do CustomCursor na tela
      const cursorEl = document.getElementById("nuvi-custom-cursor");
      let targetTipX = mouseX + cursorPullDx;
      let targetTipY = mouseY + cursorPullDy;
      if (cursorEl) {
        const cRect = cursorEl.getBoundingClientRect();
        if (cRect.width > 0 && cRect.left > -40) {
          targetTipX = cRect.left + cRect.width / 2;
          targetTipY = cRect.top + cRect.height / 2;
        }
      }

      const stretchFactor = clamp(1 - cap.edgeDist / SNAP_RADIUS, 0.28, 1);
      const rootSpreadScale = clamp(cap.edgeDist / 110, 0.65, 1.15);

      // Pré-calcular geometria das raízes e curvas para cada fio + membranas entre eles
      const computedStrands: {
        spec: StrandSpec;
        rx: number;
        ry: number;
        rtx: number;
        rty: number;
        wRoot: number;
        cx: number;
        cy: number;
        tx: number;
        ty: number;
        ext: number;
        px: number;
        py: number;
      }[] = [];

      ctx.save();
      ctx.shadowColor = "rgba(5, 15, 35, 0.24)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;

      for (let i = 0; i < STRANDS.length; i++) {
        const spec = STRANDS[i];
        const localProgress = clamp(
          (masterProgress - spec.staggerDelay) / (1 - spec.staggerDelay),
          0,
          1
        );
        if (localProgress <= 0.01) continue;

        const easedExt = 1 - Math.pow(1 - localProgress, 2.4);
        const arcPos = cap.s0 + spec.arcOffset * rootSpreadScale;
        const root = getCapsulePointAtArc(
          cap.cx,
          cap.cy,
          cap.R,
          cap.halfSpine,
          cap.totalPerimeter,
          arcPos
        );

        // Raiz recuada ~4px dentro da borda da pílula (atrás do botão z-index 10)
        const rx = root.x - root.nx * 4;
        const ry = root.y - root.ny * 4;
        const rtx = -root.ny;
        const rty = root.nx;

        const destX =
          spec.reachFactor >= 0.99
            ? targetTipX
            : root.x + (targetTipX - root.x) * spec.reachFactor;
        const destY =
          spec.reachFactor >= 0.99
            ? targetTipY
            : root.y + (targetTipY - root.y) * spec.reachFactor;

        const fullDx = destX - rx;
        const fullDy = destY - ry;
        const fullLen = Math.hypot(fullDx, fullDy) || 1;
        const px = -fullDy / fullLen;
        const py = fullDx / fullLen;

        // Curva orgânica + oscilação viva + ligeiro arrasto da velocidade do cursor
        const sway =
          Math.sin(timeSec * spec.swaySpeed + spec.swayPhase) *
          spec.swayAmp *
          clamp(fullLen / 120, 0.4, 1.15);
        const bend =
          spec.bendBias * clamp(fullLen * 0.24, 6, 34) + sway;
        const lagX = -smoothVelX * 0.018 * (spec.reachFactor >= 0.99 ? 1 : 0.6);
        const lagY = -smoothVelY * 0.018 * (spec.reachFactor >= 0.99 ? 1 : 0.6);

        const ctrlFullX = (rx + destX) * 0.5 + px * bend + lagX;
        const ctrlFullY = (ry + destY) * 0.5 + py * bend + lagY;

        const tipPt = quadPoint(
          rx,
          ry,
          ctrlFullX,
          ctrlFullY,
          destX,
          destY,
          easedExt
        );

        // Controle ajustado à fração estendida para recorte fiel da curva quadrática de De Casteljau
        const adjCtrlX = rx + (ctrlFullX - rx) * easedExt;
        const adjCtrlY = ry + (ctrlFullY - ry) * easedExt;

        const wRoot =
          spec.rootHalfWidth * (0.7 + 0.3 * stretchFactor) * easedExt;
        const wMid =
          spec.midHalfWidth * (0.55 + 0.55 * stretchFactor) * easedExt;
        const wTip =
          spec.tipHalfWidth * (0.65 + 0.35 * stretchFactor) * easedExt;

        // Desenho da silhueta cónica orgânica do fio (base larga afunilada -> cintura fina -> ponta)
        const pRootL = { x: rx - rtx * wRoot, y: ry - rty * wRoot };
        const pRootR = { x: rx + rtx * wRoot, y: ry + rty * wRoot };

        const pinchT = 0.22;
        const pinchPt = quadPoint(
          rx,
          ry,
          adjCtrlX,
          adjCtrlY,
          tipPt.x,
          tipPt.y,
          pinchT
        );
        const midPt = quadPoint(
          rx,
          ry,
          adjCtrlX,
          adjCtrlY,
          tipPt.x,
          tipPt.y,
          0.62
        );

        const wPinch = wRoot * 0.26 + wMid * 0.74;

        ctx.fillStyle = `rgba(9, 11, 16, ${spec.opacity * easedExt})`;
        ctx.beginPath();
        ctx.moveTo(pRootL.x, pRootL.y);
        ctx.quadraticCurveTo(
          pRootL.x * 0.45 + (pinchPt.x - px * wPinch) * 0.55,
          pRootL.y * 0.45 + (pinchPt.y - py * wPinch) * 0.55,
          pinchPt.x - px * wPinch,
          pinchPt.y - py * wPinch
        );
        ctx.quadraticCurveTo(
          midPt.x - px * wMid,
          midPt.y - py * wMid,
          tipPt.x - px * wTip,
          tipPt.y - py * wTip
        );
        ctx.lineTo(tipPt.x + px * wTip, tipPt.y + py * wTip);
        ctx.quadraticCurveTo(
          midPt.x + px * wMid,
          midPt.y + py * wMid,
          pinchPt.x + px * wPinch,
          pinchPt.y + py * wPinch
        );
        ctx.quadraticCurveTo(
          pRootR.x * 0.45 + (pinchPt.x + px * wPinch) * 0.55,
          pRootR.y * 0.45 + (pinchPt.y + py * wPinch) * 0.55,
          pRootR.x,
          pRootR.y
        );
        ctx.closePath();
        ctx.fill();

        computedStrands.push({
          spec,
          rx,
          ry,
          rtx,
          rty,
          wRoot,
          cx: adjCtrlX,
          cy: adjCtrlY,
          tx: tipPt.x,
          ty: tipPt.y,
          ext: easedExt,
          px,
          py,
        });
      }

      // Membranas líquidas / teia entre raízes adjacentes junto ao botão (visual Venom)
      const mainStrands = computedStrands
        .filter((s) => s.spec.reachFactor >= 0.99)
        .sort((a, b) => a.spec.arcOffset - b.spec.arcOffset);

      for (let i = 0; i < mainStrands.length - 1; i++) {
        const a = mainStrands[i];
        const b = mainStrands[i + 1];
        const bridgeT = 0.16 * Math.min(a.ext, b.ext);
        const ptA = quadPoint(a.rx, a.ry, a.cx, a.cy, a.tx, a.ty, bridgeT);
        const ptB = quadPoint(b.rx, b.ry, b.cx, b.cy, b.tx, b.ty, bridgeT);
        const rootMidX = (a.rx + b.rx) * 0.5;
        const rootMidY = (a.ry + b.ry) * 0.5;

        ctx.fillStyle = `rgba(9, 11, 16, ${0.78 * Math.min(a.ext, b.ext)})`;
        ctx.beginPath();
        ctx.moveTo(a.rx, a.ry);
        ctx.lineTo(ptA.x, ptA.y);
        ctx.quadraticCurveTo(rootMidX, rootMidY, ptB.x, ptB.y);
        ctx.lineTo(b.rx, b.ry);
        ctx.closePath();
        ctx.fill();
      }

      // Pequeno halo viscoso onde os fios agarram o cursor
      if (masterProgress > 0.25 && cap.edgeDist > 4) {
        const gripAlpha = clamp((masterProgress - 0.2) * 0.9, 0, 0.85);
        ctx.fillStyle = `rgba(9, 11, 16, ${gripAlpha})`;
        ctx.beginPath();
        ctx.arc(targetTipX, targetTipY, 6.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      window.dispatchEvent(
        new CustomEvent("nuvi:cursor-pull", { detail: { dx: 0, dy: 0 } })
      );
      if (wrapperNode) {
        wrapperNode.style.transform = "";
      }
    };
  }, [isDesktop, active, buttonRef, wrapperRef]);

  if (!isDesktop || !active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9,
      }}
    />
  );
}
