/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#050505",
        electric: "#38bdf8",
        cyber: "#8b5cf6"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 30px 100px rgba(56, 189, 248, 0.18)"
      }
    }
  },
  plugins: []
};
