import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        Babel: false,
      },
    },
    rules: {
      semi: "error",
      "no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
  { ignores: ["dist"] },
];