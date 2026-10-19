/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        // Azul-marinho da barra lateral e dos cards de batalha
        navy: {
          50: '#eef2f8',
          100: '#d7dfee',
          300: '#8fa3c7',
          400: '#647aa6',
          500: '#3d5687',
          600: '#2b4472',
          700: '#22395f',
          800: '#1b2f52',
          900: '#152643',
          950: '#0f1c33',
        },
        // Ciano de destaque (botões primários, barras, links)
        accent: {
          50: '#ecfbfe',
          100: '#cff4fc',
          200: '#a5e9f8',
          300: '#67d9f2',
          400: '#2cc6ea',
          500: '#12b0d6',
          600: '#0c8fb3',
          700: '#0f7391',
        },
        // Fundo do conteúdo
        canvas: '#f4f6f9',
        // Borda superior do card de destaque (card da VP)
        highlight: '#ec4899',
      },
    },
  },
  plugins: [],
}
