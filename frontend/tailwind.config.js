/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gnosis-primary-blue-th1": "#80E1FF",
        "gnosis-primary-blue-th2": "#DBFFE3",
        "gnosis-primary-black": "#000000",
        "gnosis-primary-white": "#ffffff",
        "gnosis-gray-th1": "#F2F2F3",
        "gnosis-gray-th2": "#444746",
      },
    },
  },
  plugins: [],
};
