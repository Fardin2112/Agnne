// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
        roboto: ['"Roboto"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        anurati: ['"Anurati"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
