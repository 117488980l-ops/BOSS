import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppNav } from "@/components/AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESSA HR",
  description: "HR 简历筛选辅助系统"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppNav />
        <main className="page-shell">{children}</main>
      </body>
    </html>
  );
}
