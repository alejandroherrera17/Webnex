import "./globals.css";

export const metadata = {
  title: "WebNex | Sitios web profesionales para negocios colombianos",
  description: "Creamos sitios web profesionales, rápidos y pensados para vender más, aparecer en Google y hacer crecer negocios colombianos."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
