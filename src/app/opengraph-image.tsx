import { ImageResponse } from "next/og";

export const alt = "Era Engines | Custom Software Development Company";
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
            top: -160,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(224,122,63,0.30)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -120,
            width: 540,
            height: 540,
            borderRadius: 9999,
            background: "rgba(76,110,245,0.20)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 70,
            width: 260,
            height: 260,
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
              gap: 16,
              marginBottom: 26,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#e07a3f",
              }}
            />
            <div
              style={{
                fontSize: 26,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#eaa879",
                fontWeight: 600,
              }}
            >
              Custom Software · SaaS · AI · Cloud
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Era
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#e07a3f",
                marginLeft: 16,
              }}
            >
              Engines
            </span>
          </div>

          <div
            style={{
              marginTop: 22,
              maxWidth: 900,
              fontSize: 32,
              lineHeight: 1.45,
              color: "#9aa4b2",
              fontWeight: 400,
            }}
          >
            We design, build, and maintain the software behind growing businesses —
            across the Middle East &amp; Africa.
          </div>

          <div
            style={{
              marginTop: 44,
              height: 6,
              width: 150,
              background:
                "linear-gradient(100deg, #e07a3f, #eaa879)",
              borderRadius: 9999,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
