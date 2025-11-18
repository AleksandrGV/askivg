module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    rules: {
        // Ошибки
        'no-unused-vars': 'error',
        'no-undef': 'error',
        'no-dupe-keys': 'error',
        'no-dupe-args': 'error',
        'no-unreachable': 'error',
        
        // Предупреждения
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        
        // Стиль кода
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'indent': ['error', 4],
        'comma-dangle': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        
        // Лучшие практики
        'eqeqeq': 'error',
        'curly': 'error',
        'no-var': 'error',
        'prefer-const': 'error'
    },
    globals: {
        // Глобальные переменные библиотек
        'AOS': 'readonly',
        'Swiper': 'readonly',
        
        // Глобальные функции проекта
        'openProjectModal': 'readonly',
        'closeProjectModal': 'readonly',
        
        // Стандартные браузерные API
        'window': 'readonly',
        'document': 'readonly',
        'console': 'readonly',
        'setTimeout': 'readonly',
        'clearTimeout': 'readonly',
        'setInterval': 'readonly',
        'clearInterval': 'readonly',
        'fetch': 'readonly',
        'FormData': 'readonly',
        'URLSearchParams': 'readonly'
    },
    overrides: [
        {
            // Файлы конфигурации могут использовать module.exports
            files: ['webpack.config.js', '.eslintrc.js'],
            env: {
                node: true
            },
            rules: {
                'no-undef': 'off'
            }
        },
        {
            // PHP файлы не проверяем
            files: ['**/*.php'],
            rules: {
                'no-undef': 'off'
            }
        }
    ]
};