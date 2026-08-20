import type { Metadata } from "next";
import "./globals.css";
import "./review.css";
import "./risk-register.css";

export const metadata: Metadata = { title: "RAMS Made Easy", description: "Create, review and issue UK construction RAMS" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
