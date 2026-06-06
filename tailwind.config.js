/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./component/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // You can change this to match CheFu brand colors
        background: '#0f172a', // Dark theme standard
        surface: '#1e293b',
        text: '#f8fafc',
        muted: '#94a3b8'
      }
    },
  },
  plugins: [],
}