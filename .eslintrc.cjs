module.exports = {
  env: { browser: true, es2021: true },
  extends: ["plugin:react/recommended", "plugin:prettier/recommended"],
  plugins: ["react", "prettier"],
  rules: {
    "react/prop-types": "off",
    "prettier/prettier": "error",
  },
};