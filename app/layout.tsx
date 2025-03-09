import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save Research | Columbia University",
  description:
    "Our response to the $400 million budget cuts. Helping researchers in need. Built by Alexa Kayman, Alex Denuzzo, and Joseph JoJoe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
