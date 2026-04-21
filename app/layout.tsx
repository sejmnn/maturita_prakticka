import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maturita – praktická",
  description: "Rozcestník k praktické maturitě",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
