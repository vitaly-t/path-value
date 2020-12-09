path-value
----------

Simple path-to-value resolver.

[![Coverage Status](https://coveralls.io/repos/vitaly-t/path-value/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/path-value?branch=master)

```ts
import {resolveValue} from 'path-value';

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

It resolves both local and inherited properties - the same as JavaScript.

## Installing

```
$ npm i path-value
```

## Features

* It supports `this` to access an alternative/custom scope for resolution:

```ts
const obj = {value: 1};

const scope = {value: 2}; // custom/alternative 'this' scope

const a = resolveValue.call(scope, obj, 'this.value');
//=> 2 (custom 'this' scope is used)

const b = resolveValue.call(obj, obj, 'this.value');
//=> 1 (custom scope = default scope)
```

* Lower-level `resolvePath` returns a descriptor:

```ts
import {resolvePath, IPathResult} from 'path-value';

const obj = {first: {value: 123}};

const res: IPathResult = resolvePath(obj, 'first.value');
//=> {chain: ['first', 'second'], idx: 1, exists: true, value: 123}
```

Function [resolvePath] supports custom `this` scope the same as [resolveValue] does.
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

See also: [Examples](http://github.com/vitaly-t/path-value/wiki/Examples)

[resolvePath]:https://github.com/vitaly-t/path-value/blob/main/src/resolve-path.ts#L13
[resolveValue]:https://github.com/vitaly-t/path-value/blob/main/src/resolve-value.ts#L14
