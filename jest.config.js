module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  testMatch: ["**/*.spec.ts"]
};