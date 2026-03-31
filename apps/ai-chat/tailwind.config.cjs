/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#09090b",
          sidebar: "#0f0f13",
          surface: "#141419",
          input: "#1a1a22",
        },
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
