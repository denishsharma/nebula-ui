import antfu from "@antfu/eslint-config";
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt(
    {
        features: {
            tooling: true,
            standalone: false,
        },
    },
).append(
    antfu({
        formatters: true,
        vue: true,
        yaml: false,
        markdown: false,
        stylistic: {
            indent: 4,
            semi: true,
            quotes: "double",
            overrides: {
                "style/array-bracket-newline": ["error", { multiline: true }],
                "style/function-call-argument-newline": ["error", "consistent"],
                "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
                "style/max-statements-per-line": ["error", { max: 2 }],
            },
        },
        rules: {
            "antfu/if-newline": "off",

            "no-console": ["warn", { allow: ["warn", "error", "trace"] }],
            "no-debugger": "warn",

            "vue/max-attributes-per-line": [
                "error",
                {
                    singleline: 3,
                    multiline: {
                        max: 1,
                    },
                },
            ],
        },
    }),
);
