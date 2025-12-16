import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface WhatsAppCTAProps {
  replyText?: string;
}

export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
  replyText = "YES",
}) => {
  const frame = useCurrentFrame();

  // Entrance
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Pulse animation for reply field
  const pulseScale = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.02]);

  // Cursor blink
  const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  // Typing animation for "Type a message"
  const typingFrame = Math.max(0, frame - 20); // start typing after fade in
  const fullText = "Type a message";
  const visibleChars = Math.min(Math.floor(typingFrame / 3), fullText.length);
  const displayText = fullText.substring(0, visibleChars);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end", // Align to bottom
        paddingBottom: "8%",
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "0 40px",
        }}
      >
        {/* Message bubble */}
        <div
          style={{
            background: "#DCF8C6",
            borderRadius: "20px 20px 20px 5px",
            padding: "20px 28px",
            marginBottom: "20px",
            maxWidth: "85%",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              fontSize: "28px",
              color: "#1F2937",
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "sans-serif",
            }}
          >
            Reply <strong>'{replyText}'</strong> to this message
          </p>
        </div>

        {/* Reply input area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            transform: `scale(${pulseScale})`,
          }}
        >
          {/* Input field */}
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.95)",
              borderRadius: "30px",
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                color: "#9CA3AF",
                fontFamily: "sans-serif",
              }}
            >
              {displayText}
              <span style={{ opacity: cursorOpacity }}>|</span>
            </span>
          </div>

          {/* Send button */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)",
            }}
          >
            <span style={{ fontSize: "28px", color: "white" }}>➤</span>
          </div>
        </div>

        {/* Reply suggestion chip */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "20px",
              padding: "12px 28px",
              border: "2px solid #25D366",
              boxShadow: "0 2px 10px rgba(37, 211, 102, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#25D366",
                fontFamily: "sans-serif",
              }}
            >
              {replyText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
