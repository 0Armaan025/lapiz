import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {

      "functional/no-impure-functions": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
