/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // ← вот он, настоящий Tailwind плагин
    autoprefixer: {},
  },
};

export default config;
