import { ImageResponse } from "next/og";

export const alt = "The Hidden Poisons - Awareness Seminar | Rotaract Sunrise Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadManrope(weight: 400 | 600 | 800) {
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-${weight}-normal.ttf`,
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const [regular, semibold, bold] = await Promise.all([
    loadManrope(400),
    loadManrope(600),
    loadManrope(800),
  ]);

  const fonts = [
    ...(regular
      ? [{ name: "Manrope", data: regular, weight: 400 as const, style: "normal" as const }]
      : []),
    ...(semibold
      ? [{ name: "Manrope", data: semibold, weight: 600 as const, style: "normal" as const }]
      : []),
    ...(bold
      ? [{ name: "Manrope", data: bold, weight: 800 as const, style: "normal" as const }]
      : []),
  ];

  const fontFamily = fonts.length ? "Manrope, sans-serif" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b0b0d",
          color: "#f4f6fa",
          fontFamily,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -100,
            width: 580,
            height: 580,
            borderRadius: 9999,
            background: "rgba(224,122,63,0.30)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(190,40,60,0.24)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 90,
            width: 220,
            height: 220,
            borderRadius: 9999,
            background: "rgba(168,85,247,0.16)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(11,11,13,0) 55%, rgba(11,11,13,0.85))",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "0 88px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: "#e07a3f",
              }}
            />
            <div
              style={{
                fontSize: 24,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#eaa879",
                fontWeight: 600,
              }}
            >
              Awareness Seminar · Rotaract Sunrise Club
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 84,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              The Hidden
            </span>
            <span
              style={{
                fontSize: 84,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#e07a3f",
              }}
            >
              Poisons
            </span>
          </div>

          <div
            style={{
              marginTop: 22,
              maxWidth: 880,
              fontSize: 30,
              lineHeight: 1.45,
              color: "#9aa4b2",
              fontWeight: 400,
            }}
          >
            What if the greatest danger isn&apos;t always visible?
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 40,
              fontSize: 24,
              color: "#c8ced8",
              fontWeight: 600,
            }}
          >
            <span>Saturday, Aug 22, 2026</span>
            <span style={{ color: "#e07a3f" }}>·</span>
            <span>6:00 PM</span>
            <span style={{ color: "#e07a3f" }}>·</span>
            <span>Grand Plaza, Alexandria</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
