/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      mono: ['"JetBrains Mono"', "monospace"],
    },
    extend: {
      colors: {
        // backgrounds
        bg: "#1c1818",
        bg2: "#231f1f",
        bg3: "#282525",
        bg4: "#333131",
        bg5: "#2E2B2B",
        bg6: "#373737",

        // text
        primary: "#f5f5f0",
        secondary: "#1C1818",
        ternary: "rgba(245, 245, 240, 0.6)",

        // state
        selected: "rgba(245, 245, 240, 0.08)",
        disabled: "rgba(245, 245, 240, 0.06)",
        hovered: "rgba(245, 245, 240, 0.04)",
      },
    },
  },
  plugins: [],
};
