/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
      'slide-in-up': {
        '0%': { transform: 'translateY(5rem)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
    animation: {
      'slide-in-up': 'slide-in-up 0.3s cubic-bezier(0.4,0,0.2,1) forwards',
    },},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}