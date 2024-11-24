import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './vendor/laravel/jetstream/**/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.js',
    './resources/js/**/*.jsx',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.jsx', 
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        'dark-orange': '#df8c42',
        'navbar-text': '#414141',
        'OFFWHITE': '#FBFCF8',
        'EGGSHELL': '#FFF9E3',
        'navbar-texthover': '#333333',
      },
    },
  },

  plugins: [
    forms,
    typography,
    flowbite,
  ],
};
