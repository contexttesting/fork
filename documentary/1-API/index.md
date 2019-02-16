## API

The package is available by importing its default function:

```js
import fork from '@zoroaster/fork'
```

%~%

```## async fork => { stdout, stderr, code }
[
  ["forkConfig", "string|ForkConfig"],
  ["input", "string"],
  ["props?", "*"],
  ["contexts?", "Context[]"]
]
```

This method will fork a process, and pass the inputs when `stdin` expects an input. Because `includeAnswers` is set to `true` by default, the answers will be included in the resulting `stdout` and `stderr` properties.

%TYPEDEF types/index.xml%

_For example, to test the fork with the next code:_
%EXAMPLE: example/fork.js%

_The ContextTesting/Fork can be used:_
%EXAMPLE: example/example.js, ../src => @zoroaster/fork%
%FORK-js example example/example%

%~%