/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [],
  theme: {
    colors: {
      'max-pri': '#373737',
      'max-sec': '#BDBDBD',
      'max-action': '#FFDA55',
      'max-action-hover': '#FFC72C',
      'max-bg': '#F3F3EB',
      'max-special': '#56FFF5',
      'white': '#FFFFFF',
    },
    extend: {
      fontFamily: {
        'sans': ['GeneralSans-Regular', 'system-ui', 'sans-serif'],
        'sans-extralight': ['GeneralSans-Extralight', 'system-ui', 'sans-serif'],
        'sans-light': ['GeneralSans-Light', 'system-ui', 'sans-serif'],
        'sans-medium': ['GeneralSans-Medium', 'system-ui', 'sans-serif'],
        'sans-semibold': ['GeneralSans-Semibold', 'system-ui', 'sans-serif'],
        'sans-bold': ['GeneralSans-Bold', 'system-ui', 'sans-serif'],
        'sans-italic': ['GeneralSans-Italic', 'system-ui', 'sans-serif'],
        'sans-extralight-italic': ['GeneralSans-ExtralightItalic', 'system-ui', 'sans-serif'],
        'sans-light-italic': ['GeneralSans-LightItalic', 'system-ui', 'sans-serif'],
        'sans-medium-italic': ['GeneralSans-MediumItalic', 'system-ui', 'sans-serif'],
        'sans-semibold-italic': ['GeneralSans-SemiboldItalic', 'system-ui', 'sans-serif'],
        'sans-bold-italic': ['GeneralSans-BoldItalic', 'system-ui', 'sans-serif'],
        'sans-variable': ['GeneralSans-Variable', 'system-ui', 'sans-serif'],
        'sans-variable-italic': ['GeneralSans-VariableItalic', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--max-pri': theme('colors.max-pri'),
          '--max-sec': theme('colors.max-sec'),
          '--max-action': theme('colors.max-action'),
          '--max-action-hover': theme('colors.max-action-hover'),
          '--max-bg': theme('colors.max-bg'),
          '--max-special': theme('colors.max-special'),
          '--white': theme('colors.white'),
        },
      })
    },
  ],
}
