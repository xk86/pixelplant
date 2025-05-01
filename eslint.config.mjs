// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
  react.configs.flat.recommended, // React recommended rules
  react.configs.flat["jsx-runtime"], // Add this if using React 17+ or the new JSX transform
  {
    // React Hooks rules
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
    },
  },
];
