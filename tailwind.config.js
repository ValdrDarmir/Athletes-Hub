/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [{
            mytheme: {
                "primary": "#77eac8",
                "secondary": "#fcc48f",
                "accent": "#83cad1",
                "neutral": "#252334",
                "base-100": "#e5e5e6",
                "info": "#889fd7",
                "success": "#69e2ca",
                "warning": "#91720d",
                "error": "#dd274e",
            }
        }],
    }
}

