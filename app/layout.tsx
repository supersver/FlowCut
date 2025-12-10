import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowCut - Video Template Editor",
  description: "Create professional product videos with customizable templates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
