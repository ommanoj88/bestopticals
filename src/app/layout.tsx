import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

// Display: Fraunces has a true optical-size axis — on-theme for an optician.
// Variable font: omit `weight` when using `axes` (next/font requirement).
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});
// Body/UI: Hanken Grotesk — warm, highly legible at large sizes (older readers).
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
// Clinical numbers only (lens power, SPH/CYL, frame dims). Monospace = "measurement".
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Best Opticals",
  description: "Verified by a real optician. Ready today at your local shop.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`h-full antialiased ${fraunces.variable} ${hanken.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <CartProvider>{children}</CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
