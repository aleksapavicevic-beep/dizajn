// jest.config.js
// Jest test konfiguracija

module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(expo|expo-font|expo-linear-gradient|react-native|@react-native|react-navigation|@react-navigation)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
