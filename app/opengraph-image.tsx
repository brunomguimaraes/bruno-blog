import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt =
  "Bruno Guimaraes — fullstack developer. Terminal-flavored portfolio + blog.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MONO = '"JetBrains Mono", "SF Mono", "Menlo", "Consolas", monospace';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(1200px 700px at 12% 0%, #0a1836 0%, #02040a 55%, #000 100%)",
          color: "#d6e8ff",
          fontFamily: MONO,
          padding: 56,
          position: "relative",
        }}
      >
        {/* thin scanline glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(26,163,255,0.04) 0px, rgba(26,163,255,0.04) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none",
            display: "flex",
          }}
        />

        {/* terminal frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRadius: 14,
            border: "1px solid rgba(26,163,255,0.35)",
            background: "rgba(3, 8, 22, 0.72)",
            boxShadow:
              "inset 0 0 0 1px rgba(26,163,255,0.08), 0 0 60px rgba(26,163,255,0.15)",
            overflow: "hidden",
          }}
        >
          {/* title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 20px",
              borderBottom: "1px solid rgba(26,163,255,0.25)",
              background: "rgba(10, 24, 54, 0.55)",
              fontSize: 18,
              color: "#8fb7e6",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ff5f56",
                display: "flex",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ffbd2e",
                display: "flex",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#27c93f",
                display: "flex",
              }}
            />
            <span style={{ marginLeft: 14, letterSpacing: 2 }}>
              bruno@bridge · ~
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 14,
                color: "#4f7ab0",
                letterSpacing: 2,
              }}
            >
              brunao.dev
            </span>
          </div>

          {/* body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "40px 48px",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#6faaff",
                letterSpacing: 2,
              }}
            >
              $ whoami
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 84,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: -1,
                lineHeight: 1,
              }}
            >
              bruno guimaraes
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 34,
                color: "#8fb7e6",
                letterSpacing: 2,
              }}
            >
              fullstack developer
            </div>

            <div
              style={{
                display: "flex",
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(26,163,255,0.6), rgba(26,163,255,0))",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 24,
                color: "#a9c6ee",
              }}
            >
              <div style={{ display: "flex" }}>
                <span style={{ color: "#6faaff", marginRight: 12 }}>$</span>
                <span>cat now.txt</span>
              </div>
              <div style={{ display: "flex", color: "#d6e8ff" }}>
                portfolio + blog. tiled panes, blue warp drive.
              </div>
              <div style={{ display: "flex", color: "#d6e8ff" }}>
                20 hidden features baked in. press{" "}
                <span
                  style={{
                    color: "#6faaff",
                    marginLeft: 8,
                    marginRight: 8,
                    border: "1px solid rgba(26,163,255,0.5)",
                    padding: "0 8px",
                    borderRadius: 4,
                  }}
                >
                  ?
                </span>{" "}
                to start.
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 18,
                color: "#4f7ab0",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#27c93f",
                  display: "flex",
                  boxShadow: "0 0 10px #27c93f",
                }}
              />
              <span>bridge · online</span>
              <span style={{ color: "#1a3a66" }}>·</span>
              <span>warp drive nominal</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
