/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-theme": "rgba(0, 22, 130, 0.05)",
      },
    },
  },
  plugins: [],
};
