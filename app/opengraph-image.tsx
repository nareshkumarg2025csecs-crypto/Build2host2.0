import { ImageResponse } from "next/og";

export const alt = "built2host — Websites and Real Estate Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#E60000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "#F7F1E8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            Studio Portfolio &middot; built2host.in
          </div>
          <div
            style={{
              fontSize: "20px",
              border: "1px solid rgba(247, 241, 232, 0.4)",
              padding: "8px 20px",
              borderRadius: "999px",
            }}
          >
            Websites &middot; Automation
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            built2host
          </div>
          <div
            style={{
              fontSize: "36px",
              fontStyle: "italic",
              opacity: 0.9,
            }}
          >
            You imagine it. We build it.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(247, 241, 232, 0.2)",
            paddingTop: "24px",
            fontSize: "18px",
            opacity: 0.8,
          }}
        >
          <div>Websites: 98402 64843</div>
          <div>Automation: 72003 46975</div>
          <div>build2host@gmail.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
