"use strict";

module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:markdown/recommended"],
  overrides: [
    {
      files: [".eslintrc.js"],
      env: {
        node: true,
      },
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
