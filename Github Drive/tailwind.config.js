/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: { xs: "2px" },
      colors: {
        glass: "rgba(255,255,255,0.06)"
      }
    }
  },
  plugins: []
};
