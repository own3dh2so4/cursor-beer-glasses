/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c3e50',
          dark: '#1a252f',
        },
        secondary: '#34495e',
        accent: {
          DEFAULT: '#e67e22',
          dark: '#d35400',
        },
      },
      borderRadius: {
        'default': '12px',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'sm-card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'md-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'lg-card': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 1.5s ease-in-out infinite',
      },
      screens: {
        'tablet': '768px',
        'desktop': '1024px',
        'xl-desktop': '1440px',
        '2xl-desktop': '1920px',
      },
    },
  },
  plugins: [],
}

