module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
  },
};
