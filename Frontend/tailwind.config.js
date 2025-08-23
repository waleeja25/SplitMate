/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui'
export default {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  // theme: {
  //   extend: {},
  // },
  theme: {
  extend: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
  },
}
,
  plugins: [daisyui],
    daisyui: {
    themes: ["emerald","light"], 
  },
}
