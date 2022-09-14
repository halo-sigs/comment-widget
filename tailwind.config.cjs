/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-themer")({
      defaultTheme: {
        extend: {},
      },
      themes: [
        {
          name: "theme-dark",
          extend: {},
        },
      ],
    }),
  ],
};
