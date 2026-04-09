import "./globals.css";

export const metadata = {
  title: "WebNex | Ultra-Luxury Software Studio",
  description: "WebNex transforma código en ventajas competitivas exponenciales con cloud, IA y UX de alto impacto."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
