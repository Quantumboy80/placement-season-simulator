import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#09090b", // slate-950 dark mode background
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#10b981", // emerald-500 neon green
          fontFamily: "monospace",
          fontWeight: "bold",
          borderRadius: "8px",
          border: "2px solid #10b981",
        }}
      >
        H
      </div>
    ),
    {
      ...size,
    }
  );
}
