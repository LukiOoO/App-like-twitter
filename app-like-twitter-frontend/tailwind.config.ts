// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         "open-sans": ['"Open Sans"', "sans-serif"],
//       },
//       colors: {
//         somegray: "#222831",
//         lighterDark: "#111111 ",
//       },
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "open-sans": ['"Open Sans"', "sans-serif"],
      },
      colors: {
        somegray: "#222831",
        lighterDark: "#111111 ",
      },
      keyframes: {
        slideOut: {
          to: {
            transform: "translateX(100%)",
            opacity: "0",
          },
        },
      },
      animation: {
        slideOut: "slideOut 0.5s forwards",
      },
    },
  },
  plugins: [],
};
