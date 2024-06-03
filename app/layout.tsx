import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin - Portal",
  description: "Clothing Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-color">
        <main>{children}</main>
      </body>
    </html>
  );
}
