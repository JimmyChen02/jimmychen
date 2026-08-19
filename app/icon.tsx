import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#081827",
          border: "3px solid #F58426",
          borderRadius: 14,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            color: "#F3EFE4",
            fontFamily: "monospace",
            fontSize: 31,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          j
        </span>
        <span
          style={{
            color: "#F58426",
            fontFamily: "monospace",
            fontSize: 21,
            fontWeight: 700,
            lineHeight: 1,
            marginLeft: 2,
          }}
        >
          ()
        </span>
      </div>
    ),
    size
  );
}
