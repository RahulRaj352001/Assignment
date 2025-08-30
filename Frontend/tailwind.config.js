/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(var(--color-primary) / <alpha-value>)",
          100: "rgb(var(--color-primary) / <alpha-value>)",
          500: "rgb(var(--color-primary) / <alpha-value>)",
          600: "rgb(var(--color-primary) / <alpha-value>)",
          700: "rgb(var(--color-primary) / <alpha-value>)",
          900: "rgb(var(--color-primary) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
