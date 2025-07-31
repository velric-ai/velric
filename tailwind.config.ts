/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jetBlack: "#0D0D0D",
        velricViolet: "#6A0DAD",
        slateGray: "#1C1C1E",
        softWhite: "#F5F5F5",
        plasmaBlue: "#00D9FF",
        mutedSand: "#E0E0DC",
      },
    },
  },
  plugins: [],
}
