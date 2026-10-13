import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

export default defineConfigWithVueTs(
    {
        name: 'app/ignores',
        ignores: ['bootstrap/**', 'coverage/**', 'node_modules/**', 'public/**', 'storage/**', 'vendor/**'],
    },
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommendedTypeChecked,
    {
        name: 'app/rules',
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/block-lang': ['error', { script: { lang: 'ts' } }],
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/define-macros-order': 'error',
            'vue/no-unused-refs': 'error',
            'vue/require-explicit-slots': 'error',
            // Optional props are typed as `T | undefined` and destructured with defaults where needed.
            'vue/require-default-prop': 'off',
        },
    },
    {
        name: 'app/tests',
        files: ['**/*.test.ts'],
        rules: {
            // `expect(api.method).toHaveBeenCalled()` passes mocked methods around unbound by design.
            '@typescript-eslint/unbound-method': 'off',
        },
    },
    skipFormatting,
);
