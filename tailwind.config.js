/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}", 
      "./components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        fontFamily: {
        'inter': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-bold': ['Inter_700Bold'],
        'inter-semibold': ['Inter_600SemiBold'],
        'geist': ['Geist_400Regular'],
        'geist-medium': ['Geist_500Medium'],
        'geist-bold': ['Geist_700Bold'],
        'geist-semibold': ['Geist_600SemiBold'],
        }
      },
    },
    plugins: [],
  };
