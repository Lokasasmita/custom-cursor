import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Cursor Component",
  description:
    "Smooth custom cursor that follows mouse movement with GSAP. Features text labels that appear when hovering elements. Desktop-only, auto-disabled on touch devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
