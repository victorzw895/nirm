/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineClamp: {
        8: '8',
      }
    },
    colors: {
      'darkest': '#2C3333',
      'dark': '#395B64',
      'light': '#A5C9CA',
      'lightest': '#b8f0ff',
      'lightest-2': '#E7F6F2'
    }
  },
  variants: {
    lineClamp: ['responsive', 'hover']
  },
  daisyui: {
    // styled: false,
    themes: [
      {
        mytheme: {
          // primary: "#E7F6F2",
          // secondary: "#395B64",
          // accent: "#395B64",
          // neutral: "#395B64",
          "base-100": "#395B64",
          // "base-200": "#A5C9CA",
        },
      }
    ],
  },
  plugins: [
    require("daisyui"),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
  ],
};
