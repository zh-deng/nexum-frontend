import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/main.scss";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Navbar from "../components/Navbar/Navbar";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexum",
  description: "Web app to track and manage job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Theme
          appearance={"light"}
          accentColor={"indigo"}
          grayColor={"slate"}
          radius={"medium"}
          scaling={"95%"}
        >
          <ClientLayout>
            <Navbar />
            {children}
          </ClientLayout>
        </Theme>
      </body>
    </html>
  );
}
