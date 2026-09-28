/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rogers: "#DA291C",
        charcoal: "#1F1F1F",
        canvas: "#F4F5F7",
      },
      boxShadow: {
        card: "0 10px 30px rgba(31,31,31,0.07)",
      },
    },
  },
  plugins: [],
};
