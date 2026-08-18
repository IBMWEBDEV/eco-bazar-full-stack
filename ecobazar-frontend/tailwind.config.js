/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Mobile-first: base styles target Mobile with no prefix.
    // Custom named breakpoints map the spec's Tablet / Laptop / Desktop / Ultra Wide tiers.
    screens: {
      tablet: '768px',
      laptop: '1024px',
      desktop: '1280px',
      ultrawide: '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B207',
          hover: '#2C742F',
        },
        secondary: '#84D187',
        background: '#FFFFFF',
        'background-light': '#F7F7F7',
        border: '#E5E5E5',
        title: '#1A1A1A',
        text: {
          DEFAULT: '#4D4D4D',
          muted: '#808080',
        },
        error: '#EA4B48',
        warning: '#FF8A00',
        success: '#2C742F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        'section-gap': '64px',
        'section-gap-lg': '96px',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [],
};
