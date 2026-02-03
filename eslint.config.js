import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
    ...eslintPluginAstro.configs.recommended,
    {
        files: ["**/*.astro"],
        languageOptions: {
            parser: eslintPluginAstro.parser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".astro"],
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
        },
    },
    {
        ignores: ["dist/", ".astro/", "node_modules/"]
    }
];
