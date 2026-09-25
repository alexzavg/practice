/**
 * Хуки beforeAll / afterAll (Jest).
 *
 * - beforeAll выполняется один раз до всех тестов блока,
 *   afterAll — один раз после всех.
 * - Для дорогих операций: поднять сервер, открыть соединение с базой,
 *   запустить браузер.
 * - Состояние общее для всех тестов блока, поэтому один тест может испортить
 *   данные другому. Всё изменяемое лучше держать в beforeEach.
 * - Асинхронный хук: верните промис или сделайте функцию async — Jest дождётся.
 * - afterAll выполняется, даже если тесты упали, поэтому там закрывают ресурсы.
 *
 * Запуск: npx jest "2. Core testing fundamentals/jest/4_before-all-after-all.test.js"
 */

const order = [];
let connection;

async function connect() {
  return {
    status: 'open',
    close: () => 'closed',
  };
}

describe('Соединение с базой', () => {
  beforeAll(async () => {
    order.push('beforeAll');
    connection = await connect(); // дорогая операция — один раз на все тесты
  });

  afterAll(() => {
    order.push('afterAll');
    connection.close();
  });

  beforeEach(() => {
    order.push('beforeEach');
  });

  it('соединение открыто', () => {
    order.push('тест 1');
    expect(connection.status).toBe('open');
  });

  it('то же соединение переиспользуется', () => {
    order.push('тест 2');
    expect(connection.status).toBe('open');
  });

  it('порядок вызова хуков', () => {
    expect(order).toEqual([
      'beforeAll',
      'beforeEach',
      'тест 1',
      'beforeEach',
      'тест 2',
      'beforeEach',
    ]);
  });
});
