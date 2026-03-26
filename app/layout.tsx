import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeverMiss — Never Miss a Customer Call Again",
  description: "Never miss a customer call again. NeverMiss AI answers, qualifies, and books appointments for your business — 24/7. $149/month. Try free for 14 days.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
