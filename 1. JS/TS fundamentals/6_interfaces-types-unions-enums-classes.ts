/**
 * TypeScript: interfaces, type aliases, unions/intersections, literal types,
 * enums, classes, access modifiers — тезисно с примерами.
 *
 * Запуск: npx tsx "2. TS fundamentals/0_interfaces-types-unions-enums-classes.ts"
 * Проверка типов: npx tsc --noEmit --strict "2. TS fundamentals/0_interfaces-types-unions-enums-classes.ts"
 */

// ---------------------------------------------------------------------------
// 1. Interfaces
// ---------------------------------------------------------------------------
// - Описывают форму объекта: какие поля и методы у него есть.
// - Расширяются через `extends`, можно наследовать сразу несколько.
// - Поддерживают declaration merging: два одноимённых интерфейса сливаются
//   в один (у type alias так нельзя).
// - `?` делает поле необязательным, `readonly` запрещает перезапись.
// - Существуют только на этапе компиляции, в рантайме их нет.

interface Person {
  readonly id: number;
  name: string;
  age?: number; // необязательное поле
}

interface Employee extends Person {
  salary: number;
}

function interfacesDemo(): void {
  const worker: Employee = {
    id: 1,
    name: 'Анна',
    salary: 1000,
  };
  console.log(worker); // { id: 1, name: 'Анна', salary: 1000 }
  // worker.id = 2; -> Error: Cannot assign to 'id' because it is a read-only property
}

// ---------------------------------------------------------------------------
// 2. Type aliases
// ---------------------------------------------------------------------------
// - Дают имя любому типу: объекту, примитиву, union, функции, кортежу.
// - Не мержатся: повторное объявление того же имени — ошибка.
// - Комбинируются через `&` вместо `extends`.
// - Правило выбора: интерфейс — для формы объекта и публичного API,
//   type — для union, кортежей и вычисляемых типов.

type ID = string | number; // union внутри алиаса
type Point = {
  x: number;
  y: number;
};
type Handler = (event: string) => void;
type Pair = [string, number]; // кортеж

function typeAliasesDemo(): void {
  const id: ID = 'a-1';
  const point: Point = {
    x: 1,
    y: 2,
  };
  const log: Handler = (e) => console.log('event:', e);
  const pair: Pair = ['возраст', 28];

  console.log(id, point, pair);
  log('click');
}

// ---------------------------------------------------------------------------
// 3. Unions (|)
// ---------------------------------------------------------------------------
// - «Или одно, или другое»: значение одного из перечисленных типов.
// - До сужения доступны только общие для всех членов поля и методы.
// - Сужаются через `typeof`, `in`, `instanceof`, проверку поля-дискриминанта.
// - Discriminated union — union объектов с общим литеральным полем-тегом.

type Result =
  | {
      status: 'ok';
      data: string;
    }
  | {
      status: 'error';
      message: string;
    };

function render(result: Result): string {
  // сужение по полю-дискриминанту status
  switch (result.status) {
    case 'ok':
      return `Данные: ${result.data}`;
    case 'error':
      return `Ошибка: ${result.message}`;
  }
}

function unionsDemo(): void {
  console.log(
    render({
      status: 'ok',
      data: 'ответ сервера',
    }),
  );
  console.log(
    render({
      status: 'error',
      message: 'HTTP 500',
    }),
  );
}

// ---------------------------------------------------------------------------
// 4. Intersections (&)
// ---------------------------------------------------------------------------
// - «И то, и другое одновременно»: объединяет требования всех типов.
// - Удобно для миксинов и для добавления полей к существующему типу.
// - Конфликт примитивных полей даёт `never` — такой объект создать нельзя.

type Timestamps = {
  createdAt: Date;
};
type Named = {
  name: string;
};
type Entity = Named & Timestamps; // нужны оба поля

function intersectionsDemo(): void {
  const entity: Entity = {
    name: 'Отчёт',
    createdAt: new Date('2026-01-01'),
  };
  console.log(entity.name, entity.createdAt.getFullYear()); // Отчёт 2026
  // const bad: Entity = { name: 'X' }; -> Error: missing property 'createdAt'
}

// ---------------------------------------------------------------------------
// 5. Literal types
// ---------------------------------------------------------------------------
// - Тип, состоящий из одного конкретного значения: 'GET', 42, true.
// - Сами по себе почти бесполезны, сила — в union литералов вместо enum.
// - `const` выводит литеральный тип, `let` расширяет его до string/number.
// - `as const` замораживает объект или массив и сохраняет литералы.

type Method = 'GET' | 'POST' | 'DELETE';

function request(method: Method, url: string): string {
  return `${method} ${url}`;
}

