# type-definitions

The purpose of this package is to allow for defining type/object structure in an
easily recognizable JSON format. An example definition might look something like:


```javascript
import { defineType } from 'type-definitions';

const myTypeDefinition = defineType({
  foo: String,
  bar: Number,
  baz: {
    test: Boolean,
    something: [String]
  }
})
```

It also offers validation of values based on those definitions:

```javascript
import { defineType } from 'type-definitions';

const aNumber = defineType(Number);

aNumber.isOfType(2); // true
aNumber.isOfType("test"); // false


const arrayOfStringsOrNumbers = defineType([String, Number]);
arrayOfStringsOrNumbers.isOfType([1, "test"]); // true
arrayOfStringsOrNumbers.isOfType([1, "test", true]); // false

const complexObject = defineType({
  a: Number,
  b: String,
  c: {
    d: [String],
    e: Boolean
  }
});

complex.isOfType({
  a: 2,
  b: "test",
  c: {
    d: ["some", "value"],
    e: true
  }
}); // true

complex.isOfType({
  a: 2,
  b: "test",
  c: {
    d: ["some", "value"],
    e: "true"
  }
}); // false (a.e !== Boolean)
```

Finally, it offers a way to construct objects of a given type and set defaults for that construction:

```javascript
import { defineType, defaultValue, types } from 'type-definition';

const defaultString = defineType(String);
const fooString = defineType(defaultValue(String, "foo"));
const barString = types.String.withDefault("bar");

defaultString.create(); // ''
fooString.create() // 'foo'
barString.create() // 'bar'
barString.create("some other string") // 'some other string'
barString.create(2) // throws error, invalid type


const customObject = types.Object.withDefinition({
  a: String,
  b: types.Number.withDefault(5),
  c: {
    d: Boolean,
    e: defaultValue(Boolean, true)
  }
})

customObject.create() // { a: '', b: 5, c: { d: false, e: true } }
customObject.create({ a: 'test', c: { d: true }}); // { a: 'test', b: 5, c: { d: true, e: true } }

```

## `defineType`

This function will process the input and return the representation as a class
with an `isOfType` static function. It is primarily for coercing native
representations, and will pass through the package-defined types.
Therefore it's always good to wrap your definitions in this so that they
will support as much definition styles as possible.

## Types

### String

Validates true for string values (ie `"test"`).

Default value: `""`


Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const aString = defineType(types.String);
```

This also supports coercion from native `String`:

```javascript
const aString = defineType(String);
```

### Number

Validates true for number values (ie `1`, `1.23`, `Infinity`, `NaN`, `1.0003e+23`).

Default value: `0`

Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const aNumber = defineType(types.Number);
```

This also supports coercion from native `Number`:

```javascript
const aNumber = defineType(Number);
```

### Boolean

Validates true for boolean values (ie `true`, `false`)

Default value: `false`

Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const aBool = defineType(types.Boolean);
```

This also supports coercion from native `Boolean`:

```javascript
const aBool = defineType(Boolean);
```

### Array

Validates true for any array (ie `[]`, `["test"]`, `["test", 2, true]`)

Default value: `[]`

Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const anArray = defineType(types.Array);
```

This also supports coercion from native `Array` or empty Array literal (`[]`):

```javascript
const anArray = defineType(Array);
const anotherArray = defineType([]);
```

### Array.ofType(type)

Validates true for any array that matches type, including empty arrays (ie for `types.Array.ofType(type.String)`, `[]` or `["test"]`)

You can also make an of Array of multiple types which will set the type to a
Union of the types supplied

Default value: `[]`


Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const anArrayOfStrings = defineType(types.Array.ofType(types.String));
```

This also supports coercion from an Array literal with types as members (`[String]`, `[String, Number]`):

```javascript
const anArrayOfStrings = defineType([String]);
const anArrayOfStringsOrNumbers = defineType([String, Number]);
```

### Object

Validates true for an object (`{}`, `new class Test {}`). Does not match `null` or arrays.

Default value: `{}`

Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const anObject = defineType(types.Object);
```

