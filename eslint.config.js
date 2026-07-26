import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.js", "tests/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                describe: "readonly",
                it: "readonly",
                expect: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "off",
            "no-useless-assignment": "off",
            "no-undef": "error"
        }
    }
];
