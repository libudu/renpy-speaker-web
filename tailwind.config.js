module.exports = {
    // mode: 'jit',
    // jit document: https://tailwindcss.com/docs/just-in-time-mode
    purge: {
      enabled: process.env.NODE_ENV !== 'development',
      content: [
        './src/**/*.html',
        './src/**/*.ejs',
        './src/**/*.tsx',
        './src/**/*.ts',
        './src/**/*.js',
      ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {},
    variants: {
      extend: {},
    },
    important: true,
    plugins: [],
};
