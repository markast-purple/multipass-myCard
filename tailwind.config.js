/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "full-dark": "#000000",
        "main-dark": "#111111",
        "slightly-black": "#333333",
        primary: {
          DEFAULT: "var(--color-primary)",
          soft: "var(--color-primary-soft)",
          softBorder: "var(--color-primary-soft-border)",
          hard: "var(--color-primary-hard)",
        },
        gray: {
          DEFAULT: "var(--color-gray)",
          soft: "var(--color-gray-soft)",
          main: "var(--color-gray-main)",
        },
      },
    },
  },
  plugins: [],
};
