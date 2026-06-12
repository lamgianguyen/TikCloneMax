// Readable reference for decompiled/modules/deobfuscated.js:149-403.
//
// This is not runtime code for the app. It is a cleaned-up equivalent of the
// Babel/regenerator async helpers so the obfuscated source can be read.
// See docs/DEOBFUSCATION_SYMBOL_MAP.md for the symbol table.

/* eslint-disable no-unused-vars */

const ContinueSentinel = {};

function tryCatch(fn, thisArg, arg) {
  try {
    return {
      type: "normal",
      arg: fn.call(thisArg, arg),
    };
  } catch (error) {
    return {
      type: "throw",
      arg: error,
    };
  }
}

function wrap(innerFn, outerFn, self, tryLocsList) {
  const protoGenerator =
    outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
  const generator = Object.create(protoGenerator.prototype);
  const context = new Context(tryLocsList || []);

  generator._invoke = makeInvokeMethod(innerFn, self, context);
  return generator;
}

function makeInvokeMethod(innerFn, self, context) {
  let state = "suspendedStart";

  return function invokeGenerator(method, arg) {
    if (state === "executing") {
      throw new Error("Generator is already running");
    }

    if (state === "completed") {
      if (method === "throw") {
        throw arg;
      }

      return doneResult();
    }

    context.method = method;
    context.arg = arg;

    while (true) {
      const delegate = context.delegate;

      if (delegate) {
        const delegateResult = maybeInvokeDelegate(delegate, context);

        if (delegateResult) {
          if (delegateResult === ContinueSentinel) {
            continue;
          }

          return delegateResult;
        }
      }

      if (context.method === "next") {
        context.sent = context._sent = context.arg;
      } else if (context.method === "throw") {
        if (state === "suspendedStart") {
          state = "completed";
          throw context.arg;
        }

        context.dispatchException(context.arg);
      } else if (context.method === "return") {
        context.abrupt("return", context.arg);
      }

      state = "executing";

      const record = tryCatch(innerFn, self, context);

      if (record.type === "normal") {
        state = context.done ? "completed" : "suspendedYield";

        if (record.arg === ContinueSentinel) {
          continue;
        }

        return {
          value: record.arg,
          done: context.done,
        };
      }

      if (record.type === "throw") {
        state = "completed";
        context.method = "throw";
        context.arg = record.arg;
      }
    }
  };
}

function AsyncIterator(generator, PromiseImpl) {
  function invoke(method, arg, resolve, reject) {
    const record = tryCatch(generator[method], generator, arg);

    if (record.type !== "throw") {
      const result = record.arg;
      const value = result.value;

      if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
        return PromiseImpl.resolve(value.__await).then(
          (awaitedValue) => {
            invoke("next", awaitedValue, resolve, reject);
          },
          (awaitError) => {
            invoke("throw", awaitError, resolve, reject);
          }
        );
      }

      return PromiseImpl.resolve(value).then(
        (resolvedValue) => {
          result.value = resolvedValue;
          resolve(result);
        },
        (promiseError) => invoke("throw", promiseError, resolve, reject)
      );
    }

    reject(record.arg);
  }

  let previousPromise;

  this._invoke = function invokeQueued(method, arg) {
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

function regeneratorAsync(innerFn, outerFn, self, tryLocsList, PromiseImpl = Promise) {
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
}

const symbolMap = {
  _0x4255d2: "regeneratorRuntime",
  _0x317e2a: "wrap",
  _0x5a5164: "innerFn",
  _0x3fd23c: "outerFn",
  _0x3333d9: "self",
  _0x509cbe: "tryLocsList",
  _0x5a2bf3: "protoGenerator",
  _0x2a3b9d: "generator",
  _0x50ce2b: "context",
  _0x294839: "innerFn",
  _0x1117f8: "self",
  _0x2880aa: "context",
  _0x4d37d3: "state",
  _0x3c6015: "method",
  _0x216572: "arg",
  _0x5ca39e: "delegate",
  _0xce82aa: "delegateResult",
  _0x208f66: "record",
  _0x436f47: "ContinueSentinel",
  _0x6816bf: "AsyncIterator",
  _0x3b94c3: "generator",
  _0x209efd: "PromiseImpl",
  _0x34e41c: "invoke",
  _0x2267db: "method",
  _0x1e3bb1: "arg",
  _0xba603a: "resolve",
  _0x4816c0: "reject",
  _0x1eac56: "record",
  _0x5b9209: "result",
  _0x51772d: "value",
  _0x4afecd: "awaitedValue",
  _0x5d2b46: "awaitError",
  _0xab9340: "resolvedValue",
  _0x4e89b0: "promiseError",
  _0x2fd497: "previousPromise",
  _0xb21d7a: "method",
  _0x5131cb: "arg",
  _0x21f20c: "callInvoke",
  _0x3bb221: "resolve",
  _0x5eacf6: "reject",
  _0x5a20b2: "tryCatch",
  _0x53f6e3: "hasOwn",
  _0x4a1288: "innerFn",
  _0x12eac9: "outerFn",
  _0xb8d8b1: "self",
  _0x36a67f: "tryLocsList",
  _0x2ab2e3: "PromiseImpl",
  _0xe64de9: "iterator",
  _0x1d8e0d: "result",
};
