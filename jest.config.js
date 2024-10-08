module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // ищем только файлы с тестами
    transform: {
      '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }] // используем конфигурацию для тестов
    }
  };