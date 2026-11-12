import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/site-url";

export const OG_IMAGE_ALT =
  "Nuvi — O lugar onde marcas encontram creators em Angola";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_IMAGE_CONTENT_TYPE = "image/png" as const;

async function loadOgFonts() {
  const fontsDir = join(process.cwd(), "src", "fonts");
  const [boldFont, mediumFont] = await Promise.all([
    readFile(join(fontsDir, "SFPRODISPLAYBOLD.otf")),
    readFile(join(fontsDir, "SFPRODISPLAYMEDIUM.otf")),
  ]);

  return [
    {
      name: "SF Pro Display",
      data: boldFont,
      style: "normal" as const,
      weight: 700 as const,
    },
    {
      name: "SF Pro Display",
      data: mediumFont,
      style: "normal" as const,
      weight: 500 as const,
    },
  ];
}

/**
 * Generates the shared 1200x630 social preview image representing the Nuvi app.
 */
export async function renderNuviOgImage(): Promise<ImageResponse> {
  const fonts = await loadOgFonts();
  const siteHost = new URL(getSiteUrl()).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          padding: "46px 64px 42px 64px",
          background:
            "linear-gradient(155deg, #1E94F4 0%, #3EA8F7 44%, #6AC1FA 85%, #84CEFC 100%)",
          fontFamily: "SF Pro Display, sans-serif",
          color: "#FFFFFF",
        }}
      >
        {/* Atmospheric soft cloud glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            left: "-120px",
            width: "540px",
            height: "540px",
            borderRadius: "9999px",
            display: "flex",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-220px",
            right: "-90px",
            width: "620px",
            height: "620px",
            borderRadius: "9999px",
            display: "flex",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 72%)",
          }}
        />
        <svg
          width="1200"
          height="135"
          viewBox="0 0 1200 135"
          fill="none"
          style={{
            position: "absolute",
            bottom: "0px",
            left: "0px",
          }}
        >
          <path
            d="M 80 135 Q 600 15 1120 135"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.75"
            fill="none"
          />
        </svg>

        {/* Top header with official Nuvi logo and live tag */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <svg width="169" height="31" viewBox="0 0 141 26" fill="none">
            <path
              d="M19.5675 0C14.983 0 11.1844 3.36518 10.5069 7.76028C10.461 7.75355 10.4148 7.74712 10.3686 7.74108C10.2845 7.73007 10.1998 7.7202 10.1147 7.71148C9.80362 7.67952 9.48763 7.66315 9.16797 7.66315C5.74623 7.66315 2.76254 9.53762 1.18718 12.3158C0.431618 13.6488 0 15.1898 0 16.8316C0 21.8951 4.1045 26 9.16797 26H29.9667C35.0302 26 39.1347 21.8951 39.1347 16.8316C39.1347 15.1898 38.7033 13.6488 37.9475 12.3158C36.3721 9.53762 33.3884 7.66315 29.9667 7.66315C29.5121 7.66315 29.0649 7.69626 28.6278 7.76028C27.9505 3.36518 24.1519 0 19.5675 0ZM26.6997 11.7906C26.6997 11.1228 26.1583 10.5814 25.4905 10.5814C24.8227 10.5814 24.2813 11.1228 24.2813 11.7906V14.2094C24.2813 14.8772 24.8227 15.4186 25.4905 15.4186C26.1583 15.4186 26.6997 14.8772 26.6997 14.2094V11.7906ZM18.2353 11.7906C18.2353 11.1228 18.7767 10.5814 19.4445 10.5814C20.1123 10.5814 20.6537 11.1228 20.6537 11.7906V14.2094C20.6537 14.8772 20.1123 15.4186 19.4445 15.4186C18.7767 15.4186 18.2353 14.8772 18.2353 14.2094V11.7906Z"
              fillRule="evenodd"
              clipRule="evenodd"
              fill="white"
            />
            <path
              d="M137.729 25.5614C136.731 25.5614 135.965 25.2617 135.432 24.6623C134.899 24.063 134.633 23.2305 134.633 22.165V3.8346C134.633 2.73578 134.899 1.90333 135.432 1.33727C135.965 0.737912 136.731 0.438232 137.729 0.438232C138.728 0.438232 139.494 0.737912 140.027 1.33727C140.593 1.90333 140.876 2.73578 140.876 3.8346V22.165C140.876 23.2305 140.61 24.063 140.077 24.6623C139.544 25.2617 138.762 25.5614 137.729 25.5614Z"
              fill="white"
            />
            <path
              d="M118.184 25.6115C117.351 25.6115 116.619 25.395 115.986 24.9622C115.387 24.5293 114.887 23.8633 114.488 22.9643L106.546 4.53399C106.246 3.80144 106.13 3.11884 106.196 2.48618C106.296 1.85352 106.596 1.35406 107.095 0.987785C107.628 0.588213 108.344 0.388428 109.243 0.388428C110.009 0.388428 110.625 0.571562 111.091 0.937836C111.557 1.27081 111.974 1.92012 112.34 2.88576L119.083 19.7178H117.584L124.527 2.83581C124.893 1.90347 125.309 1.27081 125.775 0.937836C126.275 0.571562 126.941 0.388428 127.773 0.388428C128.506 0.388428 129.089 0.588213 129.521 0.987785C129.954 1.35406 130.221 1.85352 130.321 2.48618C130.42 3.08554 130.304 3.7515 129.971 4.48405L121.88 22.9643C121.513 23.8633 121.014 24.5293 120.381 24.9622C119.782 25.395 119.049 25.6115 118.184 25.6115Z"
              fill="white"
            />
            <path
              d="M88.2101 25.7114C86.179 25.7114 84.4974 25.3451 83.1655 24.6125C81.8336 23.8467 80.8347 22.7146 80.1687 21.2162C79.5361 19.7178 79.2197 17.8531 79.2197 15.6221V3.53506C79.2197 2.46953 79.4861 1.68704 80.0189 1.18757C80.5516 0.654806 81.3175 0.388428 82.3164 0.388428C83.3154 0.388428 84.0812 0.654806 84.614 1.18757C85.18 1.68704 85.4631 2.46953 85.4631 3.53506V15.722C85.4631 17.4535 85.8127 18.7355 86.5119 19.5679C87.2112 20.4004 88.3267 20.8166 89.8584 20.8166C91.5232 20.8166 92.8884 20.2505 93.954 19.1184C95.0195 17.953 95.5523 16.4213 95.5523 14.5233V3.53506C95.5523 2.46953 95.8186 1.68704 96.3514 1.18757C96.8842 0.654806 97.65 0.388428 98.649 0.388428C99.6479 0.388428 100.414 0.654806 100.946 1.18757C101.513 1.68704 101.796 2.46953 101.796 3.53506V22.4149C101.796 24.5459 100.78 25.6115 98.7489 25.6115C97.7832 25.6115 97.034 25.3451 96.5013 24.8123C95.9685 24.2463 95.7021 23.4471 95.7021 22.4149V18.6189L96.4014 20.1173C95.7021 21.9154 94.6366 23.2973 93.2048 24.2629C91.8063 25.2285 90.1414 25.7114 88.2101 25.7114Z"
              fill="white"
            />
            <path
              d="M53.25 25.6117C52.2511 25.6117 51.4852 25.3454 50.9525 24.8126C50.4197 24.2465 50.1533 23.4474 50.1533 22.4152V3.53535C50.1533 2.50312 50.4197 1.72062 50.9525 1.18785C51.4852 0.655092 52.2344 0.388713 53.2001 0.388713C54.1657 0.388713 54.9149 0.655092 55.4477 1.18785C55.9804 1.72062 56.2468 2.50312 56.2468 3.53535V6.93171L55.6974 5.68305C56.4299 3.91827 57.5621 2.58636 59.0938 1.68732C60.6588 0.754987 62.4235 0.288818 64.3881 0.288818C66.3527 0.288818 67.9676 0.655095 69.2329 1.38764C70.4982 2.1202 71.4472 3.23567 72.0799 4.73407C72.7125 6.19917 73.0289 8.06384 73.0289 10.3281V22.4152C73.0289 23.4474 72.7625 24.2465 72.2297 24.8126C71.697 25.3454 70.9311 25.6117 69.9322 25.6117C68.9332 25.6117 68.1507 25.3454 67.5847 24.8126C67.0519 24.2465 66.7855 23.4474 66.7855 22.4152V10.6278C66.7855 8.72979 66.4193 7.34794 65.6867 6.4822C64.9875 5.61646 63.8886 5.18358 62.3902 5.18358C60.5589 5.18358 59.0938 5.76629 57.9949 6.93171C56.9294 8.06384 56.3966 9.57889 56.3966 11.4769V22.4152C56.3966 24.5462 55.3478 25.6117 53.25 25.6117Z"
              fill="white"
            />
          </svg>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.16)",
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
              fontSize: "17px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            <div
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "9999px",
                backgroundColor: "#7CFFA8",
                display: "flex",
              }}
            />
            <span>Acesso Antecipado • 1 de Janeiro</span>
          </div>
        </div>

        {/* Center App Hero Showcase */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "940px",
          }}
        >
          {/* Community Proof Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 22px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.18)",
              border: "1.5px solid rgba(255, 255, 255, 0.38)",
              marginBottom: "26px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "9999px",
                  backgroundColor: "#FFD166",
                  border: "2px solid #FFFFFF",
                  display: "flex",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "9999px",
                  backgroundColor: "#FF6B6B",
                  border: "2px solid #FFFFFF",
                  marginLeft: "-8px",
                  display: "flex",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "9999px",
                  backgroundColor: "#06D6A0",
                  border: "2px solid #FFFFFF",
                  marginLeft: "-8px",
                  display: "flex",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              3.500+ Criadores & Marcas na lista
            </span>
          </div>

          {/* Main Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              textShadow: "0 6px 28px rgba(0, 74, 153, 0.22)",
            }}
          >
            <span>O lugar onde marcas</span>
            <span>encontram creators.</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              marginTop: "22px",
              marginBottom: "34px",
              fontSize: "26px",
              fontWeight: 500,
              lineHeight: 1.38,
              color: "rgba(255, 255, 255, 0.94)",
              letterSpacing: "-0.01em",
            }}
          >
            <span>
              Ganha com o que já sabes fazer: gravar, editar e contar histórias.
            </span>
          </div>

          {/* Signature Glass Button Preview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              height: "70px",
              padding: "0 40px",
              borderRadius: "9999px",
              backgroundColor: "#4EA7EB",
              border: "2px solid rgba(255, 255, 255, 0.55)",
              boxShadow:
                "0 14px 36px rgba(0, 72, 145, 0.24), inset 0 2px 6px rgba(255, 255, 255, 0.65)",
              fontSize: "28px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            <span>Começar agora</span>
          </div>
        </div>

        {/* Bottom App Strip */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "18px",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <span>Creators • Marcas • Angola</span>
          <span>{siteHost}</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts,
    },
  );
}
