path-value web build
--------------------

Builds version of `path-value` for web distribution.

Before building web files, you need to build source JS files from the main project:

```
$ npm run build
```

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
pathValue.resolveValue({value: 123}, 'value'); //=> 123
```
