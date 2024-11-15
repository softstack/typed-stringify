import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{ files: ['**/*.{cjs,js,mjs,ts}'] },
	{ ignores: ['**/dist/**'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.strict,
	eslintPluginUnicorn.configs['flat/recommended'],
	{
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'error',
			'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
			'unicorn/no-useless-undefined': 'off',
			'unicorn/prefer-ternary': 'off',
			'unicorn/prevent-abbreviations': [
				'error',
				{
					replacements: { obj: false, tmp: false },
				},
			],
		},
	},
	eslintConfigPrettier,
];
