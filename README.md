prop-value
----------

Simple path-to-value resolver.

```ts
import {resolveValue} from 'prop-value';

const obj = {
    first: {
        second: {
            value: 123
        }
    }
};

const value = resolveValue(obj, 'first.second.value');
//=> 123
```

## Installing

```
$ npm i prop-value
```

## Features

* It supports `this` to access an alternative/custom scope for resolution:

```ts
const obj = {value: 1};

const scope = {value: 2}; // custom/alternative 'this' scope

const value1 = resolveValue.call(scope, obj, 'value');
//=> 1 (default scope is used)

const value2 = resolveValue.call(scope, obj, 'this.value');
//=> 2 (custom 'this' scope is used)

const value3 = resolveValue.call(obj, obj, 'this.value');
//=> 1 (custom scope = default scope)
```

* Lower-level `resolvePath` returns a parsing descriptor:

```ts
import {resolvePath, IParseResult} from 'prop-value';

const obj = {first: {value: 123}};

const res: IParseResult = resolvePath(obj, 'first.value');
//=> {chain: ['first', 'second'], idx: 1, value: 123}
```

Function `resolvePath` supports custom `this` scope the same as `resolveValue` does.
It will only throw an error if property getter/function throws an error.

* It supports functions-methods within resolution chain:

```ts
const obj = {
    first: {
        second() {
            // resolver correctly passes 'this' = first
            return this.value;
        },
        value: 123
    }
};

const value = resolveValue(obj, 'first.second');
//=> 123
```
