/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem"
      },
      zIndex: {
        dropdown: "1000",
        docked: "1010",
        navbar: "1020",
        modal: "1030"
      }
    }
  },
  plugins: [
    ({ addBase, theme }) => {
      const extractColorVars = (colorObj, colorGroup = "") =>
        Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey]
          const cssVariable =
            colorKey === "DEFAULT" ? `--color${colorGroup}` : `--color${colorGroup}-${colorKey}`

          const newVars =
            typeof value === "string"
              ? { [cssVariable]: value }
              : extractColorVars(value, `-${colorKey}`)

          return { ...vars, ...newVars }
        }, {})

      addBase({
        ":root": extractColorVars(theme("colors"))
      })
    }
  ]
}
