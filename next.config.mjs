/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <--- ESTA ES LA LÍNEA CLAVE
  images: {
    remotePatterns: []
  }
};

export default nextConfig;