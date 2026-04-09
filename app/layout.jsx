import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata = {
  title: "WebNex | Ultra-Luxury Software Studio",
  description: "WebNex transforma código en ventajas competitivas exponenciales con cloud, IA y UX de alto impacto."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
