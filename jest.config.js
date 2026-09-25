/**
 * Jest забирает только свою папку, иначе он попытается запустить
 * ещё и спеки Mocha и Jasmine, у которых другой набор глобальных функций.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/2. Core testing fundamentals/jest/**/*.test.js'],
  // Покрытие считается по исходному коду, а не по тестам.
  collectCoverageFrom: ['2. Core testing fundamentals/src/**/*.js'],
};
