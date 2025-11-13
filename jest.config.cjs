/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.(css|scss|sass|less)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: false }], // ❌ quita useESM:true
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      isolatedModules: true, // ⚙ ayuda a que los tests cierren correctamente
    },
  },
  verbose: true,
  forceExit: true, // ✅ fuerza salida limpia en GitHub Actions
  detectOpenHandles: true, // 🔍 detecta procesos abiertos
};