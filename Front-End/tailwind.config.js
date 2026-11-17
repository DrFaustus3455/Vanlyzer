export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b10", panel: "#13131a", panel2: "#191922", line: "#26262f",
        brand: { DEFAULT: "#ff4655", dark: "#c92f3f" },
        teal: { vi: "#2dd4bf" }, violet: { vi: "#a855f7" }, blue: { vi: "#3b82f6" }, green: { vi: "#22c55e" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
