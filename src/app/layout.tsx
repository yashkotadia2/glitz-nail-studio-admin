import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";
import { ConfigProvider } from "antd";

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
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#0097b2",
              borderRadius: 9999,

              // Alias Token
              colorBgContainer: "#ffffff",
            },
          }}
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
