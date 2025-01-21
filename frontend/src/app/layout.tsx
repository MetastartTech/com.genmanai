import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "tw-elements-react/dist/css/tw-elements-react.min.css";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GenMan",
  description: "Prompt Engineering tool",
  icons: [
    {
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      url: "/favicon.ico",
      type: "image/ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <link rel="manifest" href="/manifest.json"></link>
      <body className={`font-sans antialiased ${inter.variable}`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
