/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "Sans-serif"],
      },
    },
  },
  daisyui: {
    themes: ["lofi", "coffee"],
  },

  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
