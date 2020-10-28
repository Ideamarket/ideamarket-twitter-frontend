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
      customForms: {
        default: {
          input: {
            '&:focus': {
              boxShadow: `0 0 0 3px rgba(8,87,224, 0.45)`,
            },
          },
        },
      },
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
        18: '4.5rem',
        30: '7.5rem',
        43: '10.75rem',
        156.5: '39.125rem',
      },
      letterSpacing: {
        tightest: '-0.015625rem', // -0.25px
        'tightest-2': '-0.018125rem', // -0.29px;
      },
      backgroundImage: (theme) => ({
        'top-mobile': "url('/topbg-mobile.svg')",
        'top-desktop': "url('/topbg.svg')",
      }),
      borderRadius: {
        xlg: '0.625rem',
      },
      boxShadow: {
        home: '0 1px 5px 0 rgba(0, 0, 0, 0.05)',
      },
      minHeight: {
        6: '1.5rem',
      },
      maxHeight: {
        home: '82rem',
      },
      minWidth: {
        100: '25rem',
      },
      maxWidth: {
        88: '22rem',
        304: '76rem',
      },
      fontSize: {
        '6+xl': '4.2rem',
      },
      textOpacity: {
        60: '0.6',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
