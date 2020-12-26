@ECHO OFF

REM Generates all distribution files for the library for the ../dist folder.

IF NOT EXIST "../node_modules/browserify/bin/cmd.js" npm i browserify --no-save

IF NOT EXIST "../node_modules/uglify-js/bin/uglifyjs" npm i uglify-js --no-save

node ../node_modules/browserify/bin/cmd.js ../dist/index.js -o path-value.js -s pv

node ../node_modules/uglify-js/bin/uglifyjs path-value.js -o ../dist/web/path-value.min.js --source-map -b beautify=false,preamble='"/**\n * path-value.js 0.6.5\n * Copyright 2020 Vitaly Tomilov\n * Released under the MIT License\n * https://github.com/vitaly-t/path-value\n */"'
