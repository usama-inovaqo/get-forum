import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Forum",
  description: "Forum",
  icons: {
    icon: "/forum-logo.png",
  },
  openGraph: {
    images: [
      {
        url: "/forum-logo.png",
        width: 100,
        height: 100,
        alt: "Forum",
      },
    ],
  },
  twitter: {
    title: "Forum",
    description: "Forum",
    images: [
      {
        url: "/forum-logo.png",
        width: 100,
        height: 100,
        alt: "Forum logo",
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
    <ClerkProvider>
      <html lang="en" className="h-[100dvh]">
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        >
          <main className="h-full">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
