/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        purple: "#00FFC2",
        cyan: "#00C2FF",
        pink: "#0066FF",
      },
      fontFamily: {
        heading: ["Orbitron", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
}
