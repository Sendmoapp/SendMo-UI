import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import PrivyConfig from "./components/PrivyConfig";
import "./globals.css";

const roboto = Roboto({
  display: "swap",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SendMo",
  description: "Send money instantly in stable coins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <PrivyConfig>{children}</PrivyConfig>
      </body>
    </html>
  );
}
