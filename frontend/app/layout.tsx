import "@mantine/core/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "无人机巡检 · 教学 Demo",
  description: "软件工程课程最小前后端代码示例",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
