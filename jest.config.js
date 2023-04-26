// jest.config.js

// Configuration file for Jest testing framework

module.exports = {
    // Use the default React preset for Jest
    preset: 'react-app',
    // Set up test environment file
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    // Add coverage reporters to generate coverage report
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    // Ignore node_modules directory when running tests
    testPathIgnorePatterns: ['/node_modules/'],
    // Ignore node_modules directory when calculating coverage
    coveragePathIgnorePatterns: ['/node_modules/'],
    // Map CSS modules to a mock object
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    // Set coverage thresholds for overall project
    coverageThreshold: {
      global: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
  };
  