/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customAqua: "#9CF8E1",
        customGreen: "#00C99D",
        customDarkGreen: "#1F3F42",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
