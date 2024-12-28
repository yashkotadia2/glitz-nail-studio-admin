import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glitz Nail Studio Admin",
  description: "Admin panel for Glitz Nail Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
