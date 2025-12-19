/**
 * SRT Parser Utility
 * Converts SRT file content to caption objects with frame-based timing
 */

export interface CaptionItem {
  id: string;
  startFrame: number;
  endFrame: number;
  text: string;
}

export interface CaptionSettings {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: "top" | "center" | "bottom";
}

export const DEFAULT_CAPTION_SETTINGS: CaptionSettings = {
  fontFamily: "Inter",
  fontSize: 44,
  color: "#ffffff",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  position: "bottom",
};

/**
 * Parse SRT timecode (00:00:00,000) to seconds
 */
function parseTimecode(timecode: string): number {
  const parts = timecode.trim().split(":");
  if (parts.length !== 3) return 0;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secondsParts = parts[2].split(/[,\.]/);
  const seconds = parseInt(secondsParts[0], 10);
  const milliseconds = parseInt(secondsParts[1] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

/**
 * Parse SRT file content to caption items
 * @param srtContent - Raw SRT file content
 * @param fps - Frames per second for conversion
 * @returns Array of CaptionItem objects
 */
export function parseSrt(srtContent: string, fps: number = 30): CaptionItem[] {
  const captions: CaptionItem[] = [];

  // Normalize line endings and split into blocks
  const normalized = srtContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    // Line 0: Index number (skip)
    // Line 1: Timecodes
    // Lines 2+: Text
    const timecodeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/
    );

    if (!timecodeMatch) continue;

    const startSeconds = parseTimecode(timecodeMatch[1]);
    const endSeconds = parseTimecode(timecodeMatch[2]);
    const text = lines.slice(2).join(" ").trim();

    if (text) {
      captions.push({
        id: `caption-${captions.length}-${Date.now()}`,
        startFrame: Math.round(startSeconds * fps),
        endFrame: Math.round(endSeconds * fps),
        text,
      });
    }
  }

  return captions;
}

/**
 * Convert captions back to SRT format
 */
export function captionsToSrt(
  captions: CaptionItem[],
  fps: number = 30
): string {
  return captions
    .map((caption, index) => {
      const startSeconds = caption.startFrame / fps;
      const endSeconds = caption.endFrame / fps;

      const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.round((seconds % 1) * 1000);
        return `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms
          .toString()
          .padStart(3, "0")}`;
      };

      return `${index + 1}\n${formatTime(startSeconds)} --> ${formatTime(
        endSeconds
      )}\n${caption.text}`;
    })
    .join("\n\n");
}
