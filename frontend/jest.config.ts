import nextJest from "next/jest.js"

const createJestConfig = nextJest({ dir: "./" })

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  testEnvironment: "jsdom"
}

export default createJestConfig(customJestConfig)
