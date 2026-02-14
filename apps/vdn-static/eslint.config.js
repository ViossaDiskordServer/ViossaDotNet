import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";
import { defineConfig, globalIgnores } from "eslint/config";
import vueParser from "vue-eslint-parser";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		extends: [
			js.configs.recommended,
			ts.configs.strictTypeChecked,
			...vue.configs["flat/essential"],
		],
		files: ["./src/**/*.{js,ts,vue}"],
		plugins: { vue },
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.browser,
			parser: vueParser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				parser: ts.parser,
				extraFileExtensions: [".vue"],
			},
		},
		rules: {
			"vue/no-restricted-html-elements": [
				"error",
				{
					element: ["a", "RouterLink"],
					message: "Use <SmartLink> instead",
				},
			],
			// allow interfaces to only extend another interface without adding properties
			// good for aliasing more complex types
			"@typescript-eslint/no-empty-object-type": [
				"error",
				{ allowInterfaces: "with-single-extends" },
			],
		},
	},
	// disable multi-word-component-names for unplugin-vue-router
	{
		files: ["src/pages/**/*.vue"],
		rules: { "vue/multi-word-component-names": "off" },
	},
]);
