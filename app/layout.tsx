import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save Research | Columbia University",
  description:
    "Our response to the $400 million budget cuts. Helping researchers in need. Built by Alexa Kayman, Alex Denuzzo, and Joseph Jojoe.",
  openGraph: {
    images: [
      {
        url: "/graphimage.png",
        width: 1200,
        height: 630,
        alt: "Save Research | Columbia University",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
      <footer className="text-center p-4 mb-4">
        Built by{" "}
        <a
          href="https://alexakayman.com"
          className="text-blue-500 hover:underline"
        >
          Alexa Kayman
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/josephjojo/"
          className="text-blue-500 hover:underline"
        >
          Joseph Jojoe
        </a>{" "}
        and{" "}
        <a
          href="https://www.linkedin.com/in/alexdenuzzo/"
          className="text-blue-500 hover:underline"
        >
          Alex DeNuzzo
        </a>
        , who published this{" "}
        <a
          href="https://www.linkedin.com/in/alexdenuzzo/"
          className="text-blue-500 hover:underline"
        >
          letter
        </a>
        .
      </footer>
    </html>
  );
}
