import nextJest from 'next/jest.js';

// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  // testEnvironment: 'jsdom',
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/playwright/'],
};

export default createJestConfig(config);
