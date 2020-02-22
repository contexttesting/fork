# @zoroaster/fork

%NPM: @zoroaster/fork%
[![Build status](https://ci.appveyor.com/api/projects/status/wn2glepwjr13ska5?svg=true)](https://ci.appveyor.com/project/4r7d3c0/fork)

`@zoroaster/fork` is used in _Zoroaster_ to test forks. It is part of the [`@zoroaster/mask`](https://github.com/contexttesting/mask) package which uses it to compare forks' output against the results written in non-js files. Nevertheless, the package can be used on its own to spawn and test forks &mdash; the library allows to fork a process and then asserts on the `stderr`, `stdout` and `code` properties, if they are passed, and returns the actual values if the assertions passed.

```sh
yarn add @zoroaster/fork
```

## Table Of Contents

%TOC%

%~%