/**
 * ООП в JavaScript — тезисно с примерами.
 *
 * Базовые четыре принципа: инкапсуляция (2), наследование (3),
 * полиморфизм (4), абстракция (5).
 * Остальное — инструменты языка для их реализации.
 *
 * Запуск: node "1. JS fundamentals/5_oop.js"
 */

// ---------------------------------------------------------------------------
// 1. Класс и объект
// ---------------------------------------------------------------------------
// Класс описывает шаблон, `new` создаёт экземпляр.

class User {
  constructor(name) {
    this.name = name;
  }
  hi() {
    return `Привет, ${this.name}`;
  }
}

function classAndObjectDemo() {
  const u = new User('Анна');
  console.log(u.hi()); // "Привет, Анна"
}

// ---------------------------------------------------------------------------
// 2. Инкапсуляция
// ---------------------------------------------------------------------------
// Приватные поля через `#` недоступны снаружи.

class Account {
  #balance = 0;
  deposit(sum) {
    this.#balance += sum;
  }
  get balance() {
    return this.#balance;
  }
}

function encapsulationDemo() {
  const a = new Account();
  a.deposit(100);
  console.log('balance:', a.balance); // 100
  // a.#balance -> SyntaxError: обращение к приватному полю снаружи класса
  // не компилируется, поэтому строку нельзя даже оставить в коде.
  console.log('ключи объекта:', Object.keys(a)); // [] — приватное поле не видно
}

// ---------------------------------------------------------------------------
// 3. Наследование
// ---------------------------------------------------------------------------
// `extends` наследует класс, `super` вызывает родителя.

class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}

function inheritanceDemo() {
  console.log(new Dog('Рекс', 'овчарка').name); // "Рекс"
}

// ---------------------------------------------------------------------------
// 4. Полиморфизм
// ---------------------------------------------------------------------------
// Один метод, разное поведение в наследниках.

class Shape {
  area() {
    return 0;
  }
}

class Circle extends Shape {
  constructor(r) {
    super();
    this.r = r;
  }
  area() {
    return Math.PI * this.r ** 2;
  }
}

class Square extends Shape {
  constructor(a) {
    super();
    this.a = a;
  }
  area() {
    return this.a ** 2;
  }
}

function polymorphismDemo() {
  console.log([new Circle(1), new Square(2)].map((s) => s.area())); // [3.14..., 4]
}

// ---------------------------------------------------------------------------
// 5. Абстракция
// ---------------------------------------------------------------------------
// Нативных абстрактных классов нет. Имитируется через проверку `new.target`
// и ошибку в методе.

class Repo {
  constructor() {
    if (new.target === Repo) throw new Error('Абстрактный класс');
  }
  save() {
    throw new Error('Реализуй save()');
  }
}

class UserRepo extends Repo {
  save(u) {
    console.log('Сохранён', u);
  }
}

function abstractionDemo() {
  try {
    new Repo(); // прямое создание запрещено
  } catch (err) {
    console.log('new Repo():', err.message); // Абстрактный класс
  }

  new UserRepo().save({
    name: 'Анна',
  }); // Сохранён { name: 'Анна' }

  // Наследник без реализации save() упадёт на вызове метода.
  class EmptyRepo extends Repo {}
  try {
    new EmptyRepo().save();
  } catch (err) {
    console.log('EmptyRepo.save():', err.message); // Реализуй save()
  }
}

// ---------------------------------------------------------------------------
// 6. Геттеры и сеттеры
// ---------------------------------------------------------------------------
// Контроль чтения и записи свойства.

class Temp {
  #c = 0;
  get f() {
    return (this.#c * 9) / 5 + 32;
  }
  set f(v) {
    this.#c = ((v - 32) * 5) / 9;
  }
}

function accessorsDemo() {
  const t = new Temp();
  t.f = 212;
  console.log('f:', t.f); // 212
}

// ---------------------------------------------------------------------------
// 7. Статические члены
// ---------------------------------------------------------------------------
// Принадлежат классу, а не экземпляру.

class MathUtil {
  static PI2 = Math.PI * 2;
  static sum(a, b) {
    return a + b;
  }
}

function staticDemo() {
  console.log('MathUtil.sum(2, 3):', MathUtil.sum(2, 3)); // 5
  console.log('MathUtil.PI2:', MathUtil.PI2);
}

// ---------------------------------------------------------------------------
// 8. Прототипы
// ---------------------------------------------------------------------------
// Под капотом классы работают через прототипную цепочку.

function Car(model) {
  this.model = model;
}
Car.prototype.drive = function () {
  return `${this.model} едет`;
};

function prototypesDemo() {
  const c = new Car('BMW');
  console.log(c.drive()); // "BMW едет"
  console.log(Object.getPrototypeOf(c) === Car.prototype); // true
}

// ---------------------------------------------------------------------------
// 9. Композиция вместо наследования
// ---------------------------------------------------------------------------
// Собираем объект из поведений.

const canFly = (o) => ({
  ...o,
  fly: () => `${o.name} летит`,
});
const canSwim = (o) => ({
  ...o,
  swim: () => `${o.name} плывёт`,
});

function compositionDemo() {
  const duck = canSwim(
    canFly({
      name: 'Утка',
    }),
  );
  console.log(duck.fly()); // "Утка летит"
  console.log(duck.swim()); // "Утка плывёт"
}

// ---------------------------------------------------------------------------
// 10. Миксины
// ---------------------------------------------------------------------------
// Добавление методов в класс без глубокого наследования.

// ВНИМАНИЕ: метод назван `toJSON` — его автоматически вызывает сам
// JSON.stringify. Если внутри написать `JSON.stringify(this)`, получится
// бесконечная рекурсия и RangeError: Maximum call stack size exceeded.
// Поэтому сериализуем обычную копию полей: `{ ...this }`.
const Serializable = (Base) =>
  class extends Base {
    toJSON() {
      return JSON.stringify({
        ...this,
      });
    }
  };

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class SPoint extends Serializable(Point) {}

function mixinsDemo() {
  console.log(new SPoint(1, 2).toJSON()); // '{"x":1,"y":2}'
}

// ---------------------------------------------------------------------------

function main() {
  const sections = [
    ['1. Класс и объект', classAndObjectDemo],
    ['2. Инкапсуляция', encapsulationDemo],
    ['3. Наследование', inheritanceDemo],
    ['4. Полиморфизм', polymorphismDemo],
    ['5. Абстракция', abstractionDemo],
    ['6. Геттеры и сеттеры', accessorsDemo],
    ['7. Статические члены', staticDemo],
    ['8. Прототипы', prototypesDemo],
    ['9. Композиция вместо наследования', compositionDemo],
    ['10. Миксины', mixinsDemo],
  ];

  for (const [title, demo] of sections) {
    console.log(`\n=== ${title} ===`);
    demo();
  }
}

main();
