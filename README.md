path-value
----------

Property path-to-value resolver, in TypeScript.

```ts
import {resolveValue} from 'path-value';

const obj = {
    first: {
        second: {
            value: 123
        }
    }
};

resolveValue(obj, 'first.second.value'); //=> 123
```

It resolves both local and inherited properties.

## Installing

```
$ npm i path-value
```

## Features

#### High Performance + Full ES5 Syntax:

This library offers the best possible performance, by separating path tokenization from path resolution,
which makes it possible to create highly optimized value retrieval, by caching pre-tokenized path strings.

By default, all value-resolving functions work either with a simple name-chain path or an array of tokens.
In order to allow full ES5 syntax for arrays and array indexes, you have to tokenize such path first:

```ts
import {tokenizePath, resolveValue} from 'path-value';

const target = {
    first: [0, 1, {second: {"text index": 123}}]
};

const path = tokenizePath(`first[2].second["text index"]`); // tokenizing verbose ES5 path
//=> ['first', '2', 'second', 'text index']

const value = resolveValue(target, path); //=> 123
```

You do not need to tokenize the path, and can use it directly, if you want to support a simple-syntax path only,
such as `first.123.last`, with array indexes used like properties.

#### It supports local scope, via `this` prefix, for alternative resolution:

```ts
const obj = {value: 1};

const scope = {value: 2}; // local scope

resolveValue.call(scope, obj, 'this.value'); //=> 2 (local scope is used)

resolveValue.call(obj, obj, 'this.value'); //=> 1 (local scope = default scope)
```

#### Lower-level [resolvePath] returns [IPathResult] descriptor:

```ts
import {resolvePath, IPathResult} from 'path-value';

const obj = {first: {value: 123}};

const res: IPathResult = resolvePath(obj, 'first.value');
//=> {chain: ['first', 'value'], scope: obj, idx: 1, exists: true, value: 123}
```

Function [resolvePath] supports local scope the same as [resolveValue] does. It does not throw errors on its own, only
when a property getter does so.

#### Functions are automatically called within resolution chain:

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

resolveValue(obj, 'first.second'); //=> 123
```

Function resolution is recursive. However, a function is treated as a value when it is an ES6 class or has name start
with a capital, to correctly handle static class members:

```js
resolveValue(global, 'Number.EPSILON'); //=> 2.220446049250313e-16
```

You can also override this with option [ignoreFunctions] as the third parameter.

---

See also:

* [Performance](http://github.com/vitaly-t/path-value/wiki/Performance) - performance considerations
* [Examples](http://github.com/vitaly-t/path-value/wiki/Examples) - special-case examples
* [Browsers](http://github.com/vitaly-t/path-value/wiki/Browsers) - in-browser usage

[resolvePath]:https://github.com/vitaly-t/path-value/blob/main/src/parsers.ts#L17

[IPathResult]:https://github.com/vitaly-t/path-value/blob/main/src/types.ts#L74

[resolveValue]:https://github.com/vitaly-t/path-value/blob/main/src/resolvers.ts#L18

[ignoreFunctions]:https://github.com/vitaly-t/path-value/blob/main/src/types.ts#L28
