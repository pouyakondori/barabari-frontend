import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: {
    default: "برابری — تحلیل و مقایسه قوانین اساسی",
    template: "%s | برابری",
  },
  description: "پلتفرم تحلیل و مقایسه قوانین اساسی جهان برای شهروندان ایرانی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-vazirmatn)]">
        <ApolloWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}
