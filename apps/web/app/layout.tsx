import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedaAI | Assessment Creator",
  description: "AI-powered assessment creator for teachers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3200 }} />
      </body>
    </html>
  );
}
