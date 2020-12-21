path-value
----------

Simple path-to-value resolver.

[![Build Status](https://travis-ci.org/vitaly-t/path-value.svg?branch=main)](https://travis-ci.org/vitaly-t/path-value)
[![Coverage Status](https://coveralls.io/repos/github/vitaly-t/path-value/badge.svg?branch=main)](https://coveralls.io/github/vitaly-t/path-value?branch=main)

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

It resolves both local and inherited properties.

## Installing

```
$ npm i path-value
```

## Features

#### It supports local scope, via `this` prefix, for alternative resolution.

```ts
const obj = {value: 1};

const scope = {value: 2}; // local scope

const a = resolveValue.call(scope, obj, 'this.value');
//=> 2 (local scope is used)

const b = resolveValue.call(obj, obj, 'this.value');
//=> 1 (local scope = default scope)
```

#### Lower-level [resolvePath] returns an [IPathResult] descriptor.

```ts
import {resolvePath, IPathResult} from 'path-value';

const obj = {first: {value: 123}};

const res: IPathResult = resolvePath(obj, 'first.value');
//=> {chain: ['first', 'second'], idx: 1, exists: true, value: 123}
```

Function [resolvePath] supports local scope the same as [resolveValue] does. It does not throw errors on its own,
only when a property getter does so.

#### Functions - Getters are automatically called within resolution chain.

```ts
const obj = {
    first: {
        second() {
            // called with 'this' = obj.first
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

[IPathResult]:https://github.com/vitaly-t/path-value/blob/main/src/types.ts#L44

[resolveValue]:https://github.com/vitaly-t/path-value/blob/main/src/resolve-value.ts#L14
