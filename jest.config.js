module.exports = {
    preset: 'ts-jest',                  // Use ts-jest to handle TypeScript files
    testEnvironment: 'jsdom',            // Use jsdom to simulate a browser environment
    transform: {
      '^.+\\.tsx?$': 'ts-jest',         // Transform TypeScript files using ts-jest
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // For adding custom matchers to Jest
  };
  