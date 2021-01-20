module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['./jest/setup.ts'],
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(jsx?|tsx?)$',
    moduleNameMapper: {
        '\\.(css|jpg|png|svg|less)$': '<rootDir>/node_modules/jest-css-modules',
        'nav-(.*)-style': '<rootDir>/node_modules/jest-css-modules',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['node_modules/(?!(nav-frontend-spinner-style)/)'],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
            babelConfig: {
                plugins: ['@babel/plugin-proposal-object-rest-spread'],
                presets: ['@babel/preset-env', '@babel/preset-react'],
                env: {
                    test: {
                        plugins: ['@babel/plugin-transform-modules-commonjs'],
                    },
                },
            },
        },
    },
    rootDir: '../',
    modulePathIgnorePatterns: ['./cypress'],
};
