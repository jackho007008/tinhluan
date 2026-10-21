import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { brand } from "@/lib/config";
import "./globals.css";
import "./customer-experience.css";
export const metadata: Metadata = {
  title: "Tinh Luận · Lá số tử vi",
  description: brand.tagline,
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body
        style={
          {
            "--primary": brand.colors.primary,
            "--hover": brand.colors.hover,
            "--surface": brand.colors.surface,
            "--border": brand.colors.border,
            "--ink": brand.colors.text,
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