function literalTypesDemo(): void {
  console.log(request('GET', '/api/users')); // GET /api/users
  // request('PUT', '/api/users'); -> Error: 'PUT' is not assignable to 'Method'

  const config = {
    retries: 3,
    mode: 'fast',
  } as const;
  console.log(config.mode); // тип 'fast', не string
  // config.retries = 5; -> Error: Cannot assign to 'retries' (read-only)
}

// ---------------------------------------------------------------------------
// 6. Enums
// ---------------------------------------------------------------------------
// - Именованный набор констант. Единственная конструкция TS, которая
//   существует в рантайме (компилируется в объект).
// - Числовые enum поддерживают обратный маппинг: Status[0] === 'Active'.
// - Строковые enum читабельнее в логах и не имеют обратного маппинга.
// - `const enum` инлайнится компилятором, но ломает isolatedModules.
// - Современная альтернатива — union литералов или объект `as const`.

enum Status {
  Active, // 0
  Blocked, // 1
}

enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

function enumsDemo(): void {
  console.log(Status.Active, Status[0]); // 0 'Active' — обратный маппинг
  console.log(Role.Admin); // 'ADMIN'
  console.log(Object.values(Role)); // [ 'ADMIN', 'USER' ] — enum есть в рантайме
}

// ---------------------------------------------------------------------------
// 7. Classes
// ---------------------------------------------------------------------------
// - Классы JS плюс типы полей, `implements`, абстрактные классы, дженерики.
// - `implements` проверяет, что класс соответствует интерфейсу
//   (в отличие от `extends`, ничего не наследует).
// - `abstract` запрещает создание экземпляра и требует реализовать методы.
// - Параметрические свойства (`constructor(private x: number)`) объявляют
//   и присваивают поле одной строкой.

interface Movable {
  move(distance: number): string;
}

abstract class Vehicle implements Movable {
  constructor(protected readonly model: string) {}

  abstract move(distance: number): string; // обязан реализовать наследник

  describe(): string {
    return `Транспорт: ${this.model}`;
  }
}

class Car extends Vehicle {
  move(distance: number): string {
    return `${this.model} проехал ${distance} км`;
  }
}

function classesDemo(): void {
  const car = new Car('BMW');
  console.log(car.describe()); // Транспорт: BMW
  console.log(car.move(120)); // BMW проехал 120 км
  // new Vehicle('X'); -> Error: Cannot create an instance of an abstract class
}

// ---------------------------------------------------------------------------
// 8. Access modifiers
// ---------------------------------------------------------------------------
// - `public` (по умолчанию) — доступно везде.
// - `private` — только внутри класса; проверка на этапе компиляции,
//   в рантайме поле видно.
// - `protected` — внутри класса и его наследников.
// - `readonly` — присвоить можно только в объявлении или конструкторе.
// - `#field` — настоящее приватное поле уровня JS, недоступно и в рантайме.
// - `static` — принадлежит классу, а не экземпляру.

class Account {
  static bank = 'Каспи'; // static: принадлежит классу
  public owner: string; // доступно везде
  protected currency = 'KZT'; // доступно наследникам
  private pin: string; // только внутри Account
  #secret = 'настоящий приват'; // приват уровня рантайма
  readonly openedAt = new Date('2026-01-01');

  constructor(owner: string, pin: string) {
    this.owner = owner;
    this.pin = pin;
  }

  checkPin(input: string): boolean {
    return this.pin === input; // приватное поле доступно внутри класса
  }

  reveal(): string {
    return this.#secret;
  }
}

class SavingsAccount extends Account {
  info(): string {
    return `${this.owner}, валюта ${this.currency}`; // protected — можно
    // this.pin -> Error: Property 'pin' is private and only accessible within class 'Account'
  }
}

function accessModifiersDemo(): void {
  const account = new SavingsAccount('Анна', '1234');
  console.log(account.info()); // Анна, валюта KZT
  console.log(account.checkPin('1234')); // true
  console.log(account.reveal()); // настоящий приват
  console.log(Account.bank); // Каспи

  // account.pin -> ошибка компиляции, но в рантайме поле существует:
  console.log('private в рантайме:', Object.keys(account)); // pin виден
  // #secret не виден даже в рантайме — его нет в Object.keys
}

// ---------------------------------------------------------------------------

function main(): void {
  const sections: [string, () => void][] = [
    ['1. Interfaces', interfacesDemo],
    ['2. Type aliases', typeAliasesDemo],
    ['3. Unions', unionsDemo],
    ['4. Intersections', intersectionsDemo],
    ['5. Literal types', literalTypesDemo],
    ['6. Enums', enumsDemo],
    ['7. Classes', classesDemo],
    ['8. Access modifiers', accessModifiersDemo],
  ];

  for (const [title, demo] of sections) {
    console.log(`\n=== ${title} ===`);
    demo();
  }
}

main();

// Делает файл модулем: без import/export TypeScript считает файл глобальным
// скриптом, и имена (Point, Account, Car, main) конфликтуют с такими же
// именами из соседних файлов.
export {};
