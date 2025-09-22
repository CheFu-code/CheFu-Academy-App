module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'import',
        'react',
        'react-native',
        'unused-imports',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'plugin:prettier/recommended',
    ],
    rules: {
        // remove unused vars / imports
        'unused-imports/no-unused-imports': 'error', // removes unused imports
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        'react/prop-types': 'off',
        'react-native/no-unused-styles': 'warn',
        'prettier/prettier': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
