/**
 * Хуки в Jasmine: beforeEach / afterEach / beforeAll / afterAll.
 *
 * - Имена совпадают с Jest: beforeAll и afterAll на весь блок,
 *   beforeEach и afterEach на каждый тест.
 * - beforeAll выполняется один раз на describe, а не один раз на файл.
 * - Переменные объявляют в describe, а значения присваивают в beforeEach —
 *   иначе состояние протечёт между тестами.
 * - Асинхронный хук: async-функция, промис или колбэк done.
 * - Таймаут по умолчанию 5000 мс, меняется через jasmine.DEFAULT_TIMEOUT_INTERVAL.
 *
 * Запуск: npx jasmine --config="2. Core testing fundamentals/jasmine/jasmine.json" --filter="Корзина"
 */

class Cart {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
}

describe('Корзина', () => {
  const order = [];
  let cart;

  beforeAll(() => {
    order.push('beforeAll');
  });

  beforeEach(() => {
    order.push('beforeEach');
    cart = new Cart();
  });

  afterEach(() => {
    order.push('afterEach');
  });

  afterAll(() => {
    order.push('afterAll');
  });

  it('пустая после создания', () => {
    expect(cart.items.length).toBe(0);
  });

  it('хранит добавленный товар', () => {
    cart.add('кофе');
    expect(cart.items).toEqual(['кофе']);
  });

  it('порядок хуков на этот момент', () => {
    expect(order).toEqual([
      'beforeAll',
      'beforeEach',
      'afterEach',
      'beforeEach',
      'afterEach',
      'beforeEach',
    ]);
  });
});