This also supports coercion from native `Object` and an empty object literal (`{}`)""

```javascript
const anObject = defineType(Object);
const anotherObject = defineType({});
```

### Object.withDefinition(objectDefinition)

Validates true for objects that match the defined structure. Note: it will
match objects with additional properties not included in the definition by
default. You can include the `strict`

Default value: default values of individual props

Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const anObject = defineType(types.Object.withDefinition({
  foo: String,
  bar: Number
}));
```

This also supports coercion from an Object literal with members (`{foo: String, bar: Number }`):

```javascript
const anObject = defineType({
  foo: String,
  bar: Number
});
```

### Object.withDefinition(objectDefinition).strict

Same as `Object.withDefinition(objectDefinition)` except it also validates that
value does not have any additional keys

Default value: default values of individual props

Using package type:
```javascript
import { types, defineType } from 'type-definitions';

const anObject = defineType(types.Object.withDefinition({
  foo: String,
  bar: Number
}).strict);
```

There is no native representation of this, however you can import the `strict`
function and use that to wrap native types:

```javascript
import { defineType, strict } from 'type-definitions';

const aStringOrNull = defineType(strict({
  foo: String,
  bar: Number
}));
```


### Object.keyValuePair(valueType)

Validates true for an object where all values match the supplied value type.

Default value: `{}`

Using package type:

```javascript
import { types, defineType } from 'type-definitions';

const aHashOfStrings = defineType(types.Object.keyValuePair(String));
```

**There is no native representation for this**


### Any

Validates true for any value (allows `null` but excludes `undefined`).

Default value: `null`


Using package type:

```javascript
import { types, defineType } from 'type-definitions';

const anyType = defineType(types.Any);
```

**There is no native representation for this**


### Union.ofType(...types)

Validates true for any value matches any of the union types.

Default value: default value of first type

Using package type:

```javascript
import { types, defineType } from 'type-definitions';

const unionOfStringAndNumber = defineType(types.Union.ofType(String, Number));
```

There is no native representation of this, however you can import the `unionOf`
function and use that to wrap native types:

```javascript
import { defineType, unionOf } from 'type-definitions';

const unionOfStringAndNumber = unionOf(String, Number)
```

### Optional

All built in types include can be modified to validate for null/undefined by appending
the `.optional` modifier

Default value: `null` unless user specified

Using package type:

```javascript
import { types, defineType } from 'type-definitions';

const aStringOrNull = defineType(types.String.optional);
```

There is no native representation of this, however you can import the `optional`
function and use that to wrap native types:

```javascript
import { defineType, unionOf } from 'type-definitions';

const aStringOrNull = optional(String)
```

### Custom Classes

Custom classes can be supported by providing a `static isOfType(val)` method on
your class. It will leverage whatever logic you put in this method for validation

Default value: `Object.create(CustomClass)`

```javascript
class MyClass {
  static isOfType(val) {
    return val.__type === "myType"
  }
  get __type() { return "myType"; }
}

class SomeOtherClass {
  get __type() { return "!!!"; }
}

defineType(MyType).isOfType(new SomeOtherClass()); // false
```

_If you use a class that **does not** define `state isOfType(val)` then `isOfType`
will fall back to using `instanceof` for validation_

## Type.withDefault() / Type.create()

Taking an exisitng type and calling `.create(val)` on it will construct an instance of
of that type with the given value (assuming the provided value validates).

If no value is provided it will construct an object with the _default_ value of
an object (see defaults above)

If you would like to change the default value of an object there is a `withDefault()` static on all
type extending from `BaseType` (or coerced via `defineType`) which takes a default value, validates
it against the type and if it's value uses that as the default construction value.  Additionally
there is a `defaultValue(type, val)` method exported for use in wrapping native types

For objects, you can provide a partial value to `.create()` and it will use defaults to fill
in other properties as it is able to.
