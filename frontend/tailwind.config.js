/**
 * Tailwind CSS Configuration
 * 
 * Description: Configuration file for Tailwind CSS styling framework.
 *              Includes custom font family for elegant and readable typography.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

