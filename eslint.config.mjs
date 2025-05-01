// @ts-check
import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  eslint.configs.recommended,
  tseslint.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.recommended,
];
