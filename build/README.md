path-value web build
--------------------

Builds version of `path-value` for web distribution.

## Steps

* Install local dependencies:

```sh
$ npm i
```

* Build web files:

```sh
$ npm run build
```

All files will be generated in folder `../dist/web`.

After including `path-value.min.js` into your web page, `pathValue` namespace will have all the functions:

```js
pathValue.reolveValue({value: 123}, 'value'); //=> 123
```
