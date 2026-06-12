# Deobfuscation Symbol Map

This file maps selected symbols from generated deobfuscation artifacts to readable names.

Important: `decompiled/**/deobfuscated.js` files are generated reference artifacts. Do not edit them directly. Put renamed/readable reference code under `docs/deobfuscation/` so it survives bundle re-decompile.

## modules/deobfuscated.js:230 - Regenerator AsyncIterator

Source artifact: `decompiled/modules/deobfuscated.js`

Readable reference: `docs/deobfuscation/modules-async-iterator.js`

This block is Babel/regenerator runtime glue, not TikFinity business logic. It adapts generator methods (`next`, `throw`, `return`) into a Promise-backed async iterator and serializes calls so awaits resolve in order.

Evidence:

- `_0x4255d2.AsyncIterator = _0x6816bf`
- `_0x571641(_0x6816bf.prototype)` adds `next`, `throw`, and `return` to the prototype.
- `_0x4255d2.async(...)` constructs `new _0x6816bf(...)`.

Call chain:

```txt
_0x4255d2.async(innerFn, outerFn, self, tryLocsList, PromiseImpl)
  -> _0x317e2a(innerFn, outerFn, self, tryLocsList)
     -> returns generator object with _invoke()
  -> new _0x6816bf(generator, PromiseImpl)
     -> AsyncIterator(generator, PromiseImpl)
```

So the two parameters passed into `_0x6816bf` are known:

```txt
_0x3b94c3 = generator object returned by _0x317e2a(...)
_0x209efd = Promise implementation, defaults to native Promise
```

| Obfuscated | Readable name | Confidence | Role |
|---|---|---:|---|
| `_0x6816bf` | `AsyncIterator` | High | Constructor for Promise-backed async iterator |
| `_0x3b94c3` | `generator` | High | Generator instance wrapped by `AsyncIterator` |
| `_0x209efd` | `PromiseImpl` | High | Promise constructor/implementation used by runtime |
| `_0x34e41c` | `invoke` | High | Executes one generator method and resolves/rejects the matching promise |
| `_0x2267db` | `method` | High | Method name: `next`, `throw`, or `return` |
| `_0x1e3bb1` | `arg` | High | Argument passed into the generator method |
| `_0xba603a` | `resolve` | High | Promise resolve callback |
| `_0x4816c0` | `reject` | High | Promise reject callback |
| `_0x1eac56` | `record` | High | `tryCatch` result object: `{ type, arg }` |
| `_0x5b9209` | `result` | High | Iterator result object: `{ value, done }` |
| `_0x51772d` | `value` | High | Result value, possibly a Promise or `__await` wrapper |
| `_0x4afecd` | `awaitedValue` | Medium | Fulfilled value from an `__await` wrapper |
| `_0x5d2b46` | `awaitError` | Medium | Rejection from an `__await` wrapper |
| `_0xab9340` | `resolvedValue` | Medium | Fulfilled value from a normal promise |
| `_0x4e89b0` | `promiseError` | Medium | Rejection from a normal promise |
| `_0x2fd497` | `previousPromise` | High | Promise chain used to serialize iterator calls |
| `_0xb21d7a` | `method` | Medium | Method passed to `this._invoke` |
| `_0x5131cb` | `arg` | Medium | Argument passed to `this._invoke` |
| `_0x21f20c` | `callInvoke` | Medium | Creates the Promise for a single invocation |
| `_0x3bb221` | `resolve` | Medium | Promise resolve inside `callInvoke` |
| `_0x5eacf6` | `reject` | Medium | Promise reject inside `callInvoke` |
| `_0x5a20b2` | `tryCatch` | Medium | Runtime helper that calls a function and returns `{ type, arg }` |
| `_0x53f6e3` | `hasOwn` | Medium | Alias for `Object.prototype.hasOwnProperty` |

## modules/deobfuscated.js:149 - Regenerator wrap

`_0x317e2a` is assigned to `_0x4255d2.wrap`, so its readable name is `wrap`.

Evidence:

- `_0x4255d2.wrap = _0x317e2a`
- `_0x4255d2.async(...)` passes `_0x317e2a(...)` into `new _0x6816bf(...)`

