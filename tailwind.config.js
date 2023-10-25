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
                "primary": "#D46348",
                "secondary": "#EDFFAB",
                "accent": "#83cad1",
                "base-100": "#313638",
                "base-content": "#E8E9EB",
                "neutral": "#E8E9EB",
                "neutral-content": "#101820",
            }
        }],
    }
}

