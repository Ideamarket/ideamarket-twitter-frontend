const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  purge: {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  },
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0857e0',
        'brand-gray': '#f6f6f6',
        'brand-gray-2': '#708090',
        'brand-gray-3': '#dc2e9',
        'brand-gray-4': '#435366',
        // #1a1d3f
        'very-dark-blue': 'hsl(235, 42%, 17%)',
        'very-dark-blue-2': 'hsl(235, 42%, 10%)',
        'very-dark-blue-3': 'hsl(235, 42%, 5%)',
        'brand-green': '#329300',
        'brand-red': '#8f0033',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        'gilroy-bold': ['Gilroy-Bold', ...defaultTheme.fontFamily.sans],
        'sf-compact-medium': [
          'SF Compact Display Medium',
          ...defaultTheme.fontFamily.sans,
        ],
        'sf-pro-text': ['SFProText', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        7.5: '1.875rem',
        30: '7.5rem',
        158: '39.5rem',
      },
      letterSpacing: {
        tightest: '-0.015625rem', // -0.25px
        'tightest-2': '-0.018125rem', // -0.29px;
      },
      backgroundImage: (theme) => ({
        'top-mobile': "url('/topbg-mobile.svg')",
      }),
      borderRadius: {
        xlg: '0.625rem',
      },
      boxShadow: {
        home: '0 1px 5px 0 rgba(0, 0, 0, 0.05)',
      },
      maxHeight: {
        home: '77rem',
      },
      minWidth: {
        100: '25rem',
      },
      maxWidth: {
        88: '22rem',
        304: '76rem',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
