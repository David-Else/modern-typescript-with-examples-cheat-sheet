- [**Modern Typescript with Examples Cheat
  Sheet**](#modern-typescript-with-examples-cheat-sheet)
- [Typing Objects](#typing-objects)
  - [Members of Interfaces and Object Type
    Literals](#members-of-interfaces-and-object-type-literals)
  - [Type Literal Syntax](#type-literal-syntax)
  - [Index Signature Additional
    Rules](#index-signature-additional-rules)
  - [Optional `?` and `readonly`
    Properties](#optional-and-readonly-properties)
  - [⛔ Interfaces with Excess Properties
    (Inconsistency)](#interfaces-with-excess-properties-inconsistency)
- [Mapped Types - Getting Types from Data Using `typeof` /
  `keyof`](#mapped-types---getting-types-from-data-using-typeof-keyof)
  - [Examples](#examples)
  - [Advanced Example](#advanced-example)
- [Immutability](#immutability)
  - [`readonly` Array / Tuple](#readonly-array-tuple)
  - [`readonly` Properties](#readonly-properties)
  - [`readonly` Class Properties](#readonly-class-properties)
  - [`const` Assertions](#const-assertions)
- [Strict Mode](#strict-mode)
  - [Non-Nullable Types](#non-nullable-types)
  - [Strict Class Property
    Initialization](#strict-class-property-initialization)
- [Unknown Type](#unknown-type)
  - [Example: Reading `JSON` from
    `localStorage`](#example-reading-json-from-localstorage)
- [Generics](#generics)
  - [Example With and Without Type Argument
    Inference](#example-with-and-without-type-argument-inference)
  - [Example Using Two Type
    Parameters](#example-using-two-type-parameters)
- [Discriminated Unions](#discriminated-unions)
  - [Example with `exhaustive Pattern Matching` Using
    `never`](#example-with-exhaustive-pattern-matching-using-never)
- [Optional Chaining: `?.` return `undefined` when hitting a `null` or
  `undefined`](#optional-chaining-.-return-undefined-when-hitting-a-null-or-undefined)
- [Nullish Coalescing: `??` “fall Back” to a Default Value When
  Dealing with `null` or
  `undefined`](#nullish-coalescing-fall-back-to-a-default-value-when-dealing-with-null-or-undefined)
- [Assertion Functions](#assertion-functions)
  - [Problem: Doesn’t work for Type
    Checking](#problem-doesnt-work-for-type-checking)
  - [Solution: Not Convenient](#solution-not-convenient)
  - [Better Solution: Assertion Function Style 1 - Check for a
    Condition](#better-solution-assertion-function-style-1---check-for-a-condition)
  - [Better Solution: Assertion Function Style 2 - Tell Typescript
    That a Specific Variable or Property Has a Different
    Type](#better-solution-assertion-function-style-2---tell-typescript-that-a-specific-variable-or-property-has-a-different-type)
- [Advanced Examples](#advanced-examples)
  - [Generic Higher Order Function Example with `Parameters<T>` and
    `ReturnType<T>`](#generic-higher-order-function-example-with-parameterst-and-returntypet)

# **Modern Typescript with Examples Cheat Sheet**

# Typing Objects

## Members of Interfaces and Object Type Literals

```ts
interface ExampleInterface {
  // Property signature
  myProperty: boolean;
  callback: MyFunctionType;

  // Method signature
  myMethod(x: string): void; // parameters (x) document how things work, but have no other purpose.

  // Index signature
  [prop: string]: any; // help describe Arrays or objects that are used as dictionaries

  // Call signature
  (x: number): string; // enable interfaces to describe functions

  // Construct signature
  new (x: string): ExampleInstance; // enable describing classes and constructor functions:
}
```

## Type Literal Syntax

Typically used in the signature of a higher-order function

```ts
type MyFunctionType = (name: string) => number;
```

## Index Signature Additional Rules

If there are both an index signature and property and/or method
signatures in an interface, then the type of the index property value
must also be a supertype of the type of the property value and/or
method.

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

## Optional `?` and `readonly` Properties

```ts
interface Name {
  readonly first: string;
  middle?: string;
  last: string;
}
```

<div style="page-break-after: always;">

</div>

## ⛔ Interfaces with Excess Properties (Inconsistency)

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

> TypeScript is a **structurally** typed language. This means that to
> create a `Dog` you don’t need to explicitly extend the `Dog`
> interface. Instead any object with a `breed` property that is of type
> `string` can be used as a `Dog`.
>
> Engineers can’t just think of interfaces as “objects that have exactly
> a set of properties” or “objects that have at least a set of
> properties”. They have to consider that **inline** object arguments
> receive an **additional level of validation** that doesn’t apply when
> they’re **passed as variables**.

# Mapped Types - Getting Types from Data Using `typeof` / `keyof`

## Examples

```ts
const data = {
  value: 123,
  text: "text"
};

type Data = typeof data;
// type Data = {
// value: number;
// text: string;
// }
```

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

## Advanced Example

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

Properties marked with `readonly` can only be assigned to during
initialization or from within a constructor of the same class.

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

Gettable area property is implicitly read-only because there’s no
setter:

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
- no literal types in that expression should be widened (e.g. no going
  from `"hello"` to `string`)

<!-- end list -->

```ts
// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;
```

⛔ `const` contexts **don’t** immediately convert an expression to be
fully immutable.

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

Optional parameter automatically adds `| undefined`

```ts
type User = {
  firstName: string;
  lastName?: string; // same as `string | undefined`
};
```

Type guard needed to check if Object is possibly `null`

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

```ts
class User {
  // Type error: Property 'username' has no initializer
  // and is not definitely assigned in the constructor
  username: string;
}
```

```ts
class User {
  username: string | undefined;
}

const user = new User();

// Whenever we want to use the username property as a string, though, we first have to make sure that it actually holds a string and not the value undefined
const username =
  typeof user.username === "string" ? user.username.toLowerCase() : "n/a";
```

```ts
class User {
  username = "n/a";
}

const user = new User();

// OK
const username = user.username.toLowerCase();
```

```ts
class User {
  constructor(public username: string) {}
}

const user = new User("mariusschulz");

// OK
const username = user.username.toLowerCase();
```

# Unknown Type

## Example: Reading `JSON` from `localStorage`

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

# Generics

## Example With and Without Type Argument Inference

```ts
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString"); // type of output will be 'string'
let output = identity("myString"); // The compiler sets the value of `T` based on the type of the argument we pass in
```

## Example Using Two Type Parameters

No value arguments are needed in this case.

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

# Discriminated Unions

> The code doesn’t compile if you don’t cover every possibility: this is
> what gives you power. If you can expose your types as a common
> interface, then using OO features (interfaces/polymorphism) will make
> your life better by putting type-specific behaviour in the type rather
> than in the consuming code.

> It is important to recognise that interfaces and unions are kind of
> the opposite of each other: an interface defines some stuff the type
> has to implement, and the union defines some stuff the consumer has to
> consider. If you add a method to an interface, you have changed that
> contract, and now every type that previously implemented it needs to
> be updated. If you add a new type to a union, you have changed that
> contract, and now every exhaustive pattern matching over the union has
> to be updated. They fill different roles, and while it may sometimes
> be possible to implement a system ‘either way’, which you go with is a
> design decision: neither is inherently better.

## Example with `exhaustive Pattern Matching` Using `never`

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

# Optional Chaining: `?.` return `undefined` when hitting a `null` or `undefined`

Album where the artist, and the artists bio might not be present in the
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

# Nullish Coalescing: `??` “fall Back” to a Default Value When Dealing with `null` or `undefined`

Value `foo` will be used when it’s “present”; but when it’s `null` or
`undefined`, calculate `bar()` in its place.

```ts
let x = foo ?? bar();

// instead of

let x = foo !== null && foo !== undefined ? foo : bar();
```

It can replace uses of `||` when trying to use a default value, and
avoids bugs. When `localStorage.volume` is set to `0`, the page will set
the volume to `0.5` which is unintended. `??` avoids some unintended
behaviour from `0`, `NaN` and `""` being treated as falsy values.

```ts
function initializeAudio() {
  let volume = localStorage.volume || 0.5; // Potential bug
}
```

# Assertion Functions

Assertions in JavaScript are often used to guard against **improper**
types being passed in.

### Problem: Doesn’t work for Type Checking

```ts
function yell(str) {
  assert(typeof str === "string");

  return str.toUppercase();
  // Oops! We misspelled 'toUpperCase'.
  // Would be great if TypeScript still caught this!
}
```

### Solution: Not Convenient

```ts
function yell(str) {
  if (typeof str !== "string") {
    throw new TypeError("str should have been a string.");
  }
  // Error caught!
  return str.toUppercase();
}
```

### Better Solution: Assertion Function Style 1 - Check for a Condition

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

### Better Solution: Assertion Function Style 2 - Tell Typescript That a Specific Variable or Property Has a Different Type

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

# Advanced Examples

## Generic Higher Order Function Example with `Parameters<T>` and `ReturnType<T>`

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
