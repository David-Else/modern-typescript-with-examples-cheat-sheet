- [**Modern Typescript with Examples Cheat Sheet**](#modern-typescript-with-examples-cheat-sheet)
- [Typing Objects](#typing-objects)
  - [`Object` Versus `object`](#object-versus-object)
  - [Interface Signatures Overview](#interface-signatures-overview)
    - [Index Signature](#index-signature)
    - [Call Signature](#call-signature)
    - [Construct Signature](#construct-signature)
  - [Type Literal Syntax](#type-literal-syntax)
  - [Excess Properties (⛔ Inconsistency)](#excess-properties-inconsistency)
- [Mapped Types - Getting Types from Data](#mapped-types---getting-types-from-data)
  - [`typeof` / `keyof` Examples](#typeof-keyof-examples)
  - [`keyof` with Generics and Interfaces Example](#keyof-with-generics-and-interfaces-example)
- [Immutability](#immutability)
  - [`readonly` Array / Tuple](#readonly-array-tuple)
  - [`readonly` Properties](#readonly-properties)
  - [`readonly` Class Properties](#readonly-class-properties)
  - [`const` Assertions](#const-assertions)
- [Strict Mode](#strict-mode)
  - [Non-Nullable Types](#non-nullable-types)
  - [Strict Class Property Initialization](#strict-class-property-initialization)
- [Types](#types)
  - [`unknown`](#unknown)
    - [Reading `JSON` from `localStorage` using `unknown` Example](#reading-json-from-localstorage-using-unknown-example)
  - [`never`](#never)
- [Generics](#generics)
  - [With and Without Type Argument Inference](#with-and-without-type-argument-inference)
  - [Using More Than One Type Argument](#using-more-than-one-type-argument)
  - [Higher Order Function with `Parameters<T>` and `ReturnType<T>`](#higher-order-function-with-parameterst-and-returntypet)
- [Discriminated Unions](#discriminated-unions)
  - [Exhaustive Pattern Matching Using `never`](#exhaustive-pattern-matching-using-never)
- [Optional Chaining](#optional-chaining)
  - [`?.` returns `undefined` when hitting a `null` or `undefined`](#returns-undefined-when-hitting-a-null-or-undefined)
- [Nullish Coalescing](#nullish-coalescing)
  - [`??` “fall Backs” to a Default Value When Dealing with `null` or `undefined`](#fall-backs-to-a-default-value-when-dealing-with-null-or-undefined)
- [Assertion Functions](#assertion-functions)
  - [A Standard JavaScript `Assert()` Doesn’t Work for Type Checking](#a-standard-javascript-assert-doesnt-work-for-type-checking)
  - [Using `if` and `typeof` Everywhere is Bloat](#using-if-and-typeof-everywhere-is-bloat)
  - [Assertion Function Style 1 - Check for a Condition](#assertion-function-style-1---check-for-a-condition)
  - [Assertion Function Style 2 - Tell Typescript That a Specific Variable or Property Has a Different Type](#assertion-function-style-2---tell-typescript-that-a-specific-variable-or-property-has-a-different-type)

# **Modern Typescript with Examples Cheat Sheet**

# Typing Objects

## `Object` Versus `object`

`Object` is the type of all instances of class `Object`.

- It describes functionality that is common to all JavaScript objects
- It includes primitive values

<!-- end list -->

```ts
const obj1 = {};
obj1 instanceof Object; // true
obj1.toString === Object.prototype.toString; // true

function fn(x: Object) {}
fn("foo"); // OK
```

`object` is the type of all non-primitive values.

```ts
function fn(x: object) {}
fn("foo"); // Error: "foo" is a primitive
```

## Interface Signatures Overview

```ts
interface ExampleInterface {
  myProperty: boolean; // Property signature
  myMethod(x: string): void; // Method signature, ⛔ param names for documentation only
  [prop: string]: any; // Index signature
  (x: number): string; // Call signature
  new (x: string): ExampleInstance; // Construct signature

  readonly modifierOne: string; // readonly modifier
  modifierTwo?: string; // optional modifier
}
```

### Index Signature

Helps to describe Arrays or objects that are used as dictionaries.

- If there are both an index signature and property and/or method signatures in
  an interface, then the type of the index property value must also be a
  supertype of the type of the property value and/or method

<!-- end list -->

```ts
interface I1 {
  [key: string]: boolean;

  //@ts-ignore: Property 'myProp' of type 'number' is not assignable to string index type 'boolean'.(2411)
  myProp: number;

  //@ts-ignore: Property 'myMethod' of type '() => string' is not assignable to string index type 'boolean'.(2411)
  myMethod(): string;
}

interface I2 {
  [key: string]: number;
  myProp: number; // NO errors
}
```

### Call Signature

Enables interfaces to describe functions, `this` is the optional calling context
of the function in this example:

```ts
interface ClickListener {
  (this: Window, e: MouseEvent): void;
}

const myListener: ClickListener = e => {
  console.log("mouse clicked!", e);
};

addEventListener("click", myListener);
```

### Construct Signature

Enables describing classes and constructor functions.

```ts
interface ExampleInterface {
  new (x: string): ExampleInstance;
}
```

A class has two types:

- The type of the static side
- The type of the instance side

The constructor sits in the static side, when a class implements an interface,
only the instance side of the class is checked.

```ts
interface ClockInterface {
  tick(): void;
}
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

// Using Class Expression
const ClockA: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {}
};

let clockClassExpression = new ClockA(18, 11);

// Using Class Declaration with a Constructor Function
class ClockB implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {}
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

let clockClassDeclaration = createClock(ClockB, 12, 17);
```

## Type Literal Syntax

Typically used in the signature of a higher-order function.

```ts
type MyFunctionType = (name: string) => number;
```

<div style="page-break-after: always;">

</div>

## Excess Properties (⛔ Inconsistency)

- Engineers **can’t** just think of interfaces as “objects that have exactly a
  set of properties” or “objects that have at least a set of properties”.
  In-line object arguments receive an additional level of validation that
  doesn’t apply when they’re passed as variables.

- TypeScript is a **structurally** typed language. To create a `Dog` you don’t
  need to explicitly extend the `Dog` interface, any object with a `breed`
  property that is of type `string` can be used as a `Dog`:

<!-- end list -->

```ts
interface Dog {
  breed: string;
}

function printDog(dog: Dog) {
  console.log("Dog: " + dog.breed);
}

const ginger = {
  breed: "Airedale",
  age: 3
};

printDog(ginger); // excess properties are OK!

printDog({
  breed: "Airedale",
  age: 3
});
// excess properties are NOT OK!! Argument of type '{ breed: string; age: number; }' is not assignable..
```

# Mapped Types - Getting Types from Data

## `typeof` / `keyof` Examples

```ts
const data = {
  value: 123,
  text: "text",
  subData: {
    value: false
  }
};
type Data = typeof data;
// type Data = {
// value: number;
// text: string;
// subData: {
//   value: boolean;
//
}
```

```ts
const data = ["text 1", "text 2"] as const;
type Data = typeof data[number];
// type Data = "text 1" | "text 2"
```

```ts
const locales = [
  {
    locale: "se",
    language: "Swedish"
  },
  {
    locale: "en",
    language: "English"
  }
] as const;
type Locale = typeof locales[number]["locale"];
// type Locale = "se" | "en"
```

```ts
const currencySymbols = {
  GBP: "£",
  USD: "$",
  EUR: "€"
};
type CurrencySymbol = keyof typeof currencySymbols;
// type CurrencySymbol = "GBP" | "USD" | "EUR"
```

## `keyof` with Generics and Interfaces Example

```ts
interface HasPhoneNumber {
  name: string;
  phone: number;
}

interface HasEmail {
  name: string;
  email: string;
}

interface CommunicationMethods {
  email: HasEmail;
  phone: HasPhoneNumber;
  fax: { fax: number };
}

function contact<K extends keyof CommunicationMethods>(
  method: K,
  contact: CommunicationMethods[K] // 💡turning key into value -- a *mapped type*
) {
  //...
}
contact("email", { name: "foo", email: "mike@example.com" });
contact("phone", { name: "foo", phone: 3213332222 });
contact("fax", { fax: 1231 });

// // we can get all values by mapping through all keys
type AllCommKeys = keyof CommunicationMethods;
type AllCommValues = CommunicationMethods[keyof CommunicationMethods];
```

# Immutability

## `readonly` Array / Tuple

```ts
const array: readonly string[];
const tuple: readonly [string, string];
```

## `readonly` Properties

Properties marked with `readonly` can only be assigned to during initialization
or from within a constructor of the same class.

```ts
type Point = {
  readonly x: number;
  readonly y: number;
};

const origin: Point = { x: 0, y: 0 }; // OK
origin.x = 100; // Error

function moveX(p: Point, offset: number): Point {
  p.x += offset; // Error
  return p;
}

function moveX(p: Point, offset: number): Point {
  // OK
  return {
    x: p.x + offset,
    y: p.y
  };
}
```

## `readonly` Class Properties

Gettable area property is implicitly read-only because there’s no setter:

```ts
class Circle {
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  get area() {
    return Math.PI * this.radius ** 2;
  }
}
```

## `const` Assertions

- `number` becomes number literal

<!-- end list -->

```ts
// Type '10'
let x = 10 as const;
```

- array literals become `readonly` tuples

<!-- end list -->

```ts
// Type 'readonly [10, 20]'
let y = [10, 20] as const;
```

- object literals get `readonly` properties
- no literal types in that expression should be widened (e.g. no going from
  `"hello"` to `string`)

<!-- end list -->

```ts
// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;
```

- ⛔ `const` contexts **don’t** immediately convert an expression to be fully
  immutable.

<!-- end list -->

```ts
let arr = [1, 2, 3, 4];

let foo = {
  name: "foo",
  contents: arr
} as const;

foo.name = "bar"; // Error!
foo.contents = []; // Error!

foo.contents.push(5); // ...works!
```

# Strict Mode

## Non-Nullable Types

`--strictNullChecks`

In strict null checking mode, `null` and `undefined` are no longer assignable to
every type.

```ts
let name: string;
name = "Marius"; // OK
name = null; // Error
name = undefined; // Error
```

```ts
let name: string | null;
name = "Marius"; // OK
name = null; // OK
name = undefined; // Error
```

Optional parameter `?` automatically adds `| undefined`

```ts
type User = {
  firstName: string;
  lastName?: string; // same as `string | undefined`
};
```

- In JavaScript, every function parameter is optional, when left off their value
  is `undefined`.
- We can get this functionality in TypeScript by adding a `?` to the end of
  parameters we want to be optional. This is different from adding `| undefined`
  which requires the parameter to be explicitly passed as `undefined`

<!-- end list -->

```ts
function fn1(x: number | undefined): void {
  x;
}

function fn2(x?: number): void {
  x;
}

fn1(); // Error
fn2(); // OK
fn1(undefined); // OK
fn2(undefined); // OK
```

Type guard needed to check if Object is possibly `null`:

```ts
function getLength(s: string | null) {
  // Error: Object is possibly 'null'.
  return s.length;
}
```

```ts
function getLength(s: string | null) {
  if (s === null) {
    return 0;
  }

  return s.length;
}

// JS's truthiness semantics support type guards in conditional expressions
function getLength(s: string | null) {
  return s ? s.length : 0;
}
```

```ts
function doSomething(callback?: () => void) {
  // Error: Object is possibly 'undefined'.
  callback();
}
```

```ts
function doSomething(callback?: () => void) {
  if (typeof callback === "function") {
    callback();
  }
}
```

## Strict Class Property Initialization

`--strictPropertyInitialization`

Verify that each instance property declared in a class either:

- Has an explicit initializer, or
- Is definitely assigned to in the constructor

<!-- end list -->

```ts
// Error
class User {
  // Type error: Property 'username' has no initializer
  // and is not definitely assigned in the constructor
  username: string;
}

// OK
class User {
  username = "n/a";
}

const user = new User();
const username = user.username.toLowerCase();

// OK
class User {
  constructor(public username: string) {}
}

const user = new User("mariusschulz");
const username = user.username.toLowerCase();
```

- Has a type that includes undefined

<!-- end list -->

```ts
class User {
  username: string | undefined;
}

const user = new User();

// Whenever we want to use the username property as a string, though, we first have to make sure that it actually holds a string and not the value undefined
const username =
  typeof user.username === "string" ? user.username.toLowerCase() : "n/a";
```

# Types

## `unknown`

`unknown` is the type-safe counterpart of the `any` type: we have to do some
form of checking before performing most operations on values of type `unknown`.

### Reading `JSON` from `localStorage` using `unknown` Example

```ts
type Result =
  | { success: true; value: unknown }
  | { success: false; error: Error };

function tryDeserializeLocalStorageItem(key: string): Result {
  const item = localStorage.getItem(key);

  if (item === null) {
    // The item does not exist, thus return an error result
    return {
      success: false,
      error: new Error(`Item with key "${key}" does not exist`)
    };
  }

  let value: unknown;

  try {
    value = JSON.parse(item);
  } catch (error) {
    // The item is not valid JSON, thus return an error result
    return {
      success: false,
      error
    };
  }

  // Everything's fine, thus return a success result
  return {
    success: true,
    value
  };
}
```

## `never`

`never` represents the type of values that never occur. It is used in the
following two places:

- As the return type of functions that never return
- As the type of variables under type guards that are never true

`never` can be used in control flow analysis:

```ts
function controlFlowAnalysisWithNever(value: string | number) {
  if (typeof value === "string") {
    value; // Type string
  } else if (typeof value === "number") {
    value; // Type number
  } else {
    value; // Type never
  }
}
```

# Generics

Generics enable you to create reusable code components that work with a number
of types instead of a single type.

## With and Without Type Argument Inference

```ts
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString"); // type of output will be 'string'
let output = identity("myString"); // The compiler sets the value of `T` based on the type of the argument we pass in
```

## Using More Than One Type Argument

No value arguments are needed in this case:

```ts
function makePair<F, S>() {
  let pair: { first: F; second: S };

  function getPair() {
    return pair;
  }

  function setPair(x: F, y: S) {
    pair = {
      first: x,
      second: y
    };
  }
  return { getPair, setPair };
}

// Creates a (number, string) pair
const { getPair, setPair } = makePair<number, string>();
// Must pass (number, string)
setPair(1, "y");
```

## Higher Order Function with `Parameters<T>` and `ReturnType<T>`

```ts
// Input a function `<T extends (...args: any[]) => any>`
// Output a function with same params and return type `:(...funcArgs: Parameters<T>) => ReturnType<T>`
function logDuration<T extends (...args: any[]) => any>(func: T) {
  const funcName = func.name;

  // Return a new function that tracks how long the original took
  return (...args: Parameters<T>): ReturnType<T> => {
    console.time(funcName);
    const results = func(...args);
    console.timeEnd(funcName);
    return results;
  };
}

function addNumbers(a: number, b: number): number {
  return a + b;
}
// Hover over is `addNumbersWithLogging: (a: number, b: number) => number`
const addNumbersWithLogging = logDuration(addNumbers);

addNumbersWithLogging(5, 3);
```

# Discriminated Unions

A data structure used to hold a value that could take on several different, but
fixed, types.

## Exhaustive Pattern Matching Using `never`

```ts
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}
interface Triangle {
  kind: "triangle";
  whatever: number;
}

type Shape = Square | Rectangle | Circle | Triangle;

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
    default:
      return assertNever(s); // Argument of type 'Triangle' is not assignable to parameter of type 'never'.
  }
}
```

# Optional Chaining

## `?.` returns `undefined` when hitting a `null` or `undefined`

Album where the artist, and the artists biography might not be present in the
data.

```ts
type AlbumAPIResponse = {
  title: string;
  artist?: {
    name: string;
    bio?: string;
    previousAlbums?: string[];
  };
};

// Instead of:
const maybeArtistBio = album.artist && album.artist.bio;

// ?. acts differently than the &&s since && will act differently on "falsy" values (e.g. an empty string, 0, NaN, and false).
const artistBio = album?.artist?.bio;

// optional chaining also works with the [] operators when accessing elements
const maybeArtistBioElement = album?.["artist"]?.["bio"];
const maybeFirstPreviousAlbum = album?.artist?.previousAlbums?.[0];
```

# Nullish Coalescing

## `??` “fall Backs” to a Default Value When Dealing with `null` or `undefined`

Value `foo` will be used when it’s “present”; but when it’s `null` or
`undefined`, calculate `bar()` in its place.

```ts
let x = foo ?? bar();

// instead of

let x = foo !== null && foo !== undefined ? foo : bar();
```

It can replace uses of `||` when trying to use a default value, and avoids bugs.
When `localStorage.volume` is set to `0`, the page will set the volume to `0.5`
which is unintended. `??` avoids some unintended behaviour from `0`, `NaN` and
`""` being treated as falsy values.

```ts
function initializeAudio() {
  let volume = localStorage.volume || 0.5; // Potential bug
}
```

# Assertion Functions

Assertions in JavaScript are often used to guard against **improper** types
being passed in.

## A Standard JavaScript `Assert()` Doesn’t Work for Type Checking

```ts
function yell(str) {
  assert(typeof str === "string");

  return str.toUppercase();
  // Oops! We misspelled 'toUpperCase'.
  // Would be great if TypeScript still caught this!
}
```

## Using `if` and `typeof` Everywhere is Bloat

```ts
function yell(str) {
  if (typeof str !== "string") {
    throw new TypeError("str should have been a string.");
  }
  // Error caught!
  return str.toUppercase();
}
```

## Assertion Function Style 1 - Check for a Condition

```ts
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}

function yell(str) {
  assert(typeof str === "string");

  return str.toUppercase();
  //         ~~~~~~~~~~~
  // error: Property 'toUppercase' does not exist on type 'string'.
  //        Did you mean 'toUpperCase'?
}
```

## Assertion Function Style 2 - Tell Typescript That a Specific Variable or Property Has a Different Type

Very similar to writing type predicate signatures.

```ts
function assertIsString(val: any): asserts val is string {
  if (typeof val !== "string") {
    throw new AssertionError("Not a string!");
  }
}

function yell(str: any) {
  assertIsString(str);

  // Now TypeScript knows that 'str' is a 'string'.

  return str.toUppercase();
  //         ~~~~~~~~~~~
  // error: Property 'toUppercase' does not exist on type 'string'.
  //        Did you mean 'toUpperCase'?
}
```

#### Thanks to the following sites and people for providing many of the fantastic examples:

[typescriptlang.org](https://www.typescriptlang.org/docs/home.html)

[Marius Schulz - Blog](https://mariusschulz.com/)

[Mike North - TypeScript 3 Fundamentals v2](https://frontendmasters.com/courses/typescript-v2/)

[Shu Uesugi - TypeScript for Beginner Programmers](https://ts.chibicode.com/)

[Dr. Axel Rauschmayer - 2ality](https://2ality.com/index.html)
