const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper({
      "@/*": ["./*"]
    }, {
      prefix: '<rootDir>/',
    }),
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!app/Hero.tsx',
    '!app/layout.tsx',
    '!app/page.tsx',
    '!app/**/page.tsx',
    '!app/volunteer/components/Layout.tsx',
    '!app/profile/actions.ts',
  ],
  coverageDirectory: 'coverage',
};