| Obfuscated | Readable name | Confidence | Role |
|---|---|---:|---|
| `_0x317e2a` | `wrap` | High | Creates a generator object around an inner state-machine function |
| `_0x5a5164` | `innerFn` | Medium | Compiled generator body/state machine |
| `_0x3fd23c` | `outerFn` | Medium | Original outer generator function, used to choose prototype |
| `_0x3333d9` | `self` | Medium | `this` context for the generator body |
| `_0x509cbe` | `tryLocsList` | Medium | Try/catch/finally location table for regenerator context |
| `_0x5a2bf3` | `protoGenerator` | Medium | `Generator` or outer function prototype |
| `_0x2a3b9d` | `generator` | High | Returned generator object |
| `_0x50ce2b` | `context` | High | Regenerator context object tracking `method`, `arg`, `next`, `done`, try entries |
| `_0x294839` | `innerFn` | Medium | Captured generator body passed into `_invoke` closure |
| `_0x1117f8` | `self` | Medium | Captured `this` context |
| `_0x2880aa` | `context` | High | Captured regenerator context |
| `_0x4d37d3` | `state` | High | Generator state: `suspendedStart`, `executing`, `completed`, `suspendedYield` |
| `_0x3c6015` | `method` | High | Incoming method: `next`, `throw`, or `return` |
| `_0x216572` | `arg` | High | Incoming value/error |
| `_0x5ca39e` | `delegate` | Medium | Delegate iterator used by `yield*` |
| `_0xce82aa` | `delegateResult` | Medium | Result from delegate dispatch |
| `_0x208f66` | `record` | High | `tryCatch(innerFn, self, context)` result |
| `_0x436f47` | `ContinueSentinel` | High | Internal sentinel object meaning "continue the state-machine loop" |

## modules/deobfuscated.js:395 - Regenerator async

`_0x4255d2.async` is the wrapper Babel emits for `async function` and `async generator`.

| Obfuscated | Readable name | Confidence | Role |
|---|---|---:|---|
| `_0x4255d2` | `regeneratorRuntime` | High | Runtime object returned by `_regeneratorRuntime()` |
| `_0x4a1288` | `innerFn` | Medium | Compiled generator body/state machine |
| `_0x12eac9` | `outerFn` | Medium | Original outer function |
| `_0xb8d8b1` | `self` | Medium | `this` binding |
| `_0x36a67f` | `tryLocsList` | Medium | Try/catch/finally location metadata |
| `_0x2ab2e3` | `PromiseImpl` | High | Promise constructor, defaulting to native `Promise` |
| `_0xe64de9` | `iterator` | High | `AsyncIterator` instance |
| `_0x1d8e0d` | `result` | High | First async iterator result |

Readable equivalent:

```js
regeneratorRuntime.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl = Promise) {
  const iterator = new AsyncIterator(
    wrap(innerFn, outerFn, self, tryLocsList),
    PromiseImpl
  );

  if (regeneratorRuntime.isGeneratorFunction(outerFn)) {
    return iterator;
  }

  return iterator.next().then((result) => {
    if (result.done) {
      return result.value;
    }

    return iterator.next();
  });
};
```

Readable equivalent:

```js
function AsyncIterator(generator, PromiseImpl) {
  function invoke(method, arg, resolve, reject) {
    const record = tryCatch(generator[method], generator, arg);

    if (record.type !== "throw") {
      const result = record.arg;
      const value = result.value;

      if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
        return PromiseImpl.resolve(value.__await).then(
          awaitedValue => invoke("next", awaitedValue, resolve, reject),
          awaitError => invoke("throw", awaitError, resolve, reject)
        );
      }

      return PromiseImpl.resolve(value).then(
        resolvedValue => {
          result.value = resolvedValue;
          resolve(result);
        },
        promiseError => invoke("throw", promiseError, resolve, reject)
      );
    }

    reject(record.arg);
  }

  let previousPromise;

  this._invoke = function(method, arg) {
    function callInvoke() {
      return new PromiseImpl((resolve, reject) => {
        invoke(method, arg, resolve, reject);
      });
    }

    previousPromise = previousPromise
      ? previousPromise.then(callInvoke, callInvoke)
      : callInvoke();

    return previousPromise;
  };
}
```
