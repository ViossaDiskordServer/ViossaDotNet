import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

export default ts.config(
    { ignores: ['dist'] },
    {
        extends: [
            js.configs.recommended,
            ...ts.configs.recommendedTypeChecked,
            ...vue.configs.recommendedTypeChecked,
        ],
        files: ['**/*.{js,ts,vue}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
)
