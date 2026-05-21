function _slicedToArray(_0x18f0a8, _0x58c945) {
  return _arrayWithHoles(_0x18f0a8) || _iterableToArrayLimit(_0x18f0a8, _0x58c945) || _unsupportedIterableToArray(_0x18f0a8, _0x58c945) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(_0x5d1840, _0x6293cf) {
  var _0x59c4ef = _0x5d1840 == null ? null : typeof Symbol !== "undefined" && _0x5d1840[Symbol.iterator] || _0x5d1840["@@iterator"];
  if (_0x59c4ef == null) {
    return;
  }
  var _0x28c970 = [];
  var _0x371356 = true;
  var _0x535365 = false;
  var _0x16e107;
  var _0xbda1ff;
  try {
    for (_0x59c4ef = _0x59c4ef.call(_0x5d1840); !(_0x371356 = (_0x16e107 = _0x59c4ef.next()).done); _0x371356 = true) {
      _0x28c970.push(_0x16e107.value);
      if (_0x6293cf && _0x28c970.length === _0x6293cf) {
        break;
      }
    }
  } catch (_0x380d03) {
    _0x535365 = true;
    _0xbda1ff = _0x380d03;
  } finally {
    try {
      if (!_0x371356 && _0x59c4ef.return != null) {
        _0x59c4ef.return();
      }
    } finally {
      if (_0x535365) {
        throw _0xbda1ff;
      }
    }
  }
  return _0x28c970;
}
function _arrayWithHoles(_0x4c29b1) {
  if (Array.isArray(_0x4c29b1)) {
    return _0x4c29b1;
  }
}
function _toConsumableArray(_0x10ccd5) {
  return _arrayWithoutHoles(_0x10ccd5) || _iterableToArray(_0x10ccd5) || _unsupportedIterableToArray(_0x10ccd5) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(_0x247166) {
  if (typeof Symbol !== "undefined" && _0x247166[Symbol.iterator] != null || _0x247166["@@iterator"] != null) {
    return Array.from(_0x247166);
  }
}
function _arrayWithoutHoles(_0x272faa) {
  if (Array.isArray(_0x272faa)) {
    return _arrayLikeToArray(_0x272faa);
  }
}
function ownKeys(_0x40988b, _0x4cbd3f) {
  var _0x48e3a2 = Object.keys(_0x40988b);
  if (Object.getOwnPropertySymbols) {
    var _0x1017ff = Object.getOwnPropertySymbols(_0x40988b);
    if (_0x4cbd3f) {
      _0x1017ff = _0x1017ff.filter(function (_0x3d8dd0) {
        return Object.getOwnPropertyDescriptor(_0x40988b, _0x3d8dd0).enumerable;
      });
    }
    _0x48e3a2.push.apply(_0x48e3a2, _0x1017ff);
  }
  return _0x48e3a2;
}
function _objectSpread(_0x3b786d) {
  for (var _0x449d74 = 1; _0x449d74 < arguments.length; _0x449d74++) {
    var _0x49c410 = arguments[_0x449d74] ?? {};
    if (_0x449d74 % 2) {
      ownKeys(Object(_0x49c410), true).forEach(function (_0x4b93c1) {
        _defineProperty(_0x3b786d, _0x4b93c1, _0x49c410[_0x4b93c1]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(_0x3b786d, Object.getOwnPropertyDescriptors(_0x49c410));
    } else {
      ownKeys(Object(_0x49c410)).forEach(function (_0x32e803) {
        Object.defineProperty(_0x3b786d, _0x32e803, Object.getOwnPropertyDescriptor(_0x49c410, _0x32e803));
      });
    }
  }
  return _0x3b786d;
}
function _defineProperty(_0x18bc28, _0x4e0223, _0xb47b23) {
  if (_0x4e0223 in _0x18bc28) {
    Object.defineProperty(_0x18bc28, _0x4e0223, {
      value: _0xb47b23,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    _0x18bc28[_0x4e0223] = _0xb47b23;
  }
  return _0x18bc28;
}
function _regeneratorRuntime() {
  'use strict';

  _regeneratorRuntime = function _0x36404c() {
    return _0x4255d2;
  };
  var _0x4255d2 = {};
  var _0x22d500 = Object.prototype;
  var _0x53f6e3 = _0x22d500.hasOwnProperty;
  var _0x266df8 = typeof Symbol == "function" ? Symbol : {};
  var _0x4fc79d = _0x266df8.iterator || "@@iterator";
  var _0x2cfb41 = _0x266df8.asyncIterator || "@@asyncIterator";
  var _0x3b989c = _0x266df8.toStringTag || "@@toStringTag";
  function _0x247da6(_0x433612, _0x307652, _0x50e7cb) {
    Object.defineProperty(_0x433612, _0x307652, {
      value: _0x50e7cb,
      enumerable: !0,
      configurable: !0,
      writable: !0
    });
    return _0x433612[_0x307652];
  }
  try {
    _0x247da6({}, "");
  } catch (_0x57cd4c) {
    _0x247da6 = function _0x362e8f(_0x244bbd, _0x2cd825, _0x24c785) {
      return _0x244bbd[_0x2cd825] = _0x24c785;
    };
  }
  function _0x317e2a(_0x5a5164, _0x3fd23c, _0x3333d9, _0x509cbe) {
    var _0x5a2bf3 = _0x3fd23c && _0x3fd23c.prototype instanceof _0x4295af ? _0x3fd23c : _0x4295af;
    var _0x2a3b9d = Object.create(_0x5a2bf3.prototype);
    var _0x50ce2b = new _0x24a048(_0x509cbe || []);
    _0x2a3b9d._invoke = function (_0x294839, _0x1117f8, _0x2880aa) {
      var _0x4d37d3 = "suspendedStart";
      return function (_0x3c6015, _0x216572) {
        if (_0x4d37d3 === "executing") {
          throw new Error("Generator is already running");
        }
        if (_0x4d37d3 === "completed") {
          if (_0x3c6015 === "throw") {
            throw _0x216572;
          }
          return _0x524208();
        }
        _0x2880aa.method = _0x3c6015;
        _0x2880aa.arg = _0x216572;
        while (true) {
          var _0x5ca39e = _0x2880aa.delegate;
          if (_0x5ca39e) {
            var _0xce82aa = _0x64bf07(_0x5ca39e, _0x2880aa);
            if (_0xce82aa) {
              if (_0xce82aa === _0x436f47) {
                continue;
              }
              return _0xce82aa;
            }
          }
          if (_0x2880aa.method === "next") {
            _0x2880aa.sent = _0x2880aa._sent = _0x2880aa.arg;
          } else if (_0x2880aa.method === "throw") {
            if (_0x4d37d3 === "suspendedStart") {
              _0x4d37d3 = "completed";
              throw _0x2880aa.arg;
            }
            _0x2880aa.dispatchException(_0x2880aa.arg);
          } else if (_0x2880aa.method === "return") {
            _0x2880aa.abrupt("return", _0x2880aa.arg);
          }
          _0x4d37d3 = "executing";
          var _0x208f66 = _0x5a20b2(_0x294839, _0x1117f8, _0x2880aa);
          if (_0x208f66.type === "normal") {
            _0x4d37d3 = _0x2880aa.done ? "completed" : "suspendedYield";
            if (_0x208f66.arg === _0x436f47) {
              continue;
            }
            return {
              value: _0x208f66.arg,
              done: _0x2880aa.done
            };
          }
          if (_0x208f66.type === "throw") {
            _0x4d37d3 = "completed";
            _0x2880aa.method = "throw";
            _0x2880aa.arg = _0x208f66.arg;
          }
        }
      };
    }(_0x5a5164, _0x3333d9, _0x50ce2b);
    return _0x2a3b9d;
  }
  function _0x5a20b2(_0x5ca8e5, _0x3b387c, _0x59fc06) {
    try {
      return {
        type: "normal",
        arg: _0x5ca8e5.call(_0x3b387c, _0x59fc06)
      };
    } catch (_0x5616d6) {
      return {
        type: "throw",
        arg: _0x5616d6
      };
    }
  }
  _0x4255d2.wrap = _0x317e2a;
  var _0x436f47 = {};
  function _0x4295af() {}
  function _0x305f14() {}
  function _0x364e50() {}
  var _0x530084 = {};
  _0x247da6(_0x530084, _0x4fc79d, function () {
    return this;
  });
  var _0xe6e6ca = Object.getPrototypeOf;
  var _0x38e08f = _0xe6e6ca && _0xe6e6ca(_0xe6e6ca(_0x8bf38d([])));
  if (_0x38e08f && _0x38e08f !== _0x22d500 && _0x53f6e3.call(_0x38e08f, _0x4fc79d)) {
    _0x530084 = _0x38e08f;
  }
  var _0x780270 = _0x364e50.prototype = _0x4295af.prototype = Object.create(_0x530084);
  function _0x571641(_0x4e387b) {
    ["next", "throw", "return"].forEach(function (_0x81475b) {
      _0x247da6(_0x4e387b, _0x81475b, function (_0x4a0f8b) {
        return this._invoke(_0x81475b, _0x4a0f8b);
      });
    });
  }
  function _0x6816bf(_0x3b94c3, _0x209efd) {
    function _0x34e41c(_0x2267db, _0x1e3bb1, _0xba603a, _0x4816c0) {
      var _0x1eac56 = _0x5a20b2(_0x3b94c3[_0x2267db], _0x3b94c3, _0x1e3bb1);
      if (_0x1eac56.type !== "throw") {
        var _0x5b9209 = _0x1eac56.arg;
        var _0x51772d = _0x5b9209.value;
        if (_0x51772d && typeof _0x51772d == "object" && _0x53f6e3.call(_0x51772d, "__await")) {
          return _0x209efd.resolve(_0x51772d.__await).then(function (_0x4afecd) {
            _0x34e41c("next", _0x4afecd, _0xba603a, _0x4816c0);
          }, function (_0x5d2b46) {
            _0x34e41c("throw", _0x5d2b46, _0xba603a, _0x4816c0);
          });
        } else {
          return _0x209efd.resolve(_0x51772d).then(function (_0xab9340) {
            _0x5b9209.value = _0xab9340;
            _0xba603a(_0x5b9209);
          }, function (_0x4e89b0) {
            return _0x34e41c("throw", _0x4e89b0, _0xba603a, _0x4816c0);
          });
        }
      }
      _0x4816c0(_0x1eac56.arg);
    }
    var _0x2fd497;
    this._invoke = function (_0xb21d7a, _0x5131cb) {
      function _0x21f20c() {
        return new _0x209efd(function (_0x3bb221, _0x5eacf6) {
          _0x34e41c(_0xb21d7a, _0x5131cb, _0x3bb221, _0x5eacf6);
        });
      }
      return _0x2fd497 = _0x2fd497 ? _0x2fd497.then(_0x21f20c, _0x21f20c) : _0x21f20c();
    };
  }
  function _0x64bf07(_0x538376, _0x3ffecd) {
    var _0x7d552a = _0x538376.iterator[_0x3ffecd.method];
    if (_0x7d552a === undefined) {
      _0x3ffecd.delegate = null;
      if (_0x3ffecd.method === "throw") {
        if (_0x538376.iterator.return && (_0x3ffecd.method = "return", _0x3ffecd.arg = undefined, _0x64bf07(_0x538376, _0x3ffecd), _0x3ffecd.method === "throw")) {
          return _0x436f47;
        }
        _0x3ffecd.method = "throw";
        _0x3ffecd.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return _0x436f47;
    }
    var _0x1d691e = _0x5a20b2(_0x7d552a, _0x538376.iterator, _0x3ffecd.arg);
    if (_0x1d691e.type === "throw") {
      _0x3ffecd.method = "throw";
      _0x3ffecd.arg = _0x1d691e.arg;
      _0x3ffecd.delegate = null;
      return _0x436f47;
    }
    var _0x41cb55 = _0x1d691e.arg;
    if (_0x41cb55) {
      if (_0x41cb55.done) {
        _0x3ffecd[_0x538376.resultName] = _0x41cb55.value;
        _0x3ffecd.next = _0x538376.nextLoc;
        if (_0x3ffecd.method !== "return") {
          _0x3ffecd.method = "next";
          _0x3ffecd.arg = undefined;
        }
        _0x3ffecd.delegate = null;
        return _0x436f47;
      } else {
        return _0x41cb55;
      }
    } else {
      _0x3ffecd.method = "throw";
      _0x3ffecd.arg = new TypeError("iterator result is not an object");
      _0x3ffecd.delegate = null;
      return _0x436f47;
    }
  }
  function _0x85a41c(_0x3098c5) {
    var _0x1d247b = {
      tryLoc: _0x3098c5[0]
    };
    if (1 in _0x3098c5) {
      _0x1d247b.catchLoc = _0x3098c5[1];
    }
    if (2 in _0x3098c5) {
      _0x1d247b.finallyLoc = _0x3098c5[2];
      _0x1d247b.afterLoc = _0x3098c5[3];
    }
    this.tryEntries.push(_0x1d247b);
  }
  function _0x464650(_0x947221) {
    var _0xba397e = _0x947221.completion || {};
    _0xba397e.type = "normal";
    delete _0xba397e.arg;
    _0x947221.completion = _0xba397e;
  }
  function _0x24a048(_0xb7b6cd) {
    this.tryEntries = [{
      tryLoc: "root"
    }];
    _0xb7b6cd.forEach(_0x85a41c, this);
    this.reset(!0);
  }
  function _0x8bf38d(_0x28b488) {
    if (_0x28b488) {
      var _0x365d3d = _0x28b488[_0x4fc79d];
      if (_0x365d3d) {
        return _0x365d3d.call(_0x28b488);
      }
      if (typeof _0x28b488.next == "function") {
        return _0x28b488;
      }
      if (!isNaN(_0x28b488.length)) {
        var _0x5705a3 = -1;
        var _0x3205e8 = function _0x2e9bd1() {
          while (++_0x5705a3 < _0x28b488.length) {
            if (_0x53f6e3.call(_0x28b488, _0x5705a3)) {
              _0x2e9bd1.value = _0x28b488[_0x5705a3];
              _0x2e9bd1.done = false;
              return _0x2e9bd1;
            }
          }
          _0x2e9bd1.value = undefined;
          _0x2e9bd1.done = !0;
          return _0x2e9bd1;
        };
        return _0x3205e8.next = _0x3205e8;
      }
    }
    return {
      next: _0x524208
    };
  }
  function _0x524208() {
    return {
      value: undefined,
      done: !0
    };
  }
  _0x305f14.prototype = _0x364e50;
  _0x247da6(_0x780270, "constructor", _0x364e50);
  _0x247da6(_0x364e50, "constructor", _0x305f14);
  _0x305f14.displayName = _0x247da6(_0x364e50, _0x3b989c, "GeneratorFunction");
  _0x4255d2.isGeneratorFunction = function (_0x350fd1) {
    var _0xf7102a = typeof _0x350fd1 == "function" && _0x350fd1.constructor;
    return !!_0xf7102a && (_0xf7102a === _0x305f14 || (_0xf7102a.displayName || _0xf7102a.name) === "GeneratorFunction");
  };
  _0x4255d2.mark = function (_0x4b781f) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(_0x4b781f, _0x364e50);
    } else {
      _0x4b781f.__proto__ = _0x364e50;
      _0x247da6(_0x4b781f, _0x3b989c, "GeneratorFunction");
    }
    _0x4b781f.prototype = Object.create(_0x780270);
    return _0x4b781f;
  };
  _0x4255d2.awrap = function (_0xee2193) {
    return {
      __await: _0xee2193
    };
  };
  _0x571641(_0x6816bf.prototype);
  _0x247da6(_0x6816bf.prototype, _0x2cfb41, function () {
    return this;
  });
  _0x4255d2.AsyncIterator = _0x6816bf;
  _0x4255d2.async = function (_0x4a1288, _0x12eac9, _0xb8d8b1, _0x36a67f, _0x2ab2e3 = Promise) {
    var _0xe64de9 = new _0x6816bf(_0x317e2a(_0x4a1288, _0x12eac9, _0xb8d8b1, _0x36a67f), _0x2ab2e3);
    if (_0x4255d2.isGeneratorFunction(_0x12eac9)) {
      return _0xe64de9;
    } else {
      return _0xe64de9.next().then(function (_0x1d8e0d) {
        if (_0x1d8e0d.done) {
          return _0x1d8e0d.value;
        } else {
          return _0xe64de9.next();
        }
      });
    }
  };
  _0x571641(_0x780270);
  _0x247da6(_0x780270, _0x3b989c, "Generator");
  _0x247da6(_0x780270, _0x4fc79d, function () {
    return this;
  });
  _0x247da6(_0x780270, "toString", function () {
    return "[object Generator]";
  });
  _0x4255d2.keys = function (_0x1fbd60) {
    var _0x594520 = [];
    for (var _0x35f32b in _0x1fbd60) {
      _0x594520.push(_0x35f32b);
    }
    _0x594520.reverse();
    return function _0x2d4d30() {
      while (_0x594520.length) {
        var _0x31352f = _0x594520.pop();
        if (_0x31352f in _0x1fbd60) {
          _0x2d4d30.value = _0x31352f;
          _0x2d4d30.done = false;
          return _0x2d4d30;
        }
      }
      _0x2d4d30.done = !0;
      return _0x2d4d30;
    };
  };
  _0x4255d2.values = _0x8bf38d;
  _0x24a048.prototype = {
    constructor: _0x24a048,
    reset: function _0x798464(_0x1f5e5b) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = undefined;
      this.done = !1;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(_0x464650);
      if (!_0x1f5e5b) {
        for (var _0x50d17d in this) {
          if (_0x50d17d.charAt(0) === "t" && _0x53f6e3.call(this, _0x50d17d) && !isNaN(+_0x50d17d.slice(1))) {
            this[_0x50d17d] = undefined;
          }
        }
      }
    },
    stop: function _0x27b592() {
      this.done = !0;
      var _0x2162f2 = this.tryEntries[0].completion;
      if (_0x2162f2.type === "throw") {
        throw _0x2162f2.arg;
      }
      return this.rval;
    },
    dispatchException: function _0x3f21b7(_0x36c067) {
      if (this.done) {
        throw _0x36c067;
      }
      var _0x27eca2 = this;
      function _0x4e891f(_0x3076db, _0x32a741) {
        _0x5bd25c.type = "throw";
        _0x5bd25c.arg = _0x36c067;
        _0x27eca2.next = _0x3076db;
        if (_0x32a741) {
          _0x27eca2.method = "next";
          _0x27eca2.arg = undefined;
        }
        return !!_0x32a741;
      }
      for (var _0x331b44 = this.tryEntries.length - 1; _0x331b44 >= 0; --_0x331b44) {
        var _0x4e52fa = this.tryEntries[_0x331b44];
        var _0x5bd25c = _0x4e52fa.completion;
        if (_0x4e52fa.tryLoc === "root") {
          return _0x4e891f("end");
        }
        if (_0x4e52fa.tryLoc <= this.prev) {
          var _0x559192 = _0x53f6e3.call(_0x4e52fa, "catchLoc");
          var _0x2244b0 = _0x53f6e3.call(_0x4e52fa, "finallyLoc");
          if (_0x559192 && _0x2244b0) {
            if (this.prev < _0x4e52fa.catchLoc) {
              return _0x4e891f(_0x4e52fa.catchLoc, !0);
            }
            if (this.prev < _0x4e52fa.finallyLoc) {
              return _0x4e891f(_0x4e52fa.finallyLoc);
            }
          } else if (_0x559192) {
            if (this.prev < _0x4e52fa.catchLoc) {
              return _0x4e891f(_0x4e52fa.catchLoc, !0);
            }
          } else {
            if (!_0x2244b0) {
              throw new Error("try statement without catch or finally");
            }
            if (this.prev < _0x4e52fa.finallyLoc) {
              return _0x4e891f(_0x4e52fa.finallyLoc);
            }
          }
        }
      }
    },
    abrupt: function _0x2ca7cb(_0x4a865b, _0x39d7ac) {
      for (var _0x355e88 = this.tryEntries.length - 1; _0x355e88 >= 0; --_0x355e88) {
        var _0x153f34 = this.tryEntries[_0x355e88];
        if (_0x153f34.tryLoc <= this.prev && _0x53f6e3.call(_0x153f34, "finallyLoc") && this.prev < _0x153f34.finallyLoc) {
          var _0x137420 = _0x153f34;
          break;
        }
      }
      if (_0x137420 && (_0x4a865b === "break" || _0x4a865b === "continue") && _0x137420.tryLoc <= _0x39d7ac && _0x39d7ac <= _0x137420.finallyLoc) {
        _0x137420 = null;
      }
      var _0x270232 = _0x137420 ? _0x137420.completion : {};
      _0x270232.type = _0x4a865b;
      _0x270232.arg = _0x39d7ac;
      if (_0x137420) {
        this.method = "next";
        this.next = _0x137420.finallyLoc;
        return _0x436f47;
      } else {
        return this.complete(_0x270232);
      }
    },
    complete: function _0x4d013c(_0x4e8d50, _0x5cc8e5) {
      if (_0x4e8d50.type === "throw") {
        throw _0x4e8d50.arg;
      }
      if (_0x4e8d50.type === "break" || _0x4e8d50.type === "continue") {
        this.next = _0x4e8d50.arg;
      } else if (_0x4e8d50.type === "return") {
        this.rval = this.arg = _0x4e8d50.arg;
        this.method = "return";
        this.next = "end";
      } else if (_0x4e8d50.type === "normal" && _0x5cc8e5) {
        this.next = _0x5cc8e5;
      }
      return _0x436f47;
    },
    finish: function _0x486e11(_0x22ec95) {
      for (var _0x4c2a08 = this.tryEntries.length - 1; _0x4c2a08 >= 0; --_0x4c2a08) {
        var _0x353d88 = this.tryEntries[_0x4c2a08];
        if (_0x353d88.finallyLoc === _0x22ec95) {
          this.complete(_0x353d88.completion, _0x353d88.afterLoc);
          _0x464650(_0x353d88);
          return _0x436f47;
        }
      }
    },
    catch: function _0x258c5a(_0x1362c7) {
      for (var _0xb9e2db = this.tryEntries.length - 1; _0xb9e2db >= 0; --_0xb9e2db) {
        var _0x54142e = this.tryEntries[_0xb9e2db];
        if (_0x54142e.tryLoc === _0x1362c7) {
          var _0x5abfc6 = _0x54142e.completion;
          if (_0x5abfc6.type === "throw") {
            var _0x522e97 = _0x5abfc6.arg;
            _0x464650(_0x54142e);
          }
          return _0x522e97;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function _0x48ef57(_0x6a5617, _0x5dd039, _0x12b57b) {
      this.delegate = {
        iterator: _0x8bf38d(_0x6a5617),
        resultName: _0x5dd039,
        nextLoc: _0x12b57b
      };
      if (this.method === "next") {
        this.arg = undefined;
      }
      return _0x436f47;
    }
  };
  return _0x4255d2;
}
function asyncGeneratorStep(_0x1e2eab, _0x2b1326, _0x63db4c, _0x3f7ba8, _0xa6d4b5, _0x4b973f, _0x1437b6) {
  try {
    var _0x2fe12b = _0x1e2eab[_0x4b973f](_0x1437b6);
    var _0x13af4f = _0x2fe12b.value;
  } catch (_0x4860a6) {
    _0x63db4c(_0x4860a6);
    return;
  }
  if (_0x2fe12b.done) {
    _0x2b1326(_0x13af4f);
  } else {
    Promise.resolve(_0x13af4f).then(_0x3f7ba8, _0xa6d4b5);
  }
}
function _asyncToGenerator(_0x3cb3c1) {
  return function () {
    var _0x56557b = this;
    var _0x13ae3e = arguments;
    return new Promise(function (_0x428ae6, _0x5271a8) {
      var _0x364927 = _0x3cb3c1.apply(_0x56557b, _0x13ae3e);
      function _0x5c39e4(_0x268a05) {
        asyncGeneratorStep(_0x364927, _0x428ae6, _0x5271a8, _0x5c39e4, _0xc6a86e, "next", _0x268a05);
      }
      function _0xc6a86e(_0x8e3044) {
        asyncGeneratorStep(_0x364927, _0x428ae6, _0x5271a8, _0x5c39e4, _0xc6a86e, "throw", _0x8e3044);
      }
      _0x5c39e4(undefined);
    });
  };
}
function _createForOfIteratorHelper(_0x18fc46, _0x17477e) {
  var _0x40b46d = typeof Symbol !== "undefined" && _0x18fc46[Symbol.iterator] || _0x18fc46["@@iterator"];
  if (!_0x40b46d) {
    if (Array.isArray(_0x18fc46) || (_0x40b46d = _unsupportedIterableToArray(_0x18fc46)) || _0x17477e && _0x18fc46 && typeof _0x18fc46.length === "number") {
      if (_0x40b46d) {
        _0x18fc46 = _0x40b46d;
      }
      var _0x143dc8 = 0;
      var _0x2d0311 = function _0x40147c() {};
      return {
        s: _0x2d0311,
        n: function _0x25574e() {
          if (_0x143dc8 >= _0x18fc46.length) {
            return {
              done: true
            };
          }
          return {
            done: false,
            value: _0x18fc46[_0x143dc8++]
          };
        },
        e: function _0x20098b(_0x46ea23) {
          throw _0x46ea23;
        },
        f: _0x2d0311
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var _0x117605 = true;
  var _0x43e9c1 = false;
  var _0x457702;
  return {
    s: function _0x320e89() {
      _0x40b46d = _0x40b46d.call(_0x18fc46);
    },
    n: function _0x638c54() {
      var _0x2572d2 = _0x40b46d.next();
      _0x117605 = _0x2572d2.done;
      return _0x2572d2;
    },
    e: function _0x211c19(_0x56ddb1) {
      _0x43e9c1 = true;
      _0x457702 = _0x56ddb1;
    },
    f: function _0x17866c() {
      try {
        if (!_0x117605 && _0x40b46d.return != null) {
          _0x40b46d.return();
        }
      } finally {
        if (_0x43e9c1) {
          throw _0x457702;
        }
      }
    }
  };
}
function _unsupportedIterableToArray(_0x204aff, _0x27fb46) {
  if (!_0x204aff) {
    return;
  }
  if (typeof _0x204aff === "string") {
    return _arrayLikeToArray(_0x204aff, _0x27fb46);
  }
  var _0x21be16 = Object.prototype.toString.call(_0x204aff).slice(8, -1);
  if (_0x21be16 === "Object" && _0x204aff.constructor) {
    _0x21be16 = _0x204aff.constructor.name;
  }
  if (_0x21be16 === "Map" || _0x21be16 === "Set") {
    return Array.from(_0x204aff);
  }
  if (_0x21be16 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(_0x21be16)) {
    return _arrayLikeToArray(_0x204aff, _0x27fb46);
  }
}
function _arrayLikeToArray(_0x3d0eab, _0x2efdd7) {
  if (_0x2efdd7 == null || _0x2efdd7 > _0x3d0eab.length) {
    _0x2efdd7 = _0x3d0eab.length;
  }
  for (var _0x1d4743 = 0, _0x422715 = new Array(_0x2efdd7); _0x1d4743 < _0x2efdd7; _0x1d4743++) {
    _0x422715[_0x1d4743] = _0x3d0eab[_0x1d4743];
  }
  return _0x422715;
}
var start = {
  userIdColorMappings: {},
  inputs: {},
  inputValues: {},
  showMoreLiveChannels: false,
  viewerUpdateFns: [],
  countryFilter: [],
  lastTransactionId: 0
};
start.init = function () {
  start.refreshLiveChannels();
  start.refreshRecentTransactions();
  start.loadFaq();
  setInterval(start.refreshLiveChannels, 300000);
  $("#beginAdventureButton").dxButton({
    text: localization.getString("start_adventure_button"),
    icon: "/img/adventure.gif",
    onClick: function _0x1894e7() {
      navigation.pageChange("setup");
    }
  });
  $("#manualConnectButton").dxButton({
    text: localization.getString("start_connect_button"),
    onClick: function _0x1c0b3c() {
      if (window.isTosViolation) {
        return showTosViolationWarning();
      }
      if (!window.session.me || !window.session.me.channel.channelName) {
        navigation.pageChange("setup");
        setTimeout(function () {
          $(".setupBasic").addClass("shakeEffect");
        }, 1000);
      } else {
        broadcastlistener.tryConnect(true, false, true);
      }
    }
  });
  $("#proPromoButton").dxButton({
    text: "View Details",
    onClick: function _0x18ebea() {
      setup.scrollToPaymentUi("START_PROMOTION", true);
    }
  });
  $("#buttonShowMoreLiveChannels").dxButton({
    text: "Show More",
    onClick: function _0x53a105() {
      $("#buttonShowMoreLiveChannels").fadeOut(100);
      start.showMoreLiveChannels = true;
      start.refreshLiveChannels();
    }
  });
  var _0x1839a3 = 0;
  $("#livechannelcount").click(function () {
    _0x1839a3 += 1;
    if (_0x1839a3 === 2) {
      start.countryFilter = ["DE", "AT", "CH", "LI", "LU"];
      start.showMoreLiveChannels = true;
      start.refreshLiveChannels();
    }
  });
  setInterval(function () {
    if (navigation.currentPage !== "start" || start.viewerUpdateFns.length === 0) {
      return;
    }
    start.viewerUpdateFns.forEach(function (_0x52bd23) {
      if (Math.floor(Math.random() * 3) + 1 === 1) {
        _0x52bd23();
      }
    });
  }, 1000);
  $(".startHidden").hide();
  if (window.session.isElectron) {
    $(".isNotElectron").hide();
    $(".isElectron").show();
  } else {
    $(".isNotElectron").show();
    $(".isElectron").hide();
  }
};
start.initQuickAccessItems = function () {
  start.addQuickAccessItem("tts", "checkboxTtsEnabled", "TTS <small>(Text-to-Speech)</small>");
  start.addQuickAccessItem("sounds", "soundsEnabledCheckbox", "Sound Alerts");
  start.addQuickAccessItem("actionsandevents", "actionsEnabledCheckbox", localization.getString("menu_actionsandevents"));
};
start.addQuickAccessItem = function (_0x324a5d, _0x390b2b, _0x2c2d41) {
  var _0x1b3167 = $("#quickAccessItems");
  var _0x1dbd86 = "quickaccess_shortcut_" + _0x390b2b;
  var _0x210949 = null;
  var _0x45c679 = utils.registerKeyboardShortcut("quickaccess", null, function () {
    if (_0x5e8eb3.find(".quickControlCheckbox").dxCheckBox("instance").option("value")) {
      _0x5e8eb3.find(".quickControlCheckbox").dxCheckBox("instance").option("value", false);
    } else {
      _0x5e8eb3.find(".quickControlCheckbox").dxCheckBox("instance").option("value", true);
    }
  });
  var _0x5e8eb3 = $(`
        <div style="display: inline-block; width: fit-content;">
            <div class="quickControlItem">
                <div style="font-size: 1.1em; margin-top: 2px;">${_0x2c2d41}</small></div>
                <div style="width: 100%; text-align: right; margin-top: -25px; margin-bottom: 17px">
                    <a onclick="navigation.pageChange('${_0x324a5d}')"><i class="fas fa-wrench"></i></a> 
                </div>
                <div class="quickControlCheckbox"></div>
                <div style="font-size: 0.8em; margin-top: 15px;">
                    <a class="quickaccess_keyshortcut_link">${localization.getString("quickaccess_keyshortcut")}</a>
                </div>
            </div>
        </div>
    `);
  var _0x57e4da = function _0x142386(_0x45eae5) {
    if (_0x210949 !== _0x45eae5) {
      settings.set(_0x1dbd86, _0x45eae5 || "");
      _0x210949 = _0x45eae5;
      _0x45c679.key = _0x45eae5;
      if (_0x45eae5) {
        utils.initKeyboardListener();
      }
    }
    if (_0x45eae5) {
      _0x5e8eb3.find(".quickaccess_keyshortcut_link").html(`<span style="color: #cf8846; font-weight: 700;"><i class="fas fa-keyboard"></i> &nbsp; ${_0x45eae5}</span>`);
    } else {
      _0x5e8eb3.find(".quickaccess_keyshortcut_link").text(localization.getString("quickaccess_keyshortcut"));
    }
  };
  var _0x43d129 = _0x5e8eb3.find(".quickControlCheckbox").dxCheckBox({
    text: localization.getString("quickaccess_disabled"),
    value: false,
    onValueChanged: function _0xf66783(_0x5f1bf2) {
      var _0x1b37aa;
      _0x5f1bf2.component.option("text", _0x5f1bf2.value ? localization.getString("quickaccess_enabled") : localization.getString("quickaccess_disabled"));
      if ((_0x1b37aa = window[_0x324a5d]) !== null && _0x1b37aa !== undefined && _0x1b37aa.inputs[_0x390b2b]) {
        window[_0x324a5d].inputs[_0x390b2b].option("value", _0x5f1bf2.value);
      } else {
        toastr.error("Could not find checkbox input");
      }
    }
  }).dxCheckBox("instance");
  setInterval(function () {
    var _0x238e1c;
    var _0x37b838 = (_0x238e1c = window[_0x324a5d]) === null || _0x238e1c === undefined ? undefined : _0x238e1c.inputValues[_0x390b2b];
    if (typeof _0x37b838 === "boolean") {
      _0x43d129.option("value", _0x37b838);
    }
  }, 1000);
  _0x5e8eb3.find(".quickaccess_keyshortcut_link").click(function () {
    utils.openKeyShortcutSelectModal(_0x210949, _0x2c2d41, _0x57e4da);
  });
  _0x1b3167.append(_0x5e8eb3);
  _0x57e4da(settings.get(_0x1dbd86, "") || null);
};
start.onChannelContextChanged = function () {
  if (window.session.me) {
    $("#quickAccessArea").css("display", "block");
    start.initQuickAccessItems();
  }
  if (window.session.me && window.session.me.channel.customInfoText) {
    $("#customInfoText").html(window.session.me.channel.customInfoText);
  }
  if (window.session.me.channel.agencyId && window.session.me.activePromotions.length > 0) {
    window.session.me.activePromotions = window.session.me.activePromotions.filter(function (_0x137150) {
      return ![6, 7].includes(_0x137150.id);
    });
  }
  if (window.session.me.channel.agencyId && window.session.me.channel.agencyId !== "trueconnective" && window.session.me.activePromotions.length > 0) {
    window.session.me.activePromotions = window.session.me.activePromotions.filter(function (_0x434e98) {
      return ![9, 10, 19].includes(_0x434e98.id);
    });
  }
  if (window.session.me.channel.tiktokAgencyInfoId) {
    window.session.me.activePromotions = window.session.me.activePromotions.filter(function (_0x459623) {
      return !_0x459623.agencyId || _0x459623.agencyId === window.session.me.channel.tiktokAgencyInfoId;
    });
  }
  if (window.session.me.activePromotions?.length > 0) {
    $("#promotionSection").css("display", "block");
    $("#promotionItems").empty();
    var _0x1b5d25 = false;
    var _0x2f6a21 = _createForOfIteratorHelper(window.session.me.activePromotions);
    var _0x3f5d98;
    try {
      var _0x5c6546 = function _0x5e414e() {
        var _0x32779e = _0x3f5d98.value;
        var _0x412b34 = undefined;
        var _0x1cf4ec = false;
        if (_0x32779e.bannerSrc.includes(".mp4")) {
          _0x412b34 = $("<video>").attr("src", _0x32779e.bannerSrc).attr("muted", "1").attr("autoplay", "1").attr("loop", "1").css("width", "100%").css("margin-top", _0x1b5d25 ? "15px" : "0px").css("border-radius", "8px").css("cursor", "pointer").css("opacity", "0.9");
          _0x412b34[0].autoplay = true;
          _0x412b34[0].muted = true;
          _0x412b34[0].play();
        } else {
          _0x412b34 = $("<img>").attr("src", _0x32779e.bannerSrc).css("width", "100%").css("margin-top", _0x1b5d25 ? "15px" : "0px").css("border-radius", "8px").css("cursor", "pointer");
        }
        _0x412b34.on("load", function () {
          if (!_0x1cf4ec) {
            _0x1cf4ec = true;
            api.doAction("POST", "promo/event", {
              promotionId: _0x32779e.id,
              eventName: "LOAD"
            }, function () {}, function () {});
          }
        });
        _0x412b34.on("play", function () {
          if (!_0x1cf4ec) {
            _0x1cf4ec = true;
            api.doAction("POST", "promo/event", {
              promotionId: _0x32779e.id,
              eventName: "LOAD"
            }, function () {}, function () {});
          }
        });
        _0x412b34.on("click", function () {
          var _0x4ab120 = function _0x247872(_0x158e2a = 0) {
            if (_0x158e2a > 3) {
              return;
            }
            api.doAction("POST", "promo/event", {
              promotionId: _0x32779e.id,
              eventName: "CLICK"
            }, function () {}, function () {
              setTimeout(function () {
                _0x247872(_0x158e2a + 1);
              }, 3000);
            });
          };
          _0x4ab120();
          if (_0x32779e.bannerHref.indexOf("javascript:") === 0) {
            window.eval(_0x32779e.bannerHref.replace("javascript:", ""));
          } else {
            window.open(_0x32779e.bannerHref, "_blank");
          }
        });
        $("#promotionItems").append(_0x412b34);
        _0x1b5d25 = true;
      };
      for (_0x2f6a21.s(); !(_0x3f5d98 = _0x2f6a21.n()).done;) {
        _0x5c6546();
      }
    } catch (_0x5410af) {
      _0x2f6a21.e(_0x5410af);
    } finally {
      _0x2f6a21.f();
    }
  }
};
start.onVisible = function () {
  start.refreshLiveChannels();
  start.refreshRecentTransactions();
  start.showItems();
  start.runPreview();
};
start.onHide = function () {
  $(".startHidden").hide();
};
start.showItems = function () {
  $(".startHidden").hide();
  setTimeout(function () {
    $(".startHidden").each(function (_0x40d9e8, _0x5c62cb) {
      setTimeout(function () {
        return $(_0x5c62cb).slideDown(200);
      }, _0x40d9e8 * 200);
    });
  }, 200);
  $(".startFadeInAfter").removeClass("shakeEffect");
  setTimeout(function () {
    if ($(".startFadeInAfter").css("opacity") == 0) {
      $(".startFadeInAfter").hide().css("opacity", "1").fadeIn(200).addClass("shakeEffect");
    }
  }, 1200);
};
start.refreshLiveChannels = function () {
  if (navigation.currentPage !== "start") {
    return;
  }
  var _0x33757b = {
    limit: 60
  };
  if (settings.get("channelId") === "1") {
    _0x33757b.includeFeatures = "1";
    _0x33757b.includeProFeatureForAdmins = "1";
  }
  api.get("getLiveChannels", _0x33757b, function (_0x151922) {
    start.viewerUpdateFns = [];
    $("#liveChannelList").empty();
    if (!_0x151922.liveChannels || _0x151922.liveChannels.length === 0) {
      $("#liveChannelList").html("<br><i>Ohhh, no one is live :(</i>");
      $("#recentTransactions").hide();
    }
    $("#livechannelcount").text("(" + _0x151922.liveChannelCount + ")");
    var _0x9f7ac7 = 0;
    var _0x1f43e2 = 0;
    var _0x1a72f3 = [];
    _0x151922.liveChannels.sort(function (_0x4050b0, _0xae5f8e) {
      return _0xae5f8e.viewerCount - _0x4050b0.viewerCount;
    }).filter(function (_0x29d546) {
      if (start.countryFilter.length > 0 && !start.countryFilter.includes(_0x29d546.countryCode)) {
        return false;
      }
      if (_0x1a72f3.includes(_0x29d546.ownerUserId)) {
        return false;
      }
      _0x1a72f3.push(_0x29d546.ownerUserId);
      return true;
    }).slice(0, start.showMoreLiveChannels ? 400 : 20).forEach(function (_0x18569e) {
      var _0x487251;
      _0x1f43e2 += 1;
      _0x9f7ac7 += 0.2;
      var _0x7da67 = $("<div>");
      _0x7da67.addClass("liveChannelElement");
      _0x7da67.css("margin-top", "15px");
      _0x7da67.css("margin-right", "15px");
      _0x7da67.css("background-color", (_0x487251 = _0x18569e.activeFeatures) !== null && _0x487251 !== undefined && _0x487251.includes("PRO") && settings.get("channelId") === "1" ? "#402451" : "#2a2a2a");
      _0x7da67.css("border", "1px solid");
      _0x7da67.css("border-color", "#3f3f3f");
      _0x7da67.css("width", "200px");
      _0x7da67.css("height", "50px");
      _0x7da67.css("cursor", "pointer");
      if (typeof _0x18569e.channelName === "string") {
        _0x7da67.click(function () {
          window.open("https://www.tiktok.com/@" + _0x18569e.channelName.trim() + "/live", "_blank");
        });
      }
      var _0x1446f6 = $("<img>");
      _0x1446f6.css("height", "50px");
      _0x1446f6.css("width", "50px");
      _0x1446f6.attr("src", utils.getUserThumbnailUrlFromUserId(_0x18569e.ownerUserId, _0x18569e.channelId));
      _0x1446f6.attr("onerror", "this.src='/img/nothumb.webp'");
      _0x1446f6.css("border-right", "1px solid");
      _0x1446f6.css("border-color", "#3f3f3f");
      var _0x36b82a = $("<div>");
      _0x36b82a.css("position", "absolute");
      _0x36b82a.css("margin-left", "59px");
      _0x36b82a.css("margin-top", "-52px");
      _0x36b82a.css("max-width", "136px");
      _0x36b82a.css("overflow", "hidden");
      _0x36b82a.css("text-overflow", "ellipsis");
      _0x36b82a.css("white-space", "nowrap");
      _0x36b82a.text(_0x18569e.channelName);
      var _0x41fa49 = $("<div>");
      _0x41fa49.css("position", "absolute");
      _0x41fa49.css("margin-left", "59px");
      _0x41fa49.css("margin-top", "-30px");
      _0x41fa49.css("font-size", "0.9em");
      _0x41fa49.addClass("liveGlow");
      _0x41fa49.css("animation-delay", _0x9f7ac7 + "s");
      _0x41fa49.text("LIVE");
      var _0x87cf0c = $("<div>");
      _0x87cf0c.css("position", "absolute");
      _0x87cf0c.css("margin-left", "100px");
      _0x87cf0c.css("margin-top", "-30px");
      _0x87cf0c.css("color", "#949494");
      _0x87cf0c.css("font-size", "0.9em");
      _0x87cf0c.text(_0x18569e.countryCode);
      var _0x1141fd = $("<div>");
      _0x1141fd.css("position", "absolute");
      _0x1141fd.css("margin-left", "130px");
      _0x1141fd.css("margin-top", "-30px");
      _0x1141fd.css("color", "#949494");
      _0x1141fd.css("font-size", "0.9em");
      _0x1141fd.css("width", "60px");
      _0x1141fd.css("text-align", "right");
      function _0x8bfab7(_0x10f061, _0x26dab7) {
        return Math.floor(Math.random() * (_0x26dab7 - _0x10f061 + 1) + _0x10f061);
      }
      function _0x3db0b9() {
        var _0x3bfa2c = _0x18569e.viewerCount + _0x8bfab7(0, Math.floor(_0x18569e.viewerCount / 50));
        if (isNaN(_0x3bfa2c) || !_0x3bfa2c) {
          _0x3bfa2c = 0;
        }
        var _0x5e33b3 = _0x3bfa2c;
        if (_0x3bfa2c >= 1000) {
          _0x5e33b3 = (_0x3bfa2c / 1000).toFixed(1) + "k";
        }
        if (_0x3bfa2c >= 100000) {
          _0x5e33b3 = Math.round(_0x3bfa2c / 1000) + "k";
        }
        if (_0x1141fd.lastValue !== _0x3bfa2c) {
          _0x1141fd.removeClass("viewerUpdateBlink");
          setTimeout(function () {
            _0x1141fd.addClass("viewerUpdateBlink");
            setTimeout(function () {
              _0x1141fd.html("<i class=\"fas fa-eye\"></i> " + _0x5e33b3);
            }, 50);
          }, 100);
        }
        _0x1141fd.lastValue = _0x3bfa2c;
      }
      _0x3db0b9();
      start.viewerUpdateFns.push(_0x3db0b9);
      var _0x2c1a9d = $("<div>");
      _0x2c1a9d.css("position", "absolute");
      _0x2c1a9d.css("margin-left", _0x18569e.songRequestsEnabled ? "100px" : "110px");
      _0x2c1a9d.css("margin-top", "-27px");
      _0x2c1a9d.css("padding-left", "5px");
      _0x2c1a9d.css("padding-right", "5px");
      _0x2c1a9d.css("border-radius", "5px");
      _0x2c1a9d.css("color", "#fff");
      _0x2c1a9d.css("background-color", "rgb(40 97 165)");
      _0x2c1a9d.css("font-size", "0.7em");
      _0x2c1a9d.text("+SubCatch");
      var _0x114652 = $("<div>");
      _0x114652.css("position", "absolute");
      _0x114652.css("margin-left", "170px");
      _0x114652.css("margin-top", "-27px");
      _0x114652.css("padding-left", "5px");
      _0x114652.css("padding-right", "5px");
      _0x114652.css("border-radius", "5px");
      _0x114652.css("color", "#fff");
      _0x114652.css("background-color", "rgb(6 136 86)");
      _0x114652.css("font-size", "0.7em");
      _0x114652.html("<i class=\"fas fa-headphones\"></i>");
      _0x7da67.append(_0x1446f6);
      _0x7da67.append(_0x36b82a);
      _0x7da67.append(_0x41fa49);
      _0x7da67.append(_0x1141fd);
      if (start.countryFilter.length > 0) {
        _0x7da67.append(_0x87cf0c);
      }
      if (_0x18569e.catchProEnabled) {
        _0x2c1a9d.css("background-color", "rgb(165 40 40)");
      }
      if (_0x18569e.catchEnabled) {
        _0x7da67.append(_0x2c1a9d);
      }
      if (_0x18569e.songRequestsEnabled) {
        _0x7da67.append(_0x114652);
      }
      var _0x1dbbe1 = $("<div>");
      if (_0x1f43e2 >= 5) {
        $("#liveChannelList").append($("<div>").css("display", "table-row"));
        _0x1f43e2 = 1;
      }
      _0x1dbbe1.css("display", "table-cell");
      _0x1dbbe1.append(_0x7da67);
      $("#liveChannelList").append(_0x1dbbe1);
    });
  });
};
start.getColorByUserId = function (_0x5e0f4f) {
  if (_0x5e0f4f == 39091914) {
    return "#31b5d5";
  }
  if (start.userIdColorMappings[_0x5e0f4f]) {
    return start.userIdColorMappings[_0x5e0f4f];
  }
  function _0x164009(_0x43a81e, _0x240a99) {
    return Math.floor(Math.random() * (_0x240a99 - _0x43a81e + 1) + _0x43a81e);
  }
  start.userIdColorMappings[_0x5e0f4f] = "rgba(" + _0x164009(100, 240) + "," + _0x164009(100, 240) + "," + _0x164009(100, 240) + ", 1)";
  return start.userIdColorMappings[_0x5e0f4f];
};
start.addRecentTransactionRow = function (_0x27a148) {
  if (navigation.currentPage !== "start") {
    return;
  }
  if (!$("#recentTransactionsTableHeader").isInViewport()) {
    return;
  }
  var _0x467810 = $("<tr>");
  var _0x17f2de = _0x27a148.amount.toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
  var _0x325fc9 = null;
  if (_0x27a148.amount > 0) {
    _0x17f2de = "+ " + _0x17f2de;
    _0x325fc9 = "#08d687";
  } else {
    _0x17f2de = _0x17f2de.replace("-", "- ");
    _0x325fc9 = "#f64a4a";
  }
  var _0x3a5f7b = $("<td>").css("width", "25%").append($("<a>").attr("href", "https://www.tiktok.com/@" + _0x27a148.channelName + "/live").css("color", start.getColorByUserId(_0x27a148.channelId)).attr("target", "_blank").text(_0x27a148.channelName));
  var _0x360b62 = $("<td>").css("width", "25%").append($("<a>").attr("href", "https://www.tiktok.com/@" + _0x27a148.username).css("color", start.getColorByUserId(_0x27a148.userId)).attr("target", "_blank").text(_0x27a148.username));
  var _0x1f226a = $("<td>").css("width", "15%").text(_0x17f2de).css("color", _0x325fc9);
  var _0x4e8c3a = $("<td>").css("width", "35%").text(_0x27a148.description);
  _0x467810.hide();
  _0x467810.append(_0x3a5f7b).append(_0x360b62).append(_0x1f226a).append(_0x4e8c3a);
  _0x467810.fadeIn(200);
  if ($("#recentTransactionsTableBody").find("table").first().find("tr").length > 20) {
    $("#recentTransactionsTableBody").find("table").first().find("tr").first().remove();
  }
  $("#recentTransactionsTableBody").find("table").first().append(_0x467810);
  $("#recentTransactionsTableBody").stop().animate({
    scrollTop: $("#recentTransactionsTableBody")[0].scrollHeight
  }, 100);
  if (_0x27a148.transactionId > start.lastTransactionId) {
    start.lastTransactionId = _0x27a148.transactionId;
    $("#recentTransactionsTotalCount").text((_0x27a148.transactionId + 2063824754 + 1988040963).toLocaleString());
  }
};
start.refreshRecentTransactions = function () {
  api.get("getGlobalTransactions", null, function (_0x4911ab) {
    _0x4911ab.globalTransactions.forEach(function (_0x3f63dd) {
      start.addRecentTransactionRow(_0x3f63dd);
    });
  });
};
start.loadFaq = function () {
  $.get("/docs/faq-en.md?t=" + new Date().getTime(), function (_0x3caa99) {
    var _0x2aaff9 = new showdown.Converter().makeHtml(_0x3caa99);
    _0x2aaff9 = _0x2aaff9.replaceAll("<h3", "</details><details><summary style='cursor: pointer;' ");
    _0x2aaff9 = _0x2aaff9.replaceAll("</h3>", "</summary>");
    _0x2aaff9 = _0x2aaff9.replace("</details>", "");
    $("#faqContent").html(_0x2aaff9);
  });
};
var previewStarted = false;
start.runPreview = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
  var _0x39b56e;
  var _0x12474e;
  var _0x17898a;
  var _0x48265f;
  var _0x5b7810;
  var _0x492ad7;
  var _0x256430;
  var _0x5ed76a;
  return _regeneratorRuntime().wrap(function _0x18ea35(_0x1b1306) {
    while (1) {
      switch (_0x1b1306.prev = _0x1b1306.next) {
        case 0:
          if (settings.get("channelId") === "0") {
            _0x1b1306.next = 3;
            break;
          }
          $("#unregisteredOverlayPreview").css("display", "none");
          return _0x1b1306.abrupt("return");
        case 3:
          if (!previewStarted) {
            _0x1b1306.next = 5;
            break;
          }
          return _0x1b1306.abrupt("return");
        case 5:
          previewStarted = true;
          _0x39b56e = $("#unregisteredOverlayPreview");
          _0x12474e = _0x39b56e.find(".greyBackgroundSection");
          _0x39b56e.css("display", "block");
          if (window.innerWidth > 1800) {
            _0x39b56e.css("position", "absolute");
            _0x12474e.removeClass("greyBackgroundSection");
            _0x12474e.css("position", "fixed");
            _0x12474e.css("top", "50px");
            _0x12474e.css("left", "1200px");
            $("#overlayPreviewFrame").css("width", "600px").css("height", "400px");
            $("#overlayPreviewFrameContainer").css("width", "600px").css("height", "400px");
          } else {
            $("#overlayPreviewFrame").css("width", "100%").css("height", "400px");
            $("#overlayPreviewFrameContainer").css("width", "100%").css("height", "400px");
          }
          _0x17898a = new Typewriter("#previewTitle", {
            delay: 30
          });
          _0x48265f = new Typewriter("#previewText", {
            delay: 30
          });
          _0x5b7810 = $("#overlayPreviewFrameContainer");
          _0x492ad7 = $("#overlayPreviewFrame");
          _0x256430 = function _0x5cca15(_0x4ec5fd) {
            return new Promise(function (_0x56b990) {
              var _0x2857cf = setInterval(function () {
                if (document.visibilityState === "visible" && window.navigation?.currentPage === "start") {
                  clearInterval(_0x2857cf);
                  return _0x56b990();
                }
              }, _0x4ec5fd * 1000);
            });
          };
          _0x5ed76a = function () {
            var _0x3e60cd = _asyncToGenerator(_regeneratorRuntime().mark(function _0x3db1c8(_0x4d9bd7) {
              return _regeneratorRuntime().wrap(function _0x26e9d3(_0x20ef2d) {
                while (1) {
                  switch (_0x20ef2d.prev = _0x20ef2d.next) {
                    case 0:
                      _0x492ad7.fadeOut(200);
                      _0x20ef2d.next = 3;
                      return _0x256430(0.2);
                    case 3:
                      _0x492ad7.attr("src", "/widget/" + _0x4d9bd7 + "?cid=0&screen=1&preview=1&onStartPage=1");
                      _0x20ef2d.next = 6;
                      return _0x256430(0.2);
                    case 6:
                      _0x492ad7.fadeIn(300);
                    case 7:
                    case "end":
                      return _0x20ef2d.stop();
                  }
                }
              }, _0x3db1c8);
            }));
            return function _0x20b568(_0x37978c) {
              return _0x3e60cd.apply(this, arguments);
            };
          }();
        case 16:
          if (!true) {
            _0x1b1306.next = 161;
            break;
          }
          _0x17898a.deleteAll().start();
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 21;
          return _0x256430(2);
        case 21:
          _0x17898a.typeString("Welcome to <b><span class='ttred'>Tik</span><span style='color: white'>Finity</span></b>!").start();
          _0x5ed76a("myactions");
          _0x1b1306.next = 25;
          return _0x256430(3);
        case 25:
          _0x48265f.typeString("Join the ultimate TikTok Live Experience!").start();
          _0x1b1306.next = 28;
          return _0x256430(3);
        case 28:
          _0x17898a.deleteAll().start();
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 32;
          return _0x256430(3);
        case 32:
          _0x17898a.typeString("Interactive Stream Widgets").start();
          _0x1b1306.next = 35;
          return _0x256430(3);
        case 35:
          _0x48265f.typeString("To thank your supporters!").start();
          _0x1b1306.next = 38;
          return _0x256430(5);
        case 38:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 41;
          return _0x256430(3);
        case 41:
          _0x48265f.typeString("To increase viewer engagement!").start();
          _0x1b1306.next = 44;
          return _0x256430(5);
        case 44:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 47;
          return _0x256430(3);
        case 47:
          _0x48265f.typeString("Create your own alerts for gifts, follows, shares, likes and much more!!").start();
          _0x1b1306.next = 50;
          return _0x256430(5);
        case 50:
          _0x48265f.deleteAll().start();
          _0x17898a.deleteAll().start();
          _0x1b1306.next = 54;
          return _0x256430(4);
        case 54:
          _0x17898a.typeString("Keep track of all activities").start();
          _0x5ed76a("chat");
          _0x1b1306.next = 58;
          return _0x256430(2);
        case 58:
          _0x48265f.typeString("With customizable overlays for your stream chat!").start();
          _0x1b1306.next = 61;
          return _0x256430(6);
        case 61:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 64;
          return _0x256430(3);
        case 64:
          _0x48265f.typeString("Show your TikTok chat on any platform!").start();
          _0x1b1306.next = 67;
          return _0x256430(6);
        case 67:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 70;
          return _0x256430(3);
        case 70:
          _0x48265f.typeString("List all received gifts in one overlay!").start();
          _0x5ed76a("gifts");
          _0x1b1306.next = 74;
          return _0x256430(6);
        case 74:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 77;
          return _0x256430(4);
        case 77:
          _0x48265f.typeString("Easy to implement!").start();
          _0x1b1306.next = 80;
          return _0x256430(6);
        case 80:
          _0x17898a.deleteAll().start();
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 84;
          return _0x256430(4);
        case 84:
          _0x17898a.typeString("Make your stream more colorful!").start();
          _0x5ed76a("emojify");
          _0x1b1306.next = 88;
          return _0x256430(4);
        case 88:
          _0x48265f.typeString("With overlays that your viewers can control!").start();
          _0x1b1306.next = 91;
          return _0x256430(6);
        case 91:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 94;
          return _0x256430(4);
        case 94:
          _0x48265f.typeString("With overlays that react to your viewers!").start();
          _0x1b1306.next = 97;
          return _0x256430(6);
        case 97:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 100;
          return _0x256430(4);
        case 100:
          _0x48265f.typeString("Let your emotes and emojis appear in the stream!").start();
          _0x1b1306.next = 103;
          return _0x256430(6);
        case 103:
          _0x48265f.deleteAll().start();
          _0x17898a.deleteAll().start();
          _0x1b1306.next = 107;
          return _0x256430(4);
        case 107:
          _0x17898a.typeString("Play mini-games with your viewers!").start();
          _0x5ed76a("wheel");
          _0x1b1306.next = 111;
          return _0x256430(4);
        case 111:
          _0x48265f.typeString("And reward viewers for their activities!").start();
          _0x1b1306.next = 114;
          return _0x256430(6);
        case 114:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 117;
          return _0x256430(4);
        case 117:
          _0x48265f.typeString("With the integrated channel points system for TikTok Live!").start();
          _0x5ed76a("coindrop");
          _0x1b1306.next = 121;
          return _0x256430(6);
        case 121:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 124;
          return _0x256430(4);
        case 124:
          _0x48265f.typeString("Reward your viewers for chatting and giving gifts!").start();
          _0x5ed76a("transactionviewer");
          _0x1b1306.next = 128;
          return _0x256430(6);
        case 128:
          _0x48265f.deleteAll().start();
          _0x17898a.deleteAll().start();
          _0x1b1306.next = 132;
          return _0x256430(4);
        case 132:
          _0x17898a.typeString("Build a leaderboard with your most loyal viewers!").start();
          _0x1b1306.next = 135;
          return _0x256430(4);
        case 135:
          _0x48265f.typeString("Your viewers can check the <b>!score</b> with simple chat commands").start();
          _0x5ed76a("userinfo");
          _0x1b1306.next = 139;
          return _0x256430(6);
        case 139:
          _0x48265f.deleteAll().start();
          _0x1b1306.next = 142;
          return _0x256430(4);
        case 142:
          _0x48265f.typeString("You can create your own chat commands!").start();
          _0x5ed76a("commandinfo");
          _0x1b1306.next = 146;
          return _0x256430(6);
        case 146:
          _0x48265f.deleteAll().start();
          _0x17898a.deleteAll().start();
          _0x1b1306.next = 150;
          return _0x256430(4);
        case 150:
          _0x17898a.typeString("Show your top supporters in your stream!").start();
          _0x5ed76a("topgifter");
          _0x1b1306.next = 154;
          return _0x256430(4);
        case 154:
          _0x48265f.typeString("With a customizable ranking list!").start();
          _0x1b1306.next = 157;
          return _0x256430(6);
        case 157:
          _0x48265f.deleteAll().start();
          _0x17898a.deleteAll().start();
          _0x1b1306.next = 16;
          break;
        case 161:
        case "end":
          return _0x1b1306.stop();
      }
    }
  }, _callee2);
}));
var setup = {
  inputs: {},
  inputValues: {}
};
setup.levelListLinkClosed = "<i class=\"fas fa-chevron-down\"></i> " + localization.getString("setup_level_list_show");
setup.levelListLinkExpanded = "<i class=\"fas fa-chevron-up\"></i> " + localization.getString("setup_level_list_hide");
setup.userLastMessageSent = {};
setup.obsConnection = null;
setup.updateChannelTimeout = null;
setup.paymentUiCreated = false;
setup.debugEnabled = false;
setup.streamerbotConnection = null;
setup.openCheckoutWindows = [];
setup.init = function () {
  var _0x3b4057;
  var _0x562d38 = posthog.getFeatureFlag("new-navigation-design");
  if (_0x562d38) {
    document.body.setAttribute("data-new-navigation-design", "true");
  }
  utils.initDxInput(setup, "dxButton", $("#buttonLoginWithEmail"), null, {
    text: localization.getString("setup_channel_connection_connect"),
    width: "350px",
    height: "45px",
    icon: "/img/email.png",
    onClick: function _0x2ea341() {
      if (window.appConfig.useAuthApi) {
        openAuthPopup($("#loginPopup"));
      } else {
        settings.set("pendingLogin", "1");
        window.location.href = "/login";
      }
    }
  });
  function _0x171b1d() {
    if (window.session.isElectron) {
      var _0x56d6aa = utils.uuidv4();
      window.open(`${location.origin}/auth/google?remoteAuthCallbackId=${_0x56d6aa}`, "_blank");
      window.addEventListener("message", setup.googleLoginCallbackHandler);
      socketiowrapper.io.emit("remoteAuth", _0x56d6aa);
      socketiowrapper.io.on("remoteAuthCallback", function (_0x11c6be) {
        if (_0x11c6be.remoteAuthCallbackId === _0x56d6aa) {
          setup.setPendingGoogleLogin(_0x11c6be.token);
        }
      });
    } else {
      window.location.replace("/auth/google");
    }
  }
  utils.initDxInput(setup, "dxButton", $("#buttonLoginWithGoogle"), null, {
    text: localization.getString("setup_channel_connection_connect_google"),
    width: "350px",
    height: "45px",
    icon: "/img/Google__G__Logo.svg",
    onClick: _0x171b1d
  });
  $("#upgrNativeModal").find(".nativeModalClose").click(function () {
    setup.closeNativeUpgradeModal();
  });
  $("#upgrNativeModal").click(function (_0x3931d8) {
    if (_0x3931d8.target.id === "upgrNativeModal") {
      setup.closeNativeUpgradeModal();
    }
  });
  utils.initDxInput(setup, "dxButton", $("#buttonLogout"), null, {
    text: localization.getString("setup_channel_connection_disconnect"),
    width: "180px",
    onClick: setup.disconnect,
    disabled: crossconnect.getIsIframed()
  });
  utils.initDxInput(setup, "dxTextBox", $("#textboxChannelName"), "", {
    placeholder: "TikTok @username",
    valueChangeEvent: "keyup"
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxPointsPerBarEnabled"), true, {
    text: localization.getString("setup_points_per_bar")
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxPointsPerInvite"), false, {
    text: localization.getString("setup_points_per_invite")
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxPointsPerChatminute"), false, {
    text: localization.getString("setup_points_per_chatminute")
  });
  utils.initDxInput(setup, "dxTextBox", $("#textboxCurrencyName"), "Points");
  utils.initDxInput(setup, "dxNumberBox", $("#textboxPointsPerBar"), 1, {
    min: 0,
    max: 50,
    step: 0.01,
    showSpinButtons: true
  });
  utils.initDxInput(setup, "dxNumberBox", $("#textboxPointsPerChatminute"), 0.5, {
    min: 0,
    step: 0.01,
    max: 50000,
    showSpinButtons: true
  });
  utils.initDxInput(setup, "dxNumberBox", $("#textboxPointsPerInvite"), 3, {
    min: 0,
    max: 100000,
    showSpinButtons: true
  });
  utils.initDxInput(setup, "dxNumberBox", $("#textboxSubscriberBonus"), 0, {
    min: 0,
    max: 100,
    showSpinButtons: true,
    format: "#0'%'"
  });
  utils.initDxInput(setup, "dxNumberBox", $("#textboxLevelPoints"), 50, {
    min: 1,
    max: 10000,
    showSpinButtons: true
  });
  utils.initDxInput(setup, "dxNumberBox", $("#textboxLevelMultiplikator"), 1.03, {
    min: 1,
    max: 1.1,
    step: 0.01,
    showSpinButtons: true
  });
  utils.initDxInput(setup, "dxTextBox", $("#obsWebsocketIp"), "127.0.0.1", {
    placeholder: "127.0.0.1"
  });
  utils.initDxInput(setup, "dxNumberBox", $("#obsWebsocketPort"), 4455, {
    placeholder: "4455"
  });
  utils.initDxInput(setup, "dxTextBox", $("#obsWebsocketPassword"), "", {
    mode: "password",
    placeholder: "(optional)"
  });
  utils.initDxInput(setup, "dxButton", $("#obsWebsocketTestConnectionButton"), null, {
    text: localization.getString("setup_obs_connection_test"),
    width: "160px",
    onClick: setup.testObsConnection
  });
  utils.initDxInput(setup, "dxTextBox", $("#streamerbotWebsocketIp"), "127.0.0.1", {
    placeholder: "127.0.0.1"
  });
  utils.initDxInput(setup, "dxNumberBox", $("#streamerbotWebsocketPort"), 8080, {
    placeholder: "8080"
  });
  utils.initDxInput(setup, "dxTextBox", $("#streamerbotWebsocketEndpoint"), "/", {
    placeholder: "/"
  });
  utils.initDxInput(setup, "dxButton", $("#streamerbotTestButton"), null, {
    text: localization.getString("setup_streamerbot_connection_test"),
    width: "160px",
    onClick: function _0x2ffd3f() {
      $("#streamerbotTestButton").dxButton("instance").option("disabled", true);
      setup.testStreamerbotConnection().then(function () {
        $("#streamerbotTestButton").dxButton("instance").option("disabled", false);
      });
    }
  });
  utils.initDxInput(setup, "dxTextBox", $("#mcPlayerName"), "", {
    placeholder: "(required for ServerTap Plugin)"
  });
  utils.initDxInput(setup, "dxTextBox", $("#mcRestIp"), "127.0.0.1", {
    placeholder: "127.0.0.1",
    valueChangeEvent: "keyup"
  });
  utils.initDxInput(setup, "dxNumberBox", $("#mcRestPort"), 4567, {
    placeholder: "4567"
  });
  utils.initDxInput(setup, "dxTextBox", $("#mcRestPassword"), "change_me", {
    placeholder: "Password from config.yml"
  });
  utils.initDxInput(setup, "dxButton", $("#mcRestTestConnectionButton"), null, {
    text: localization.getString("setup_mc_connection_test"),
    width: "160px",
    onClick: setup.testMcConnection
  });
  utils.initDxInput(setup, "dxButton", $("#setupPointsDbResetButton"), null, {
    text: localization.getString("setup_coin_dbreset_button"),
    width: "320px",
    onClick: setup.resetDbPoints
  });
  utils.initDxInput(setup, "dxButton", $("#setupPointsConditionalDbResetButton"), null, {
    text: localization.getString("setup_coin_dbreset_conditional_button"),
    width: "320px",
    onClick: setup.openConditionalDbResetDialog
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxServerSideConnection"), true, {
    text: "Use server-side TikTok connection (if available)"
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxShowTiktokPopup"), false, {
    text: "Open TikTok LIVE in new window when connecting"
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxShowLocalizedGiftNames"), true, {
    text: "Use localized gift names in overlays"
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxShowUserNicknames"), true, {
    text: "Use display names of users in overlays (instead @-handles)"
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxQueueKeystrokes"), true, {
    text: "Queue keystrokes by action screen"
  });
  utils.initDxInput(setup, "dxCheckBox", $("#checkboxProcessOnlyFirstEmoteByActions"), true, {
    text: "Process only first emote of message by Actions & Events (to avoid spam)"
  });
  utils.initDxInput(setup, "dxTextBox", $("#textboxWebcastLanguage"), navigator.language, {
    placeholder: "en-US",
    maxLength: 5
  });
  utils.initDxInput(setup, "dxButton", $("#settingsExportButton"), null, {
    text: "Export Settings to file",
    icon: "export",
    width: "250px",
    onClick: setup.settingsExport
  });
  utils.initDxInput(setup, "dxButton", $("#settingsImportButton"), null, {
    text: "Import Settings from file",
    icon: "import",
    width: "250px",
    onClick: setup.settingsImport
  });
  utils.initDxInput(setup, "dxButton", $("#buttonEnableDebug"), null, {
    text: "Enable Debug Mode",
    icon: "warning",
    onClick: function _0x2fcd22() {
      setup.debugEnabled = true;
      toastr.success("Debug mode enabled!");
      $("#buttonEnableDebug").dxButton("instance").option("disabled", true);
      $("#buttonEnableDebug").dxButton("instance").option("text", "Debug Mode running...");
      setup.logDebugModeEvent("start", "Debug mode enabled");
      function _0x1f9fca() {
        if (window.session.isElectron && setup.debugEnabled) {
          setup.logDebugModeEvent("browserBridgeDebugInfo", $("#browserBridgeDebug").text());
        }
      }
      setInterval(_0x1f9fca, 10000);
      _0x1f9fca();
    }
  });
  if (!window.session.isElectron) {
    $("#checkboxShowTiktokPopup").hide();
  }
  $("#checkboxServerSideConnection").dxCheckBox("instance").on("valueChanged", function () {
    var _0x523b9d = DevExpress.ui.dialog.confirm("The website needs to be reloaded. Reload now?", "Reload Required");
    _0x523b9d.done(function (_0x58341e) {
      if (_0x58341e) {
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }
    });
  });
  $(".setupUnconnected").hide();
  $(".setupConnected").hide();
  $("#levelListLink").html(setup.levelListLinkClosed);
  $("#levelList").hide();
  $("#buttonTiktokLogin").dxButton({
    text: "Login to TikTok",
    width: "180px",
    onClick: function _0x1985d8() {
      window.open("https://www.tiktok.com/login#ttlogin", "_blank");
    }
  });
  $("#buttonTiktokLogout").dxButton({
    text: "Logout from TikTok",
    width: "180px",
    onClick: function _0x51c4b7() {
      window.open("https://www.tiktok.com/logout?redirect_url=https%3A%2F%2Fwww.tiktok.com%2F#ttlogout", "_blank");
    }
  });
  $("#buttonSwitchServer").dxButton({
    text: "Switch Server",
    width: "180px",
    onClick: function _0xb45c63() {
      API.toMain({
        action: "patchHostEntry"
      });
    }
  });
  $("#buttonRestoreServer").dxButton({
    text: "Restore Server",
    width: "180px",
    onClick: function _0x325b9d() {
      API.toMain({
        action: "unpatchHostEntry"
      });
    }
  });
  $("#buttonOpenTikTok").dxButton({
    text: "Open TikTok LIVE",
    icon: "warning",
    onClick: function _0x2f6284() {
      window.open(`https://www.tiktok.com/@${window.session.me.channel.channelName}/live#electron`, "_blank");
    }
  });
  if (!window.session.isElectron) {
    $(".showOnlyElectron").hide();
  }
  if (window.session.stripeProActivationSuccess) {
    setup.showProActivationSuccessAlert();
  }
  setup.toggleServerTapWarning();
  if ((_0x3b4057 = setup.inputValues) !== null && _0x3b4057 !== undefined && _0x3b4057.textboxChannelName) {
    setup.validateUsername(setup.inputValues.textboxChannelName);
  }
  if (settings.get("channelId") === "0") {
    $(".setHalfOpacitityOnUnregistered").css("opacity", "0.5");
  }
};
setup.toggleServerTapWarning = function () {
  if (setup.inputValues.mcRestIp && setup.inputValues.mcRestIp !== "127.0.0.1" && setup.inputValues.mcRestIp !== "localhost" && setup.inputValues.mcRestIp.indexOf("192.") !== 0) {
    $("#mdExternalIpWarning").show(100);
  } else {
    $("#mdExternalIpWarning").hide(100);
  }
};
setup.onChannelContextChanged = function () {
  if (!window.session.me || !window.session.me.channel) {
    return;
  }
  setup.createPaymentUi();
  if (setup.inputValues.checkboxServerSideConnection === false) {
    setup.inputs.checkboxServerSideConnection.option("value", true);
  }
  setup.inputs.checkboxServerSideConnection.option("visible", false);
  $("#manualConnectButtonSetup").dxButton({
    text: localization.getString("start_connect_button"),
    disabled: !window.session.me || !window.session.me.channel.channelName,
    onClick: function _0x472e0b() {
      if (window.isTosViolation) {
        return showTosViolationWarning();
      }
      broadcastlistener.tryConnect(true, true, true);
      $("#manualConnectButtonSetup").dxButton("instance").option("disabled", true);
      setTimeout(function () {
        $("#manualConnectButtonSetup").dxButton("instance").option("disabled", false);
      }, 2000);
    }
  }).css("margin-top", "15px");
  $("#connectPatreonButton").dxButton({
    text: window.session.me.channel.patreonUserId ? "Reconnect Patreon" : "Connect Patreon",
    width: "220px",
    icon: "/img/patreon.png",
    onClick: function _0x310665() {
      var _0x19f35e = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${window.appConfig.patreon.clientId}&redirect_uri=${location.origin}/patreon_callback&scope=identity&state=${encodeURIComponent(btoa(JSON.stringify({
        channelId: window.session.me.channelId,
        isApp: window.session.isElectron
      })))}`;
      if (window.session.isElectron) {
        window.open(_0x19f35e, "_blank");
      } else {
        location.replace(_0x19f35e);
      }
    }
  });
  if (window.session.me.channel.patreonUserId) {
    var _0x102b34 = "https://www.patreon.com/user?u=" + window.session.me.channel.patreonUserId;
    $("#currentPatreonAccountInfo").show();
    $("#currentPatreonAccountInfo").find("a").attr("href", _0x102b34);
    $("#currentPatreonAccountInfo").find("a").text(_0x102b34);
  } else {
    $("#currentPatreonAccountInfo").hide();
  }
  if (settings.get("patreonPageOpened") === "1") {
    setup.showPatreonConnectReminder();
  }
  setup.setupMobileVoucherCode();
};
setup.setProEnd = function (_0x29eadc, _0x5159c0) {
  var _0xf87c85 = `The subscription has been cancelled.<br>Your benefits end on ${new Date(_0x29eadc).toLocaleDateString()}.`;
  $("#checkout-modal-subscription-canceled-info").removeClass("hidden").html(_0xf87c85);
  if (_0x5159c0) {
    DevExpress.ui.dialog.alert(_0xf87c85, "Subscription Cancelled").then(function () {
      window.open("https://docs.google.com/forms/d/e/1FAIpQLSeeho_VVs4O1hdwhz6E-l_NACpCsXvkeUPvgYk6464S4IM7ag/viewform?usp=dialog", "blank");
    });
  }
};
setup.setDiscountBanner = function (_0x1f934e, _0x4bd147, _0x5a3e6e) {
  $("#paymentAffiliateInfo").css("display", "block");
  $("#paymentAffiliateInfo").css("margin-top", "7px");
  $("#paymentAffiliateInfo").css("margin-bottom", "7px");
  $("#paymentAffiliateInfo").html(_0x5a3e6e).css("color", "rgb(185 185 185)");
  $("#proDiscountBanner").css("display", "block").css("margin-bottom", "15px");
  $("#proDiscountBanner").html(`💸 Now <b>\$${_0x1f934e}</b> instead of <b>\$19</b> per month (${_0x4bd147}) 💸`);
};
setup.openPaymentCheckout = function () {
  var _0x384fe3 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x298be1(_0x308363, _0x11792c, _0x12efff, _0x4a035c, _0x238d85, _0x3b00c0) {
    var _0x2f326d;
    var _0xfba6e8;
    return _regeneratorRuntime().wrap(function _0x27848a(_0x3429d4) {
      while (1) {
        switch (_0x3429d4.prev = _0x3429d4.next) {
          case 0:
            api.doAction("POST", "pro/setPaymentMethod", {
              method: _0x308363
            }, function (_0x2071f2) {}, function () {});
            _0x2f326d = {
              vendor: _0x3b00c0,
              channelId: window.session.me.channel.channelId,
              channelName: window.session.me.channel.channelName || "",
              email: window.session.me.channel.email || "",
              method: _0x308363,
              price: _0x11792c,
              agencyId: _0x12efff ? window.session.me.channel.agencyId : null,
              affId: _0x4a035c ? window.session.me.channel.affId : null,
              agencyAffiliateId: window.session.me.channel.agencyAffiliateId || null,
              yearly: _0x238d85
            };
            if (!_0x2f326d.vendor) {}
            _0xfba6e8 = `/checkout?token=${encodeURIComponent(btoa(JSON.stringify(_0x2f326d)))}`;
            posthog.capture("checkout plan_selected", {
              vendor: _0x3b00c0,
              id: window.session.me.channel.channelId,
              method: _0x308363,
              price: _0x11792c,
              agencyId: _0x12efff ? window.session.me.channel.agencyId : null,
              affiliateId: _0x4a035c ? window.session.me.channel.affId : null,
              period: _0x238d85 ? "year" : "month"
            });
            setup.openCheckoutWindows.push(window.open(_0xfba6e8, "_blank"));
          case 6:
          case "end":
            return _0x3429d4.stop();
        }
      }
    }, _0x298be1);
  }));
  return function (_0x4a6edf, _0x24b1be, _0x4297b2, _0x41183c, _0x48a6a1, _0x17c075) {
    return _0x384fe3.apply(this, arguments);
  };
}();
setup.createPaymentUi = function () {
  if (setup.paymentUiCreated) {
    return;
  }
  try {
    setup.paymentUiCreated = true;
    $("#setupPro").removeClass("hidden");
    $("#setupProOuter").html(getProFeaturesUi(undefined, "no-"));
    $("#no-checkout-modal-upgrade-button").click(function () {
      var _0x1bbbc7;
      var _0x117897;
      var _0x4c6235;
      var _0x49f585;
      ui.modal.showCheckoutModal();
      posthog.capture((_0x1bbbc7 = window.session.me) === null || _0x1bbbc7 === undefined || (_0x117897 = _0x1bbbc7.userFeatures) === null || _0x117897 === undefined || !_0x117897.isPro ? "paywall shown_upgrade_button" : "paywall shown_manage_button", {
        id: window.session.channelId,
        intent: (_0x4c6235 = window.session.me) === null || _0x4c6235 === undefined || (_0x49f585 = _0x4c6235.userFeatures) === null || _0x49f585 === undefined || !_0x49f585.isPro ? "UPGRADE_BUTTON" : "MANAGE BUTTON"
      });
    });
    var _0x47adff = window.location.host.includes("localhost") || window.location.host.includes("staging") ? window.appConfig.paymentConfig.dev : window.appConfig.paymentConfig.prod;
    var _0x105b5a = window.session.me.channel.agencyId ? window.appConfig.agencies[window.session.me.channel.agencyId] : null;
    var _0x58e4b2 = window.appConfig.affiliates.find(function (_0x5128ec) {
      return _0x5128ec.id === window.session.me.channel.affId;
    }) || null;
    var _0x1e25ef = 19;
    var _0x170d9b = 19;
    {
      var _0x32bb68;
      var _0x48033c;
      var _0x3317c1;
      var _0x44fe53;
      if ((_0x32bb68 = _0x105b5a) === null || _0x32bb68 === undefined || !_0x32bb68.enabled || _0x105b5a.allRegions === false && ((_0x48033c = _0x105b5a) === null || _0x48033c === undefined ? undefined : (_0x3317c1 = _0x48033c.regions) === null || _0x3317c1 === undefined ? undefined : _0x3317c1.includes(window.session.me.countryCode)) === false) {
        _0x105b5a = null;
      }
      if ((_0x44fe53 = window.session.me.channel.agencyId) !== null && _0x44fe53 !== undefined && _0x44fe53.startsWith("g_")) {
        _0x105b5a = {
          name: window.session.me.channel.agencyId.replace("g_", ""),
          enabled: true,
          price: 14,
          description: "Your discount as a member of <b>" + window.session.me.channel.agencyId.replace("g_", "") + "</b> has been applied.<br>Click OK to proceed to the payment area."
        };
      }
    }
    {
      var _0x3f6026;
      var _0x295752;
      if (_0x105b5a) {
        _0x170d9b = _0x105b5a.price;
        if (!window.session.me.userFeatures.isPro) {
          if (_0x105b5a.isAgency === false) {
            setup.setDiscountBanner(_0x170d9b, "Special Discount", `Partner-ID: <b>${_0x105b5a.name}</b>`);
          } else {
            setup.setDiscountBanner(_0x170d9b, "Agency Discount", `Agency-ID: <b>${_0x105b5a.name}</b>`);
          }
        }
      } else if (_0x58e4b2) {
        _0x170d9b = _0x58e4b2.price;
        if (!window.session.me.userFeatures.isPro) {
          setup.setDiscountBanner(_0x170d9b, "Affiliate Discount", `Affiliate-ID: <b>${_0x58e4b2.id}</b>`);
        }
      } else if (window.session.me.countryCode === "TH") {
        _0x170d9b = 12;
        if (!window.session.me.userFeatures.isPro) {
          setup.setDiscountBanner(_0x170d9b, "Special Discount", "");
        }
      } else if ((_0x3f6026 = window.session.me) !== null && _0x3f6026 !== undefined && (_0x295752 = _0x3f6026.channel) !== null && _0x295752 !== undefined && _0x295752.specialProOfferPrice && _0x1e25ef > window.session.me.channel.specialProOfferPrice) {
        _0x170d9b = window.session.me.channel.specialProOfferPrice;
        if (!window.session.me.userFeatures.isPro) {
          setup.setDiscountBanner(_0x170d9b, "Special Offer", "");
        }
      } else {}
      $(".proPrice").text("$" + _0x170d9b);
    }
    {
      if (window.session.me.userFeatures.isPro && window.session.me.userFeatures.proInfo?.paymentGateway === "paddle" && window.session.me.userFeatures.proInfo.customerId) {
        $.getScript(_0x47adff.paddleConfig.sdkUrl, function () {
          Paddle.Environment.set(_0x47adff.paddleConfig.environment);
          Paddle.Initialize({
            token: _0x47adff.paddleConfig.token,
            pwCustomer: {
              id: window.session.me.userFeatures.proInfo.customerId
            }
          });
        });
      }
    }
    {
      if (window.session.me.userFeatures.isPro) {
        $(".nopro").hide();
        $("#currentSubscriptionInfo").html(localization.getString("setup_upgrade_issub"));
        $(".proPromoBox").css("display", "none");
        setTimeout(function () {
          $(".appNameExtra").text("Pro").css("display", "inline-block").addClass("proColor").hide().show(300);
        }, 3000);
      } else {
        $(".proPromoBox").css("display", "block");
        setTimeout(function () {
          $(".proPromoBox").addClass("shakeEffect");
        }, 3000);
      }
    }
    if (!window.session.me.userFeatures.isPro) {
      var _0x486efa;
      var _0x24733f;
      $("#paymentMethodsContainer").css("display", "block");
      if (_0x170d9b < _0x1e25ef) {
        $("#bigDiscount").css("display", "block");
        $(".proDiscountPercentage").text(Math.round((1 - _0x170d9b / _0x1e25ef) * 100) + "%");
      }
      if (window.appConfig.paymentConfig.enablePatreonPayments && ((_0x486efa = window.appConfig.paymentConfig.tazapaySupportedCountries) === null || _0x486efa === undefined || !_0x486efa.includes(window.session.me.countryCode))) {
        $("#patreonButton").html("\n                <div class=\"patreonButtonLayout\">\n                    <table style=\"margin: 0px auto;\">\n                        <tr>\n                            <td>\n                                <img src=\"/img/patreon.png\" style=\"height: 42px;\">\n                            </td>\n                            <td style=\"padding-bottom: 12px;\">\n                                <div class=\"patreonSubText\">Subscribe on Patreon</div>\n                            </td>\n                        </tr>\n                    </table>\n                </div>\n            ").click(function () {
          window.open("https://www.patreon.com/zerody/membership", "_blank");
          settings.set("patreonPageOpened", "1");
          setup.showPatreonConnectReminder();
          api.doAction("POST", "pro/setPaymentMethod", {
            method: "patreon"
          }, function (_0x400392) {}, function () {});
        }).css("margin-bottom", "20px");
      }
      if ((_0x24733f = window.appConfig.paymentConfig.tazapaySupportedCountries) !== null && _0x24733f !== undefined && _0x24733f.includes(window.session.me.countryCode)) {
        api.get("pro/tazapay/methods", {}, function (_0x22075f) {
          if (_0x22075f.methods.length > 0) {
            var _0x5af8b7 = [];
            var _0x53fd8e = "";
            _0x22075f.methods = _0x22075f.methods.filter(function (_0x1e9f20) {
              return _0x1e9f20.name !== "Bank Transfer";
            });
            if (_0x22075f.methods.find(function (_0x505b6d) {
              return _0x505b6d.name === "QRIS";
            })) {
              _0x22075f.methods = _0x22075f.methods.filter(function (_0xa1341f) {
                return _0xa1341f.name !== "QRIS";
              });
              $("#qrisButton").html("\n                                <div class=\"paymentButtonLayout\">\n                                    <img src=\"/img/payment/qris.svg\" style=\"height: 40px; margin-top: 2px; opacity: 0.9;\">\n                                </div>\n                            ").click(function () {
                toastr.success("Please wait...", "TazaPay");
                setup.createTazaCheckout(30);
                api.doAction("POST", "pro/setPaymentMethod", {
                  method: "tazapay_qris"
                }, function (_0xaf57d) {}, function () {});
              }).css("margin-bottom", "20px");
            }
            var _0x46fe39 = _createForOfIteratorHelper(_0x22075f.methods);
            var _0x5921c4;
            try {
              for (_0x46fe39.s(); !(_0x5921c4 = _0x46fe39.n()).done;) {
                var _0x3e8b5d = _0x5921c4.value;
                if (_0x3e8b5d.group === "card") {
                  continue;
                }
                if (_0x3e8b5d.logo_url[0] && !_0x5af8b7.includes(_0x3e8b5d.logo_url[0])) {
                  _0x5af8b7.push(_0x3e8b5d.logo_url[0]);
                }
              }
            } catch (_0x6615f0) {
              _0x46fe39.e(_0x6615f0);
            } finally {
              _0x46fe39.f();
            }
            for (var _0xa33f08 = 0, _0x3e9ff7 = _0x5af8b7; _0xa33f08 < _0x3e9ff7.length; _0xa33f08++) {
              var _0x55b0d1 = _0x3e9ff7[_0xa33f08];
              _0x53fd8e += `<img src="${_0x55b0d1}" style="height: 30px; margin: 1px; opacity: 0.9;">`;
            }
            $("#tazaButton").html(`
                            <div class="paymentButtonLayout" style="height: auto; padding: 5px; width: 290px;">
                                ${_0x53fd8e}
                            </div>
                        `).click(function () {
              setup.startTazapayFlow(_0x170d9b, 30);
              api.doAction("POST", "pro/setPaymentMethod", {
                method: "tazapay"
              }, function (_0x466229) {}, function () {});
            }).css("margin-bottom", "20px");
            if (_0x5af8b7.length < 4) {
              $("#tazaButton").find(".paymentButtonLayout").css("height", "35px");
              $("#tazaButton").find(".paymentButtonLayout").css("min-height", "0px");
            }
          }
        }, function () {});
      }
      $("#paypalButton").html("\n                <div class=\"paymentButtonLayout\">\n                    <img src=\"/img/payment/paypal.svg\" style=\"height: 42px;\">\n                </div>\n            ").click(function () {
        setup.openPaymentCheckout("paypal", _0x170d9b, _0x105b5a, _0x58e4b2, false);
      });
      $("#creditCardButton").html("\n                <div class=\"paymentButtonLayout\">\n                    <img src=\"/img/payment/1.png\" style=\"height: 42px;\">\n                    <img src=\"/img/payment/2.png\" style=\"height: 42px;\">\n                    <img src=\"/img/payment/3.png\" style=\"height: 42px;\">\n                    <img src=\"/img/payment/4.png\" style=\"height: 42px;\">\n                </div>\n            ").click(function () {
        setup.openPaymentCheckout("creditcard", _0x170d9b, _0x105b5a, _0x58e4b2, false);
      });
      $("#cashAppButton").html("\n                <div class=\"paymentButtonLayout\">\n                    <img src=\"/img/payment/cashapp_pay.png\" style=\"height: 26px; margin-top: 8px;\">\n                </div>\n            ").click(function () {
        setup.openPaymentCheckout("cashapp", _0x170d9b, _0x105b5a, _0x58e4b2, false, "lemonsqueezy");
      });
    }
    if (window.session.me.userFeatures.isPro) {
      var _0x3a789e;
      var _0x172ad2;
      $("#cancelSubscriptionButton").css("margin-bottom", "10px");
      $("#cancelSubscriptionButton").css("margin-right", "4px");
      $("#cancelSubscriptionButton").dxButton({
        text: localization.getString("setup_upgrade_cancel"),
        disabled: !window.session.me.userFeatures.proInfo.isActiveSubscription || ((_0x3a789e = window.session.me.userFeatures.proInfo.paymentGateway) === null || _0x3a789e === undefined ? undefined : _0x3a789e.includes("agency_")),
        width: "180px",
        onClick: function _0xa42180() {
          if (window.session.me.userFeatures.proInfo.paymentGateway === "patreon") {
            return window.open("https://www.patreon.com/settings/memberships", "_blank");
          }
          if (window.session.me.userFeatures.proInfo.paymentGateway === "bmc") {
            return window.open("https://www.buymeacoffee.com/app/login", "_blank");
          }
          if (window.session.me.userFeatures.proInfo.paymentGateway === "sdps") {
            return window.open("https://streamdps.com/panel/", "_blank");
          }
          if (window.session.me.userFeatures.proInfo.paymentGateway === "paddle" && !window.session.me.userFeatures.proInfo.isVerified) {
            return toastr.error("Payment not verified. Please wait until your payment is processed then try again.", "Pending Payment");
          }
          if (window.session.me.userFeatures.proInfo.paymentGateway === "lemonsqueezy" && !window.session.me.userFeatures.proInfo.isVerified) {
            return toastr.error("Payment not verified. Please wait until your payment is processed then try again.", "Pending Payment");
          }
          var _0x5f10e3 = DevExpress.ui.dialog.confirm(localization.getString("setup_upgrade_cancel_info"), localization.getString("setup_upgrade_cancel"));
          _0x5f10e3.done(function (_0x9e8668) {
            if (_0x9e8668) {
              api.doAction("POST", "pro/deactivate", {}, function (_0x4ecf4c) {
                $("#cancelSubscriptionButton").dxButton("instance").option("disabled", true);
                $("#manageSubscriptionButton").dxButton("instance").option("disabled", true);
                $("#proSubscriptionPastDue").css("display", "none");
                if (_0x4ecf4c.expire) {
                  setup.setProEnd(_0x4ecf4c.expire, true);
                } else {
                  window.location.reload();
                }
              }, function () {});
            }
          });
        }
      });
      $("#manageSubscriptionButton").css("margin-bottom", "10px");
      $("#manageSubscriptionButton").dxButton({
        text: "Manage Subscription",
        disabled: !window.session.me.userFeatures.proInfo.isActiveSubscription || ((_0x172ad2 = window.session.me.userFeatures.proInfo.paymentGateway) === null || _0x172ad2 === undefined ? undefined : _0x172ad2.includes("agency_")),
        width: "180px",
        onClick: function _0x137a21() {
          switch (window.session.me.userFeatures.proInfo.paymentGateway) {
            case "stripe":
              window.open("https://billing.stripe.com/p/login/dR69Dm6446aM5r23cc?prefilled_email=" + encodeURIComponent(window.session.me.channel.email), "_blank");
              break;
            case "paypal":
              window.open("https://www.paypal.com/myaccount/autopay/", "_blank");
              break;
            case "patreon":
              window.open("https://www.patreon.com/settings/memberships", "_blank");
              break;
            case "bmc":
              window.open("https://www.buymeacoffee.com/app/login", "_blank");
              break;
            case "sdps":
              window.open("https://streamdps.com/panel/", "_blank");
              break;
            case "paddle":
            case "lemonsqueezy":
              if (!window.session.me.userFeatures.proInfo.updateUrl) {
                return toastr.error("Payment not verified. Please wait until your payment is processed then try again.", "Pending Payment");
              }
              window.open(window.session.me.userFeatures.proInfo.updateUrl, "_blank");
              break;
            default:
              alert("unknown paymentGateway " + window.session.me.userFeatures.proInfo.paymentGateway);
          }
        }
      });
      $("#claimDiscordRoleDescription").css("display", "block");
      $("#claimDiscordRoleButton").css("margin-top", "20px");
      $("#claimDiscordRoleButton").css("margin-bottom", "20px");
      $("#claimDiscordRoleButton").dxButton({
        text: "Claim Discord Role",
        width: "369px",
        icon: "/img/discord.svg",
        onClick: function _0x246a97() {
          window.open(setup.getDiscorOAuthUrl(), "_blank");
        }
      });
      if (!window.session.me.userFeatures.proInfo.isActiveSubscription) {
        setup.setProEnd(window.session.me.userFeatures.proInfo.expire, false);
      }
    }
  } catch (_0x31dc8d) {
    console.error(_0x31dc8d);
    throw new Error(`Failed to create payment UI: ${_0x31dc8d.message}`);
  }
};
setup.fixPaddleContainer = function () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $(".paddle-frame-overlay").css("position", "fixed");
  }
};
var throughRestrictions = {
  CLAIM_DISCORD_ROLE: true,
  OVERLOAD: true,
  PATREON_NOTICE: false,
  AGENCY_DISCOUNT_APPLIED: false,
  DISCOUNT_APPLIED: false,
  PRO_EXPIRED_STARTUP: false,
  TOS_VIOLATION: true,
  POINTSYSTEM_LIMIT: true,
  ACTIONS_DOWNGRADE: true,
  ACTIONS_DOWNGRADE_LOCKED: true,
  ACTIONS_LIMIT: true,
  COUNTERS_DOWNGRADE: true,
  COUNTER_LIMIT: true,
  COUNTER_ADD: true,
  PREMIUM_OVERLAY_: true,
  SOUNDS_DOWNGRADE: true,
  SOUNDS_LIMIT: true,
  SOUNDS_DOWNGRADE_LOCKED: true,
  START_PROMOTION: false,
  TTS_DAILY_QUOTA: true
};
setup.scrollToPaymentUi = function () {
  var _0x32973e;
  var _0x1715db;
  var _0x5e1745;
  var _0x299d08;
  var _0x55b3d9;
  var _0xf0eb1c;
  var _0x120082;
  var _0x324b9d;
  var _0x6db4a0;
  var _0x304565 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "UNKNOWN";
  var _0x246e48 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var _0x521fbe = arguments.length > 2 ? arguments[2] : undefined;
  if (settings.get("channelId") === "0") {
    toastr.error("Please sign in first.", "Login required");
    return;
  }
  setup.createPaymentUi();
  if ((_0x32973e = window.session) === null || _0x32973e === undefined || (_0x1715db = _0x32973e.me) === null || _0x1715db === undefined || (_0x5e1745 = _0x1715db.userFeatures) === null || _0x5e1745 === undefined || !_0x5e1745.isPro) {
    api.doAction("POST", "pro/setUpgradeIntent", {
      intent: _0x304565
    }, function (_0x3a938a) {}, function () {});
  }
  if (_0x246e48 && ((_0x299d08 = window.session) === null || _0x299d08 === undefined || (_0x55b3d9 = _0x299d08.me) === null || _0x55b3d9 === undefined || (_0xf0eb1c = _0x55b3d9.userFeatures) === null || _0xf0eb1c === undefined || !_0xf0eb1c.isPro)) {
    setup.openNativeUpgradeModal();
    if (_0x521fbe) {
      toastr.error(_0x521fbe, "TikFinity Pro required");
    }
  } else {
    $(".shakeEffect").removeClass("shakeEffect");
    setTimeout(function () {
      navigation.pageChange("setup");
      $("html, body").animate({
        scrollTop: $("#setupPro").offset().top - 40
      }, 500, function () {
        setTimeout(function () {
          $("#setupPro").addClass("shakeEffect");
        }, 200);
      });
    }, 100);
  }
  if ((_0x120082 = window.session) === null || _0x120082 === undefined || (_0x324b9d = _0x120082.me) === null || _0x324b9d === undefined || (_0x6db4a0 = _0x324b9d.userFeatures) === null || _0x6db4a0 === undefined || !_0x6db4a0.isPro) {
    posthog.capture(throughRestrictions[_0x304565] || _0x304565.startsWith("PREMIUM_OVERLAY_") ? "paywall shown_feature_restriction" : "paywall shown_upgrade_button", {
      id: window.session.channelId,
      intent: _0x304565
    });
  }
};
setup.scrollToStreamerbotConfiguration = function () {
  $(".shakeEffect").removeClass("shakeEffect");
  setTimeout(function () {
    navigation.pageChange("setup");
    $("html, body").animate({
      scrollTop: $("#streamerbotConfig").offset().top - 40
    }, 500, function () {
      setTimeout(function () {
        $("#streamerbotConfig").addClass("shakeEffect");
      }, 200);
    });
  }, 100);
};
setup.scrollToPatreonConnection = function () {
  setup.createPaymentUi();
  $(".shakeEffect").removeClass("shakeEffect");
  setTimeout(function () {
    navigation.pageChange("setup");
    $("html, body").animate({
      scrollTop: $("#patreonConnectionContainer").offset().top - 40
    }, 500, function () {
      setTimeout(function () {
        $("#patreonConnectionContainer").addClass("shakeEffect");
      }, 200);
    });
  }, 100);
};
setup.showProActivationSuccessAlert = function (_0x3fda98) {
  window.proJustUnlocked = true;
  try {
    if (typeof Paddle !== "undefined") {
      Paddle.Checkout.close();
    }
  } catch (_0x37e7b1) {}
  if (settings.get("channelId") === "0") {
    DevExpress.ui.dialog.alert("Welcome to TikFinity Pro!<br>Thank you for your support!<br><br>Please switch back to your TikFinity app or sign in.", "Success! 🚀").then(function (_0x3ab8c7) {});
  } else {
    var _0x26821a;
    var _0x4496cd;
    var _0x49c46e;
    if (_0x3fda98 && _0x3fda98.vendor === "tazapay" && (_0x26821a = window.session) !== null && _0x26821a !== undefined && (_0x4496cd = _0x26821a.me) !== null && _0x4496cd !== undefined && (_0x49c46e = _0x4496cd.userFeatures) !== null && _0x49c46e !== undefined && _0x49c46e.isPro) {
      var _0x189594 = _0x3fda98.period === "month" ? 30 : 365;
      DevExpress.ui.dialog.alert(`Your TikFinity Pro Version has been extended by ${_0x189594} days!<br>Thank you for your support!<br><br>You have received an email with all relevant information<br>about TikFinity Pro.<br><br>Click "OK" to reload the page and activate all features.`, "Success! 🚀").then(function (_0x295d1d) {
        window.location.reload();
      });
    } else {
      closeModal("checkoutModal");
      window.proDiscordModalPeriod = _0x3fda98?.period || "year";
      renderModal({
        name: "proDiscordModal",
        closeOnEsc: true,
        padding: "0",
        width: "460px",
        height: "auto",
        body: "<div id='pro-discord-modal-app' class='tw-preflight'></div>",
        onClose: function _0x27b14f() {
          window.location.reload();
        }
      });
      var _0x1c0373 = document.querySelector("#pro-discord-modal-app");
      if (_0x1c0373 && window.createProDiscordModal) {
        window.createProDiscordModal().mount(_0x1c0373);
      }
    }
  }
};
setup.showProUpgradedAlert = function () {
  return DevExpress.ui.dialog.alert(localization.t("checkout_modal_upgrade_success_info"), localization.t("checkout_modal_upgrade_success_title"));
};
setup.onInputChange = function (_0x2d389e, _0x3687da) {
  if (_0x2d389e === "textboxLevelPoints" || _0x2d389e === "textboxLevelMultiplikator") {
    setup.refreshLevelList();
    socketiowrapper.emitWidgetSettingsToWidgets();
  }
  if (_0x2d389e === "textboxCurrencyName" || _0x2d389e === "checkboxShowUserNicknames") {
    socketiowrapper.emitWidgetSettingsToWidgets();
  }
  if (_0x2d389e === "mcRestIp") {
    setup.toggleServerTapWarning();
  }
  if (_0x2d389e === "textboxChannelName") {
    if (_0x3687da.indexOf("https://www.tiktok.com/") === 0) {
      _0x3687da = _0x3687da.split("/")[3];
    }
    _0x3687da = _0x3687da.replace(/@/g, "").trim().toLowerCase();
    settings.set("ownerUserId", "");
    window.navigationStore.set("ownerUserId", "");
    if (setup.updateChannelTimeout) {
      clearTimeout(setup.updateChannelTimeout);
      setup.updateChannelTimeout = null;
    }
    try {
      browserbridge.closeWindow();
      browserbridge.onDisconnect();
    } catch (_0x3b63d5) {}
    setup.updateChannelTimeout = setTimeout(function () {
      setup.validateUsername(_0x3687da);
      settings.set("profileChannelName", _0x3687da);
      loginChannel(_0x3687da, function () {
        broadcastlistener.tryConnect(false, true, true);
        if (window.appConfig.useBrowserBridge) {
          $("#manualConnectButtonSetup").dxButton("instance").option("disabled", false);
        }
      }, function () {}, true);
    }, 1000);
  }
  if (!window.session || !window.session.channel) {
    DevExpress.ui.dialog.alert("Cannot save the settings. Please sign in first.<br>(Setup > Login)", "Login required");
  }
};
setup.validateUsername = function (_0x45f3ad) {
  if (typeof _0x45f3ad !== "string") {
    return false;
  }
  _0x45f3ad = _0x45f3ad.replace(/@/g, "").trim().toLowerCase();
  if (!_0x45f3ad || _0x45f3ad.length < 3 || !_0x45f3ad.match(/^[a-zA-Z0-9_.]+$/)) {
    $("#invalidUsernameHint").css("display", "block");
    return false;
  } else {
    $("#invalidUsernameHint").css("display", "none");
    return true;
  }
};
setup.setConnected = function () {
  var _0x1a1ed6;
  var _0x85dc92;
  var _0x2f76bf;
  var _0x4a267c;
  var _0x45b7d1;
  var _0x2a8926;
  setup.inputs.buttonLoginWithEmail.option("disabled", false);
  $(".setupUnconnected").hide();
  $(".setupConnected").show();
  if ((_0x1a1ed6 = window.session) !== null && _0x1a1ed6 !== undefined && (_0x85dc92 = _0x1a1ed6.me) !== null && _0x85dc92 !== undefined && (_0x2f76bf = _0x85dc92.userFeatures) !== null && _0x2f76bf !== undefined && _0x2f76bf.isPro) {
    $(".onlypro").css("display", "block");
    $(".sidebarmenuitemlist").css("max-height", "calc(100vh - 190px)");
  } else {
    $(".sidebarmenuitemlist").css("max-height", "calc(100vh - 160px)");
  }
  if ((_0x4a267c = window.session) !== null && _0x4a267c !== undefined && (_0x45b7d1 = _0x4a267c.me) !== null && _0x45b7d1 !== undefined && (_0x2a8926 = _0x45b7d1.channel) !== null && _0x2a8926 !== undefined && !!_0x2a8926.channelId) {
    var _0x473edf;
    var _0x45b33a;
    var _0x26c49d = window.session.me;
    var _0x5080f9 = _0x26c49d.channel;
    var _0xf37e65 = _0x5080f9 !== null && _0x5080f9 !== undefined && _0x5080f9.createdAt ? Math.floor((Date.now() - new Date(_0x5080f9.createdAt).getTime()) / 86400000) : undefined;
    var _0x1af7be = _0x26c49d.hasActiveTrial ? "trial" : (_0x473edf = _0x26c49d.userFeatures) !== null && _0x473edf !== undefined && _0x473edf.proInfo ? "premium" : "free";
    var _0x22362a = null;
    if (_0x26c49d.hasActiveTrial) {
      _0x22362a = "active";
    } else if (_0x26c49d.trialEnded) {
      _0x22362a = "expired";
    } else if (_0x26c49d.isTrialAvailable) {
      _0x22362a = "eligible";
    } else if (_0x5080f9 !== null && _0x5080f9 !== undefined && _0x5080f9.trialStartedAt || _0x5080f9 !== null && _0x5080f9 !== undefined && _0x5080f9.trialExpiresAt) {
      _0x22362a = "consumed";
    }
    var _0x4b7930 = _0x26c49d.hasActiveTrial && (_0x45b33a = _0x26c49d.trialInfo) !== null && _0x45b33a !== undefined && _0x45b33a.expiresAt ? typeof _0x26c49d.trialInfo.expiresAt === "string" ? _0x26c49d.trialInfo.expiresAt : new Date(_0x26c49d.trialInfo.expiresAt).toISOString() : null;
    var _0x31f202 = _0x26c49d.isTrialAvailable ? "d7_d14_v1" : null;
    posthog.identify(window.session.me.channel.channelId.toString(), _objectSpread(_objectSpread({}, _0x5080f9?.email && {
      email: _0x5080f9.email
    }), {}, {
      trial_offer_variant: _0x31f202,
      account_age_days: _0xf37e65,
      plan: _0x1af7be,
      trial_status: _0x22362a,
      trial_ends_at: _0x4b7930
    }));
    featurebase.initFeaturebase(window.session.me.channel.channelName, window.session.me.channel.channelId.toString(), window.session.me.channel.email, window.session.me.featureBaseToken);
  }
};
setup.setUnconnected = function () {
  setup.inputs.buttonLoginWithEmail.option("disabled", false);
  $(".setupUnconnected").show();
  $(".setupConnected").hide();
  utils.generateTampermonkeyLinkBasedOnBrowser($(".tampermonkeyLink"));
  $(".sidebarmenuitemlist").css("max-height", "calc(100vh - 160px)");
};
setup.disconnect = function () {
  settings.set("channelId", 0);
  settings.set("channelSignature", "");
  settings.set("apiAuthToken", "");
  settings.clearLocalStorage();
  document.location.href = "/logout";
};
setup.toggleLevelList = function () {
  var _0x3f25b1 = $("#levelListLink");
  var _0x431cc1 = _0x3f25b1.data("expanded") === "1";
  if (_0x431cc1) {
    _0x3f25b1.data("expanded", "0");
    _0x3f25b1.html(setup.levelListLinkClosed);
    $("#levelList").hide(100);
  } else {
    _0x3f25b1.data("expanded", "1");
    _0x3f25b1.html(setup.levelListLinkExpanded);
    $("#levelList").show(100);
    setup.refreshLevelList();
  }
};
setup.refreshLevelList = function () {
  var _0x4afaa7 = $("#levelList table");
  _0x4afaa7.html("");
  _0x4afaa7.append("<tr><th>" + localization.getString("setup_level_list_th1") + "</th><th>" + localization.getString("setup_level_list_th2", settings.get("textboxCurrencyName")) + "</th></tr>");
  utils.getLevelList().forEach(function (_0x2fd13b) {
    _0x4afaa7.append("<tr><td>" + _0x2fd13b.level + "</td><td>" + _0x2fd13b.requiredPoints + "</td></tr>");
  });
};
setup.addSubscriberBonus = function (_0x45f8c2) {
  if (typeof _0x45f8c2 !== "number") {
    _0x45f8c2 = parseFloat(_0x45f8c2);
  }
  if (_0x45f8c2 === 0) {
    return _0x45f8c2;
  }
  return _0x45f8c2 * (1 + parseFloat(setup.inputValues.textboxSubscriberBonus) / 100);
};
setup.onChat = function (_0x168fea) {
  if (_0x168fea.isBroadcaster) {
    return;
  }
  if (!setup.inputValues.checkboxPointsPerChatminute) {
    return;
  }
  var _0x9268db = parseFloat(settings.get("textboxPointsPerChatminute"));
  if (_0x9268db === 0) {
    return;
  }
  if (setup.userLastMessageSent[_0x168fea.userId] && new Date().getTime() - setup.userLastMessageSent[_0x168fea.userId] < 60000) {
    return;
  }
  setup.userLastMessageSent[_0x168fea.userId] = new Date().getTime();
  if (utils.isSubscriber(_0x168fea)) {
    _0x9268db = setup.addSubscriberBonus(_0x9268db);
  }
  setTimeoutFix(function () {
    transaction.put(_0x168fea.userId, _0x168fea.name, _0x9268db, true, false, "Chat Minute", false, function () {});
  }, 500);
};
setup.onGift = function (_0x2033eb) {
  if (_0x2033eb.isBroadcaster) {
    return;
  }
  if (crossconnect.getOption("pointsPerBarDisabled") === true) {
    return;
  }
  if (!_0x2033eb.value) {
    return;
  }
  if (!setup.inputValues.checkboxPointsPerBarEnabled) {
    return;
  }
  var _0x3795ec = parseFloat(settings.get("textboxPointsPerBar"));
  if (_0x3795ec === 0) {
    return;
  }
  var _0x564803 = parseInt(_0x2033eb.value);
  var _0x2862fb = _0x2033eb.giftName + " (x" + _0x2033eb.repeatCount + ") - " + _0x564803 + " Coins";
  var _0x3e7f73 = _0x564803 * _0x3795ec;
  if (utils.isSubscriber(_0x2033eb)) {
    _0x3e7f73 = setup.addSubscriberBonus(_0x3e7f73);
  }
  transaction.put(_0x2033eb.userId, _0x2033eb.name, _0x3e7f73, true, false, _0x2862fb, false, function () {});
};
setup.onShare = function (_0x133597) {
  if (!setup.inputValues.checkboxPointsPerInvite) {
    return;
  }
  var _0x1959fe = parseFloat(settings.get("textboxPointsPerInvite"));
  if (_0x1959fe === 0) {
    return;
  }
  if (utils.isSubscriber(_0x133597)) {
    _0x1959fe = setup.addSubscriberBonus(_0x1959fe);
  }
  transaction.put(_0x133597.userId, _0x133597.name, _0x1959fe, true, false, "Share", false, function () {});
};
setup.testObsConnection = function () {
  if (!setup.inputValues.obsWebsocketIp || !setup.inputValues.obsWebsocketPort) {
    DevExpress.ui.dialog.alert("Please enter valid connection details.<br>Default IP: 127.0.0.1<br>Default Port: 4455", "Invalid IP/Port");
  }
  setup.connectObs(function () {
    DevExpress.ui.dialog.alert("Connection successfully established!", "Success");
  }, function (_0x9589ca) {
    var _0x5138db = _0x9589ca ? _0x9589ca.toString() : "";
    if (_0x5138db === "Error") {
      _0x5138db = "Please make sure you have OBS Version 28 or newer!<br>Please check your WebSocket Server Settings in OBS and make<br>sure you have entered the correct connection details.";
    }
    if (_0x5138db.toLowerCase().includes("auth")) {
      _0x5138db += "<br>Please enter the correct password or disable authentication in OBS.<br>(Tools > WebSocket Server Settings)";
    }
    DevExpress.ui.dialog.alert("Error while establishing the connection.<br>" + _0x5138db, "Error");
  });
};
setup.connectObs = function (_0x409cfc, _0x1d1ad5) {
  if (settings.get("channelId") === "935191") {
    return;
  }
  if (setup.obsConnection) {
    try {
      setup.obsConnection.disconnect();
      setup.obsConnection = null;
    } catch (_0x186827) {}
  }
  if (!setup.inputValues.obsWebsocketIp || !setup.inputValues.obsWebsocketPort) {
    return;
  }
  var _0x12e8de = {
    address: "ws://" + setup.inputValues.obsWebsocketIp + ":" + setup.inputValues.obsWebsocketPort
  };
  if (setup.inputValues.obsWebsocketPassword) {
    _0x12e8de.password = setup.inputValues.obsWebsocketPassword;
  }
  try {
    setup.obsConnection = new OBSWebSocket();
    setup.obsConnection.connect(_0x12e8de.address, _0x12e8de.password).then(function () {
      if (_0x409cfc) {
        _0x409cfc();
      }
    }).catch(function (_0x2daded) {
      if (_0x1d1ad5) {
        _0x1d1ad5(_0x2daded?.message || "Connection failed");
      }
    });
  } catch (_0x132099) {
    if (_0x1d1ad5) {
      _0x1d1ad5(_0x132099);
    }
    console.error(_0x132099);
  }
};
setup.execObsCommand = function () {
  var _0xc64d5b = _asyncToGenerator(_regeneratorRuntime().mark(function _0x21aa2c(_0x363212, _0x5136fe, _0x177edf, _0x194659) {
    var _0x571a3a;
    return _regeneratorRuntime().wrap(function _0xcc01db(_0x4aba4a) {
      while (1) {
        switch (_0x4aba4a.prev = _0x4aba4a.next) {
          case 0:
            console.log("execObsCommand", _0x363212, _0x5136fe);
            _0x4aba4a.prev = 1;
            if (((_0x571a3a = setup.obsConnection) === null || _0x571a3a === undefined ? undefined : _0x571a3a.socket?.readyState) === WebSocket.OPEN) {
              _0x4aba4a.next = 5;
              break;
            }
            _0x4aba4a.next = 5;
            return new Promise(function (_0x6fdf2a, _0x575e60) {
              setTimeout(function () {
                return _0x575e60("Timeout");
              }, 5000);
              setup.connectObs(function () {
                _0x6fdf2a();
              }, function (_0x567ea5) {
                _0x575e60(_0x567ea5);
              });
            });
          case 5:
            setup.obsConnection.call(_0x363212, _0x5136fe).then(function (_0x31cb29) {
              if (_0x177edf) {
                _0x177edf(_0x31cb29);
              }
            }).catch(function (_0x26b83b) {
              if (_0x194659) {
                _0x194659(_0x26b83b);
              }
            });
            _0x4aba4a.next = 11;
            break;
          case 8:
            _0x4aba4a.prev = 8;
            _0x4aba4a.t0 = _0x4aba4a.catch(1);
            if (_0x194659) {
              _0x194659(_0x4aba4a.t0);
            }
          case 11:
          case "end":
            return _0x4aba4a.stop();
        }
      }
    }, _0x21aa2c, null, [[1, 8]]);
  }));
  return function (_0x3ae13a, _0x5ae5a8, _0x5040bc, _0x4eb1e5) {
    return _0xc64d5b.apply(this, arguments);
  };
}();
setup.onVisible = function () {
  if (!window.session || !window.session.channel) {
    setTimeout(function () {
      $(".loginSection").addClass("shakeEffect");
      setTimeout(function () {
        $(".loginSection").removeClass("shakeEffect");
      }, 2000);
    }, 500);
  }
};
setup.resetDbPoints = function () {
  var _0x1077b6;
  var _0x397a10;
  if ((_0x1077b6 = window.session.me) !== null && _0x1077b6 !== undefined && (_0x397a10 = _0x1077b6.channel) !== null && _0x397a10 !== undefined && _0x397a10.challengeRunning) {
    DevExpress.ui.dialog.alert("You have a challenge running right now. Please finish the challenge before you perform a reset.", "Challenge Running");
    navigation.pageChange("challenge");
    return;
  }
  var _0x196726 = DevExpress.ui.dialog.confirm(localization.getString("setup_coin_dbreset_confirm", halving.inputValues.textboxHalvingPercent), "DB Reset");
  _0x196726.done(function (_0x473c6f) {
    if (_0x473c6f) {
      api.doAction("POST", "deleteAllUsers", {}, function () {
        toastr.success("DB reset success!");
        transaction.disabled = false;
      }, function () {});
    }
  });
};
setup.openConditionalDbResetDialog = function () {
  var _0x2721b7;
  var _0x27d68f;
  if ((_0x2721b7 = window.session.me) !== null && _0x2721b7 !== undefined && (_0x27d68f = _0x2721b7.channel) !== null && _0x27d68f !== undefined && _0x27d68f.challengeRunning) {
    DevExpress.ui.dialog.alert("You have a challenge running right now. Please finish the challenge before you perform a reset.", "Challenge Running");
    navigation.pageChange("challenge");
    return;
  }
  var _0x1b76e6 = $("#setupConditionalDbResetPopup").dxPopup({
    width: 400,
    height: 450,
    visible: true,
    title: "Conditional DB Reset",
    closeOnOutsideClick: true,
    showCloseButton: true,
    contentTemplate: function _0x1655f5(_0x7a5650) {
      _0x7a5650.append("<div>Here you can remove users from the database based on various criteria. If you select multiple criteria, the conditions are combined with a logical AND.</div>");
      var _0x35ac47 = $("<div>").css("margin-top", "20px");
      _0x7a5650.append(_0x35ac47);
      var _0x4dc9cd = $("<div>").css("margin-left", "40px").css("margin-top", "10px");
      _0x7a5650.append(_0x4dc9cd);
      function _0x546c1f() {
        _0x4dc9cd.dxNumberBox("instance").option("disabled", !_0x35ac47.dxCheckBox("instance").option("value"));
        _0x30ca59.dxNumberBox("instance").option("disabled", !_0x113832.dxCheckBox("instance").option("value"));
      }
      _0x35ac47.dxCheckBox({
        text: "Delete Users inactive since:",
        value: settings.get("dbResetCheckboxDayDeadline", "1") === "1",
        onValueChanged: function _0x202ced(_0x30c5c4) {
          settings.set("dbResetCheckboxDayDeadline", _0x30c5c4.value ? "1" : "0");
          _0x546c1f();
          _0x42eede();
        }
      });
      _0x4dc9cd.dxNumberBox({
        width: "150px",
        min: 1,
        max: 365,
        showSpinButtons: true,
        format: "#0' Days'",
        value: parseInt(settings.get("dbResetNumberBoxDayDeadline", 30)),
        onValueChanged: function _0x257188(_0x203e52) {
          settings.set("dbResetNumberBoxDayDeadline", _0x203e52.value);
          _0x42eede();
        }
      });
      var _0x113832 = $("<div>").css("margin-top", "20px");
      _0x7a5650.append(_0x113832);
      var _0x30ca59 = $("<div>").css("margin-left", "40px").css("margin-top", "10px");
      _0x7a5650.append(_0x30ca59);
      _0x113832.dxCheckBox({
        text: "Delete Users with less points than:",
        value: settings.get("dbResetCheckboxPointsDeadline", "1") === "1",
        onValueChanged: function _0x21a306(_0x1f2a63) {
          settings.set("dbResetCheckboxPointsDeadline", _0x1f2a63.value ? "1" : "0");
          _0x546c1f();
          _0x42eede();
        }
      });
      _0x30ca59.dxNumberBox({
        width: "150px",
        min: 0,
        max: 10000000,
        showSpinButtons: true,
        format: "#0' Points'",
        value: parseInt(settings.get("dbResetNumberBoxPointsDeadline", 10)),
        onValueChanged: function _0x263704(_0x171270) {
          settings.set("dbResetNumberBoxPointsDeadline", _0x171270.value);
          _0x42eede();
        }
      });
      _0x7a5650.append("<br><br><div class=\"conditionalDbResetAffectedUserInfo\"></div>");
      var _0x33f32e = $("<div>").dxButton({
        text: "Delete Users from Database",
        icon: "check",
        onClick: function () {
          var _0x1d6431 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x48ec67(_0x182753) {
            var _0x2b3991;
            var _0x2067a8;
            var _0x4eb3fe;
            var _0x468769;
            return _regeneratorRuntime().wrap(function _0x3475ff(_0xcfaf72) {
              while (1) {
                switch (_0xcfaf72.prev = _0xcfaf72.next) {
                  case 0:
                    _0x33f32e.dxButton("instance").option("disabled", true);
                    _0xcfaf72.next = 3;
                    return setup.getConditionalUserIdList();
                  case 3:
                    _0x2b3991 = _0xcfaf72.sent;
                    _0x2067a8 = _0x2b3991.count;
                    _0x4eb3fe = _0x2b3991.userIds;
                    if (!!_0x2067a8 && !!_0x4eb3fe) {
                      _0xcfaf72.next = 8;
                      break;
                    }
                    return _0xcfaf72.abrupt("return");
                  case 8:
                    _0x468769 = DevExpress.ui.dialog.confirm(`Are you sure you want to delete <b>${_0x2067a8.toLocaleString()}</b> users from your database?<br>This operation cannot be undone!`, "Conditional DB Reset");
                    _0x468769.done(function () {
                      var _0x4788b8 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x31dc73(_0x5d2d2d) {
                        var _0x22424e;
                        var _0x1e2f2d;
                        return _regeneratorRuntime().wrap(function _0x5f3445(_0x2ae93d) {
                          while (1) {
                            switch (_0x2ae93d.prev = _0x2ae93d.next) {
                              case 0:
                                _0x33f32e.dxButton("instance").option("disabled", false);
                                if (!_0x5d2d2d) {
                                  _0x2ae93d.next = 11;
                                  break;
                                }
                                toastr.success("Please wait...", "DB Reset started!");
                                _0x22424e = 0;
                                _0x1e2f2d = _regeneratorRuntime().mark(function _0x2360e3() {
                                  var _0x1ae5e5;
                                  var _0x10d8b9;
                                  var _0xa7f3c3;
                                  return _regeneratorRuntime().wrap(function _0x21263c(_0x382f78) {
                                    while (1) {
                                      switch (_0x382f78.prev = _0x382f78.next) {
                                        case 0:
                                          _0x1ae5e5 = [];
                                          for (_0x10d8b9 = 0; _0x10d8b9 < 1000; _0x10d8b9++) {
                                            _0xa7f3c3 = _0x4eb3fe.shift();
                                            if (_0xa7f3c3) {
                                              _0x1ae5e5.push(_0xa7f3c3);
                                              _0x22424e += 1;
                                            }
                                          }
                                          _0x7a5650.find(".conditionalDbResetAffectedUserInfo").html(`Deleting User ${_0x22424e.toLocaleString()}/${_0x2067a8.toLocaleString()}. Please wait...`);
                                          _0x382f78.next = 5;
                                          return new Promise(function (_0x3de77e) {
                                            api.doAction("POST", "deleteChannelUsers", {
                                              userIds: _0x1ae5e5
                                            }, function (_0x5477dd) {
                                              setTimeout(_0x3de77e, 500);
                                            }, function (_0x331ac2) {
                                              setTimeout(_0x3de77e, 500);
                                            });
                                          });
                                        case 5:
                                        case "end":
                                          return _0x382f78.stop();
                                      }
                                    }
                                  }, _0x2360e3);
                                });
                              case 5:
                                if (!(_0x4eb3fe.length > 0)) {
                                  _0x2ae93d.next = 9;
                                  break;
                                }
                                return _0x2ae93d.delegateYield(_0x1e2f2d(), "t0", 7);
                              case 7:
                                _0x2ae93d.next = 5;
                                break;
                              case 9:
                                $("#setupConditionalDbResetPopup").dxPopup("instance").hide();
                                toastr.success("DB Reset Success!");
                              case 11:
                              case "end":
                                return _0x2ae93d.stop();
                            }
                          }
                        }, _0x31dc73);
                      }));
                      return function (_0x130129) {
                        return _0x4788b8.apply(this, arguments);
                      };
                    }());
                  case 10:
                  case "end":
                    return _0xcfaf72.stop();
                }
              }
            }, _0x48ec67);
          }));
          function _0x1d4c64(_0x574a2a) {
            return _0x1d6431.apply(this, arguments);
          }
          return _0x1d4c64;
        }()
      });
      _0x33f32e.css("margin-top", "15px");
      _0x7a5650.append(_0x33f32e);
      _0x546c1f();
      var _0x4f5b59 = null;
      function _0x42eede() {
        return _0x1efb9c.apply(this, arguments);
      }
      function _0x1efb9c() {
        _0x1efb9c = _asyncToGenerator(_regeneratorRuntime().mark(function _0x6ed91f() {
          var _0x5b4772;
          var _0x445c5e;
          var _0x3de9c4;
          var _0x3bce3a;
          return _regeneratorRuntime().wrap(function _0x3257d0(_0x2c381f) {
            while (1) {
              switch (_0x2c381f.prev = _0x2c381f.next) {
                case 0:
                  _0x33f32e.dxButton("instance").option("disabled", true);
                  _0x7a5650.find(".conditionalDbResetAffectedUserInfo").html("<i>Calculating affected users. Please wait...</i>");
                  _0x5b4772 = Math.random().toString() + Math.random().toString();
                  _0x4f5b59 = _0x5b4772;
                  _0x2c381f.next = 6;
                  return new Promise(function (_0x123490) {
                    return setTimeout(_0x123490, 1000);
                  });
                case 6:
                  if (_0x4f5b59 === _0x5b4772) {
                    _0x2c381f.next = 9;
                    break;
                  }
                  console.log("overlap detected");
                  return _0x2c381f.abrupt("return");
                case 9:
                  _0x2c381f.prev = 9;
                  _0x2c381f.next = 12;
                  return setup.getConditionalUserIdList();
                case 12:
                  _0x445c5e = _0x2c381f.sent;
                  _0x3de9c4 = _0x445c5e.count;
                  _0x3bce3a = _0x445c5e.userIds;
                  if (_0x3de9c4 > 0) {
                    _0x7a5650.find(".conditionalDbResetAffectedUserInfo").html("This will delete " + _0x3de9c4.toLocaleString() + " Users from your Database!");
                    _0x33f32e.dxButton("instance").option("disabled", false);
                  } else {
                    _0x7a5650.find(".conditionalDbResetAffectedUserInfo").html("These conditions do not affect any users!");
                  }
                  _0x2c381f.next = 21;
                  break;
                case 18:
                  _0x2c381f.prev = 18;
                  _0x2c381f.t0 = _0x2c381f.catch(9);
                  _0x7a5650.find(".conditionalDbResetAffectedUserInfo").html("<i>Error while retrieving affected users.</i>");
                case 21:
                case "end":
                  return _0x2c381f.stop();
              }
            }
          }, _0x6ed91f, null, [[9, 18]]);
        }));
        return _0x1efb9c.apply(this, arguments);
      }
      _0x42eede();
      return _0x7a5650;
    }
  }).dxPopup("instance");
};
setup.getConditionalUserIdList = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8() {
  var _0x36f76d;
  var _0x2fdc66;
  var _0x516ccc;
  var _0x49540b;
  return _regeneratorRuntime().wrap(function _0x183445(_0x1c98c7) {
    while (1) {
      switch (_0x1c98c7.prev = _0x1c98c7.next) {
        case 0:
          _0x2fdc66 = settings.get("dbResetCheckboxDayDeadline") === "1";
          _0x516ccc = settings.get("dbResetCheckboxPointsDeadline") === "1";
          if ((_0x36f76d = window.session) !== null && _0x36f76d !== undefined && _0x36f76d.channelId) {
            _0x1c98c7.next = 4;
            break;
          }
          return _0x1c98c7.abrupt("return", {
            count: 0,
            userIds: []
          });
        case 4:
          if (!!_0x2fdc66 || !!_0x516ccc) {
            _0x1c98c7.next = 6;
            break;
          }
          return _0x1c98c7.abrupt("return", {
            count: 0,
            userIds: []
          });
        case 6:
          _0x49540b = {
            channelId: window.session.channelId
          };
          if (_0x2fdc66) {
            _0x49540b.dayDeadline = settings.get("dbResetNumberBoxDayDeadline");
          }
          if (_0x516ccc) {
            _0x49540b.pointsDeadline = settings.get("dbResetNumberBoxPointsDeadline");
          }
          return _0x1c98c7.abrupt("return", new Promise(function (_0x19fdb1, _0x49872d) {
            api.get("getDbUserIds", _0x49540b, function (_0x26fcb5) {
              _0x19fdb1({
                count: _0x26fcb5.count,
                userIds: _0x26fcb5.userIds,
                params: _0x49540b
              });
            }, function (_0x327ae2) {
              _0x49872d(_0x327ae2);
            });
          }));
        case 10:
        case "end":
          return _0x1c98c7.stop();
      }
    }
  }, _callee8);
}));
setup.queryMcApi = function () {
  var _0x6fa5fe = _asyncToGenerator(_regeneratorRuntime().mark(function _0x1ee5ad(_0x4ac2f4, _0xab38b1) {
    var _0x361fc6;
    var _0x394a25 = arguments;
    return _regeneratorRuntime().wrap(function _0x1cbef0(_0x53774b) {
      while (1) {
        switch (_0x53774b.prev = _0x53774b.next) {
          case 0:
            _0x361fc6 = _0x394a25.length > 2 && _0x394a25[2] !== undefined ? _0x394a25[2] : null;
            return _0x53774b.abrupt("return", new Promise(function (_0x4df229, _0x4cf97c) {
              var _0x34d20c = new XMLHttpRequest();
              _0x34d20c.open(_0x4ac2f4, `http://${setup.inputValues.mcRestIp}:${setup.inputValues.mcRestPort}/${_0xab38b1}`);
              _0x34d20c.setRequestHeader("key", setup.inputValues.mcRestPassword);
              _0x34d20c.send(_0x361fc6);
              _0x34d20c.onload = function () {
                try {
                  _0x4df229(JSON.parse(_0x34d20c.responseText));
                } catch (_0x51fae8) {
                  _0x4df229(_0x34d20c.responseText);
                }
              };
              _0x34d20c.onerror = function (_0x179fab) {
                _0x4cf97c(_0x179fab);
              };
            }));
          case 2:
          case "end":
            return _0x53774b.stop();
        }
      }
    }, _0x1ee5ad);
  }));
  return function (_0x245660, _0x16fd75) {
    return _0x6fa5fe.apply(this, arguments);
  };
}();
setup.testMcConnection = function () {
  setup.queryMcApi("GET", "v1/server").then(function (_0x3a1a6a) {
    if (typeof _0x3a1a6a === "object") {
      DevExpress.ui.dialog.alert(`Connection successfully established!<br><br>Server Name: ${_0x3a1a6a.name}<br>Server Version: ${_0x3a1a6a.version}`, "Success");
    } else {
      var _0x4a8097 = "";
      if (_0x3a1a6a.includes("Unauthorized key")) {
        _0x4a8097 += "<br><br>The default password is: <b>change_me</b><br><br>If the default password does not work open the <b>config.yml</b><br>from the ServerTap Plugin folder (<i>/plugins/ServerTap/config.yml</i>)<br>and enter it from there.";
      }
      DevExpress.ui.dialog.alert(`${_0x3a1a6a}${_0x4a8097}`, "Connection Failed");
    }
  }).catch(function (_0x4bf10a) {
    var _0x56833a = "";
    if (setup.inputValues.mcRestIp !== "127.0.0.1" && setup.inputValues.mcRestIp !== "localhost" && !window.session.isElectron) {
      _0x56833a += "\n                <br><br>\n                <div>\n                    You have entered an external server IP. To be able to connect to external servers,<br>\n                    you might need to allow \"Insecure content\" in your browser.<br>\n                    Open the site settings and set \"Insecure Content\" to \"Allow\".\n                </div>\n                <br><br>\n                <img src=\"https://media.discordapp.net/attachments/1026254118848839700/1072652550798581901/image.png\" width=\"450\"><br><br>\n                <img src=\"https://media.discordapp.net/attachments/1026254118848839700/1072652634906955796/image.png\" width=\"450\">\n                <br><br>\n                If you have your Minecraft server running on your local PC,<br>enter the IP <b>127.0.0.1</b> and the port <b>4567</b>.\n            ";
    } else {
      _0x56833a += "\n                <br><br>\n                Troubleshooting if you use the TikFinity mod:<br>\n                <ul>\n                    <li>Is the mod installed and shown inside of mod menu?</li>\n                    <li>Have you joined a world?</li>\n                    <li>is the port correct? Default: 4567</a>\n                </ul>\n                <br>\n                Troubleshooting if you use the ServerTap plugin:<br>\n                <ul>\n                    <li>Is the Minecraft Server (Paper/Bukkit/Spigot) running?</li>\n                    <li>Is the ServerTap Plugin installed? (The JAR file must be located in the plugin directory)</li>\n                    <li>Do you have the correct Java version installed? <b>You might need Java 17!</b><br>Newer or older versions can lead to problems. In this case, please uninstall the other Java version<br>and install <b>Java 17</b> via this link: <a href=\"https://corretto.aws/downloads/latest/amazon-corretto-17-x64-windows-jdk.msi\" target=\"blank\">https://corretto.aws/downloads/latest/amazon-corretto-17-x64-windows-jdk.msi</a>\n                </ul>";
    }
    if (setup.inputValues.mcRestPort != 4567) {
      _0x56833a += "\n                <br><br>\n                <div>\n                    Please note that the <b>ServerTap Plugin</b> always runs on port <b>4567</b> by default,<br>\n                    independent of the port of your Minecraft server!\n                </div>\n            ";
    }
    DevExpress.ui.dialog.alert(`Could not connect to the specified IP and port.<br>Please check the information and make sure that the mod or plugin is installed correctly. ${_0x56833a}`, "Connection Failed");
  });
};
setup.scrollToServerSideConnection = function () {
  $("#checkboxServerSideConnection").removeClass("shakeEffect");
  navigation.pageChange("setup");
  $("html, body").animate({
    scrollTop: $("#checkboxServerSideConnection").offset().top - 300
  }, 1000, function () {
    $("#checkboxServerSideConnection").addClass("shakeEffect");
  });
};
setup.googleLoginCallbackHandler = function (_0x1135c2) {
  if (typeof _0x1135c2.data === "object" && _0x1135c2.data && _0x1135c2.data.type === "authCallback" && typeof _0x1135c2.data.token === "string") {
    window.removeEventListener("message", setup.googleLoginCallbackHandler);
    setup.setPendingGoogleLogin(_0x1135c2.data.token);
  }
};
setup.setPendingGoogleLogin = function (_0x192e78) {
  toastr.success("Success!");
  settings.set("pendingLogin", 1);
  settings.set("loginAccessToken", _0x192e78);
  settings.set("loginAccessTokenProvider", "social");
  window.location.reload();
};
setup.settingsExport = function () {
  var _0x888e59 = $("#settingsExportPopup");
  if (!_0x888e59.length) {
    _0x888e59 = $("<div>").attr("id", "settingsExportPopup");
    $("#pages").append(_0x888e59);
  }
  _0x888e59.dxPopup({
    width: 550,
    height: 520,
    visible: true,
    title: "Export Settings",
    closeOnOutsideClick: true,
    showCloseButton: true,
    contentTemplate: function _0x57e073(_0x4219fa) {
      _0x4219fa.html("\n                <div>\n                    Here you can export all your settings of the current profile into a file in order to\n                    import them into another profile or into another TikFinity account. Please note that the exported \n                    file can also contain media uploads for actions and sound alerts as well as webhook URLs. \n                    Please consider carefully if you want to share this file.\n                </div>\n\n                <br>\n\n                <div>Select settings to export:</div>\n\n                <br>\n\n                <div class=\"exportSettingsUsername\"></div><br><br>\n                <div class=\"exportSettingsSetup\"></div><br><br>\n                <div class=\"exportSettingsSounds\"></div><br><br>\n                <div class=\"exportSettingsActions\"></div><br><br>\n                <div class=\"exportSettingsEvents\"></div><br><br>\n\n                <br><br>\n\n                <div style=\"width: 90%; text-align: center; bottom: 32px; position: absolute;\">\n                    <div class=\"exportSettingsButton\"></div>\n                </div>\n            \n            ");
      var _0x58ad75 = _0x4219fa.find(".exportSettingsUsername").dxCheckBox({
        value: false,
        text: "TikTok Username"
      }).dxCheckBox("instance");
      var _0x5b33a4 = _0x4219fa.find(".exportSettingsSetup").dxCheckBox({
        value: false,
        text: "General Setup"
      }).dxCheckBox("instance");
      var _0xa641e0 = _0x4219fa.find(".exportSettingsSounds").dxCheckBox({
        value: false,
        text: "Sound Alerts (" + (sounds.soundsDataSource?.length || 0) + ")"
      }).dxCheckBox("instance");
      var _0x32fd4f = _0x4219fa.find(".exportSettingsActions").dxCheckBox({
        value: false,
        text: "Actions (" + (actionsandevents.actions?.length || 0) + ")"
      }).dxCheckBox("instance");
      var _0x5cdaff = _0x4219fa.find(".exportSettingsEvents").dxCheckBox({
        value: false,
        text: "Events (" + (actionsandevents.events?.length || 0) + ")"
      }).dxCheckBox("instance");
      _0x4219fa.find(".exportSettingsButton").dxButton({
        text: "Download File",
        icon: "download",
        onClick: function _0x4ee59a() {
          setup.doExport(_0x58ad75.option("value"), _0x5b33a4.option("value"), _0xa641e0.option("value"), _0x32fd4f.option("value"), _0x5cdaff.option("value"));
        }
      });
      return _0x4219fa;
    }
  });
};
setup.doExport = function (_0x1b4f7d, _0x1e7d4c, _0x114139, _0x3ed1ab, _0x348e5f) {
  if (!_0x1b4f7d && !_0x1e7d4c && !_0x114139 && !_0x3ed1ab && !_0x348e5f) {
    return toastr.error("Nothing selected to export");
  }
  var _0x1cfb6f = {};
  var _0x2fba97 = ["profilechannelname", "textboxchannelname", "events", "timer", "soundsdatasource"];
  settings.save(function (_0x1b5837) {
    var _0x54cdec;
    if (!_0x1e7d4c) {
      for (key in _0x1b5837) {
        if (!_0x2fba97.includes(key)) {
          delete _0x1b5837[key];
        }
      }
    }
    if (!_0x1b4f7d) {
      delete _0x1b5837.profilechannelname;
      delete _0x1b5837.textboxchannelname;
    }
    if (!_0x114139) {
      delete _0x1b5837.soundsdatasource;
    }
    if (!_0x348e5f) {
      delete _0x1b5837.events;
      delete _0x1b5837.timer;
    }
    if (Object.keys(_0x1b5837).length > 0) {
      _0x1cfb6f.dynamicSettings = _0x1b5837;
    }
    if (_0x3ed1ab && actionsandevents.actions?.length > 0) {
      _0x1cfb6f.actions = actionsandevents.actions;
    }
    if (Object.keys(_0x1cfb6f).length === 0) {
      return toastr.error("Nothing to export");
    }
    _0x1cfb6f.version = window.appConfig.appVersion;
    _0x1cfb6f.sourceChannelId = window.session.channelId;
    var _0x25c45f = btoa(encodeURIComponent(JSON.stringify(_0x1cfb6f))).replaceAll("=", "").split("").reverse().join("");
    var _0x197cb7 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var _0x4b72f2 = window.shash(_0x197cb7, 3);
    var _0x1effbd = CryptoJS.AES.encrypt(JSON.stringify({
      b64RawData: _0x25c45f
    }), _0x4b72f2).toString();
    var _0x4f0e63 = CryptoJS.AES.encrypt(`v3:${btoa(_0x197cb7)}:${_0x1effbd}`, "lolsurghwi378ukasfjsdf_s").toString();
    utils.downloadFileFromText("tikfinity_settings_profile" + (((_0x54cdec = window.session.me) === null || _0x54cdec === undefined ? undefined : _0x54cdec.channel?.profileId) || 1) + ".tfc", _0x4f0e63);
    toastr.success("Export success");
  });
};
setup.settingsImport = function () {
  var _0x5ee22b = $("#settingsImportPopup");
  if (!_0x5ee22b.length) {
    _0x5ee22b = $("<div>").attr("id", "settingsImportPopup");
    $("#pages").append(_0x5ee22b);
  }
  _0x5ee22b.dxPopup({
    width: 550,
    height: 580,
    visible: true,
    title: "Import Settings",
    closeOnOutsideClick: true,
    showCloseButton: true,
    contentTemplate: function _0x2a3f9c(_0x3ccbec) {
      _0x3ccbec.html("\n                <div>\n                    Here you can import TikFinity settings from a file into the current profile.<br>\n                    Please note that existing actions with the same name will be overwritten.\n                </div>\n\n                <br>\n\n                <div class=\"importSettingsUploader\"></div>\n\n                <br>\n\n                <div class=\"fileParseDone\" style=\"display: none\">\n                    <div>Select settings to import:</div>\n\n                    <br>\n\n                    <div class=\"importSettingsUsername\"></div><br><br>\n                    <div class=\"importSettingsSetup\"></div><br><br>\n                    <div class=\"importSettingsSounds\"></div><br><br>\n                    <div class=\"importSettingsActions\"></div><br><br>\n                    <div class=\"importSettingsEvents\"></div><br><br>\n\n                    <br><br>\n\n                    <div style=\"width: 90%; text-align: center; bottom: 32px; position: absolute;\">\n                        <div class=\"importSettingsButton\"></div>\n                    </div>\n                </div>\n            ");
      _0x3ccbec.find(".importSettingsUploader").dxFileUploader({
        accept: ".tfc",
        allowedFileExtensions: [".tfc"],
        uploadMode: "useButtons",
        readyToUploadMessage: "Ready to import",
        onValueChanged: function _0x2df31c(_0x149576) {
          var _0xeef83d = new FileReader();
          _0xeef83d.onload = function (_0x313a97) {
            _0x3ccbec.find(".fileParseDone").css("display", "none");
            var _0x2043a6 = null;
            try {
              _0x2043a6 = JSON.parse(decodeURIComponent(atob(_0x313a97.target.result.split("").reverse().join(""))));
              if (typeof _0x2043a6 !== "object") {
                throw "invalid object type";
              }
              if (!_0x2043a6.version) {
                throw "unknown version";
              }
              api.logError({
                type: "SettingsImportParseSuccess",
                fileVersion: "v1"
              });
            } catch (_0x1979a5) {
              try {
                var _0x164168 = CryptoJS.AES.decrypt(_0x313a97.target.result, "lolsurghwi378ukasfjsdf_s").toString(CryptoJS.enc.Utf8);
                var _0x5efadc = _0x164168.split(":");
                var _0x22cf73 = parseInt(_0x5efadc[0].replace("v", ""));
                var _0x5a827b = atob(_0x5efadc[1]);
                var _0x205b5b = _0x5efadc[2];
                var _0x277fd3 = window.shash(_0x5a827b, _0x22cf73);
                var _0x4b1b6d = CryptoJS.AES.decrypt(_0x205b5b, _0x277fd3).toString(CryptoJS.enc.Utf8);
                var _0x2c62f0 = JSON.parse(_0x4b1b6d).b64RawData;
                _0x2043a6 = JSON.parse(decodeURIComponent(atob(_0x2c62f0.split("").reverse().join(""))));
                if (typeof _0x2043a6 !== "object") {
                  throw "invalid object type";
                }
                if (!_0x2043a6.version) {
                  throw "unknown version";
                }
                api.logError({
                  type: "SettingsImportParseSuccess",
                  fileVersion: _0x5efadc[0]
                });
              } catch (_0x4ca570) {
                api.logError({
                  type: "SettingsImportError1",
                  message: _0x4ca570.toString()
                });
                try {
                  api.logError({
                    type: "SettingsImportError1_data",
                    message: _0x313a97.target.result
                  });
                } catch (_0x481f9b) {
                  var _0x8da4b0;
                  api.logError({
                    type: "SettingsImportError1_data_partial",
                    message: (_0x8da4b0 = _0x313a97.target.result) === null || _0x8da4b0 === undefined ? undefined : _0x8da4b0.substring(0, 1000)
                  });
                }
                return DevExpress.ui.dialog.alert("The selected file could not be read.<br>The file may be corrupted or incompatible with this version of TikFinity.", "Import Error");
              }
            }
            try {
              var _0x4546a0;
              var _0x275df5;
              var _0x93a914;
              var _0x49577c;
              var _0x50cddf = (_0x4546a0 = _0x2043a6.dynamicSettings) !== null && _0x4546a0 !== undefined && !!_0x4546a0.profilechannelname;
              var _0x4ebe36 = (_0x275df5 = _0x2043a6.dynamicSettings) !== null && _0x275df5 !== undefined && !!_0x275df5.textboxcurrencyname;
              var _0x44da93 = (_0x93a914 = _0x2043a6.dynamicSettings) !== null && _0x93a914 !== undefined && !!_0x93a914.soundsdatasource && _0x2043a6.dynamicSettings?.soundsdatasource !== "[]";
              var _0xff09b0 = _0x2043a6.actions?.length > 0;
              var _0x2579c0 = (_0x49577c = _0x2043a6.dynamicSettings) !== null && _0x49577c !== undefined && !!_0x49577c.events && _0x2043a6.dynamicSettings?.events !== "[]";
              var _0x465cd1 = _0x44da93 ? JSON.parse(_0x2043a6.dynamicSettings.soundsdatasource).length : 0;
              var _0x5744bc = _0xff09b0 ? _0x2043a6.actions.length : 0;
              var _0x409e8b = _0x2579c0 ? JSON.parse(_0x2043a6.dynamicSettings.events).length : 0;
              var _0x4053fe = _0x3ccbec.find(".importSettingsUsername").dxCheckBox({
                disabled: !_0x50cddf,
                value: false,
                text: "TikTok Username"
              }).dxCheckBox("instance");
              var _0x2fdaa4 = _0x3ccbec.find(".importSettingsSetup").dxCheckBox({
                disabled: !_0x4ebe36,
                value: false,
                text: "General Setup"
              }).dxCheckBox("instance");
              var _0x52baf9 = _0x3ccbec.find(".importSettingsSounds").dxCheckBox({
                disabled: !_0x44da93,
                value: false,
                text: "Sound Alerts (" + _0x465cd1 + ")"
              }).dxCheckBox("instance");
              var _0x4ae31c = _0x3ccbec.find(".importSettingsActions").dxCheckBox({
                disabled: !_0xff09b0,
                value: false,
                text: "Actions (" + _0x5744bc + ")"
              }).dxCheckBox("instance");
              var _0x489625 = _0x3ccbec.find(".importSettingsEvents").dxCheckBox({
                disabled: !_0x2579c0,
                value: false,
                text: "Events (" + _0x409e8b + ")"
              }).dxCheckBox("instance");
              _0x3ccbec.find(".fileParseDone").css("display", "block");
              _0x3ccbec.find(".importSettingsButton").dxButton({
                text: "Start Import",
                icon: "import",
                onClick: function () {
                  var _0x4c194c = _asyncToGenerator(_regeneratorRuntime().mark(function _0x392955() {
                    return _regeneratorRuntime().wrap(function _0x5df80d(_0x3bf5e8) {
                      while (1) {
                        switch (_0x3bf5e8.prev = _0x3bf5e8.next) {
                          case 0:
                            _0x3bf5e8.prev = 0;
                            if (!!_0x4053fe.option("value") || !!_0x2fdaa4.option("value") || !!_0x52baf9.option("value") || !!_0x4ae31c.option("value") || !!_0x489625.option("value")) {
                              _0x3bf5e8.next = 3;
                              break;
                            }
                            return _0x3bf5e8.abrupt("return", toastr.error("Nothing selected"));
                          case 3:
                            _0x3ccbec.find(".importSettingsButton").dxButton("instance").option("disabled", true);
                            toastr.success("Please wait...");
                            _0x3bf5e8.next = 7;
                            return setup.doImport(_0x2043a6, _0x4053fe.option("value"), _0x2fdaa4.option("value"), _0x52baf9.option("value"), _0x4ae31c.option("value"), _0x489625.option("value"));
                          case 7:
                            _0x3bf5e8.next = 9;
                            return new Promise(function (_0x5e34a1) {
                              return setTimeout(_0x5e34a1, 3000);
                            });
                          case 9:
                            _0x5ee22b.dxPopup("instance").hide();
                            toastr.success("Import Done");
                            settings.set("settingsImportDone", "1");
                            api.logError({
                              type: "SettingsImportSuccess"
                            });
                            location.reload();
                            _0x3bf5e8.next = 20;
                            break;
                          case 16:
                            _0x3bf5e8.prev = 16;
                            _0x3bf5e8.t0 = _0x3bf5e8.catch(0);
                            api.logError({
                              type: "SettingsImportError3",
                              message: _0x3bf5e8.t0.toString()
                            });
                            toastr.error(_0x3bf5e8.t0.toString(), "Import failed");
                          case 20:
                            _0x3ccbec.find(".importSettingsButton").dxButton("instance").option("disabled", false);
                          case 21:
                          case "end":
                            return _0x3bf5e8.stop();
                        }
                      }
                    }, _0x392955, null, [[0, 16]]);
                  }));
                  function _0x34cf51() {
                    return _0x4c194c.apply(this, arguments);
                  }
                  return _0x34cf51;
                }()
              });
            } catch (_0x31c512) {
              api.logError({
                type: "SettingsImportError2",
                message: _0x31c512.toString()
              });
              return DevExpress.ui.dialog.alert("Error while parsing the data.<br>The file may be corrupted or incompatible with this version of TikFinity.", "Import Error");
            }
          };
          _0xeef83d.readAsText(_0x149576.value[0]);
        }
      });
      return _0x3ccbec;
    }
  });
};
setup.doImport = function () {
  var _0x495782 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x52fdc3(_0x5eee13, _0x5b57ec, _0x463ddc, _0x3ccf58, _0x395e7a, _0x315355) {
    var _0x41a359;
    var _0x16372a;
    var _0x33cd1d;
    var _0x4a0a03;
    var _0x345fd7;
    var _0x3cdfdd;
    var _0x265200;
    var _0x599dac;
    var _0x6c2f70;
    var _0x41d71e;
    var _0x462269;
    var _0x10650c;
    var _0x5b1751;
    var _0xeb36e8;
    var _0x51e48c;
    var _0x10ca2f;
    var _0x5b0981;
    var _0x8bd9fc;
    var _0x45cd1c;
    return _regeneratorRuntime().wrap(function _0x5947ed(_0x37cf3a) {
      while (1) {
        switch (_0x37cf3a.prev = _0x37cf3a.next) {
          case 0:
            _0x41a359 = ["profilechannelname", "textboxchannelname", "soundsdatasource", "events", "timer"];
            _0x16372a = {};
            _0x33cd1d = {};
            if (!_0x395e7a) {
              _0x37cf3a.next = 14;
              break;
            }
            if (typeof ((_0x4a0a03 = window.session.me) === null || _0x4a0a03 === undefined ? undefined : _0x4a0a03.channel?.profileId) === "number") {
              _0x37cf3a.next = 6;
              break;
            }
            throw "Unknown profileId";
          case 6:
            _0x37cf3a.next = 8;
            return new Promise(function (_0xed03c4, _0x22b348) {
              var _0x26ad58;
              api.doAction("POST", "importActions", {
                targetProfileId: ((_0x26ad58 = window.session.me) === null || _0x26ad58 === undefined ? undefined : _0x26ad58.channel?.profileId) || 1,
                actions: _0x5eee13.actions
              }, function (_0x14690c) {
                _0xed03c4(_0x14690c.newRecordMappings);
              }, function (_0x633b89) {
                _0x22b348(_0x633b89);
              });
            });
          case 8:
            _0x16372a = _0x37cf3a.sent;
            if (Array.isArray(_0x5eee13.actions)) {
              _0x345fd7 = _createForOfIteratorHelper(actionsandevents.actions);
              try {
                _0x265200 = function _0xa959d9() {
                  var _0x3d1bdc = _0x3cdfdd.value;
                  var _0x524694 = _0x5eee13.actions.find(function (_0x236a71) {
                    return _0x236a71.name === _0x3d1bdc.name;
                  });
                  if (_0x524694 && _0x16372a[_0x524694.id]) {
                    _0x33cd1d[_0x3d1bdc.id] = _0x16372a[_0x524694.id];
                  }
                };
                for (_0x345fd7.s(); !(_0x3cdfdd = _0x345fd7.n()).done;) {
                  _0x265200();
                }
              } catch (_0x44dc10) {
                _0x345fd7.e(_0x44dc10);
              } finally {
                _0x345fd7.f();
              }
            }
            setup.replaceEventActionMappings(actionsandevents.events, _0x33cd1d);
            setup.replaceEventActionMappings(actionsandevents.timer, _0x33cd1d);
            settings.set("events", JSON.stringify(actionsandevents.events));
            settings.set("timer", JSON.stringify(actionsandevents.timer));
          case 14:
            if (!_0x5eee13.dynamicSettings) {
              _0x37cf3a.next = 31;
              break;
            }
            if (_0x5b57ec) {
              if (_0x5eee13.dynamicSettings.profilechannelname) {
                settings.set("profilechannelname", _0x5eee13.dynamicSettings.profilechannelname);
              }
              if (_0x5eee13.dynamicSettings.profilechannelname) {
                settings.set("textboxchannelname", _0x5eee13.dynamicSettings.textboxchannelname);
              }
            }
            if (!_0x463ddc) {
              _0x37cf3a.next = 29;
              break;
            }
            _0x37cf3a.t0 = _regeneratorRuntime().keys(_0x5eee13.dynamicSettings);
          case 18:
            if ((_0x37cf3a.t1 = _0x37cf3a.t0()).done) {
              _0x37cf3a.next = 29;
              break;
            }
            key = _0x37cf3a.t1.value;
            _0x599dac = _0x5eee13.dynamicSettings[key];
            if (!key.includes("chatbotsnippet")) {
              _0x37cf3a.next = 23;
              break;
            }
            return _0x37cf3a.abrupt("continue", 18);
          case 23:
            if (!_0x41a359.includes(key)) {
              _0x37cf3a.next = 25;
              break;
            }
            return _0x37cf3a.abrupt("continue", 18);
          case 25:
            settings.set(key, _0x599dac);
            console.log("set", key);
            _0x37cf3a.next = 18;
            break;
          case 29:
            if (_0x3ccf58) {
              if (!sounds.soundsDataSource) {
                sounds.soundsDataSource = [];
              }
              _0x6c2f70 = _createForOfIteratorHelper(JSON.parse(_0x5eee13.dynamicSettings.soundsdatasource));
              try {
                _0x462269 = function _0xd4dcff() {
                  var _0x44e208 = _0x41d71e.value;
                  _0x44e208.id = utils.uuidv4();
                  _0x44e208.isImported = true;
                  sounds.soundsDataSource = sounds.soundsDataSource.filter(function (_0x54f7dc) {
                    return _0x54f7dc.triggerId !== _0x44e208.triggerId || _0x54f7dc.soundName !== _0x44e208.soundName;
                  });
                  sounds.soundsDataSource.push(_0x44e208);
                };
                for (_0x6c2f70.s(); !(_0x41d71e = _0x6c2f70.n()).done;) {
                  _0x462269();
                }
              } catch (_0x144793) {
                _0x6c2f70.e(_0x144793);
              } finally {
                _0x6c2f70.f();
              }
              settings.set("soundsDataSource", JSON.stringify(sounds.soundsDataSource));
            }
            if (_0x315355) {
              _0x10650c = JSON.parse(_0x5eee13.dynamicSettings.events || "[]");
              _0x5b1751 = JSON.parse(_0x5eee13.dynamicSettings.timer || "[]");
              setup.replaceEventActionMappings(_0x10650c, _0x16372a);
              setup.replaceEventActionMappings(_0x5b1751, _0x16372a);
              _0xeb36e8 = _createForOfIteratorHelper(actionsandevents.events);
              try {
                _0x10ca2f = function _0x174805() {
                  var _0x297dc1 = _0x51e48c.value;
                  if (_0x10650c.find(function (_0x211dcf) {
                    return _0x211dcf.whichUserId === _0x297dc1.whichUserId && _0x211dcf.triggerTypeId === _0x297dc1.triggerTypeId && _0x211dcf.userId === _0x297dc1.userId && _0x211dcf.chatCmd === _0x297dc1.chatCmd && _0x211dcf.minBarsAmount === _0x297dc1.minBarsAmount && _0x211dcf.minLikesAmount === _0x297dc1.minLikesAmount && _0x211dcf.giftId === _0x297dc1.giftId;
                  })) {
                    _0x297dc1.remove = true;
                  }
                };
                for (_0xeb36e8.s(); !(_0x51e48c = _0xeb36e8.n()).done;) {
                  _0x10ca2f();
                }
              } catch (_0x47c1b0) {
                _0xeb36e8.e(_0x47c1b0);
              } finally {
                _0xeb36e8.f();
              }
              _0x5b0981 = _createForOfIteratorHelper(actionsandevents.timer);
              try {
                _0x45cd1c = function _0x1dfec0() {
                  var _0xfb5cc9 = _0x8bd9fc.value;
                  if (_0x5b1751.find(function (_0x467ade) {
                    return _0x467ade.originalId === _0xfb5cc9.originalId || _0x467ade.originalId === _0xfb5cc9.id;
                  })) {
                    _0xfb5cc9.remove = true;
                  } else {
                    _0xfb5cc9.__KEY__ = utils.uuidv4();
                  }
                };
                for (_0x5b0981.s(); !(_0x8bd9fc = _0x5b0981.n()).done;) {
                  _0x45cd1c();
                }
              } catch (_0x106132) {
                _0x5b0981.e(_0x106132);
              } finally {
                _0x5b0981.f();
              }
              actionsandevents.events = actionsandevents.events.filter(function (_0x346400) {
                return !_0x346400.remove;
              });
              actionsandevents.events = [].concat(_toConsumableArray(actionsandevents.events), _toConsumableArray(_0x10650c));
              actionsandevents.timer = actionsandevents.timer.filter(function (_0x123f1e) {
                return !_0x123f1e.remove;
              });
              actionsandevents.timer = [].concat(_toConsumableArray(actionsandevents.timer), _toConsumableArray(_0x5b1751));
              settings.set("events", JSON.stringify(actionsandevents.events));
              settings.set("timer", JSON.stringify(actionsandevents.timer));
            }
          case 31:
            settings.save();
          case 32:
          case "end":
            return _0x37cf3a.stop();
        }
      }
    }, _0x52fdc3);
  }));
  return function (_0x57a523, _0x30fa39, _0x870f97, _0x3403aa, _0x4e49c4, _0x3a658f) {
    return _0x495782.apply(this, arguments);
  };
}();
setup.replaceEventActionMappings = function (_0x456319, _0x3d05d6) {
  var _0x16d617 = _createForOfIteratorHelper(_0x456319);
  var _0x2fd2b8;
  try {
    for (_0x16d617.s(); !(_0x2fd2b8 = _0x16d617.n()).done;) {
      var _0x1a7dba = _0x2fd2b8.value;
      if (!_0x1a7dba.originalId) {
        _0x1a7dba.originalId = _0x1a7dba.id;
      }
      _0x1a7dba.id = utils.uuidv4();
      _0x1a7dba.isImported = true;
      if (Array.isArray(_0x1a7dba.actionIds)) {
        for (var _0x2fbaf7 in _0x1a7dba.actionIds) {
          if (_0x3d05d6[_0x1a7dba.actionIds[_0x2fbaf7]]) {
            _0x1a7dba.actionIds[_0x2fbaf7] = _0x3d05d6[_0x1a7dba.actionIds[_0x2fbaf7]];
          }
        }
      }
      if (Array.isArray(_0x1a7dba.actionRandomIds)) {
        for (var _0x1ec1c9 in _0x1a7dba.actionRandomIds) {
          if (_0x3d05d6[_0x1a7dba.actionRandomIds[_0x1ec1c9]]) {
            _0x1a7dba.actionRandomIds[_0x1ec1c9] = _0x3d05d6[_0x1a7dba.actionRandomIds[_0x1ec1c9]];
          }
        }
      }
      if (_0x1a7dba.actionId && _0x3d05d6[_0x1a7dba.actionId]) {
        _0x1a7dba.actionId = _0x3d05d6[_0x1a7dba.actionId];
      }
    }
  } catch (_0x425ede) {
    _0x16d617.e(_0x425ede);
  } finally {
    _0x16d617.f();
  }
};
setup.showPatreonConnectReminder = function () {
  window.hideDialogsOnLoad = true;
  var _0x88a7da = DevExpress.ui.dialog.confirm("Have you joined the membership on Patreon?<br><br>If so, the final step is to create a connection between Patreon and TikFinity.<br>This can be done at any time under \"Setup\" => \"Patreon Connection\".<br><br>Do you want to connect to Patreon now to unlock TikFinity Pro?", "Patreon Connection");
  _0x88a7da.done(function (_0x1669f5) {
    settings.set("patreonPageOpened", "");
    if (_0x1669f5) {
      setup.scrollToPatreonConnection();
    }
  });
};
setup.getDiscorOAuthUrl = function () {
  return `${location.origin}/discord/connect?channelId=${window.session.me.channelId}&verify=${window.session.me.discordVerifyToken}`;
};
setup.updatePaymentMethod = function () {
  var _0x579fb1;
  if ((_0x579fb1 = window.session.me.userFeatures.proInfo) !== null && _0x579fb1 !== undefined && _0x579fb1.updateUrl) {
    window.open(window.session.me.userFeatures.proInfo.updateUrl, "_blank");
  }
};
setup.logDebugModeEvent = function (_0x11d549, _0x40b8ae) {
  if (setup.debugEnabled !== true) {
    return;
  }
  api.logError({
    type: "debugModeEvent",
    eventName: _0x11d549,
    eventData: _0x40b8ae
  }, function () {}, function () {});
};
setup.testStreamerbotConnection = _asyncToGenerator(_regeneratorRuntime().mark(function _callee12() {
  var _0x2e4d90;
  var _0x32a258;
  return _regeneratorRuntime().wrap(function _0x34f4b5(_0x53f29b) {
    while (1) {
      switch (_0x53f29b.prev = _0x53f29b.next) {
        case 0:
          _0x53f29b.prev = 0;
          _0x53f29b.next = 3;
          return setup.getStreamerbotConnection(true);
        case 3:
          _0x2e4d90 = _0x53f29b.sent;
          if (!_0x2e4d90) {
            _0x53f29b.next = 10;
            break;
          }
          _0x53f29b.next = 7;
          return _0x2e4d90.getInfo();
        case 7:
          _0x53f29b.t0 = _0x53f29b.sent;
          _0x53f29b.next = 11;
          break;
        case 10:
          _0x53f29b.t0 = null;
        case 11:
          _0x32a258 = _0x53f29b.t0;
          if (!_0x32a258) {
            _0x53f29b.next = 16;
            break;
          }
          DevExpress.ui.dialog.alert(`
            Connection successfully established to Streamer.bot ${_0x32a258.info.version}!<br><br>
            Now you can trigger Streamer.bot Actions via your TikFinity Actions<br>
            and send chatbot messages!
            `, "Success");
          _0x53f29b.next = 17;
          break;
        case 16:
          throw new Error("Unable to communicate with Streamer.bot.");
        case 17:
          _0x53f29b.next = 22;
          break;
        case 19:
          _0x53f29b.prev = 19;
          _0x53f29b.t1 = _0x53f29b.catch(0);
          DevExpress.ui.dialog.alert(`
        Could not connect to Streamer.bot! Please check the information and make sure<br>
        that the Streamer.bot is running and the connection details are correct.<br>
        <br>
        Error: ${_0x53f29b.t1.message}<br><br>
        Please read the <a href="/streamerbot-integration" target="_blank">Setup Instructions</a>.
        `, "Connection Failed");
        case 22:
        case "end":
          return _0x53f29b.stop();
      }
    }
  }, _callee12, null, [[0, 19]]);
}));
setup.getStreamerbotConnection = function () {
  var _0x565098 = _asyncToGenerator(_regeneratorRuntime().mark(function _0xa4ddd1(_0x3e92e7) {
    var _0x4f46f0;
    var _0x416fa8;
    var _0x44d59e;
    var _0x8c0af;
    return _regeneratorRuntime().wrap(function _0x1ea122(_0x3a75ac) {
      while (1) {
        switch (_0x3a75ac.prev = _0x3a75ac.next) {
          case 0:
            if (!!_0x3e92e7 || ((_0x4f46f0 = setup.streamerbotConnection) === null || _0x4f46f0 === undefined ? undefined : _0x4f46f0.socket?.readyState) !== 1) {
              _0x3a75ac.next = 2;
              break;
            }
            return _0x3a75ac.abrupt("return", setup.streamerbotConnection);
          case 2:
            if (setup.streamerbotConnection) {
              setup.streamerbotConnection.disconnect();
            }
            _0x8c0af = false;
            setup.streamerbotConnection = new StreamerbotClient({
              host: ((_0x416fa8 = setup.inputValues.streamerbotWebsocketIp) === null || _0x416fa8 === undefined ? undefined : _0x416fa8.trim()) || "127.0.0.1",
              port: setup.inputValues.streamerbotWebsocketPort || 8080,
              endpoint: ((_0x44d59e = setup.inputValues.streamerbotWebsocketEndpoint) === null || _0x44d59e === undefined ? undefined : _0x44d59e.trim()) || "/",
              immediate: false,
              subscribe: {
                General: ["Custom"]
              },
              onConnect: function _0x1b7457() {
                toastr.success("Streamer.bot connected!");
                _0x8c0af = true;
              },
              onDisconnect: function _0x8c27a3(_0x161cec) {
                if (_0x8c0af) {
                  toastr.error("Streamer.bot disconnected!");
                  _0x8c0af = false;
                }
              }
            });
            _0x3a75ac.prev = 5;
            _0x3a75ac.next = 8;
            return setup.streamerbotConnection.connect();
          case 8:
            setup.streamerbotConnection.on("General.Custom", setup.processStreamerbotCustomEvent);
            return _0x3a75ac.abrupt("return", setup.streamerbotConnection);
          case 12:
            _0x3a75ac.prev = 12;
            _0x3a75ac.t0 = _0x3a75ac.catch(5);
            setup.streamerbotConnection.disconnect();
            toastr.error(_0x3a75ac.t0.message, "Streamer.bot Error");
            return _0x3a75ac.abrupt("return", null);
          case 17:
          case "end":
            return _0x3a75ac.stop();
        }
      }
    }, _0xa4ddd1, null, [[5, 12]]);
  }));
  return function (_0x97b61) {
    return _0x565098.apply(this, arguments);
  };
}();
setup.processStreamerbotCustomEvent = function (_0xfd22a6) {
  var _0x318f4f;
  var _0x36fdf2;
  switch (_0xfd22a6.data?.action) {
    case "sendChatbotMessage":
      if (!chatbot.inputValues.checkboxEnableStreamerbotMessages) {
        toastr.error("Streamer.bot messages are disabled in the chatbot settings.", "Streamer.bot Error");
        break;
      }
      if ((_0x318f4f = _0xfd22a6.data) !== null && _0x318f4f !== undefined && (_0x36fdf2 = _0x318f4f.args) !== null && _0x36fdf2 !== undefined && _0x36fdf2.message) {
        chatservice.sendMessage(_0xfd22a6.data.args.message, _0xfd22a6.data.args.nickname || _0xfd22a6.data.args.username || null, "STREAMERBOT_CUSTOM");
      } else {
        toastr.error("Failed to send message. Variable 'message' not defined. Please read the integration guide.", "Streamer.bot Error");
      }
      break;
  }
};
setup.openNativeUpgradeModal = function () {
  ui.modal.showCheckoutModal();
  return;
  if ($("#upgrNativeModal").hasClass("nativeModalShow")) {
    return;
  }
  $("#upgrNativeModal").find(".nativeModalUpgrInfo").append($("#setupProInner"));
  $("#upgrNativeModal").addClass("nativeModalShow");
  $("#setupPro").css("display", "none");
};
setup.closeNativeUpgradeModal = function () {
  if ($("#upgrNativeModal").hasClass("nativeModalShow")) {
    $("#upgrNativeModal").removeClass("nativeModalShow");
    $("#setupProOuter").append($("#setupProInner"));
    $("#setupPro").css("display", "block");
  }
};
setup.startTazapayFlow = function (_0x5658e0, _0x46d8c5, _0x927a42, _0x3cd69a, _0x203824 = "tazapay") {
  posthog.capture("checkout plan_selected", {
    vendor: "tazapay",
    id: window.session.me.channel.channelId,
    method: _0x203824,
    price: _0x5658e0,
    affiliateId: _0x927a42,
    agencyId: _0x3cd69a,
    period: _0x46d8c5 === 365 ? "year" : "month"
  });
  $("#tazapayFlowContainer").dxPopup({
    width: 450,
    height: 310,
    visible: true,
    title: "Customer Details",
    closeOnOutsideClick: false,
    showCloseButton: true,
    container: $("#checkoutModal-modal"),
    contentTemplate: function _0x30c6cb(_0x2c0874) {
      _0x2c0874.append($("<div>").html("Please complete your payment details to continue."));
      _0x2c0874.append($("<div>").html("\n                <div class=\"dxForm\" style=\"width: unset;\">\n                    <div class=\"form\">\n                        <div class=\"dx-fieldset\">\n                            <div class=\"dx-field\">\n                                <div class=\"dx-field-label\">Email address</div>\n                                <div class=\"dx-field-value\">\n                                    <div class=\"tazaflowEmail\"></div>\n                                </div>\n                            </div>\n                            <div class=\"dx-field\">\n                                <div class=\"dx-field-label\">Your full name</div>\n                                <div class=\"dx-field-value\">\n                                    <div class=\"tazaflowName\"></div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div style=\"text-align: center; margin-top: 50px;\">\n                    <div class=\"tazaflowSubmit\"></div>\n                </div>\n            "));
      _0x2c0874.find(".tazaflowEmail").dxTextBox({
        value: window.session.me.channel.email,
        disabled: true
      });
      _0x2c0874.find(".tazaflowName").dxTextBox({
        value: settings.get("tazaflowName", ""),
        maxLength: 100,
        onEnterKey: function _0x18c24d() {
          _0x2c0874.find(".tazaflowSubmit").click();
        }
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x2c0874.find(".tazaflowSubmit").dxButton({
        text: "Continue",
        width: "140px",
        onClick: function () {
          var _0x235c87 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x4ac7ad() {
            var _0x561ec0;
            return _regeneratorRuntime().wrap(function _0x34cc56(_0x14fb88) {
              while (1) {
                switch (_0x14fb88.prev = _0x14fb88.next) {
                  case 0:
                    if (_0x2c0874.find(".tazaflowName").dxValidator("instance").validate().isValid) {
                      _0x14fb88.next = 2;
                      break;
                    }
                    return _0x14fb88.abrupt("return");
                  case 2:
                    settings.set("tazaflowName", _0x2c0874.find(".tazaflowName").dxTextBox("instance").option("value"));
                    _0x2c0874.find(".tazaflowSubmit").dxButton("instance").option("disabled", true);
                    _0x2c0874.find(".tazaflowSubmit").dxButton("instance").option("text", "Processing...");
                    _0x561ec0 = _0x2c0874.find(".tazaflowName").dxTextBox("instance").option("value");
                    setup.createTazaCheckout(_0x46d8c5, _0x561ec0).then(function () {
                      $("#tazapayFlowContainer").dxPopup("instance").hide();
                    }).catch(function () {
                      $("#tazapayFlowContainer").dxPopup("instance").hide();
                    });
                  case 7:
                  case "end":
                    return _0x14fb88.stop();
                }
              }
            }, _0x4ac7ad);
          }));
          function _0x39b2c3() {
            return _0x235c87.apply(this, arguments);
          }
          return _0x39b2c3;
        }()
      });
      setTimeout(function () {
        _0x2c0874.find(".tazaflowName").dxTextBox("instance").focus();
      }, 100);
    }
  }).dxPopup("instance");
};
setup.createTazaCheckout = function (_0x43c545, _0x4f9391) {
  return new Promise(function (_0x5ec95b, _0x599bb3) {
    var _0x274671 = {
      days: _0x43c545,
      name: _0x4f9391
    };
    api.doAction("POST", "pro/tazapay/checkout", _0x274671, function (_0x591e01) {
      _0x5ec95b();
      if (_0x591e01 !== null && _0x591e01 !== undefined && _0x591e01.url) {
        window.open(_0x591e01.url, "_blank");
        api.logError({
          type: "Tazapay",
          message: "Tazapay checkout started",
          params: _0x274671,
          url: _0x591e01.url
        });
      } else {
        toastr.error("Error while starting the payment process. Please try again later.");
      }
    }, function (_0x5ce1f8) {
      _0x599bb3();
      toastr.error("Error while starting the payment process. Please try again later.");
      api.logError({
        type: "Tazapay",
        message: "Tazapay checkout error",
        params: _0x274671
      });
    });
  });
};
setup.onHeaderLoginClick = function () {
  if (navigation.currentPage === "setup") {
    $(".loginSection").removeClass("shakeEffect");
    setTimeout(function () {
      $(".loginSection").addClass("shakeEffect");
    }, 100);
    return;
  }
  navigation.pageChange("setup");
};
setup.setupMobileVoucherCode = function () {
  var _0x3745b1 = false;
  var _0x3dd039 = window.session.me.mobileVoucherCode;
  if (!_0x3dd039) {
    return;
  }
  $("#mobileVoucherCode").removeClass("hidden");
  var _0x49ed72 = utils.initDxInput(setup, "dxTextBox", $("#mobileVoucherCodeInput"), "XXXX-XXXX", {
    placeholder: "XXXX-XXXX",
    readOnly: true,
    mode: "text",
    width: "200px",
    buttons: [{
      name: "copy",
      location: "after",
      options: {
        icon: "fas fa-copy",
        hint: "Copy code",
        disabled: false,
        stylingMode: "text",
        onClick: function _0x8c3baa() {
          var _0xeb1d3a = $("#mobileVoucherCodeInput").dxTextBox("instance").option("value");
          var _0x17b490 = _0x3dd039 || (_0xeb1d3a !== "XXXX-XXXX" ? _0xeb1d3a : null);
          utils.copyTextToClipboard(_0x17b490, localization.t("setup_mobile_voucher_copy_success_title"));
        }
      }
    }, {
      name: "toggleVisibility",
      location: "after",
      options: {
        icon: "fas fa-eye",
        hint: "Show code",
        disabled: false,
        stylingMode: "text",
        onClick: function _0x3af74b() {
          _0x3745b1 = !_0x3745b1;
          var _0x2f0db0 = $("#mobileVoucherCodeInput").dxTextBox("instance");
          var _0x5a4e2b = _0x2f0db0.option("value");
          if (_0x3745b1) {
            var _0x4641fc = _0x3dd039 || (_0x5a4e2b !== "XXXX-XXXX" ? _0x5a4e2b : null);
            if (_0x4641fc) {
              _0x2f0db0.option("value", _0x4641fc);
            } else {
              _0x2f0db0.option("value", "XXXX-XXXX");
            }
          } else {
            if (_0x5a4e2b && _0x5a4e2b !== "XXXX-XXXX") {
              _0x3dd039 = _0x5a4e2b;
            }
            _0x2f0db0.option("value", "XXXX-XXXX");
          }
          var _0x26174f = _0x2f0db0.option("buttons");
          _0x26174f[1].options.icon = _0x3745b1 ? "fas fa-eye-slash" : "fas fa-eye";
          _0x26174f[1].options.hint = _0x3745b1 ? "Hide code" : "Show code";
          _0x2f0db0.option("buttons", _0x26174f);
        }
      }
    }]
  });
  _0x49ed72.option("value", "XXXX-XXXX");
};
var chatbot = {
  inputValues: {},
  chatbotSnippets: [],
  dataGridChatbotAnswers: null,
  cleverbotCsValues: {},
  cleverbotCounter: 0,
  streamboerConnectionCheckerInterval: null
};
setIntervalFix(function () {
  chatbot.cleverbotCsValues = {};
}, 900000);
setIntervalFix(function () {
  chatbot.cleverbotCounter = 0;
}, 30000);
chatbot.init = function () {
  chatbot.initCustomSnippets();
  chatbot.initSnippetGrid();
  utils.initDxInput(chatbot, "dxCheckBox", $("#checkboxEnableChatbot"), false, {
    text: localization.getString("chatbot_enable")
  });
  utils.initDxInput(chatbot, "dxCheckBox", $("#checkboxEnableStreamerbotMessages"), false, {
    text: "Allow Streamer.bot to push messages to TikFinity"
  });
  utils.initDxInput(chatbot, "dxNumberBox", $("#chatbotMaxMessages15SecondsNumberbox"), 2, {
    min: 1,
    max: 5,
    showSpinButtons: true,
    format: "#0' Messages per 15 Seconds'"
  });
  $("#chatbotTestButton").dxButton({
    text: "Send Test Message",
    disabled: !chatbot.chatAllowed(),
    onClick: function _0x2057da() {
      if (!chatbot.inputValues.checkboxEnableChatbot) {
        return toastr.error("Please enable the CheckBox", "Chatbot is not enabled!");
      }
      chatservice.sendMessage("Hello from TikFinity!", "TestUser", "CUSTOM_TEST_MESSAGE");
    }
  });
  $("#configureStreamerBotButton").dxButton({
    text: "Configure Streamer.bot",
    onClick: function _0x5d30b0() {
      setup.scrollToStreamerbotConfiguration();
    }
  });
  $("#chatbotWarning").hide();
  if (!chatbot.streamboerConnectionCheckerInterval) {
    chatbot.streamboerConnectionCheckerInterval = setInterval(chatbot.checkStreamerbotConnection, 600000);
    chatbot.checkStreamerbotConnection();
  }
};
chatbot.checkStreamerbotConnection = function () {
  if (chatbot.inputValues.checkboxEnableChatbot && chatbot.inputValues.checkboxEnableStreamerbotMessages && chatbot.chatAllowed()) {
    setup.getStreamerbotConnection();
  }
};
chatbot.chatAllowed = function () {
  if (window.appConfig.useBrowserBridge) {
    return true;
  }
  if (window.appConfig.electronUseBrowserBridge && window.session.isElectron) {
    return true;
  }
  if (!setup.inputValues.checkboxServerSideConnection) {
    return true;
  }
};
chatbot.onChannelContextChanged = function () {
  if (chatbot.chatAllowed()) {
    $("#chatbotNoticeBanners").hide();
    $("#chatbotWarning").show();
  } else {
    $("#checkboxEnableChatbot").hide();
    $("#chatbotWarning").hide();
  }
  if (window.session.me && window.session.me.channel && !window.session.me.channel.isChatbotApproved) {
    $("#notificationChatbotNeedsApproval").removeClass("hidden");
  }
};
chatbot.initSnippetGrid = function () {
  chatbot.dataGridChatbotAnswers = $("#dataGridChatbotAnswers").dxDataGrid({
    dataSource: chatbot.chatbotSnippets,
    showBorders: true,
    editing: {
      allowUpdating: true,
      allowDeleting: true,
      mode: "cell",
      texts: {
        deleteRow: "Reset",
        confirmDeleteMessage: false
      }
    },
    paging: {
      enabled: false
    },
    sorting: {
      mode: "none"
    },
    columns: [{
      dataField: "enabled",
      caption: localization.getString("chatbot_list_active"),
      width: "60px",
      allowEditing: true
    }, {
      dataField: "command",
      caption: localization.getString("chatbot_list_command"),
      width: "200px",
      allowEditing: false
    }, {
      dataField: "szenario",
      caption: localization.getString("chatbot_list_szenario"),
      width: "350px",
      allowEditing: false
    }, {
      dataField: "message",
      caption: localization.getString("chatbot_list_message"),
      allowEditing: true
    }],
    onRowRemoving: function _0x102352(_0x800552) {
      _0x800552.cancel = true;
      chatbot.resetSnippet(_0x800552.data.id);
      chatbot.initSnippetGrid();
    },
    onRowUpdated: function _0x963b18(_0x262d77) {
      chatbot.updateSnippet(_0x262d77.data.id, _0x262d77.data.enabled, _0x262d77.data.message);
      chatbot.initSnippetGrid();
    }
  }).dxDataGrid("instance");
};
chatbot.initCustomSnippets = function () {
  chatbot.chatbotSnippets = [];
  var _0x19c62d = window.appConfig["chatbotSnippets_" + localization.currentLangCode] || window.appConfig.chatbotSnippets_en;
  _0x19c62d.forEach(function (_0x59aa8e) {
    _0x19c62d = JSON.parse(JSON.stringify(_0x59aa8e));
    var _0x4771f2 = localStorage.getItem("chatbotsnippet_" + _0x19c62d.id.toLowerCase() + "_enabled");
    var _0x1ec6d1 = localStorage.getItem("chatbotsnippet_" + _0x19c62d.id.toLowerCase() + "_message");
    _0x19c62d.enabled = _0x4771f2 ? _0x4771f2 === "true" : _0x19c62d.enabled;
    _0x19c62d.message = _0x1ec6d1 ? _0x1ec6d1 : _0x19c62d.message;
    chatbot.chatbotSnippets.push(_0x19c62d);
  });
};
chatbot.resetSnippet = function (_0x37af0b) {
  localStorage.removeItem("chatbotsnippet_" + _0x37af0b.toLowerCase() + "_message");
  localStorage.removeItem("chatbotsnippet_" + _0x37af0b.toLowerCase() + "_enabled");
  chatbot.initCustomSnippets();
  settings.save();
};
chatbot.updateSnippet = function (_0x3391e0, _0x5b08f4, _0x391059) {
  var _0xfcfb7 = window.appConfig["chatbotSnippets_" + localization.currentLangCode].find(function (_0xc24004) {
    return _0xc24004.id === _0x3391e0;
  });
  if (_0xfcfb7.message === _0x391059) {
    localStorage.removeItem("chatbotsnippet_" + _0x3391e0.toLowerCase() + "_message");
  } else {
    localStorage.setItem("chatbotsnippet_" + _0x3391e0.toLowerCase() + "_message", _0x391059);
  }
  if (_0xfcfb7.enabled === _0x5b08f4) {
    localStorage.removeItem("chatbotsnippet_" + _0x3391e0.toLowerCase() + "_enabled");
  } else {
    localStorage.setItem("chatbotsnippet_" + _0x3391e0.toLowerCase() + "_enabled", _0x5b08f4);
  }
  chatbot.initCustomSnippets();
  settings.save();
};
chatbot.onInputChange = function (_0x197ce4, _0x5c15c6) {
  if (_0x197ce4 === "checkboxEnableStreamerbotMessages" && _0x5c15c6 === true) {
    setup.testStreamerbotConnection();
  }
};
chatbot.sendChatbotMessageByTemplate = function (_0x534279, _0x5e41bd, _0xe46d4d) {
  var _0x3f2f22 = chatbot.chatbotSnippets.find(function (_0xc2aaf4) {
    return _0xc2aaf4.id === _0x534279 && _0xc2aaf4.enabled;
  });
  if (!_0x3f2f22) {
    return false;
  }
  var _0x239082 = _0x3f2f22.message.replaceAll("%username%", _0x5e41bd).replaceAll("%currencyname%", settings.get("textboxCurrencyName"));
  if (_0xe46d4d) {
    for (fieldName in _0xe46d4d) {
      var _0x22f2a4 = _0xe46d4d[fieldName];
      _0x239082 = _0x239082.replaceAll("%" + fieldName + "%", _0x22f2a4.toString());
    }
  }
  chatservice.sendMessage(_0x239082, _0x5e41bd, _0x3f2f22.id);
  return true;
};
var chatcommands = {
  inputs: {},
  inputValues: {}
};
chatcommands.init = function () {
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdHelpEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdHelp"), "!help");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdGetPointsEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdGetPoints"), "!score");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdTransferPointsEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdTransferPoints"), "!send");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdSpinEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdSpin"), "!spin");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdCoinDropEnabled"), true, {
    disabled: true
  });
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdCoinDrop"), "!get");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdCustomCommandsEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdCustomCommands"), "!commands");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdCustomSubCommandsEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdCustomSubCommands"), "!subcommands");
  utils.initDxInput(chatcommands, "dxCheckBox", $("#checkboxChatCmdCustomUserCommandsEnabled"), true);
  utils.initDxInput(chatcommands, "dxTextBox", $("#textboxChatCmdCustomUserCommands"), "!mycommands");
  chatcommands.setCommandsInTemplate();
  setInterval(chatcommands.setCommandsInTemplate, 500);
  $(".gotoCommandSettingsButton").dxButton({
    icon: "preferences",
    onInitialized: function _0x33e87c(_0x445755) {
      var _0x205cc3 = $(_0x445755.element).data("destpage");
      _0x445755.component.option("disabled", !_0x205cc3);
    },
    onClick: function _0x29baa7(_0x1eea28) {
      var _0xbfc13e = $(_0x1eea28.element).data("destpage");
      if (!_0xbfc13e) {
        return;
      }
      navigation.pageChange(_0xbfc13e);
    }
  });
};
chatcommands.onInputChange = function () {
  chatcommands.setCommandsInTemplate();
};
chatcommands.setCommandsInTemplate = function () {
  for (var _0x5f25d2 in chatcommands.inputValues) {
    if (_0x5f25d2.indexOf("textboxChat") === 0) {
      var _0x1728a2 = chatcommands.inputValues[_0x5f25d2];
      var _0x481225 = _0x5f25d2.replace("textboxChat", "").toLocaleLowerCase();
      $("." + _0x481225).text(_0x1728a2);
    }
  }
};
chatcommands.handlePointsCommand = function (_0x3a2fda, _0x1032e0) {
  var _0x32c97c = false;
  var _0xbab6c3 = 0;
  api.get("rest/channeluser", {
    channelId: settings.get("channelId"),
    orderColumn: "totalAmount",
    pageSize: 100
  }, function (_0x3f1bd8) {
    _0x3f1bd8.channelusers.forEach(function (_0x308c8e) {
      if (!_0x32c97c) {
        _0xbab6c3 += 1;
      }
      if (_0x308c8e.userId === _0x3a2fda) {
        _0x32c97c = true;
      }
    });
    api.get("rest/channeluser", {
      channelId: settings.get("channelId"),
      userId: _0x3a2fda
    }, function (_0x3a9ac2) {
      var _0x91ebf1 = 0;
      var _0x596d27 = 0;
      if (_0x3a9ac2.channelusers && _0x3a9ac2.channelusers.length) {
        _0x91ebf1 = parseFloat(_0x3a9ac2.channelusers[0].totalRewardAmount);
        _0x596d27 = parseFloat(_0x3a9ac2.channelusers[0].totalAmount);
      }
      var _0x10eca7 = _0x32c97c ? "SCORE_TOP_100" : "SCORE";
      var _0x25ac8e = chatbot.chatbotSnippets.find(function (_0x526bfb) {
        return _0x526bfb.id === _0x10eca7 && _0x526bfb.enabled;
      });
      socketiowrapper.emitSocketEvent("showUserScore", {
        userId: _0x3a2fda,
        username: _0x1032e0,
        totalAmount: _0x596d27,
        level: utils.getLevelByPoints(_0x91ebf1),
        rank: _0x32c97c ? _0xbab6c3 : 0,
        thumbnailUrl: getCachedImageUrl(_0x3a2fda)
      });
      if (!_0x25ac8e) {
        return;
      }
      var _0x5be57d = _0x25ac8e.message.replaceAll("%username%", _0x1032e0).replaceAll("%points%", _0x596d27.toLocaleString()).replaceAll("%currencyname%", settings.get("textboxCurrencyName")).replaceAll("%level%", utils.getLevelByPoints(_0x91ebf1)).replaceAll("%rank%", _0xbab6c3);
      chatservice.sendMessage(_0x5be57d, _0x1032e0, _0x25ac8e.id);
    }, function () {});
  }, function () {});
};
chatcommands.handleTransferCommand = function (_0x590b3d, _0x524cca, _0x1a0b0f) {
  try {
    var _0x3f802c = _0x1a0b0f.substr(settings.get("textboxChatCmdTransferPoints").trim().length, _0x1a0b0f.length).trim();
    if (!_0x3f802c) {
      throw "empty";
    }
    var _0x3f4575 = _0x3f802c.split(" ");
    if (_0x3f4575.length < 2) {
      throw "syntax";
    }
    var _0xd7c81e = parseFloat(_0x3f4575[0].replace(",", "."));
    var _0x150ed5 = _0x3f4575.slice(1).join(" ").replace("@", "");
    if (isNaN(_0xd7c81e)) {
      throw "NaN";
    }
    if (_0xd7c81e === 0) {
      throw "zero";
    }
    if (_0xd7c81e < 0.01) {
      throw "negative";
    }
    if (_0x150ed5.length < 3) {
      throw "receiver";
    }
    if (_0xd7c81e > 999999999) {
      _0xd7c81e = 999999999;
    }
    api.doAction("POST", "transferAmountToUser", {
      fromUserId: _0x590b3d,
      toUsername: _0x150ed5,
      amount: _0xd7c81e
    }, function (_0x5e751a) {
      var _0x238388 = chatbot.chatbotSnippets.find(function (_0xf62023) {
        return _0xf62023.id === "SEND_" + _0x5e751a.transferResult && _0xf62023.enabled;
      });
      if (_0x238388) {
        var _0x2dbe79 = _0x5e751a.receiverRecord ? _0x5e751a.receiverRecord.username : "";
        var _0x571d8a = _0x238388.message.replaceAll("%username%", _0x524cca).replaceAll("%currencyname%", settings.get("textboxCurrencyName")).replaceAll("%amount%", _0xd7c81e.toLocaleString()).replaceAll("%destination%", _0x2dbe79);
        chatservice.sendMessage(_0x571d8a, _0x524cca, _0x238388.id);
      }
    }, function () {});
  } catch (_0x5dd57b) {
    var _0x26499e = chatbot.chatbotSnippets.find(function (_0x53f2af) {
      return _0x53f2af.id === "SEND_FAILED_SYNTAX" && _0x53f2af.enabled;
    });
    if (!_0x26499e) {
      return;
    }
    var _0x1a7932 = _0x26499e.message.replaceAll("%username%", _0x524cca);
    chatservice.sendMessage(_0x1a7932, _0x524cca, _0x26499e.id);
  }
};
chatcommands.handleHelpCommand = function (_0x26deaf, _0x4ff492) {
  var _0x195f06 = chatbot.chatbotSnippets.find(function (_0x586e49) {
    return _0x586e49.id === "HELP" && _0x586e49.enabled;
  });
  if (_0x195f06) {
    var _0x3b31e9 = _0x195f06.message.replaceAll("%username%", _0x4ff492).replaceAll("%currencyname%", settings.get("textboxCurrencyName"));
    _0x3b31e9 = _0x3b31e9.replaceAll("%cmdpoints%", settings.get("textboxChatCmdGetPoints"));
    _0x3b31e9 = _0x3b31e9.replaceAll("%cmdsend%", settings.get("textboxChatCmdTransferPoints"));
    _0x3b31e9 = _0x3b31e9.replaceAll("%cmdspin%", settings.get("textboxChatCmdSpin"));
    _0x3b31e9 = _0x3b31e9.replaceAll("%cmdcustomglobal%", settings.get("textboxChatCmdCustomCommands"));
    _0x3b31e9 = _0x3b31e9.replaceAll("%cmdcustomsub%", settings.get("textboxChatCmdCustomSubCommands"));
    _0x3b31e9 = _0x3b31e9.replaceAll("%cmdcustompersonal%", settings.get("textboxChatCmdCustomUserCommands"));
    chatservice.sendMessage(_0x3b31e9, _0x4ff492, _0x195f06.id);
  }
  chatcommands.sendInfoScreenCommands();
  setTimeoutFix(function () {
    chatcommands.sendInfoScreenCustomCommands(0, "", 1);
  }, 1000);
};
chatcommands.sendInfoScreenCommands = function () {
  var _0x25cc98 = "";
  if (settings.get("checkboxChatCmdGetPointsEnabled") === "true") {
    _0x25cc98 += settings.get("textboxChatCmdGetPoints") + "<br>";
  }
  if (settings.get("checkboxChatCmdTransferPointsEnabled") === "true") {
    _0x25cc98 += settings.get("textboxChatCmdTransferPoints") + " [amount] [username]<br>";
  }
  if (settings.get("checkboxChatCmdSpinEnabled") === "true") {
    _0x25cc98 += settings.get("textboxChatCmdSpin") + "<br>";
  }
  socketiowrapper.emitSocketEvent("showCommands", {
    commandsText: _0x25cc98
  });
};
chatcommands.sendInfoScreenCustomCommands = function (_0x4e99be, _0x54b89d, _0x3cc6e9) {
  var _0x18a56a = "";
  var _0x46bd12 = "";
  if (!actionsandevents || !actionsandevents.events) {
    return;
  }
  var _0x30df4a = [];
  actionsandevents.events.forEach(function (_0x52f323) {
    if (_0x52f323.active && _0x52f323.whichUserId === _0x3cc6e9 && _0x52f323.triggerTypeId === 2 && (_0x3cc6e9 !== 2 || _0x52f323.userId === parseInt(_0x4e99be))) {
      var _0x47950a = actionsandevents.actions.find(function (_0xcd71ee) {
        return _0xcd71ee.id === _0x52f323.actionId || _0xcd71ee.id === _0x52f323.actionIds?.[0] || _0xcd71ee.id === _0x52f323.actionRandomIds?.[0];
      });
      if (_0x47950a) {
        _0x30df4a.push({
          event: _0x52f323,
          action: _0x47950a
        });
      }
    }
    if (_0x3cc6e9 === 1) {
      if (_0x52f323.active && _0x52f323.whichUserId === 5 && _0x52f323.triggerTypeId === 2 && (_0x3cc6e9 !== 2 || _0x52f323.userId === parseInt(_0x4e99be))) {
        var _0x47950a = actionsandevents.actions.find(function (_0x34dbd6) {
          return _0x34dbd6.id === _0x52f323.actionId || _0x34dbd6.id === _0x52f323.actionIds?.[0] || _0x34dbd6.id === _0x52f323.actionRandomIds?.[0];
        });
        if (_0x47950a) {
          _0x30df4a.push({
            event: _0x52f323,
            action: _0x47950a
          });
        }
      }
    }
  });
  _0x30df4a.sort(function (_0x11009f, _0x1e98c4) {
    return _0x1e98c4.action.amountToAdd - _0x11009f.action.amountToAdd;
  }).forEach(function (_0x259600) {
    var _0x52680e = "free";
    if (_0x259600.action.amountToAdd < 0) {
      _0x52680e = (_0x259600.action.amountToAdd * -1).toLocaleString();
    }
    _0x18a56a += _0x259600.event.chatCmd + " (<span class='price'>" + _0x52680e + "</span>), ";
    _0x46bd12 += _0x259600.event.chatCmd + " (" + _0x52680e + "), ";
  });
  if (_0x3cc6e9 === 1 && typeof songrequests === "object" && songrequests.getStoreText) {
    var _0x4b00f5 = songrequests.getStoreText();
    if (_0x4b00f5) {
      _0x18a56a += _0x4b00f5;
      _0x46bd12 += $("<div>").html(_0x4b00f5).text();
    }
  }
  _0x18a56a = _0x18a56a.substr(0, _0x18a56a.length - 2);
  _0x46bd12 = _0x46bd12.substr(0, _0x46bd12.length - 2);
  if (_0x3cc6e9 === 2 && _0x18a56a === "") {
    _0x18a56a = "-";
  }
  if (_0x3cc6e9 === 2 && _0x46bd12 === "") {
    _0x46bd12 = "-";
  }
  socketiowrapper.emitSocketEvent("showCustomCommands", {
    commandsText: _0x18a56a,
    whichUserId: _0x3cc6e9,
    username: _0x54b89d
  });
  var _0xc87551 = null;
  if (_0x3cc6e9 === 1) {
    _0xc87551 = chatbot.chatbotSnippets.find(function (_0x3ca190) {
      return _0x3ca190.id === "CUSTOM_COMMANDS" && _0x3ca190.enabled;
    });
  }
  if (_0x3cc6e9 === 3) {
    _0xc87551 = chatbot.chatbotSnippets.find(function (_0x524f3b) {
      return _0x524f3b.id === "CUSTOM_SUB_COMMANDS" && _0x524f3b.enabled;
    });
  }
  if (_0x3cc6e9 === 2) {
    _0xc87551 = chatbot.chatbotSnippets.find(function (_0x35f34d) {
      return _0x35f34d.id === "CUSTOM_USER_COMMANDS" && _0x35f34d.enabled;
    });
  }
  if (_0xc87551 && _0x4e99be) {
    var _0x1bac9a = _0xc87551.message.replaceAll("%username%", _0x54b89d);
    _0x1bac9a = _0x1bac9a.replaceAll("%globalcommands%", _0x46bd12);
    _0x1bac9a = _0x1bac9a.replaceAll("%subcommands%", _0x46bd12);
    _0x1bac9a = _0x1bac9a.replaceAll("%usercommands%", _0x46bd12);
    chatservice.sendMessage(_0x1bac9a, _0x54b89d, _0xc87551.id);
  }
};
chatcommands.onChat = function (_0x232781) {
  if (settings.get("checkboxChatCmdHelpEnabled") === "true" && settings.get("textboxChatCmdHelp").trim().length > 0 && (_0x232781.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdHelp").trim().toLowerCase()) === 0 || _0x232781.comment.trim().toLowerCase().indexOf("!help") === 0)) {
    chatcommands.handleHelpCommand(_0x232781.userId, _0x232781.name);
  }
  if (settings.get("checkboxChatCmdGetPointsEnabled") === "true" && settings.get("textboxChatCmdGetPoints").trim().length > 0 && _0x232781.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdGetPoints").trim().toLowerCase()) === 0) {
    chatcommands.handlePointsCommand(_0x232781.userId, _0x232781.name);
  }
  if (settings.get("checkboxChatCmdTransferPointsEnabled") === "true" && settings.get("textboxChatCmdTransferPoints").trim().length > 0 && _0x232781.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdTransferPoints").trim().toLowerCase()) === 0) {
    chatcommands.handleTransferCommand(_0x232781.userId, _0x232781.name, _0x232781.comment);
  }
  if (settings.get("checkboxChatCmdCustomCommandsEnabled") === "true" && settings.get("textboxChatCmdCustomCommands").trim().length > 0 && _0x232781.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdCustomCommands").trim().toLowerCase()) === 0) {
    chatcommands.sendInfoScreenCustomCommands(_0x232781.userId, _0x232781.name, 1);
  }
  if (settings.get("checkboxChatCmdCustomSubCommandsEnabled") === "true" && settings.get("textboxChatCmdCustomSubCommands").trim().length > 0 && _0x232781.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdCustomSubCommands").trim().toLowerCase()) === 0) {
    chatcommands.sendInfoScreenCustomCommands(_0x232781.userId, _0x232781.name, 3);
  }
  if (settings.get("checkboxChatCmdCustomUserCommandsEnabled") === "true" && settings.get("textboxChatCmdCustomUserCommands").trim().length > 0 && _0x232781.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdCustomUserCommands").trim().toLowerCase()) === 0) {
    chatcommands.sendInfoScreenCustomCommands(_0x232781.userId, _0x232781.name, 2);
  }
};
var tts = {
  freeMessages: 25,
  freeMessagesMax: 25,
  proCredits: 0,
  proCreditsMax: 100000,
  topUpCredits: 0,
  topUpCreditsMax: 100000,
  creditsRefreshDays: 30,
  aiVoices: [],
  aiVoiceIdPrefix: "tts_api__",
  lastKnownAiCreditsTotal: null,
  lastKnownFreeMessagesRemaining: null,
  lastKnownTopUpCredits: null,
  creditsTopupCheckoutWindow: null,
  aiCreditsBlocked: false,
  ttsCreditsTopupProductId: "",
  ttsCreditsTopupPriceIds: {
    tts_credits_small: "",
    tts_credits_medium: "",
    tts_credits_big: ""
  },
  aiAuthTokenRefreshIntervalId: null,
  aiAuthToken: window.ttsAuthToken || "",
  aiAuthTokenRequestPromise: null,
  aiVoiceStateRequestPromise: null,
  aiVoiceStateLastLoadedAt: 0
};
tts.ensureAiAuthToken = function (_0x15c013 = false) {
  if (tts.aiAuthTokenRequestPromise) {
    return tts.aiAuthTokenRequestPromise;
  }
  var _0x39ae76 = new Promise(function (_0x2344f9, _0x297fc3) {
    var _0x5e897f;
    var _0x1451dd = window.ttsAuthToken || tts.aiAuthToken || ((_0x5e897f = window.session) === null || _0x5e897f === undefined ? undefined : _0x5e897f.me?.ttsAuthToken) || "";
    if (!_0x15c013 && _0x1451dd) {
      tts.aiAuthToken = _0x1451dd;
      window.ttsAuthToken = _0x1451dd;
      return _0x2344f9(_0x1451dd);
    }
    api.doAction("POST", "tts/auth-token", null, function (_0xad8d53) {
      var _0x3eb894;
      var _0x3a2858 = _0xad8d53?.ttsAuthToken || "";
      tts.aiAuthToken = _0x3a2858;
      window.ttsAuthToken = _0x3a2858;
      if ((_0x3eb894 = window.session) !== null && _0x3eb894 !== undefined && _0x3eb894.me) {
        window.session.me.ttsAuthToken = _0x3a2858;
      }
      _0x2344f9(_0x3a2858);
    }, function (_0x34658f, _0x13e2d5) {
      _0x297fc3(new Error(_0x13e2d5 || `Failed to fetch TTS auth token (${_0x34658f || "unknown"})`));
    }, false, true);
  });
  tts.aiAuthTokenRequestPromise = _0x39ae76.finally(function () {
    tts.aiAuthTokenRequestPromise = null;
  });
  return tts.aiAuthTokenRequestPromise;
};
tts.startAiAuthTokenRefresh = function () {
  if (tts.aiAuthTokenRefreshIntervalId) {
    clearInterval(tts.aiAuthTokenRefreshIntervalId);
  }
  tts.aiAuthTokenRefreshIntervalId = setInterval(function () {
    tts.ensureAiAuthToken(true).catch(function () {});
  }, 3600000);
};
tts.requestAiTtsApi = function () {
  var _0x33f768 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x29a9b5(_0x4e0f6e) {
    var _0x3a1909;
    var _0x4a4fb5;
    var _0x4de6fa;
    var _0x37025e;
    var _0x45cbaa;
    var _0x322d71;
    var _0x3cdc82;
    return _regeneratorRuntime().wrap(function _0x386fae(_0x38f372) {
      while (1) {
        switch (_0x38f372.prev = _0x38f372.next) {
          case 0:
            _0x38f372.next = 2;
            return tts.ensureAiAuthToken();
          case 2:
            _0x3a1909 = _0x38f372.sent;
            _0x4a4fb5 = (window.appConfig?.ttsHost || "").replace(/\/+$/, "");
            _0x4de6fa = _0x4e0f6e.startsWith("/") ? _0x4e0f6e : `/${_0x4e0f6e}`;
            _0x37025e = _0x4a4fb5 ? `${_0x4a4fb5}${_0x4de6fa}` : "";
            if (!!_0x37025e && !!_0x3a1909) {
              _0x38f372.next = 8;
              break;
            }
            throw new Error("TTS API context unavailable");
          case 8:
            _0x38f372.next = 10;
            return fetch(_0x37025e, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${_0x3a1909}`
              }
            });
          case 10:
            _0x45cbaa = _0x38f372.sent;
            if (_0x45cbaa.ok) {
              _0x38f372.next = 16;
              break;
            }
            _0x38f372.next = 14;
            return _0x45cbaa.text().catch(function () {
              return "";
            });
          case 14:
            _0x322d71 = _0x38f372.sent;
            throw new Error(_0x322d71 || `TTS API Error (${_0x45cbaa.status})`);
          case 16:
            _0x3cdc82 = _0x45cbaa.headers.get("content-type") || "";
            if (!_0x3cdc82.includes("application/json")) {
              _0x38f372.next = 19;
              break;
            }
            return _0x38f372.abrupt("return", _0x45cbaa.json());
          case 19:
            return _0x38f372.abrupt("return", _0x45cbaa.text());
          case 20:
          case "end":
            return _0x38f372.stop();
        }
      }
    }, _0x29a9b5);
  }));
  return function (_0x373abf) {
    return _0x33f768.apply(this, arguments);
  };
}();
tts.normalizeAiVoice = function (_0x5e058e) {
  if (!_0x5e058e || !_0x5e058e.vendorId || !_0x5e058e.voiceId) {
    return null;
  }
  var _0x148f7e = `${tts.aiVoiceIdPrefix}${_0x5e058e.vendorId}__${_0x5e058e.voiceId}`;
  return {
    id: _0x148f7e,
    name: _0x5e058e.displayName || _0x5e058e.voiceName || _0x5e058e.voiceId,
    provider: "ai",
    languageCode: String(_0x5e058e.languageCode || "").toLowerCase()
  };
};
tts.isAiVoiceId = function (_0x563d02) {
  return typeof _0x563d02 === "string" && _0x563d02.startsWith(tts.aiVoiceIdPrefix);
};
tts.isLegacyPremiumVoiceId = function (_0x397884) {
  return !!_0x397884 && _0x397884 !== "default" && !String(_0x397884).startsWith("google_") && !tts.isAiVoiceId(_0x397884);
};
tts.isAiFreeQuotaExceeded = function () {
  var _0x47dc49;
  var _0x34e4f7;
  return ((_0x47dc49 = window.session) === null || _0x47dc49 === undefined ? undefined : (_0x34e4f7 = _0x47dc49.me) === null || _0x34e4f7 === undefined ? undefined : _0x34e4f7.userFeatures?.isPro) === false && tts.freeMessages <= 0;
};
tts.markAiCreditsBlocked = function () {
  tts.aiCreditsBlocked = true;
  tts.freeMessages = 0;
  tts.proCredits = 0;
  tts.topUpCredits = 0;
  tts.syncNavigationStoreCredits();
  tts.setProVoicesHint();
};
tts.shouldBlockAiGenerate = function () {
  return tts.aiCreditsBlocked;
};
tts.applyAiCreditsFromApiUser = function (_0x203e6f) {
  var _0x4a6568;
  if (!_0x203e6f || typeof _0x203e6f !== "object") {
    return;
  }
  var _0x345857 = _0x203e6f.quota && typeof _0x203e6f.quota === "object" ? _0x203e6f.quota : (_0x4a6568 = _0x203e6f.user) !== null && _0x4a6568 !== undefined && _0x4a6568.quota && typeof _0x203e6f.user.quota === "object" ? _0x203e6f.user.quota : null;
  if (_0x345857) {
    var _0x5a6bb8 = String(_0x345857.currentUsageMode || _0x345857.mode || "").toLowerCase();
    var _0x13b96c = Number(_0x345857.subscriptionCreditsRemaining ?? _0x345857.remaining);
    var _0x539a98 = Number(_0x345857.subscriptionCreditsTotal ?? _0x345857.periodTotal);
    var _0x31582a = Number(_0x345857.purchasedCreditsRemaining ?? _0x345857.remainingOtpCredits);
    var _0x4a366c = Number(_0x345857.purchasedCreditsTotal ?? _0x345857.totalPurchasedCredits);
    var _0x121b28 = Number(_0x345857.freeRequestsRemaining ?? _0x345857.remainingFreeMessages ?? _0x345857.freeMessagesRemaining);
    var _0xcf6e59 = Number(_0x345857.freeRequestsTotal ?? _0x345857.freeMessagesTotal ?? _0x345857.dailyFreeMessages);
    var _0xfc2b69 = Number(_0x345857.nextResetSeconds);
    if (_0x5a6bb8 === "sub_credits") {
      if (Number.isFinite(_0x13b96c)) {
        tts.proCredits = Math.max(0, Math.floor(_0x13b96c));
      }
      if (Number.isFinite(_0x539a98)) {
        tts.proCreditsMax = Math.max(0, Math.floor(_0x539a98));
      }
    } else if (_0x5a6bb8 === "otp_credits") {
      tts.proCredits = 0;
    } else if (_0x5a6bb8 === "free") {
      tts.proCredits = 0;
    }
    if (Number.isFinite(_0x121b28)) {
      tts.freeMessages = Math.max(0, Math.floor(_0x121b28));
    }
    if (Number.isFinite(_0xcf6e59)) {
      tts.freeMessagesMax = Math.max(0, Math.floor(_0xcf6e59));
    }
    if (Number.isFinite(_0x31582a)) {
      tts.topUpCredits = Math.max(0, Math.floor(_0x31582a));
    }
    if (Number.isFinite(_0x4a366c)) {
      tts.topUpCreditsMax = Math.max(0, Math.floor(_0x4a366c));
    }
    if (Number.isFinite(_0xfc2b69)) {
      tts.creditsRefreshDays = Math.max(0, Math.ceil(_0xfc2b69 / 86400));
    }
  }
  var _0x14bea4 = Number(_0x203e6f.remainingSubscriptionCredits);
  var _0x434e46 = Number(_0x203e6f.remainingPurchasedCredits);
  var _0x17eacd = Number(_0x203e6f.totalPurchasedCredits);
  var _0x146e01 = Number(_0x203e6f.monthlyCredits);
  if (Number.isFinite(_0x14bea4)) {
    tts.proCredits = Math.max(0, Math.floor(_0x14bea4));
  } else if (Number.isFinite(_0x146e01)) {
    tts.proCredits = Math.max(0, Math.floor(_0x146e01));
  }
  if (Number.isFinite(_0x434e46)) {
    tts.topUpCredits = Math.max(0, Math.floor(_0x434e46));
  }
  if (Number.isFinite(_0x17eacd)) {
    tts.topUpCreditsMax = Math.max(0, Math.floor(_0x17eacd));
  }
  var _0x1a48ab = Math.max(0, Number(tts.proCredits || 0)) + Math.max(0, Number(tts.topUpCredits || 0));
  var _0x40c0da = tts.lastKnownAiCreditsTotal;
  tts.lastKnownAiCreditsTotal = _0x1a48ab;
  var _0xe98e60 = Math.max(0, Number(tts.freeMessages || 0));
  var _0x3b0da7 = tts.lastKnownFreeMessagesRemaining;
  tts.lastKnownFreeMessagesRemaining = _0xe98e60;
  var _0x4ee79b = Math.max(0, Number(tts.topUpCredits || 0));
  tts.lastKnownTopUpCredits = _0x4ee79b;
  tts.syncNavigationStoreCredits();
  tts.setProVoicesHint();
  tts.aiCreditsBlocked = _0x1a48ab <= 0 && _0xe98e60 <= 0;
  if (_0x40c0da !== null && _0x40c0da > 0 && _0x1a48ab === 0) {
    tts.openMoreCreditsModal();
  }
  if (_0x3b0da7 !== null && _0x3b0da7 > 0 && _0xe98e60 === 0) {
    tts.openDailyLimitModal();
  }
};
tts.loadUserCredits = _asyncToGenerator(_regeneratorRuntime().mark(function _callee16() {
  var _0x171f83;
  return _regeneratorRuntime().wrap(function _0x89104f(_0x5a6b91) {
    while (1) {
      switch (_0x5a6b91.prev = _0x5a6b91.next) {
        case 0:
          _0x5a6b91.prev = 0;
          _0x5a6b91.next = 3;
          return tts.requestAiTtsApi("/api/tts/user");
        case 3:
          _0x171f83 = _0x5a6b91.sent;
          tts.applyAiCreditsFromApiUser(_0x171f83?.data);
          _0x5a6b91.next = 10;
          break;
        case 7:
          _0x5a6b91.prev = 7;
          _0x5a6b91.t0 = _0x5a6b91.catch(0);
          console.warn("Failed to load TTS credits", _0x5a6b91.t0);
        case 10:
        case "end":
          return _0x5a6b91.stop();
      }
    }
  }, _callee16, null, [[0, 7]]);
}));
tts.loadAiVoices = _asyncToGenerator(_regeneratorRuntime().mark(function _callee17() {
  var _0x89ca32;
  var _0x4805f4;
  return _regeneratorRuntime().wrap(function _0x5640ac(_0x5f38aa) {
    while (1) {
      switch (_0x5f38aa.prev = _0x5f38aa.next) {
        case 0:
          _0x5f38aa.prev = 0;
          _0x5f38aa.next = 3;
          return tts.requestAiTtsApi("/api/tts/voices");
        case 3:
          _0x89ca32 = _0x5f38aa.sent;
          _0x4805f4 = (_0x89ca32 === null || _0x89ca32 === undefined ? undefined : _0x89ca32.data?.voices) || (_0x89ca32 === null || _0x89ca32 === undefined ? undefined : _0x89ca32.data?.featuredVoices) || [];
          tts.aiVoices = _0x4805f4.map(tts.normalizeAiVoice).filter(Boolean);
          _0x5f38aa.next = 12;
          break;
        case 8:
          _0x5f38aa.prev = 8;
          _0x5f38aa.t0 = _0x5f38aa.catch(0);
          tts.aiVoices = [];
          console.warn("Failed to load AI TTS voices", _0x5f38aa.t0);
        case 12:
        case "end":
          return _0x5f38aa.stop();
      }
    }
  }, _callee17, null, [[0, 8]]);
}));
tts.loadAiVoiceState = _asyncToGenerator(_regeneratorRuntime().mark(function _callee18() {
  var _0x471ac1;
  var _0x1b00ef;
  return _regeneratorRuntime().wrap(function _0x1e6d0e(_0x4e8d3b) {
    while (1) {
      switch (_0x4e8d3b.prev = _0x4e8d3b.next) {
        case 0:
          if (!tts.aiVoiceStateRequestPromise) {
            _0x4e8d3b.next = 2;
            break;
          }
          return _0x4e8d3b.abrupt("return", tts.aiVoiceStateRequestPromise);
        case 2:
          if (!(Date.now() - tts.aiVoiceStateLastLoadedAt < 3000)) {
            _0x4e8d3b.next = 4;
            break;
          }
          return _0x4e8d3b.abrupt("return");
        case 4:
          _0x471ac1 = (window.appConfig?.ttsHost || "").replace(/\/+$/, "");
          if (_0x471ac1) {
            _0x4e8d3b.next = 7;
            break;
          }
          return _0x4e8d3b.abrupt("return");
        case 7:
          _0x4e8d3b.next = 9;
          return tts.ensureAiAuthToken().catch(function () {
            return "";
          });
        case 9:
          _0x1b00ef = _0x4e8d3b.sent;
          if (_0x1b00ef) {
            _0x4e8d3b.next = 12;
            break;
          }
          return _0x4e8d3b.abrupt("return");
        case 12:
          tts.aiVoiceStateRequestPromise = Promise.all([tts.loadUserCredits(), tts.loadAiVoices()]).finally(function () {
            tts.aiVoiceStateRequestPromise = null;
            tts.aiVoiceStateLastLoadedAt = Date.now();
          });
          return _0x4e8d3b.abrupt("return", tts.aiVoiceStateRequestPromise);
        case 14:
        case "end":
          return _0x4e8d3b.stop();
      }
    }
  }, _callee18);
}));
tts.syncNavigationStoreCredits = function () {
  if (!window.navigationStore) {
    return;
  }
  window.navigationStore.set("ttsFreeMessages", tts.freeMessages || 0);
  window.navigationStore.set("ttsFreeMessagesMax", tts.freeMessagesMax || 0);
  window.navigationStore.set("ttsProCredits", tts.proCredits || 0);
  window.navigationStore.set("ttsProCreditsMax", tts.proCreditsMax || 0);
  window.navigationStore.set("ttsTopUpCredits", tts.topUpCredits || 0);
  window.navigationStore.set("ttsTopUpCreditsMax", tts.topUpCreditsMax || 0);
  window.navigationStore.set("ttsCreditsRefreshDays", tts.creditsRefreshDays || 0);
};
tts.syncNavigationStoreCredits();
tts.openCreditsTopupCheckout = function () {
  var _0x5008ff = _asyncToGenerator(_regeneratorRuntime().mark(function _0x3f5aa3(_0x190a42) {
    var _0x3608cd;
    var _0x37c751;
    var _0x544047;
    var _0x1d0f28;
    var _0x33846c;
    var _0x12a37c;
    var _0x11ad45;
    var _0x17b8ef;
    var _0x4a3e20;
    var _0x478705;
    return _regeneratorRuntime().wrap(function _0x400471(_0x3a3595) {
      while (1) {
        switch (_0x3a3595.prev = _0x3a3595.next) {
          case 0:
            _0x37c751 = window.appConfig?.ttsOtpPaddleConfig || {};
            _0x544047 = _0x37c751?.priceIds || {};
            _0x1d0f28 = String(_0x37c751?.productId || tts.ttsCreditsTopupProductId || "").trim();
            _0x33846c = _0x190a42?.priceId || _0x544047?.[_0x190a42?.id] || tts.ttsCreditsTopupPriceIds?.[_0x190a42?.id];
            _0x12a37c = (_0x3608cd = window.session) === null || _0x3608cd === undefined ? undefined : _0x3608cd.me?.channel;
            _0x11ad45 = String(_0x12a37c?.channelId || "");
            if (!!_0x33846c && !!_0x11ad45) {
              _0x3a3595.next = 8;
              break;
            }
            throw new Error("Invalid topup pack or user");
          case 8:
            if (_0x190a42 === null || _0x190a42 === undefined || !_0x190a42.productId || !_0x1d0f28 || _0x190a42.productId === _0x1d0f28) {
              _0x3a3595.next = 10;
              break;
            }
            throw new Error("Invalid topup product");
          case 10:
            _0x17b8ef = {
              vendor: "paddle",
              channelId: _0x11ad45,
              channelName: _0x12a37c?.channelName || "",
              email: _0x12a37c?.email || "",
              ttsOtpPriceId: _0x33846c,
              purchaseType: "tts_otp"
            };
            _0x4a3e20 = `/checkout?token=${encodeURIComponent(btoa(JSON.stringify(_0x17b8ef)))}`;
            _0x478705 = window.open(_0x4a3e20, "_blank");
            if (_0x478705) {
              _0x3a3595.next = 15;
              break;
            }
            throw new Error("Checkout popup blocked");
          case 15:
            tts.creditsTopupCheckoutWindow = _0x478705;
          case 16:
          case "end":
            return _0x3a3595.stop();
        }
      }
    }, _0x3f5aa3);
  }));
  return function (_0xe478e5) {
    return _0x5008ff.apply(this, arguments);
  };
}();
tts.onCreditsTopUpCompleted = _asyncToGenerator(_regeneratorRuntime().mark(function _callee20() {
  var _0x16cf74;
  var _0x1f2914;
  var _0x31435f;
  var _0x339c3c = arguments;
  return _regeneratorRuntime().wrap(function _0x453976(_0x439fd5) {
    while (1) {
      switch (_0x439fd5.prev = _0x439fd5.next) {
        case 0:
          _0x16cf74 = _0x339c3c.length > 0 && _0x339c3c[0] !== undefined ? _0x339c3c[0] : {};
          try {
            if ((_0x1f2914 = tts.creditsTopupCheckoutWindow) === null || _0x1f2914 === undefined) {
              undefined;
            } else if ((_0x31435f = _0x1f2914.close) === null || _0x31435f === undefined) {
              undefined;
            } else {
              _0x31435f.call(_0x1f2914);
            }
          } catch (_0x274a28) {}
          tts.creditsTopupCheckoutWindow = null;
          _0x439fd5.next = 5;
          return tts.loadUserCredits();
        case 5:
          tts.openTopUpModal(Math.max(0, Math.floor(Number(_0x16cf74.credits) || 0)));
        case 6:
        case "end":
          return _0x439fd5.stop();
      }
    }
  }, _callee20);
}));
tts.openCreditsTopupModal = function () {
  renderModal({
    name: "ttsCreditsTopupModal",
    closeOnEsc: true,
    padding: "0",
    width: "520px",
    height: "auto",
    body: "<div id='tts-credits-topup-modal-app' class='tw-preflight relative'></div>",
    header: "<div class='font-outfit'>Top-up AI Voice Credit</div>"
  });
  var _0x10e06d = document.querySelector("#tts-credits-topup-modal-app");
  if (!_0x10e06d || !window.createTtsCreditsTopupModal) {
    utils.showError("TTS Credits", "Failed to open top-up modal.");
    return;
  }
  window.createTtsCreditsTopupModal().mount(_0x10e06d);
};
tts.openTopUpModal = function (_0x131f2b) {
  renderModal({
    name: "ttsTopUpModal",
    closeOnEsc: true,
    padding: "0",
    width: "520px",
    height: "auto",
    header: "<div class='font-outfit flex items-center gap-0.5'><i class='fa-solid fa-sparkles text-[#FFB54D] text-sm mr-1'></i><span>AI Voice Credit</span></div>",
    body: "<div id='tts-topup-modal-app' class='tw-preflight relative'></div>"
  });
  var _0x369402 = document.querySelector("#tts-topup-modal-app");
  if (!_0x369402 || !window.createTtsTopupModal) {
    var _0x556555;
    var _0x3ba95b;
    if ((_0x556555 = window.toastr) === null || _0x556555 === undefined) {
      undefined;
    } else if ((_0x3ba95b = _0x556555.error) === null || _0x3ba95b === undefined) {
      undefined;
    } else {
      _0x3ba95b.call(_0x556555, "Failed to open top-up success modal.");
    }
    return;
  }
  window.createTtsTopupModal({
    amount: Math.max(0, Math.floor(Number(_0x131f2b) || 0))
  }).mount(_0x369402);
};
tts.openMoreCreditsModal = function () {
  renderModal({
    name: "ttsMoreCreditsModal",
    closeOnEsc: true,
    padding: "0",
    width: "520px",
    height: "auto",
    header: "<div class='flex items-center font-outfit gap-0.5'><i class='fa-solid fa-crown text-[#FFB54D] text-sm'></i><i class='fa-solid fa-sparkles text-[#FFB54D] text-sm mr-1'></i><span>Get AI Voice Credits</span></div>",
    body: "<div id='tts-more-credits-modal-app' class='tw-preflight relative'></div>"
  });
  var _0x11ed0b = document.querySelector("#tts-more-credits-modal-app");
  if (!_0x11ed0b || !window.createTtsMoreCreditsModal) {
    var _0xcd5979;
    var _0x505e13;
    if ((_0xcd5979 = window.toastr) === null || _0xcd5979 === undefined) {
      undefined;
    } else if ((_0x505e13 = _0xcd5979.error) === null || _0x505e13 === undefined) {
      undefined;
    } else {
      _0x505e13.call(_0xcd5979, "Failed to open more credits modal.");
    }
    return;
  }
  window.createTtsMoreCreditsModal().mount(_0x11ed0b);
};
tts.openDailyLimitModal = function () {
  renderModal({
    name: "ttsDailyLimitModal",
    closeOnEsc: true,
    padding: "0",
    width: "520px",
    height: "auto",
    header: "<div class='flex items-center font-outfit gap-0.5'><i class='fa-solid fa-crown text-[#FFB54D] text-sm'></i><i class='fa-solid fa-sparkles text-[#FFB54D] text-sm mr-1'></i><span>AI Voices</span></div>",
    body: "<div id='tts-daily-limit-modal-app' class='tw-preflight relative'></div>"
  });
  var _0x5cbe3a = document.querySelector("#tts-daily-limit-modal-app");
  if (!_0x5cbe3a || !window.createTtsDailyLimitModal) {
    var _0x23e4cb;
    var _0x170153;
    if ((_0x23e4cb = window.toastr) === null || _0x23e4cb === undefined) {
      undefined;
    } else if ((_0x170153 = _0x23e4cb.error) === null || _0x170153 === undefined) {
      undefined;
    } else {
      _0x170153.call(_0x23e4cb, "Failed to open daily limit modal.");
    }
    return;
  }
  window.createTtsDailyLimitModal().mount(_0x5cbe3a);
};
tts.inputs = {};
tts.inputValues = {};
tts.testTtsItem = null;
tts.specialUsers = [];
tts.logs = [];
tts.queue = null;
tts.userLastTtsTs = {};
tts.currentLanguage = null;
tts.currentVoice = null;
tts.voicePickerModalApp = null;
tts.proVoiceUsageCount = 0;
tts.proVoiceUsageCountLimit = 50;
tts.ttsTeamMembersMinLevel = 0;
tts.ttsTopGiftersTopN = 0;
tts.languages = [{
  id: "af-ZA",
  name: "Afrikaans (Suid-Afrika)"
}, {
  id: "id-ID",
  name: "Bahasa Indonesia (Indonesia)"
}, {
  id: "ms-MY",
  name: "Bahasa Melayu (Malaysia)"
}, {
  id: "bn-BD",
  name: "বাংলা (বাংলাদেশ)"
}, {
  id: "bn-IN",
  name: "বাংলা (ভারত)"
}, {
  id: "ca-ES",
  name: "Català (Espanya)"
}, {
  id: "cs-CZ",
  name: "Čeština (Česká republika)"
}, {
  id: "da-DK",
  name: "Dansk (Danmark)"
}, {
  id: "de-DE",
  name: "Deutsch (Deutschland)"
}, {
  id: "en-AU",
  name: "English (Australia)"
}, {
  id: "en-CA",
  name: "English (Canada)"
}, {
  id: "en-GH",
  name: "English (Ghana)"
}, {
  id: "en-GB",
  name: "English (Great Britain)"
}, {
  id: "en-IN",
  name: "English (India)"
}, {
  id: "en-IE",
  name: "English (Ireland)"
}, {
  id: "en-KE",
  name: "English (Kenya)"
}, {
  id: "en-NZ",
  name: "English (New Zealand)"
}, {
  id: "en-NG",
  name: "English (Nigeria)"
}, {
  id: "en-PH",
  name: "English (Philippines)"
}, {
  id: "en-ZA",
  name: "English (South Africa)"
}, {
  id: "en-TZ",
  name: "English (Tanzania)"
}, {
  id: "en-US",
  name: "English (United States)"
}, {
  id: "es-AR",
  name: "Español (Argentina)"
}, {
  id: "es-BO",
  name: "Español (Bolivia)"
}, {
  id: "es-CL",
  name: "Español (Chile)"
}, {
  id: "es-CO",
  name: "Español (Colombia)"
}, {
  id: "es-CR",
  name: "Español (Costa Rica)"
}, {
  id: "es-EC",
  name: "Español (Ecuador)"
}, {
  id: "es-SV",
  name: "Español (El Salvador)"
}, {
  id: "es-ES",
  name: "Español (España)"
}, {
  id: "es-US",
  name: "Español (Estados Unidos)"
}, {
  id: "es-GT",
  name: "Español (Guatemala)"
}, {
  id: "es-HN",
  name: "Español (Honduras)"
}, {
  id: "es-MX",
  name: "Español (México)"
}, {
  id: "es-NI",
  name: "Español (Nicaragua)"
}, {
  id: "es-PA",
  name: "Español (Panamá)"
}, {
  id: "es-PY",
  name: "Español (Paraguay)"
}, {
  id: "es-PE",
  name: "Español (Perú)"
}, {
  id: "es-PR",
  name: "Español (Puerto Rico)"
}, {
  id: "es-DO",
  name: "Español (República Dominicana)"
}, {
  id: "es-UY",
  name: "Español (Uruguay)"
}, {
  id: "es-VE",
  name: "Español (Venezuela)"
}, {
  id: "eu-ES",
  name: "Euskara (Espainia)"
}, {
  id: "fil-PH",
  name: "Filipino (Pilipinas)"
}, {
  id: "fr-CA",
  name: "Français (Canada)"
}, {
  id: "fr-FR",
  name: "Français (France)"
}, {
  id: "gu-IN",
  name: "ગુજરાતી (ભારત)"
}, {
  id: "is-IS",
  name: "Íslenska (Ísland)"
}, {
  id: "it-IT",
  name: "Italiano (Italia)"
}, {
  id: "jv-ID",
  name: "Jawa (Indonesia)"
}, {
  id: "kn-IN",
  name: "ಕನ್ನಡ (ಭಾರತ)"
}, {
  id: "km-KH",
  name: "ភាសាខ្មែរ (កម្ពុជា)"
}, {
  id: "lo-LA",
  name: "ລາວ (ລາວ)"
}, {
  id: "lv-LV",
  name: "Latviešu (latviešu)"
}, {
  id: "lt-LT",
  name: "Lietuvių (Lietuva)"
}, {
  id: "hu-HU",
  name: "Magyar (Magyarország)"
}, {
  id: "ml-IN",
  name: "മലയാളം (ഇന്ത്യ)"
}, {
  id: "mr-IN",
  name: "मराठी (भारत)"
}, {
  id: "nl-NL",
  name: "Nederlands (Nederland)"
}, {
  id: "ne-NP",
  name: "नेपाली (नेपाल)"
}, {
  id: "nb-NO",
  name: "Norsk bokmål (Norge)"
}, {
  id: "pl-PL",
  name: "Polski (Polska)"
}, {
  id: "pt-BR",
  name: "Português (Brasil)"
}, {
  id: "pt-PT",
  name: "Português (Portugal)"
}, {
  id: "ro-RO",
  name: "Română (România)"
}, {
  id: "si-LK",
  name: "සිංහල (ශ්රී ලංකාව)"
}, {
  id: "sk-SK",
  name: "Slovenčina (Slovensko)"
}, {
  id: "sl-SI",
  name: "Slovenščina (Slovenija)"
}, {
  id: "su-ID",
  name: "Urang (Indonesia)"
}, {
  id: "sw-TZ",
  name: "Swahili (Tanzania)"
}, {
  id: "sw-KE",
  name: "Swahili (Kenya)"
}, {
  id: "fi-FI",
  name: "Suomi (Suomi)"
}, {
  id: "sv-SE",
  name: "Svenska (Sverige)"
}, {
  id: "ta-IN",
  name: "தமிழ் (இந்தியா)"
}, {
  id: "ta-SG",
  name: "தமிழ் (சிங்கப்பூர்)"
}, {
  id: "ta-LK",
  name: "தமிழ் (இலங்கை)"
}, {
  id: "ta-MY",
  name: "தமிழ் (மலேசியா)"
}, {
  id: "te-IN",
  name: "తెలుగు (భారతదేశం)"
}, {
  id: "vi-VN",
  name: "Tiếng Việt (Việt Nam)"
}, {
  id: "tr-TR",
  name: "Türkçe (Türkiye)"
}, {
  id: "ur-PK",
  name: "اردو (پاکستان)",
  rtl: !0
}, {
  id: "ur-IN",
  name: "اردو (بھارت)",
  rtl: !0
}, {
  id: "el-GR",
  name: "Ελληνικά (Ελλάδα)"
}, {
  id: "bg-BG",
  name: "Български (България)"
}, {
  id: "ru-RU",
  name: "Русский (Россия)"
}, {
  id: "sr-RS",
  name: "Српски (Србија)"
}, {
  id: "uk-UA",
  name: "Українська (Україна)"
}, {
  id: "he-IL",
  name: "עברית (ישראל)",
  rtl: !0
}, {
  id: "ar-IL",
  name: "العربية (إسرائيل)",
  rtl: !0
}, {
  id: "ar-XA",
  name: "Arabic, multi-region"
}, {
  id: "ar-JO",
  name: "العربية (الأردن)",
  rtl: !0
}, {
  id: "ar-AE",
  name: "العربية (الإمارات)",
  rtl: !0
}, {
  id: "ar-BH",
  name: "العربية (البحرين)",
  rtl: !0
}, {
  id: "ar-DZ",
  name: "العربية (الجزائر)",
  rtl: !0
}, {
  id: "ar-SA",
  name: "العربية (السعودية)",
  rtl: !0
}, {
  id: "ar-IQ",
  name: "العربية (العراق)",
  rtl: !0
}, {
  id: "ar-KW",
  name: "العربية (الكويت)",
  rtl: !0
}, {
  id: "ar-MA",
  name: "العربية (المغرب)",
  rtl: !0
}, {
  id: "ar-TN",
  name: "العربية (تونس)",
  rtl: !0
}, {
  id: "ar-OM",
  name: "العربية (عُمان)",
  rtl: !0
}, {
  id: "ar-PS",
  name: "العربية (فلسطين)",
  rtl: !0
}, {
  id: "ar-QA",
  name: "العربية (قطر)",
  rtl: !0
}, {
  id: "ar-LB",
  name: "العربية (لبنان)",
  rtl: !0
}, {
  id: "ar-EG",
  name: "العربية (مصر)",
  rtl: !0
}, {
  id: "fa-IR",
  name: "فارسی (ایران)",
  rtl: !0
}, {
  id: "hi-IN",
  name: "हिन्दी (भारत)"
}, {
  id: "th-TH",
  name: "ไทย (ประเทศไทย)"
}, {
  id: "ko-KR",
  name: "한국어 (대한민국)"
}, {
  id: "cmn-Hant-TW",
  name: "國語 (台灣)"
}, {
  id: "yue-Hant-HK",
  name: "廣東話 (香港)"
}, {
  id: "ja-JP",
  name: "日本語（日本)"
}, {
  id: "cmn-Hans-HK",
  name: "普通話 (香港)"
}, {
  id: "cmn-Hans-CN",
  name: "普通话 (中国大陆)"
}, {
  id: "cmn-CN",
  name: "普通话 (中国大陆)"
}];
tts.init = function () {
  tts.startAiAuthTokenRefresh();
  function _0x7f9ea3(_0xca0708) {
    var _0x4cda34 = String(typeof _0xca0708 === "object" ? _0xca0708?.message || "" : _0xca0708 || "").toLowerCase();
    if (_0x4cda34.includes("insufficient credits")) {
      return null;
    }
    return "Failed to play TTS message.";
  }
  tts.queue = new TTSQueue(300, null, function (_0x49a3c9, _0x32bc40) {
    if (typeof _0x32bc40 === "object" && _0x32bc40 && _0x32bc40.message && (_0x32bc40.message.includes("interact with the document") || _0x32bc40.message.includes("user denied permission"))) {
      utils.showError("Sound blocked by your browser", "Please interact with the website (e.g. click on a empty area) to allow sound playback. If that doesn't help, check in your browser's website settings if the \"Sound\" permission is set to \"Allow\".");
    } else {
      var _0x12d83f = _0x7f9ea3(_0x32bc40);
      if (_0x12d83f) {
        utils.showError("TTS Error", _0x12d83f);
      }
    }
  });
  setInterval(function () {
    tts.userLastTtsTs = {};
  }, 10800000);
  var _0x20075e = window.navigator.language;
  var _0x376fa2 = tts.languages.find(function (_0x2c71fd) {
    return _0x2c71fd.id === _0x20075e;
  }) || tts.languages.find(function (_0x4dc5f8) {
    return _0x4dc5f8.id.substring(0, 2) === _0x20075e.substring(0, 2);
  }) || tts.languages.find(function (_0x12a870) {
    return _0x12a870.id === "en-US";
  });
  tts.currentLanguage = settings.get("selectboxTtsLanguage", _0x376fa2.id);
  tts.currentVoice = settings.get("selectboxTtsVoice", "default");
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsEnabled"), false);
  utils.initDxInput(tts, "dxNumberBox", $("#numberboxTtsDefaultSpeed"), 50, {
    width: "120px",
    min: 0,
    max: 100,
    step: 5,
    showSpinButtons: true
  });
  utils.initDxInput(tts, "dxNumberBox", $("#numberboxTtsDefaultPitch"), 50, {
    width: "120px",
    min: 0,
    max: 100,
    step: 5,
    showSpinButtons: true
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsRandomVoiceV2"), tts.currentLanguage.indexOf("en-") === 0 || tts.currentLanguage.indexOf("de-") === 0 || tts.currentLanguage.indexOf("es-") === 0 || tts.currentLanguage.indexOf("fr-") === 0);
  utils.initDxInput(tts, "dxSlider", $("#slideTtsVolume"), 100, {
    min: 1,
    max: 100,
    width: "130px"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersNormal"), true, {
    text: "All Users"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersFollowers"), true, {
    text: "Followers"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersSubscribers"), true, {
    text: "Super Fans / Subscribers"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersTeamMembers"), true, {
    text: "Team Members"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersModerators"), true, {
    text: "Moderators"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersTopGifters"), true, {
    text: "Top Gifters"
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsUsersSpecific"), true, {
    text: "Allowed Users from list"
  });
  tts.ttsTeamMembersMinLevel = parseInt(settings.get("ttsTeamMembersMinLevel", "1"));
  tts.ttsTopGiftersTopN = parseInt(settings.get("ttsTopGiftersTopN", "3"));
  $("#ttsTeamMembersMinLevel").text(tts.ttsTeamMembersMinLevel);
  $("#ttsTopGiftersTopN").text(tts.ttsTopGiftersTopN);
  function _0x873d05(_0x7c3f23, _0x25ba7a) {
    return (_0x25ba7a === null || _0x25ba7a === undefined ? undefined : _0x25ba7a.find(function (_0x2fb9a0) {
      return _0x2fb9a0.id === _0x7c3f23;
    })?.name) || _0x7c3f23 || "Default Voice";
  }
  function _0x588211(_0x5d96f2, _0x3765b0) {
    if (!_0x5d96f2 || tts.currentVoice === _0x5d96f2) {
      return;
    }
    tts.currentVoice = _0x5d96f2;
    settings.set("selectboxTtsVoice", _0x5d96f2);
    if (_0x3765b0) {
      settings.set("selectboxTtsVoiceName", _0x3765b0);
    }
    if ($("#checkboxTtsRandomVoiceV2").dxCheckBox("instance").option("value") === true) {
      $("#checkboxTtsRandomVoiceV2").dxCheckBox("instance").option("value", false);
      toastr.success("Random Voice disabled!");
    }
    tts.setProVoicesHint();
    _0x817fa1();
  }
  function _0x5eca32() {
    if (tts.testTtsItem) {
      tts.testTtsItem.stop();
      tts.testTtsItem = null;
    }
  }
  function _0x25cee7(_0x1e634d) {
    return _0x13bb67.apply(this, arguments);
  }
  function _0x13bb67() {
    _0x13bb67 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x109f06(_0x2ed43a) {
      var _0x218659;
      var _0x4ba1b5;
      var _0x142d26;
      var _0x2422fa;
      return _regeneratorRuntime().wrap(function _0x431683(_0x4cab87) {
        while (1) {
          switch (_0x4cab87.prev = _0x4cab87.next) {
            case 0:
              _0x5eca32();
              _0x218659 = tts.inputValues.textboxTtsTest || "This is a test!";
              _0x4ba1b5 = tts.inputValues.numberboxTtsDefaultSpeed || 50;
              _0x142d26 = tts.inputValues.numberboxTtsDefaultPitch || 50;
              _0x2422fa = (tts.inputValues.slideTtsVolume || 100) / 100;
              tts.testTtsItem = new TTSItem(_0x218659, tts.currentLanguage, _0x4ba1b5, _0x142d26, _0x2422fa, {
                uniqueId: "Testuser",
                comment: _0x218659
              }, _0x2ed43a, {
                requestType: "preview"
              });
              _0x4cab87.prev = 6;
              _0x4cab87.next = 9;
              return tts.testTtsItem.play();
            case 9:
              _0x4cab87.next = 16;
              break;
            case 11:
              _0x4cab87.prev = 11;
              _0x4cab87.t0 = _0x4cab87.catch(6);
              _0x5eca32();
              utils.showError("TTS Error", "Voice or Language not supported!");
              throw _0x4cab87.t0;
            case 16:
            case "end":
              return _0x4cab87.stop();
          }
        }
      }, _0x109f06, null, [[6, 11]]);
    }));
    return _0x13bb67.apply(this, arguments);
  }
  function _0x44db94(_0x23f30e = {}) {
    var _0x4c3b11 = _0x23f30e.includeRandomVoice === true;
    var _0x91b79c = tts.getVoices(true, true, false, _0x4c3b11).filter(Boolean);
    var _0x1b738d = _0x23f30e.selectedVoiceId || "default";
    if (tts.voicePickerModalApp) {
      var _0x3e93df;
      var _0x4eb9f2;
      var _0x54f46e;
      if ((_0x3e93df = window.ui) === null || _0x3e93df === undefined) {
        undefined;
      } else if ((_0x4eb9f2 = _0x3e93df.modal) === null || _0x4eb9f2 === undefined) {
        undefined;
      } else if ((_0x54f46e = _0x4eb9f2.closeModal) === null || _0x54f46e === undefined) {
        undefined;
      } else {
        _0x54f46e.call(_0x4eb9f2, "ttsVoicePickerModal");
      }
    }
    renderModal({
      name: "ttsVoicePickerModal",
      closeOnEsc: true,
      padding: "0",
      width: "560px",
      height: "auto",
      body: "<div id='tts-voice-picker-modal-app' class='tw-preflight relative'></div>",
      onClose: function _0x7e4a() {
        if (typeof _0x23f30e.onStopTest === "function") {
          _0x23f30e.onStopTest();
        }
        if (tts.voicePickerModalApp) {
          tts.voicePickerModalApp.unmount();
          tts.voicePickerModalApp = null;
        }
      }
    });
    var _0x30c0e8 = document.querySelector("#tts-voice-picker-modal-app");
    if (!_0x30c0e8 || !window.createTtsVoicePickerModal) {
      utils.showError("TTS Voice Picker", "Failed to open voice picker modal.");
      return;
    }
    tts.loadAiVoiceState().catch(function () {});
    tts.voicePickerModalApp = window.createTtsVoicePickerModal({
      voices: _0x91b79c,
      includeRandomVoice: _0x4c3b11,
      selectedVoiceId: _0x1b738d,
      onSelect: function _0x50d0c0(_0x677f0d) {
        var _0x3e6214;
        var _0x7bcbd8;
        var _0x5c7f0d;
        var _0x5be055 = _0x91b79c.find(function (_0x407b42) {
          return _0x407b42.id === _0x677f0d;
        });
        _0x23f30e.onSelect(_0x677f0d, _0x5be055?.name);
        if ((_0x3e6214 = window.ui) === null || _0x3e6214 === undefined) {
          undefined;
        } else if ((_0x7bcbd8 = _0x3e6214.modal) === null || _0x7bcbd8 === undefined) {
          undefined;
        } else if ((_0x5c7f0d = _0x7bcbd8.closeModal) === null || _0x5c7f0d === undefined) {
          undefined;
        } else {
          _0x5c7f0d.call(_0x7bcbd8, "ttsVoicePickerModal");
        }
      },
      onTest: function _0x1b2c24(_0x9ddae6) {
        return _0x23f30e.onTest(_0x9ddae6);
      },
      onStopTest: function _0x3fc41b() {
        _0x23f30e.onStopTest();
      }
    });
    tts.voicePickerModalApp.mount(_0x30c0e8);
  }
  function _0x5e7097(_0x38f575) {
    var _0x1dd9bd = _0x873d05(tts.currentVoice, _0x38f575);
    $("#selectboxTtsVoice").dxTextBox({
      width: "200px",
      value: _0x1dd9bd,
      readOnly: true,
      inputAttr: {
        style: "cursor:pointer;"
      },
      buttons: [{
        name: "voice-picker",
        location: "after",
        options: {
          icon: "chevrondown",
          stylingMode: "text",
          onClick: function _0x1fc512() {
            return _0x44db94({
              selectedVoiceId: tts.currentVoice,
              onSelect: _0x588211,
              onTest: _0x25cee7,
              onStopTest: _0x5eca32,
              includeRandomVoice: false
            });
          }
        }
      }],
      onInitialized: function _0x54d7b2(_0x519cc9) {
        _0x519cc9.component.element().off("click.ttsVoicePicker").on("click.ttsVoicePicker", function () {
          _0x44db94({
            selectedVoiceId: tts.currentVoice,
            onSelect: _0x588211,
            onTest: _0x25cee7,
            onStopTest: _0x5eca32,
            includeRandomVoice: false
          });
        });
      }
    });
  }
  $("#selectboxTtsLanguage").dxSelectBox({
    width: "200px",
    items: tts.languages,
    value: tts.currentLanguage,
    displayExpr: "name",
    valueExpr: "id",
    searchEnabled: true,
    onValueChanged: function _0x2693ee(_0x4ae64c) {
      tts.currentLanguage = _0x4ae64c.value;
      settings.set("selectboxTtsLanguage", _0x4ae64c.value);
      _0x817fa1();
    }
  });
  function _0x817fa1() {
    var _0x2d5ebe = tts.getVoices(false, true);
    var _0x192bf1 = _0x2d5ebe.some(function (_0xb86bbb) {
      return _0xb86bbb.id === tts.currentVoice;
    });
    if (!_0x192bf1) {
      if (tts.isAiVoiceId(tts.currentVoice)) {
        var _0x1db16c = settings.get("selectboxTtsVoiceName", "AI Voice");
        _0x2d5ebe.push({
          id: tts.currentVoice,
          name: _0x1db16c || "AI Voice",
          provider: "ai"
        });
      } else {
        var _0x2f99d1;
        var _0xb81b19;
        var _0x22d727 = (_0x2f99d1 = window.appConfig) === null || _0x2f99d1 === undefined ? undefined : (_0xb81b19 = _0x2f99d1.ttsVoices) === null || _0xb81b19 === undefined ? undefined : _0xb81b19.find(function (_0x372f22) {
          return _0x372f22.id === tts.currentVoice;
        });
        if (_0x22d727) {
          _0x2d5ebe.push(_0x22d727);
        } else {
          tts.currentVoice = "default";
        }
      }
    }
    _0x5e7097(_0x2d5ebe);
  }
  _0x817fa1();
  var _0x3fc1cc = [{
    id: "0",
    text: "Any comment"
  }, {
    id: "1",
    text: "Comments starting with dot (.)"
  }, {
    id: "2",
    text: "Comments starting with slash (/)"
  }, {
    id: "3",
    text: "Comments starting with Command:"
  }];
  $("#radiogroupTtsCommentTypes").dxRadioGroup({
    items: _0x3fc1cc,
    value: _0x3fc1cc[settings.get("radiogroupTtsCommentTypes", "0")],
    onValueChanged: function _0x55b8f6(_0x5cdf95) {
      settings.set("radiogroupTtsCommentTypes", _0x5cdf95.value.id);
      tts.checkSettings();
    }
  });
  utils.initDxInput(tts, "dxTextBox", $("#textboxCommentTypesSpecialCommand"), "!tts", {
    width: "100px",
    maxLength: 20,
    placeholder: "!command"
  });
  var _0xf539ec = [{
    id: "0",
    text: "No, its free"
  }, {
    id: "1",
    text: "Yes, withdraw the following amount:"
  }];
  $("#radiogroupTtsChargePoints").dxRadioGroup({
    items: _0xf539ec,
    value: _0xf539ec[settings.get("radiogroupTtsChargePoints", "0")],
    onValueChanged: function _0x1d80ab(_0x54b3be) {
      settings.set("radiogroupTtsChargePoints", _0x54b3be.value.id);
      tts.checkSettings();
    }
  });
  utils.initDxInput(tts, "dxNumberBox", $("#numberboxTtsCost"), 5, {
    width: "110px",
    min: 0.01,
    max: 99999999,
    step: 1,
    showSpinButtons: true
  });
  utils.initDxInput(tts, "dxTextBox", $("#textboxTtsTest"), "This is a test!", {
    width: "300px",
    maxLength: 50
  });
  $("#buttonTtsTest").dxButton({
    icon: "chevronright",
    text: "Play",
    onClick: function _0x2824e4() {
      if (tts.testTtsItem) {
        tts.testTtsItem.stop();
      }
      tts.testTtsItem = tts.generateTtsItem({
        comment: tts.inputValues.textboxTtsTest,
        uniqueId: "Testuser"
      });
      tts.testTtsItem.play().catch(function () {
        utils.showError("TTS Error", "Voice or Language not supported!");
      });
    }
  });
  tts.specialUsers = JSON.parse(settings.get("ttsSpecialUsers") || "[]").filter(function (_0x124942) {
    return _0x124942.uniqueId !== "";
  });
  function _0x384f18() {
    return tts.getVoices(true, true, false, true).filter(Boolean);
  }
  var _0x4ce18f = _createForOfIteratorHelper(tts.specialUsers);
  var _0x393bfc;
  try {
    for (_0x4ce18f.s(); !(_0x393bfc = _0x4ce18f.n()).done;) {
      var _0x31d710 = _0x393bfc.value;
      if (!_0x31d710.voiceId) {
        _0x31d710.voiceId = "default";
      }
    }
  } catch (_0x4af874) {
    _0x4ce18f.e(_0x4af874);
  } finally {
    _0x4ce18f.f();
  }
  $("#ttsUserGrid").dxDataGrid({
    width: "700px",
    dataSource: tts.specialUsers,
    showBorders: true,
    noDataText: "No Special Users defined",
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: "Search users..."
    },
    editing: {
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
      mode: "cell",
      useIcons: true,
      texts: {
        confirmDeleteMessage: ""
      }
    },
    columns: [{
      type: "buttons",
      width: 70
    }, {
      dataField: "createdAt",
      dataType: "string",
      visible: false,
      sortIndex: 0,
      sortOrder: "desc"
    }, {
      dataField: "uniqueId",
      caption: "Username (@handle)",
      dataType: "string",
      width: "200px",
      editorOptions: {
        maxLength: 100
      }
    }, {
      dataField: "allowed",
      dataType: "boolean",
      width: "70px"
    }, {
      dataField: "voiceId",
      caption: "Voice",
      width: "180px",
      allowEditing: false,
      cellTemplate: function _0x54189c(_0x41784, _0x4f21a9) {
        var _0x158354 = _0x873d05(_0x4f21a9.value, _0x384f18());
        $("<span style=\"cursor:pointer; color:#359bd4;\"></span>").text(_0x158354).appendTo(_0x41784);
      }
    }, {
      dataField: "speed",
      dataType: "number",
      editorOptions: {
        showSpinButtons: true,
        min: 1,
        max: 100
      }
    }, {
      dataField: "pitch",
      dataType: "number",
      editorOptions: {
        showSpinButtons: true,
        min: 1,
        max: 100
      }
    }],
    onInitNewRow: function _0x188e26(_0x5e949a) {
      _0x5e949a.data.allowed = true;
      _0x5e949a.data.uniqueId = "";
      _0x5e949a.data.speed = 50;
      _0x5e949a.data.pitch = 50;
      _0x5e949a.data.voiceId = "default";
      _0x5e949a.data.createdAt = new Date().toISOString();
      setTimeout(function () {
        var _0x5ef1be = _0x5e949a.component.getCellElement(0, "uniqueId");
        _0x5e949a.component.focus(_0x5ef1be);
        _0x5ef1be.click();
      }, 10);
    },
    onRowRemoved: function _0x2b0480() {
      settings.set("ttsSpecialUsers", JSON.stringify(tts.specialUsers));
      tts.setProVoicesHint();
    },
    onRowUpdated: function _0x1d351b() {
      settings.set("ttsSpecialUsers", JSON.stringify(tts.specialUsers));
      tts.setProVoicesHint();
    },
    onRowInserted: function _0x5ac423() {
      settings.set("ttsSpecialUsers", JSON.stringify(tts.specialUsers));
      tts.setProVoicesHint();
    },
    onCellClick: function _0x3b1971(_0x1ebdae) {
      if (_0x1ebdae.rowType !== "data" || _0x1ebdae.column?.dataField !== "voiceId") {
        return;
      }
      _0x44db94({
        selectedVoiceId: _0x1ebdae.data?.voiceId || "default",
        onSelect: function _0x183d4f(_0x344aaa) {
          _0x1ebdae.data.voiceId = _0x344aaa;
          _0x1ebdae.component.refresh();
          settings.set("ttsSpecialUsers", JSON.stringify(tts.specialUsers));
          tts.setProVoicesHint();
        },
        onTest: _0x25cee7,
        onStopTest: _0x5eca32,
        includeRandomVoice: true
      });
    }
  });
  utils.initDxInput(tts, "dxNumberBox", $("#numberboxTtsUserCooldown"), 0, {
    width: "120px",
    min: 0,
    max: 99999,
    step: 10,
    showSpinButtons: true
  });
  utils.initDxInput(tts, "dxNumberBox", $("#numberboxTtsQueueLength"), 5, {
    width: "120px",
    min: 1,
    max: 50,
    step: 1,
    showSpinButtons: true
  });
  utils.initDxInput(tts, "dxNumberBox", $("#numberboxTtsCommentLength"), 300, {
    width: "120px",
    min: 5,
    max: 500,
    step: 10,
    showSpinButtons: true
  });
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsFilterLetterSpam"), true);
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsFilterMentions"), false);
  utils.initDxInput(tts, "dxCheckBox", $("#checkboxTtsFilterCommands"), false);
  utils.initDxInput(tts, "dxTextBox", $("#textboxTtsMessageTemplate"), "{comment}", {
    width: "260px",
    maxLength: 100,
    placeholder: "{comment}"
  });
  tts.checkSettings();
  tts.toggleStartHint();
};
tts.onInputChange = function (_0x314207, _0x20ac58) {
  tts.toggleStartHint();
  tts.setProVoicesHint();
  if (tts.inputValues.checkboxTtsEnabled) {
    tts.queue.start();
  } else {
    tts.queue.pause();
    tts.queue.clear();
    tts.queue.skipCurrent();
  }
};
tts.toggleStartHint = function () {
  if (tts.inputValues.checkboxTtsEnabled) {
    $("#ttsStartHint").hide();
  } else {
    $("#ttsStartHint").show();
  }
};
tts.getVoices = function (_0x1e3d94, _0xe8e04d, _0x53198d, _0x134517) {
  var _0x1903ad = [];
  var _0x53a4d0 = String(tts.currentLanguage || "").toLowerCase();
  var _0x5a5dd8 = _0x53a4d0.split("-");
  _0x1903ad.push(window.appConfig.ttsVoices.find(function (_0x2ac5b8) {
    return _0x2ac5b8.id === "default";
  }));
  _0x1903ad.push(window.appConfig.ttsVoices.find(function (_0x574d32) {
    return _0x574d32.id === "google_female";
  }));
  _0x1903ad.push(window.appConfig.ttsVoices.find(function (_0xea6875) {
    return _0xea6875.id === "google_male";
  }));
  if (_0x134517) {
    _0x1903ad.push({
      id: "random",
      name: "Random Voice"
    });
  }
  if (tts.isOverQuota() && _0x53198d) {
    return _0x1903ad;
  }
  var _0x4f5d10 = _createForOfIteratorHelper(window.appConfig.ttsVoices);
  var _0x3983ab;
  try {
    for (_0x4f5d10.s(); !(_0x3983ab = _0x4f5d10.n()).done;) {
      var _0x23745f;
      var _0x5777c3;
      var _0x111dd7;
      var _0x29aae4;
      var _0x3ca081 = _0x3983ab.value;
      if (!_0x1903ad.includes(_0x3ca081) && (_0x3ca081.id.startsWith(((_0x23745f = tts.currentLanguage) === null || _0x23745f === undefined ? undefined : (_0x5777c3 = _0x23745f.split("-")[0]) === null || _0x5777c3 === undefined ? undefined : _0x5777c3.toLowerCase()) + "_") || _0x3ca081.id.startsWith(((_0x111dd7 = tts.currentLanguage) === null || _0x111dd7 === undefined ? undefined : (_0x29aae4 = _0x111dd7.split("-")[1]) === null || _0x29aae4 === undefined ? undefined : _0x29aae4.toLowerCase()) + "_"))) {
        if (!_0xe8e04d && _0x3ca081.name.includes("Singing")) {
          continue;
        }
        _0x1903ad.push(_0x3ca081);
      }
    }
  } catch (_0x30ecaf) {
    _0x4f5d10.e(_0x30ecaf);
  } finally {
    _0x4f5d10.f();
  }
  if (_0x1e3d94) {
    var _0x213ffe = _createForOfIteratorHelper(window.appConfig.ttsVoices);
    var _0x4353cc;
    try {
      for (_0x213ffe.s(); !(_0x4353cc = _0x213ffe.n()).done;) {
        var _0x5b87c4 = _0x4353cc.value;
        if (!_0x1903ad.includes(_0x5b87c4) && _0x5b87c4.id.startsWith("en_")) {
          if (!_0xe8e04d && _0x5b87c4.name.includes("Singing")) {
            continue;
          }
          _0x1903ad.push(_0x5b87c4);
        }
      }
    } catch (_0x21e1c2) {
      _0x213ffe.e(_0x21e1c2);
    } finally {
      _0x213ffe.f();
    }
    var _0x62832c = _createForOfIteratorHelper(window.appConfig.ttsVoices);
    var _0x37dfad;
    try {
      for (_0x62832c.s(); !(_0x37dfad = _0x62832c.n()).done;) {
        var _0x418487 = _0x37dfad.value;
        if (!_0x1903ad.includes(_0x418487)) {
          if (!_0xe8e04d && _0x418487.name.includes("Singing")) {
            continue;
          }
          _0x1903ad.push(_0x418487);
        }
      }
    } catch (_0x283be5) {
      _0x62832c.e(_0x283be5);
    } finally {
      _0x62832c.f();
    }
  }
  var _0x363c86 = _createForOfIteratorHelper(tts.aiVoices);
  var _0x20887f;
  try {
    var _0x269315 = function _0x5375e6() {
      var _0x4963bd = _0x20887f.value;
      if (_0x1903ad.find(function (_0x12c4c0) {
        return _0x12c4c0.id === _0x4963bd.id;
      })) {
        return "continue";
      }
      if (_0x1e3d94) {
        _0x1903ad.push(_0x4963bd);
        return "continue";
      }
      var _0x19b84f = String(_0x4963bd.languageCode || "").toLowerCase();
      if (!_0x19b84f) {
        return "continue";
      }
      var _0x5815de = _0x19b84f.split("-");
      var _0x1ca85c = _0x19b84f === _0x53a4d0 || _0x5815de[0] === _0x5a5dd8[0] || _0x5815de[1] && _0x5a5dd8[1] && _0x5815de[1] === _0x5a5dd8[1];
      if (_0x1ca85c) {
        _0x1903ad.push(_0x4963bd);
      }
    };
    for (_0x363c86.s(); !(_0x20887f = _0x363c86.n()).done;) {
      var _0x72d658 = _0x269315();
      if (_0x72d658 === "continue") {
        continue;
      }
    }
  } catch (_0xace73f) {
    _0x363c86.e(_0xace73f);
  } finally {
    _0x363c86.f();
  }
  return _0x1903ad;
};
tts.onChannelContextChanged = function () {
  tts.setProVoicesHint();
  tts.loadAiVoiceState().catch(function () {});
  if (settings.get("textboxTtsMessageTemplateMigrated") !== "1" && tts.inputValues.textboxTtsMessageTemplate.includes("{username}")) {
    settings.set("textboxTtsMessageTemplateMigrated", "1");
    tts.inputs.textboxTtsMessageTemplate.option("value", tts.inputValues.textboxTtsMessageTemplate.replace("{username}", "{nickname}"));
  }
};
tts.isOverQuota = function () {
  var _0x4e41a1;
  var _0x326d63;
  tts.proVoiceUsageCount = parseInt(settings.get("proVoiceUsageCount") || "0");
  if (settings.get("proVoiceUsageDay") !== new Date().toISOString().substring(0, 10)) {
    settings.set("proVoiceUsageDay", new Date().toISOString().substring(0, 10));
    settings.set("proVoiceUsageCount", 0);
    tts.proVoiceUsageCount = 0;
  }
  return ((_0x4e41a1 = window.session) === null || _0x4e41a1 === undefined ? undefined : (_0x326d63 = _0x4e41a1.me) === null || _0x326d63 === undefined ? undefined : _0x326d63.userFeatures?.isPro) === false && tts.proVoiceUsageCount > tts.proVoiceUsageCountLimit;
};
tts.setProVoicesHint = function () {
  var _0x40349a;
  var _0x201972;
  $(".proVoiceSelectNote").addClass("hidden");
  $("#ttsOverQuotaBanner").addClass("hidden");
  var _0x567fd5 = tts.isLegacyPremiumVoiceId(tts.currentVoice);
  var _0x169d1b = tts.isAiVoiceId(tts.currentVoice);
  var _0x56c574 = tts.inputValues.checkboxTtsRandomVoiceV2;
  var _0x289020 = tts.specialUsers.find(function (_0x49d85f) {
    return tts.isLegacyPremiumVoiceId(_0x49d85f.voiceId);
  });
  var _0x54fb88 = tts.specialUsers.find(function (_0x30f4dd) {
    return tts.isAiVoiceId(_0x30f4dd.voiceId);
  });
  var _0x4a8d71 = tts.isAiFreeQuotaExceeded();
  if ((_0x169d1b || _0x54fb88) && _0x4a8d71) {
    $(".proVoiceSelectNote").removeClass("hidden");
    $(".proVoiceSelectNote").find("small").html("Daily usage limit exceeded. Upgrade to <a onclick=\"setup.scrollToPaymentUi(`TTS_DAILY_QUOTA`, true);\">TikFinity Pro</a> or select default voice.").css("color", "#b7213f");
    return;
  }
  if ((_0x567fd5 || _0x56c574 || _0x289020) && ((_0x40349a = window.session) === null || _0x40349a === undefined ? undefined : (_0x201972 = _0x40349a.me) === null || _0x201972 === undefined ? undefined : _0x201972.userFeatures?.isPro) === false) {
    if (tts.isOverQuota()) {
      $("#ttsOverQuotaBanner").removeClass("hidden");
      if (_0x567fd5 || _0x56c574) {
        $(".proVoiceSelectNote").removeClass("hidden");
        if (_0x56c574) {
          $(".proVoiceSelectNote").find("small").html("Daily usage limit exceeded. Upgrade to <a onclick=\"setup.scrollToPaymentUi(`TTS_DAILY_QUOTA`, true);\">TikFinity Pro</a> or disable random voice.").css("color", "#b7213f");
        } else {
          $(".proVoiceSelectNote").find("small").html("Daily usage limit exceeded. Upgrade to <a onclick=\"setup.scrollToPaymentUi(`TTS_DAILY_QUOTA`, true);\">TikFinity Pro</a> or select default voice.").css("color", "#b7213f");
        }
      }
    } else {
      $(".proVoiceSelectNote").removeClass("hidden");
      if (_0x56c574 || _0x289020) {
        $(".proVoiceSelectNote").find("small").html("Please note that some voices are limited to " + tts.proVoiceUsageCountLimit + " uses per day in the free version!").css("color", "");
      } else if (_0x567fd5) {
        $(".proVoiceSelectNote").find("small").html("Please note that this voice is limited to " + tts.proVoiceUsageCountLimit + " uses per day in the free version!").css("color", "");
      }
    }
  }
};
tts.countUsage = function () {
  tts.proVoiceUsageCount += 1;
  settings.set("proVoiceUsageCount", tts.proVoiceUsageCount);
  tts.setProVoicesHint();
};
tts.checkSettings = function () {
  if (settings.get("radiogroupTtsCommentTypes") === "0" && settings.get("radiogroupTtsChargePoints") !== "0") {
    $("#ttsChargePointsWarning").fadeIn(100);
  } else {
    $("#ttsChargePointsWarning").hide();
  }
};
tts.filterCommentText = function (_0x82b756, _0x58a85b = true) {
  if (!_0x82b756 || typeof _0x82b756 !== "string") {
    return "";
  }
  _0x82b756 = _0x82b756.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").trim();
  var _0x3179e9 = tts.inputValues.textboxCommentTypesSpecialCommand.toLowerCase().trim();
  if (_0x3179e9 && _0x82b756.toLowerCase().indexOf(_0x3179e9) === 0) {
    _0x82b756 = _0x82b756.substring(_0x3179e9.length).trim();
  }
  if (_0x82b756.indexOf(".") === 0 || _0x82b756.indexOf("/") === 0) {
    _0x82b756 = _0x82b756.substring(1).trim();
  }
  if (tts.inputValues.checkboxTtsFilterLetterSpam && _0x58a85b) {
    var _0x538d15 = 0;
    var _0x3f9dcd = "";
    var _0x16ede0 = "";
    Array.from(_0x82b756).forEach(function (_0x41f277) {
      if (_0x41f277.toLowerCase() === _0x3f9dcd.toLowerCase()) {
        if (isNaN(_0x41f277)) {
          if (_0x538d15 < 2) {
            _0x16ede0 += _0x41f277;
          }
        } else if (_0x538d15 < 10) {
          _0x16ede0 += _0x41f277;
        }
        _0x538d15 += 1;
      } else {
        _0x538d15 = 0;
        _0x16ede0 += _0x41f277;
      }
      _0x3f9dcd = _0x41f277;
    });
    return _0x16ede0;
  } else {
    return _0x82b756;
  }
};
tts.generateTtsItem = function (_0x5ea132) {
  var _0xef1a83;
  var _0x15c78b = tts.getSpecialUserByUniqueId(_0x5ea132.uniqueId);
  var _0x48d6cf = _0x15c78b?.speed || (tts.inputValues.checkboxTtsRandomVoiceV2 ? utils.randomIntFromInterval(30, 70) : tts.inputValues.numberboxTtsDefaultSpeed);
  var _0x52eeca = _0x15c78b?.pitch || (tts.inputValues.checkboxTtsRandomVoiceV2 ? utils.randomIntFromInterval(20, 80) : tts.inputValues.numberboxTtsDefaultPitch);
  var _0x38669e = _0x15c78b?.voiceId || tts.currentVoice;
  if (!_0x15c78b && tts.inputValues.checkboxTtsRandomVoiceV2 || _0x15c78b?.voiceId === "random") {
    var _0x3a2ad0 = tts.getVoices(false, false, true);
    _0x38669e = _0x3a2ad0[Math.floor(Math.random() * _0x3a2ad0.length)]?.id;
  }
  var _0x36055b = tts.filterCommentText(_0x5ea132.comment);
  if (!_0x36055b) {
    console.warn("Empty comment after processing");
    return;
  }
  var _0x1f395c = _0x36055b;
  if (tts.inputValues.textboxTtsMessageTemplate.trim()) {
    var _0x1e7996;
    var _0x128560 = (_0x1e7996 = _0x5ea132.uniqueId) === null || _0x1e7996 === undefined ? undefined : _0x1e7996.replaceAll("_", " ").replace(/[0-9]/g, " ");
    var _0x5ce787 = tts.normalizeUnicode(_0x5ea132.nickname).replaceAll("_", " ");
    if (_0x5ce787.length < 2) {
      _0x5ce787 = _0x128560;
    }
    console.log("Normalized Username", _0x128560, _0x5ea132.nickname, "Result", _0x5ce787);
    _0x1f395c = tts.inputValues.textboxTtsMessageTemplate.trim();
    _0x1f395c = _0x1f395c.replace("{comment}", _0x36055b);
    _0x1f395c = _0x1f395c.replace("{username}", _0x128560 || "Testuser");
    _0x1f395c = _0x1f395c.replace("{nickname}", _0x5ce787 || "Testuser");
  }
  console.log("TTS Item Generated", _0x5ea132.uniqueId, _0x48d6cf, _0x52eeca, _0x1f395c);
  tts.log(_0x5ea132.uniqueId, _0x36055b);
  if (_0x38669e !== "default" && ((_0xef1a83 = _0x38669e) === null || _0xef1a83 === undefined || !_0xef1a83.startsWith("google_")) && _0x5ea132.uniqueId !== "Testuser") {
    if (tts.isAiVoiceId(_0x38669e)) {
      if (tts.shouldBlockAiGenerate()) {
        return;
      }
      if (tts.isAiFreeQuotaExceeded()) {
        return;
      }
    } else {
      tts.countUsage();
      if (tts.isOverQuota()) {
        toastr.error("Please select the default voice or upgrade to TikFinity Pro (Setup -> TikFinity Pro)", "Daily TTS Limit exceeded");
        setup.createPaymentUi();
        return;
      }
    }
  }
  return new TTSItem(_0x1f395c, tts.currentLanguage, _0x48d6cf, _0x52eeca, tts.inputValues.slideTtsVolume / 100, _0x5ea132, _0x38669e);
};
tts.log = function (_0x18164b, _0x4733d4) {
  tts.logs = tts.logs.slice(-8);
  tts.logs.push(`[${new Date().toLocaleTimeString()}] ${_0x18164b}: ${_0x4733d4}`);
  $("#ttsLogs").text(tts.logs.slice().reverse().join("\n"));
};
tts.onChat = function (_0x2fc998) {
  _0x2fc998 = JSON.parse(JSON.stringify(_0x2fc998));
  if (!tts.inputValues.checkboxTtsEnabled) {
    return;
  }
  var _0x4df62f = {};
  if (tts.checkAllowed(_0x2fc998)) {
    _0x4df62f.allowed = true;
    if (tts.commentMeetsCriterial(_0x2fc998)) {
      _0x4df62f.commentMeetsCriterial = true;
      if (tts.userCooldownOk(_0x2fc998)) {
        _0x4df62f.userCooldownOk = true;
        if (tts.queueAvailable()) {
          _0x4df62f.queueAvailable = true;
          tts.withdrawPoints(_0x2fc998, function () {
            var _0x3fa74f = tts.generateTtsItem(_0x2fc998);
            if (_0x3fa74f) {
              tts.userLastTtsTs[_0x2fc998.userId] = new Date().getTime();
              tts.queue.append(_0x3fa74f);
            }
          }, function () {
            console.warn("User not enough points for TTS", _0x2fc998.uniqueId);
            var _0x3d0e90 = chatbot.chatbotSnippets.find(function (_0x35ef49) {
              return _0x35ef49.id === "TTS_FAILED_AMOUNT" && _0x35ef49.enabled;
            });
            if (_0x3d0e90) {
              var _0x1b063d = _0x3d0e90.message.replaceAll("%username%", _0x2fc998.nickname).replaceAll("%actionamount%", tts.inputValues.numberboxTtsCost.toLocaleString()).replaceAll("%currencyname%", settings.get("textboxCurrencyName"));
              chatservice.sendMessage(_0x1b063d, _0x2fc998.uniqueId, _0x3d0e90.id);
            }
          });
        } else {
          console.warn("TTS queue size exceeded");
        }
      } else {
        console.warn("User blocked by cooldown", _0x2fc998.uniqueId);
      }
    }
  }
  setup.logDebugModeEvent("TTSOnChat", {
    checkStages: _0x4df62f,
    chatObject: _0x2fc998,
    inputValues: tts.inputValues
  });
};
tts.checkAllowed = function (_0x11d967) {
  if (tts.inputValues.checkboxTtsFilterMentions && _0x11d967.comment.trim().indexOf("@") === 0) {
    console.warn("Comment starts with mention and mentions are filtered");
    return false;
  }
  if (tts.inputValues.checkboxTtsFilterCommands && _0x11d967.comment.trim().indexOf("!") === 0) {
    var _0x293fb0 = tts.inputValues.textboxCommentTypesSpecialCommand.toLowerCase().trim();
    if (settings.get("radiogroupTtsCommentTypes") === "3" && _0x11d967.comment && _0x11d967.comment.trim().toLowerCase().indexOf(_0x293fb0) === 0 && _0x11d967.comment.trim().length > 1) {} else {
      console.warn("Comment starts with command and commands are filtered");
      return false;
    }
  }
  if (_0x11d967.comment.trim().length > tts.inputValues.numberboxTtsCommentLength) {
    console.warn("Comment too long");
    return false;
  }
  if (tts.getSpecialUserByUniqueId(_0x11d967.uniqueId)?.allowed === false) {
    console.warn("TTS user blocked", _0x11d967.uniqueId);
    return false;
  }
  if (tts.inputValues.checkboxTtsUsersNormal) {
    return true;
  }
  if (tts.inputValues.checkboxTtsUsersSpecific) {
    var _0x1d03bf;
    if ((_0x1d03bf = tts.getSpecialUserByUniqueId(_0x11d967.uniqueId)) !== null && _0x1d03bf !== undefined && _0x1d03bf.allowed) {
      return true;
    }
  }
  if (tts.inputValues.checkboxTtsUsersFollowers && utils.isFollower(_0x11d967)) {
    return true;
  }
  if (tts.inputValues.checkboxTtsUsersSubscribers && utils.isSubscriber(_0x11d967)) {
    return true;
  }
  if (tts.inputValues.checkboxTtsUsersModerators && utils.isModerator(_0x11d967)) {
    return true;
  }
  if (tts.inputValues.checkboxTtsUsersTopGifters && utils.getTopGifterRank(_0x11d967) > 0 && utils.getTopGifterRank(_0x11d967) <= tts.ttsTopGiftersTopN) {
    return true;
  }
  if (tts.inputValues.checkboxTtsUsersTeamMembers && _0x11d967.teamMemberLevel >= tts.ttsTeamMembersMinLevel) {
    return true;
  }
  return false;
};
tts.commentMeetsCriterial = function (_0x3680c6) {
  if (!tts.filterCommentText(_0x3680c6.comment)) {
    return false;
  }
  if (tts.inputValues.checkboxTtsFilterLetterSpam && tts.isSpamComment(_0x3680c6.comment)) {
    console.log("Spamm comment filtered");
    return false;
  }
  if (settings.get("radiogroupTtsCommentTypes") === "0") {
    return true;
  }
  if (settings.get("radiogroupTtsCommentTypes") === "1" && _0x3680c6.comment && _0x3680c6.comment.trim().indexOf(".") === 0 && _0x3680c6.comment.trim().length > 1) {
    return true;
  }
  if (settings.get("radiogroupTtsCommentTypes") === "2" && _0x3680c6.comment && _0x3680c6.comment.trim().indexOf("/") === 0 && _0x3680c6.comment.trim().length > 1) {
    return true;
  }
  var _0x51f55e = tts.inputValues.textboxCommentTypesSpecialCommand.toLowerCase().trim();
  if (settings.get("radiogroupTtsCommentTypes") === "3" && _0x3680c6.comment && _0x3680c6.comment.trim().toLowerCase().indexOf(_0x51f55e) === 0 && _0x3680c6.comment.trim().length > 1) {
    return true;
  }
  return false;
};
tts.queueAvailable = function () {
  return tts.queue && tts.queue.getLength() < tts.inputValues.numberboxTtsQueueLength;
};
tts.getSpecialUserByUniqueId = function (_0x2de418) {
  return tts.specialUsers.find(function (_0x21840c) {
    return _0x21840c.uniqueId.toLowerCase().trim().replace("@", "") === _0x2de418.toLowerCase().trim();
  });
};
tts.userCooldownOk = function (_0x3310fa) {
  if (tts.inputValues.numberboxTtsUserCooldown === 0) {
    return true;
  }
  var _0x5f23e7 = (new Date().getTime() - (tts.userLastTtsTs[_0x3310fa.userId] || 0)) / 1000;
  return _0x5f23e7 > tts.inputValues.numberboxTtsUserCooldown;
};
tts.withdrawPoints = function (_0x44d768, _0x541b17, _0x29c6ea) {
  if (settings.get("radiogroupTtsChargePoints") === "0") {
    _0x541b17();
    return;
  }
  if (settings.get("radiogroupTtsCommentTypes") === "0") {
    _0x541b17();
    return;
  }
  if (tts.inputValues.numberboxTtsCost <= 0) {
    _0x541b17();
    return;
  }
  transaction.put(_0x44d768.userId, _0x44d768.uniqueId, tts.inputValues.numberboxTtsCost * -1, false, false, "TTS Cost", true, function (_0x170c26) {
    if (_0x170c26) {
      _0x541b17();
    } else {
      _0x29c6ea();
    }
  });
};
tts.isSpamComment = function (_0x1e2e73) {
  _0x1e2e73 = tts.filterCommentText(_0x1e2e73, false).toLowerCase().trim();
  var _0x2a1921 = [];
  Array.from(_0x1e2e73).forEach(function (_0x5d5542) {
    if (!_0x2a1921.includes(_0x5d5542)) {
      _0x2a1921.push(_0x5d5542);
    }
  });
  if (_0x2a1921.length <= 1) {
    return true;
  }
  if (_0x1e2e73.length >= 5 && _0x2a1921.length <= 2) {
    return true;
  }
  if (_0x1e2e73.length >= 20 && _0x2a1921.length <= 5) {
    return true;
  }
  if (_0x1e2e73.length >= 30 && _0x1e2e73.split(" ").length <= 1) {
    return true;
  }
  if (_0x1e2e73.length >= 50 && _0x1e2e73.split(" ").length <= 2) {
    return true;
  }
  return false;
};
tts.setMinimumMemberLevel = function () {
  utils.openNumberInputDialog($("#numberInputDialog"), "Minimum Team Member Level", tts.ttsTeamMembersMinLevel, 1, 1000, function (_0x30a6d3) {
    tts.ttsTeamMembersMinLevel = _0x30a6d3;
    $("#ttsTeamMembersMinLevel").text(_0x30a6d3);
    settings.set("ttsTeamMembersMinLevel", _0x30a6d3);
  });
};
tts.setTopGiftersN = function () {
  utils.openNumberInputDialog($("#numberInputDialog"), "Allow Top N Gifters", tts.ttsTopGiftersTopN, 1, 20, function (_0x3deda7) {
    tts.ttsTopGiftersTopN = _0x3deda7;
    $("#ttsTopGiftersTopN").text(_0x3deda7);
    settings.set("ttsTopGiftersTopN", _0x3deda7);
  });
};
tts.onVisible = function () {
  if (settings.get("channelId") === "0") {
    $("#buttonTtsTest").click();
    $("#ttsVoiceTesterArea").removeClass("shakeEffect");
    setTimeout(function () {
      return $("#ttsVoiceTesterArea").addClass("shakeEffect");
    }, 100);
  }
};
tts.normalizeUnicode = function (_0x2c8b4d) {
  if (!_0x2c8b4d) {
    return "";
  }
  var _0x184ce0 = _0x2c8b4d.normalize("NFKC");
  _0x184ce0 = _0x184ce0.replace(/(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDFF\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFF]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])/g, " ");
  _0x184ce0 = _0x184ce0.replace(/(?:[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3005\u3007\u3012\u3013\u3020-\u3029\u3036-\u303B\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u9FFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uF900-\uFA6D\uFA70-\uFAD9\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDD-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC5\uDED0-\uDED9\uDEE0-\uDEE7\uDEF0-\uDEF6\uDF00-\uDF92\uDF94-\uDFCA]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/g, " ");
  _0x184ce0 = _0x184ce0.replace(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g, " ");
  return _0x184ce0.trim();
};
var actionsandevents = {
  inputs: [],
  inputValues: [],
  actions: [],
  events: [],
  timer: [],
  cachedGifts: null,
  getAllGiftsCalled: false,
  localActionGrid: null,
  localEventGrid: null,
  localTimerGrid: null,
  screenGridRefreshInterval: null,
  joinedUserCurrentBroadcastId: null,
  joinedUserIds: [],
  firstActivityUserIds: [],
  restoreSceneInterval: null,
  sceneIdToRestore: null,
  timerInterval: null,
  timerLastExecutionTs: {},
  actionsLastExecTs: {},
  actionsLastUserExecTs: {},
  freeLimit: 5,
  switchSceneActionQueue: [],
  switchSceneInProgress: false,
  activateSourceQueue: [],
  activateSourceInProgress: {},
  giftRepeatInfo: {},
  actionExecCounter: {},
  ttsTestItem: null,
  ttsVoicePickerModalApp: null,
  voicemodConnection: null,
  mcScriptPromises: [],
  customGoalDataSource: [{
    id: "custom1",
    name: "Custom Goal 1"
  }, {
    id: "custom2",
    name: "Custom Goal 2"
  }, {
    id: "custom3",
    name: "Custom Goal 3"
  }, {
    id: "all",
    name: "All Custom Goals"
  }],
  actionsPageSize: 150,
  eventsPageSize: 150,
  createPredefinedPromptShown: false
};
actionsandevents.optionsWhich = [{
  value: 1,
  text: localization.getString("actionsandevents_events_modal_options_which_any")
}, {
  value: 5,
  text: localization.getString("actionsandevents_events_modal_options_which_followers")
}, {
  value: 3,
  text: localization.getString("actionsandevents_events_modal_options_which_subscribers")
}, {
  value: 4,
  text: localization.getString("actionsandevents_events_modal_options_which_moderators")
}, {
  value: 6,
  text: localization.getString("actionsandevents_events_modal_options_which_topgifter")
}, {
  value: 2,
  text: localization.getString("actionsandevents_events_modal_options_which_specific_user")
}];
actionsandevents.optionsTrigger = [{
  value: 6,
  text: localization.getString("actionsandevents_events_modal_options_trigger_join")
}, {
  value: 13,
  text: localization.getString("actionsandevents_events_modal_options_trigger_first_activity")
}, {
  value: 1,
  text: localization.getString("actionsandevents_events_modal_options_trigger_invite")
}, {
  value: 9,
  text: localization.getString("actionsandevents_events_modal_options_trigger_follow")
}, {
  value: 10,
  text: localization.getString("actionsandevents_events_modal_options_trigger_subscribe")
}, {
  value: 7,
  text: localization.getString("actionsandevents_events_modal_options_trigger_gift_likes_min")
}, {
  value: 11,
  text: localization.getString("actionsandevents_events_modal_options_trigger_chat")
}, {
  value: 2,
  text: localization.getString("actionsandevents_events_modal_options_trigger_command")
}, {
  value: 3,
  text: localization.getString("actionsandevents_events_modal_options_trigger_gift_min")
}, {
  value: 4,
  text: localization.getString("actionsandevents_events_modal_options_trigger_gift_specific")
}, {
  value: 12,
  text: localization.getString("actionsandevents_events_modal_options_trigger_emote_specific")
}, {
  value: 15,
  text: localization.getString("actionsandevents_events_modal_options_trigger_fanclub_sticker_specific")
}, {
  value: 14,
  text: localization.getString("actionsandevents_events_modal_options_trigger_shop_purchase")
}];
actionsandevents.init = function () {
  actionsandevents.events = JSON.parse(settings.get("events", "[]"));
  actionsandevents.timer = JSON.parse(settings.get("timer", "[]"));
  actionsandevents.toggleNotifications();
  if (settings.get("channelId") == 0) {
    actionsandevents.onChannelContextChanged();
  }
  if (!actionsandevents.timerInterval) {
    actionsandevents.timerInterval = setIntervalFix(actionsandevents.timerTick, 1000);
    setIntervalFix(function () {
      actionsandevents.actionExecCounter = {};
    }, 5000);
  }
  utils.initDxInput(actionsandevents, "dxCheckBox", $("#actionsEnabledCheckbox"), true, {
    text: localization.getString("actionsandevents_actions_enabled_checkbox")
  });
  if (actionsandevents.inputValues.actionsEnabledCheckbox === false) {
    $("#actionsEnabledCheckboxHint").css("display", "block");
  }
  $("#buttonSimulateFollow").dxButton({
    width: "160px",
    text: "Simulate Follow",
    onClick: function _0x242a89() {
      toastr.success("Follow triggered");
      actionsandevents.onFollow({
        userId: "1",
        name: "Testuser",
        nickname: "Test User",
        uniqueId: "Testuser",
        teamMemberLevel: 9999,
        topGifterRank: 1
      });
    }
  });
  $("#buttonSimulateShare").dxButton({
    width: "160px",
    text: "Simulate Share",
    onClick: function _0x42e931() {
      toastr.success("Share triggered");
      actionsandevents.onShare({
        userId: "1",
        name: "Testuser",
        nickname: "Test User",
        uniqueId: "Testuser",
        teamMemberLevel: 9999,
        topGifterRank: 1
      });
    }
  });
  $("#buttonSimulateSubscribe").dxButton({
    width: "160px",
    text: "Simulate Subscribe / Super Fan",
    onClick: function _0x5655ab() {
      toastr.success("Subscribe triggered");
      actionsandevents.onSubscribe({
        userId: "1",
        name: "Testuser",
        nickname: "Test User",
        uniqueId: "Testuser",
        subMonth: 1,
        teamMemberLevel: 9999,
        topGifterRank: 1
      });
    }
  });
  var _0xa3a341 = 0;
  $("#buttonSimulateLike").dxButton({
    width: "160px",
    text: "Simulate 15 Likes",
    onClick: function _0x2184ec() {
      toastr.success("Like triggered");
      _0xa3a341 += 15;
      actionsandevents.onLike({
        userId: "1",
        name: "Testuser",
        nickname: "Test User",
        uniqueId: "Testuser",
        likeCount: 15,
        totalUserLikeCount: _0xa3a341,
        teamMemberLevel: 9999,
        topGifterRank: 1
      });
    }
  });
  $("#buttonSimulateGift").dxButton({
    width: "160px",
    text: "Simulate Gift",
    onClick: function _0x7a795f() {
      var _0x23317a;
      var _0x1c7716;
      var _0x1272f5 = $("#selectBoxSimulateGift").dxSelectBox("instance").option("selectedItem");
      if (!_0x1272f5) {
        return DevExpress.ui.dialog.alert("Please first select a gift that you want to trigger.", "Select Gift");
      }
      toastr.success("Gift triggered");
      actionsandevents.onGift(_objectSpread(_objectSpread({}, _0x1272f5), {}, {
        userId: "1",
        name: "Testuser",
        uniqueId: "Testuser",
        nickname: "Test User",
        giftPictureUrl: _0x1272f5 === null || _0x1272f5 === undefined ? undefined : (_0x23317a = _0x1272f5.image) === null || _0x23317a === undefined ? undefined : _0x23317a.url_list?.[0],
        giftId: _0x1272f5.id,
        giftName: _0x1272f5.name,
        giftType: 1,
        repeatEnd: 1,
        repeatCount: 1,
        value: _0x1272f5.diamond_count,
        teamMemberLevel: 9999,
        topGifterRank: 1
      }));
      actionsandevents.onRawGift(_objectSpread(_objectSpread({}, _0x1272f5), {}, {
        userId: "1",
        name: "Testuser",
        uniqueId: "Testuser",
        nickname: "Test User",
        giftPictureUrl: _0x1272f5 === null || _0x1272f5 === undefined ? undefined : (_0x1c7716 = _0x1272f5.image) === null || _0x1c7716 === undefined ? undefined : _0x1c7716.url_list?.[0],
        giftId: _0x1272f5.id,
        giftName: _0x1272f5.name,
        giftType: 1,
        repeatEnd: 0,
        repeatCount: 1,
        value: _0x1272f5.diamond_count,
        teamMemberLevel: 9999,
        topGifterRank: 1,
        groupId: Math.random().toString()
      }));
    }
  });
  $("#selectBoxSimulateGift").dxSelectBox({
    width: "487px",
    dataSource: actionsandevents.getGiftDataSource(),
    placeholder: "Select gift...",
    valueExpr: "id",
    displayExpr: "name",
    searchEnabled: true,
    itemTemplate: actionsandevents.getGiftItemTemplate,
    onValueChanged: function _0x4f95bb(_0x2afed3) {}
  }).dxValidator({
    validationRules: [{
      type: "required"
    }]
  });
};
actionsandevents.onChannelContextChanged = function () {
  actionsandevents.localTimerGrid = actionsandevents.initTimerGrid($("#onPageTimerContainer"));
  actionsandevents.localActionGrid = actionsandevents.initActionGrid($("#onPageActionContainer"));
  actionsandevents.localEventGrid = actionsandevents.initEventGrid($("#onPageEventContainer"));
  actionsandevents.localScreenGrid = actionsandevents.initScreenGrid($("#onPageScreenContainer"));
};
actionsandevents.onInputChange = function (_0x319f14, _0x20419b) {
  if (_0x319f14 === "actionsEnabledCheckbox") {
    $("#actionsEnabledCheckboxHint").css("display", _0x20419b ? "none" : "block");
    if (_0x20419b === false) {
      socketiowrapper.emitSocketEvent("actionsChanged", {
        origin: "actionsEnabledCheckbox"
      });
    }
  }
};
actionsandevents.onVisible = function () {
  setTimeout(function () {
    actionsandevents.refreshActions(actionsandevents.localActionGrid);
  }, 500);
  try {
    if (actionsandevents.localActionGrid) {
      actionsandevents.localActionGrid.dxDataGrid("instance").updateDimensions();
    }
    if (actionsandevents.localEventGrid) {
      actionsandevents.localEventGrid.dxDataGrid("instance").updateDimensions();
    }
  } catch (_0x3d3ef7) {}
  $("#actionProExpiredWarning").removeClass("shakeEffect");
  setTimeout(function () {
    return $("#actionProExpiredWarning").addClass("shakeEffect");
  }, 500);
};
actionsandevents.openSelectActionDialog = function (_0xa5dba6, _0xf1e804) {
  var _0x1d46b0 = _0xa5dba6.dxPopup({
    width: 900,
    height: 650,
    visible: true,
    title: localization.getString("actionsandevents_actions_modal_select_action"),
    closeOnOutsideClick: true,
    showCloseButton: true,
    showScrollbar: true,
    contentTemplate: function _0x597761(_0x345589) {
      var _0xceee2d = $("<div>");
      _0x345589.append(_0xceee2d);
      actionsandevents.initActionGrid(_0xceee2d, true, function (_0x54e7e8) {
        _0x1d46b0.hide();
        _0xf1e804(_0x54e7e8);
      });
    }
  }).dxPopup("instance");
};
actionsandevents.initActionGrid = function (_0x17ec08, _0x2baae8, _0x3ed310) {
  if (!_0x2baae8) {
    _0x2baae8 = false;
  }
  _0x17ec08.empty();
  var _0x4ca286 = $("<div>").dxButton({
    icon: "add",
    text: localization.getString("actionsandevents_actions_create_action_button"),
    onClick: function _0x573d3e() {
      if (actionsandevents.hasActionCountLimitReached()) {
        return;
      }
      actionsandevents.openNewActionModal(function (_0xdc2cc8) {
        if (_0x2baae8) {
          if (_0xdc2cc8 && !actionsandevents.actions.find(function (_0x575d5c) {
            return _0x575d5c.id === _0xdc2cc8.id;
          })) {
            actionsandevents.actions.push(_0xdc2cc8);
          }
          _0x3ed310(_0xdc2cc8);
        } else {
          actionsandevents.refreshActions(_0x5933a3);
        }
        socketiowrapper.emitWidgetSettingsToWidgets();
      });
    }
  }).css("margin-bottom", "10px");
  if (!_0x2baae8) {
    _0x4ca286.css("z-index", "9").css("position", "absolute");
  }
  var _0x5933a3 = $("<div>").addClass("actionGrid").dxDataGrid({
    width: _0x2baae8 ? "850px" : "100%",
    dataSource: actionsandevents.actions,
    showBorders: true,
    height: _0x2baae8 ? "500px" : null,
    noDataText: localization.getString("actionsandevents_actions_empty"),
    hoverStateEnabled: _0x2baae8,
    columnAutoWidth: true,
    columnHidingEnabled: !_0x2baae8,
    wordWrapEnabled: true,
    scrolling: {
      mode: "standard",
      showScrollbar: "always"
    },
    paging: {
      enabled: actionsandevents.actions.length >= actionsandevents.actionsPageSize,
      pageSize: actionsandevents.actionsPageSize
    },
    pager: {
      visible: actionsandevents.actions.length >= actionsandevents.actionsPageSize,
      showPageSizeSelector: false
    },
    searchPanel: {
      visible: !_0x2baae8,
      width: 240,
      placeholder: "Search existing actions..."
    },
    editing: {
      allowUpdating: !_0x2baae8,
      allowDeleting: !_0x2baae8,
      mode: "cell",
      texts: {
        confirmDeleteMessage: localization.getString("actionsandevents_actions_delete_confirm")
      }
    },
    repaintChangesOnly: true,
    columns: [{
      dataField: "id",
      visible: false,
      dataType: "string"
    }, {
      type: "buttons",
      width: 130,
      visible: !_0x2baae8,
      buttons: [{
        icon: "video",
        hint: "Play",
        onClick: function _0x70b907(_0xf88a0) {
          var _0x4a0c33 = _0xf88a0.row.data;
          if (_0x4a0c33.isTempDisabled) {
            return actionsandevents.showUnlockAllActionsMessage();
          }
          if (actionsandevents.executeAction(_0x4a0c33.id, undefined, undefined, "Testuser123", "Test User 123", "Test", 1, "Rose", 1, 15, 100, 1, {
            value: 1
          })) {
            toastr.success(null, localization.getString("actionsandevents_action_exec_success"));
          }
        }
      }, {
        icon: "edit",
        hint: "Edit",
        onClick: function _0x1d0893(_0x1da932) {
          var _0x26892a = _0x1da932.row.data;
          if (_0x26892a.isTempDisabled) {
            return actionsandevents.showUnlockAllActionsMessage();
          }
          actionsandevents.openNewActionModal(function () {
            actionsandevents.refreshActions(_0x5933a3);
            socketiowrapper.emitWidgetSettingsToWidgets();
          }, _0x26892a);
        }
      }, {
        icon: "copy",
        hint: "Duplicate",
        onClick: function _0x5ba5c7(_0x7234bd) {
          var _0x36c6e9 = _0x7234bd.row.data;
          if (_0x36c6e9.isTempDisabled) {
            return actionsandevents.showUnlockAllActionsMessage();
          }
          var _0xb35883 = DevExpress.ui.dialog.confirm("Do you want to duplicate (copy) the action with all the settings?", "Duplicate Action");
          _0xb35883.done(function (_0x7c4137) {
            if (_0x7c4137) {
              if (actionsandevents.hasActionCountLimitReached()) {
                return;
              }
              actionsandevents.copyAction(_0x36c6e9);
            }
          });
        }
      }, {
        name: "delete",
        icon: "trash"
      }]
    }, {
      dataField: "name",
      caption: localization.getString("actionsandevents_actions_list_name"),
      dataType: "string",
      width: "230px",
      cellTemplate: function _0x36ee68(_0x1c71d2, _0x59b495) {
        if (_0x59b495.row.data.isTempDisabled) {
          _0x1c71d2.text("[DISABLED] " + _0x59b495.row.data.name);
        } else {
          _0x1c71d2.text(_0x59b495.row.data.name);
        }
      }
    }, {
      dataField: "screenId",
      caption: localization.getString("actionsandevents_actions_list_screen"),
      dataType: "number",
      alignment: "left",
      width: "100px",
      visible: !_0x2baae8,
      lookup: {
        dataSource: utils.getScreenList(),
        displayExpr: "screenName",
        valueExpr: "screenId"
      }
    }, {
      dataField: "duration",
      caption: localization.getString("actionsandevents_actions_list_duration"),
      dataType: "number",
      width: "110px",
      alignment: "left",
      editorOptions: {
        showSpinButtons: true,
        min: 1
      }
    }, {
      dataField: "amountToAdd",
      caption: localization.getString("actionsandevents_actions_list_amount"),
      dataType: "number",
      width: "90px",
      alignment: "left",
      editorOptions: {
        showSpinButtons: true,
        min: -99999999,
        max: 99999999
      }
    }, {
      caption: localization.getString("actionsandevents_actions_list_animation"),
      dataType: "boolean",
      width: "80px",
      allowEditing: false,
      alignment: "center",
      allowSorting: true,
      calculateCellValue: function _0x43df7d(_0x5a7852) {
        return _0x5a7852.animationUrl !== null;
      }
    }, {
      caption: localization.getString("actionsandevents_actions_list_image"),
      dataType: "boolean",
      width: "70px",
      allowEditing: false,
      alignment: "center",
      allowSorting: true,
      calculateCellValue: function _0x55928c(_0x3e0777) {
        return _0x3e0777.imageUrl !== null;
      }
    }, {
      caption: localization.getString("actionsandevents_actions_list_audio"),
      dataType: "boolean",
      width: "70px",
      allowEditing: false,
      alignment: "center",
      allowSorting: true,
      calculateCellValue: function _0x3a4ebf(_0xdf317d) {
        return _0xdf317d.audioUrl !== null || _0xdf317d.textToSpeech !== null;
      }
    }, {
      caption: localization.getString("actionsandevents_actions_list_video"),
      dataType: "boolean",
      width: "70px",
      allowEditing: false,
      alignment: "center",
      allowSorting: true,
      calculateCellValue: function _0x43fcf6(_0x2b2be9) {
        return _0x2b2be9.videoUrl !== null;
      }
    }, {
      dataField: "description",
      caption: localization.getString("actionsandevents_actions_list_description"),
      dataType: "string",
      allowEditing: false,
      allowSearch: true,
      calculateCellValue: function _0x8dbfc3(_0x15abc8) {
        var _0x3ad9b2;
        var _0x4981ca;
        var _0x8c3731;
        var _0x15376c = "";
        if (_0x15abc8.dynamicConfig.animationUrlOriginalFilename) {
          _0x15376c += "Show " + _0x15abc8.dynamicConfig.animationUrlOriginalFilename + ", ";
        }
        if (_0x15abc8.dynamicConfig.imageUrlOriginalFilename) {
          _0x15376c += "Show " + _0x15abc8.dynamicConfig.imageUrlOriginalFilename + ", ";
        }
        if (_0x15abc8.dynamicConfig.audioUrlOriginalFilename) {
          _0x15376c += "Play Sound " + _0x15abc8.dynamicConfig.audioUrlOriginalFilename + ", ";
        }
        if (_0x15abc8.videoUrl) {
          _0x15376c += "Play Video " + (_0x15abc8.dynamicConfig.videoFileOriginalFilename || _0x15abc8.videoUrl) + ", ";
        }
        if (_0x15abc8.webhookUrl) {
          _0x15376c += "Trigger WebHook " + _0x15abc8.webhookUrl + ", ";
        }
        if (_0x15abc8.text) {
          _0x15376c += "Show Text \"" + _0x15abc8.text + "\", ";
        }
        if (_0x15abc8.textToSpeech) {
          _0x15376c += "Read \"" + _0x15abc8.textToSpeech + "\", ";
        }
        if (_0x15abc8.message) {
          _0x15376c += "Send Text \"" + _0x15abc8.message + "\", ";
        }
        if (_0x15abc8.obsSceneId) {
          _0x15376c += "Switch Scene \"" + _0x15abc8.obsSceneId + "\", ";
        }
        if (_0x15abc8.obsSourceId) {
          _0x15376c += "Activate Source \"" + _0x15abc8.dynamicConfig.obsSourceLabel + "\", ";
        }
        if (_0x15abc8.mcCmd) {
          _0x15376c += "Minecraft Command \"" + _0x15abc8.mcCmd + "\", ";
        }
        if (_0x15abc8.keystrokes) {
          _0x15376c += "Send Keystrokes \"" + _0x15abc8.keystrokes + "\", ";
        }
        if ((_0x3ad9b2 = _0x15abc8.thirdPartyAction) !== null && _0x3ad9b2 !== undefined && _0x3ad9b2.label) {
          _0x15376c += _0x15abc8.thirdPartyAction.label + ", ";
        }
        if ((_0x4981ca = _0x15abc8.voicemodVoiceConfig) !== null && _0x4981ca !== undefined && _0x4981ca.voiceName) {
          _0x15376c += "Set Voice \"" + _0x15abc8.voicemodVoiceConfig.voiceName + "\", ";
        }
        if (_0x15abc8.streamerbotActionId) {
          _0x15376c += "Streamer.bot Action \"" + _0x15abc8.dynamicConfig.streamerbotActionIdOriginalFilename + "\", ";
        }
        if (_0x15abc8.timerSeconds) {
          _0x15376c += "Timer " + (_0x15abc8.timerSeconds > 0 ? "+" : "") + ((_0x8c3731 = _0x15abc8.timerSeconds) === null || _0x8c3731 === undefined ? undefined : _0x8c3731.toLocaleString()) + " Seconds, ";
        }
        if (_0x15abc8.customGoalConfig) {
          var _0x2db78f;
          var _0x5c8bb5 = "Control";
          var _0x69ef70 = "by";
          switch (_0x15abc8.customGoalConfig.goalActionId) {
            case 0:
              _0x5c8bb5 = "Increase";
              break;
            case 1:
              _0x5c8bb5 = "Decrease";
              break;
            case 2:
              _0x5c8bb5 = "Set";
              _0x69ef70 = "to";
              break;
          }
          _0x15376c += _0x5c8bb5 + " " + (actionsandevents.customGoalDataSource.find(function (_0x427c27) {
            return _0x427c27.id === _0x15abc8.customGoalConfig.goalId;
          })?.name || "Custom Goal") + " " + _0x69ef70 + " " + ((_0x2db78f = _0x15abc8.customGoalConfig.goalValue) === null || _0x2db78f === undefined ? undefined : _0x2db78f.toLocaleString()) + ", ";
        }
        if (_0x15abc8.snapCamEffectId) {
          _0x15376c += "Set Snap Cam Effect \"" + (_0x15abc8.dynamicConfig && _0x15abc8.dynamicConfig.snapCamEffectIdOriginalFilename ? _0x15abc8.dynamicConfig.snapCamEffectIdOriginalFilename : _0x15abc8.snapCamEffectId) + "\", ";
        }
        return _0x15376c.substring(0, _0x15376c.length - 2);
      }
    }],
    onRowClick: function _0xfd66a3(_0x38b772) {
      if (_0x2baae8) {
        _0x3ed310(_0x38b772.data);
      }
    },
    onRowPrepared: function _0x39424b(_0x1cf860) {
      if (_0x2baae8 && _0x1cf860.rowType === "data") {
        _0x1cf860.rowElement.addClass("cursorPointer");
      }
      if (_0x1cf860.rowType === "data") {
        if (_0x1cf860.data.isTempDisabled) {
          _0x1cf860.rowElement.css("background", "#561623");
        }
      }
    },
    onRowRemoved: function _0xf8754b(_0x100ce5) {
      api.doAction("DELETE", "rest/action/" + _0x100ce5.data.id, null, function () {
        actionsandevents.refreshTimerGrid();
        toastr.success(null, localization.getString("actionsandevents_deleted_action"));
        actionsandevents.refreshActionsGridPagination(_0x5933a3);
      }, function () {});
      if (actionsandevents.localEventGrid) {
        actionsandevents.refreshEvents(actionsandevents.localEventGrid);
      }
      actionsandevents.toggleNotifications();
      socketiowrapper.emitWidgetSettingsToWidgets();
    },
    onRowUpdated: function _0x4cb963(_0x3e4605) {
      api.doAction("PATCH", "rest/action/" + _0x3e4605.data.id, _0x3e4605.data, function (_0x3d3a67) {
        actionsandevents.refreshTimerGrid();
        toastr.success(null, localization.getString("actionsandevents_saved_action"));
      }, function () {});
      if (actionsandevents.localEventGrid) {
        actionsandevents.refreshEvents(actionsandevents.localEventGrid);
      }
      actionsandevents.refreshUiActionLabels();
      actionsandevents.toggleNotifications();
      socketiowrapper.emitWidgetSettingsToWidgets();
    }
  });
  _0x17ec08.append(_0x4ca286);
  _0x17ec08.append(_0x5933a3);
  actionsandevents.refreshActions(_0x5933a3);
  return _0x5933a3;
};
actionsandevents.refreshActionsGridPagination = function (_0x21f42b) {
  _0x21f42b.dxDataGrid("instance").option({
    paging: {
      enabled: actionsandevents.actions.length > actionsandevents.actionsPageSize,
      pageSize: actionsandevents.actionsPageSize
    },
    pager: {
      visible: actionsandevents.actions.length > actionsandevents.actionsPageSize,
      showPageSizeSelector: false
    }
  });
};
actionsandevents.refreshEventsGridPagination = function (_0x545881) {
  _0x545881.dxDataGrid("instance").option({
    paging: {
      enabled: actionsandevents.events.length > actionsandevents.eventsPageSize,
      pageSize: actionsandevents.eventsPageSize
    },
    pager: {
      visible: actionsandevents.events.length > actionsandevents.eventsPageSize,
      showPageSizeSelector: false
    }
  });
};
actionsandevents.refreshActions = function (_0x2854bd) {
  var _0x36e974;
  if (!window.session.channelId) {
    return;
  }
  api.get("rest/action", {
    channelId: window.session.channelId,
    profileId: ((_0x36e974 = window.session.me) === null || _0x36e974 === undefined ? undefined : _0x36e974.channel?.profileId) || 1,
    pageSize: 5000
  }, function (_0xbd3198) {
    var _0x5ba53f;
    var _0xbe040e;
    var _0x4504d6;
    var _0x3eaa6a = _0xbd3198[_0xbd3198.arrayKey];
    if (!window.myInstantsActionBackup) {
      window.myInstantsActionBackup = true;
      setTimeout(function () {
        utils.createMyInstantsBackup(_0x3eaa6a);
      }, 60000);
    }
    if ((_0x5ba53f = window.session) === null || _0x5ba53f === undefined || (_0xbe040e = _0x5ba53f.me) === null || _0xbe040e === undefined || (_0x4504d6 = _0xbe040e.userFeatures) === null || _0x4504d6 === undefined || !_0x4504d6.isPro) {
      _0x3eaa6a.slice(actionsandevents.freeLimit).forEach(function (_0x4728aa) {
        _0x4728aa.isTempDisabled = true;
      });
      if (_0x3eaa6a.find(function (_0x236608) {
        return _0x236608.isTempDisabled;
      })) {
        $("#actionProExpiredWarning").removeClass("hidden");
      }
    }
    console.log("GRID: Start Compare!");
    var _0x3a03dc = false;
    var _0x4550a9 = _createForOfIteratorHelper(_0x3eaa6a);
    var _0x56a3e5;
    try {
      var _0xe1bc12 = function _0xafd8ce() {
        var _0x36bfeb = _0x56a3e5.value;
        var _0x5db43e = actionsandevents.actions.find(function (_0x4e6ca1) {
          return _0x4e6ca1.id === _0x36bfeb.id;
        });
        if (_0x5db43e) {
          if (JSON.stringify(_0x5db43e) !== JSON.stringify(_0x36bfeb)) {
            _0x3a03dc = true;
            var _0x465243 = actionsandevents.actions.indexOf(_0x5db43e);
            actionsandevents.actions[_0x465243] = _0x36bfeb;
          }
        } else {
          actionsandevents.actions.push(_0x36bfeb);
          _0x3a03dc = true;
        }
      };
      for (_0x4550a9.s(); !(_0x56a3e5 = _0x4550a9.n()).done;) {
        _0xe1bc12();
      }
    } catch (_0x206820) {
      _0x4550a9.e(_0x206820);
    } finally {
      _0x4550a9.f();
    }
    actionsandevents.refreshActionsGridPagination(_0x2854bd);
    if (_0x3a03dc) {
      console.log("GRID: Changed!");
      _0x2854bd.dxDataGrid("instance").refresh();
      actionsandevents.refreshUiActionLabels();
      actionsandevents.refreshTimerGrid();
      if (actionsandevents.localEventGrid) {
        actionsandevents.refreshEvents(actionsandevents.localEventGrid);
      }
    } else {
      console.log("GRID: Not Changed!");
    }
    if (actionsandevents.actions.length > 1) {
      try {
        setup.createPaymentUi();
      } catch (_0x55d72d) {}
    }
    actionsandevents.toggleNotifications();
    if (!actionsandevents.createPredefinedPromptShown && actionsandevents.actions.length === 0 && navigation.currentPage === "actionsandevents") {
      actionsandevents.createPredefinedPromptShown = true;
      var _0x11cc15 = DevExpress.ui.dialog.confirm("\n            Welcome to the most advanced alert system for TikTok Live! 🚀<br><br>\n            Would you like to use predefined alerts for gifts, follows, subs and likes?<br>\n            You can customise the automatically created actions afterwards.<br>\n            If not, you will have to create them yourself.\n            ", "Welcome to Actions & Events");
      _0x11cc15.done(function (_0x4655d8) {
        if (_0x4655d8) {
          actionsandevents.importPredefined();
        }
      });
    }
  }, function () {});
};
actionsandevents.toggleNotifications = function () {
  $(".actionsandeventsNotification").hide();
  if (!window.session.channelId) {
    return;
  }
  if (actionsandevents.actions.length > 0) {
    $(".actionsandeventsNotificationWithActions").show();
  } else {
    $(".actionsandeventsNotificationWithoutActions").show();
  }
};
actionsandevents.importPredefined = _asyncToGenerator(_regeneratorRuntime().mark(function _callee22() {
  var _0x4855ee;
  var _0x28d76e;
  return _regeneratorRuntime().wrap(function _0x1396c8(_0x267c2b) {
    while (1) {
      switch (_0x267c2b.prev = _0x267c2b.next) {
        case 0:
          $(".actionsandeventsNotificationWithoutActions").fadeOut(100);
          _0x267c2b.next = 3;
          return fetch("/preconfig/predefined_actions.tfc");
        case 3:
          _0x4855ee = _0x267c2b.sent;
          _0x267c2b.next = 6;
          return _0x4855ee.text();
        case 6:
          _0x28d76e = _0x267c2b.sent;
          _0x267c2b.next = 9;
          return setup.doImport(JSON.parse(decodeURIComponent(atob(_0x28d76e.split("").reverse().join("")))), false, false, false, true, true);
        case 9:
          actionsandevents.init();
          actionsandevents.onChannelContextChanged();
          actionsandevents.toggleNotifications();
          DevExpress.ui.dialog.alert(`
        4 predefined actions and events have been created!<br>
        These include:
        <ul>
            <li>Follow Alert when someone follows you!</li>
            <li>Like Alert when someone sends 100 likes (taps) in your stream!</li>
            <li>Gift Alert when someone sends a gift!</li>
            <li>Sub Alert when someone subscribes!</li>
        </ul>
        You can edit and customise all actions by clicking on the pencil icon.<br>
        The created alerts have all been assigned to the "Screen 1" overlay.<br>
        TikFinity also allows the assignment to multiple overlays for a more<br>
        professional use with more alerts.<br><br>

        Please add the following URL as "Link Source" in Live Studio to display<br>
        the alerts in your stream:<br><br>

        <a href="${actionsandevents.getScreenUrl(1)}" id="importPrefefinedScreen1Link">${actionsandevents.getScreenUrl(1)}</a><br><br>

        Click on the link to copy it to your clipboard. Then in Live Studio<br>
        click on "+ Add Source" -> "Link" -> Paste the link and select your<br>
        preferred resolution. Then confirm it by clicking on "Add source".<br><br>
    `, "You are ready!");
          $("#importPrefefinedScreen1Link").click(function (_0x365f38) {
            _0x365f38.preventDefault();
            utils.copyTextToClipboard(actionsandevents.getScreenUrl(1), localization.getString("obsoverlays_widget_copy_success_message"), localization.getString("obsoverlays_widget_copy_success_title"));
          });
        case 14:
        case "end":
          return _0x267c2b.stop();
      }
    }
  }, _callee22);
}));
actionsandevents.refreshUiActionLabels = function () {
  actionsandevents.actions.forEach(function (_0xe2eff) {
    $(".action-name-" + _0xe2eff.id).text(_0xe2eff.name);
  });
};
actionsandevents.refreshEvents = function (_0x133fa4) {
  _0x133fa4.dxDataGrid("instance").option("dataSource", actionsandevents.events);
  actionsandevents.refreshEventsGridPagination(_0x133fa4);
  _0x133fa4.dxDataGrid("instance").refresh();
};
actionsandevents.openNewActionModal = function (_0x7db69, _0x4cfab9) {
  if (_0x4cfab9) {
    _0x4cfab9 = JSON.parse(JSON.stringify(_0x4cfab9));
  }
  if (!_0x4cfab9) {
    _0x4cfab9 = {};
  }
  if (!_0x4cfab9.dynamicConfig) {
    _0x4cfab9.dynamicConfig = {};
  }
  if (!_0x4cfab9.duration) {
    _0x4cfab9.duration = 10;
  }
  if (!_0x4cfab9.amountToAdd) {
    _0x4cfab9.amountToAdd = 0;
  }
  if (!_0x4cfab9.amountToRemove) {
    _0x4cfab9.amountToRemove = 0;
  }
  if (!_0x4cfab9.screenId) {
    _0x4cfab9.screenId = 1;
  }
  if (typeof _0x4cfab9.enableFadeEffect === "undefined") {
    _0x4cfab9.enableFadeEffect = true;
  }
  if (typeof _0x4cfab9.dynamicConfig.enableStreaks === "undefined") {
    _0x4cfab9.dynamicConfig.enableStreaks = false;
  }
  if (typeof _0x4cfab9.dynamicConfig.skipOnNext === "undefined") {
    _0x4cfab9.dynamicConfig.skipOnNext = false;
  }
  if (_0x4cfab9.amountToAdd < 0) {
    _0x4cfab9.amountToRemove = _0x4cfab9.amountToAdd * -1;
    _0x4cfab9.amountToAdd = 0;
  }
  if (_0x4cfab9.videoUrl && _0x4cfab9.videoUrl.includes("/file/")) {
    _0x4cfab9.videoFile = _0x4cfab9.videoUrl;
    _0x4cfab9.videoUrl = null;
  }
  if (!_0x4cfab9.dynamicConfig.mediaSoundVolume) {
    _0x4cfab9.dynamicConfig.mediaSoundVolume = 100;
  }
  if (!_0x4cfab9.dynamicConfig.cooldown) {
    _0x4cfab9.dynamicConfig.cooldown = 0;
  }
  if (!_0x4cfab9.dynamicConfig.userCooldown) {
    _0x4cfab9.dynamicConfig.userCooldown = 0;
  }
  var _0x519244 = false;
  var _0x395580 = function _0x5663de(_0x5aa05f, _0x1147e4, _0x220328) {
    _0x4cfab9[_0x5aa05f] = _0x1147e4;
    _0x4cfab9.dynamicConfig[_0x5aa05f + "OriginalFilename"] = _0x220328;
    if (!_0x220328) {
      delete _0x4cfab9.dynamicConfig[_0x5aa05f + "OriginalFilename"];
    }
    console.log(_0x4cfab9);
  };
  var _0x460f8a = $("#newActionModal");
  if (!_0x460f8a.length) {
    console.log("create new");
    _0x460f8a = $("<div>").attr("id", "newActionModal");
    $("#pages").append(_0x460f8a);
  }
  var _0x4d5a91 = $("<div>");
  _0x460f8a.append(_0x4d5a91);
  var _0x4fc0fc = $(".newActionTemplate").first().clone();
  if (_0x4cfab9.videoUrl) {
    _0x4fc0fc.find(".youtubeDeprecated").removeClass("hidden");
  }
  var _0x328592 = function _0xa2034a(_0x3ec365) {
    var _0x37cb88;
    var _0x3f74f3;
    if ((_0x37cb88 = window.session) === null || _0x37cb88 === undefined || (_0x3f74f3 = _0x37cb88.me) === null || _0x3f74f3 === undefined || !_0x3f74f3.channelId) {
      return;
    }
    var _0x3b2a30 = utils.getScreenList().find(function (_0x26325d) {
      return _0x26325d.screenId === _0x3ec365;
    })?.statusId > 0;
    var _0x4b7e57 = actionsandevents.getScreenUrl(_0x3ec365);
    _0x4fc0fc.find(".selectedOverlayScreenOfflineWarning").css("display", _0x3b2a30 ? "none" : "block");
    _0x4fc0fc.find(".selectedOverlayScreenOfflineWarningId").text("Screen " + _0x3ec365);
    _0x4fc0fc.find(".selectedOverlayScreenOfflineLink").attr("href", _0x4b7e57);
    _0x4fc0fc.find(".selectedOverlayScreenOfflineLink").text(_0x4b7e57);
  };
  _0x4fc0fc.find(".selectedOverlayScreenOfflineLink").click(function (_0x2b1753) {
    _0x2b1753.preventDefault();
    utils.copyTextToClipboard(_0x4fc0fc.find(".selectedOverlayScreenOfflineLink").first().attr("href"), localization.getString("obsoverlays_widget_copy_success_message"), localization.getString("obsoverlays_widget_copy_success_title"));
  });
  _0x328592(_0x4cfab9.screenId);
  var _0x45eee2 = false;
  var _0x359f37 = null;
  _0x4d5a91.dxPopup({
    width: 650,
    height: utils.getResponsiveDialogHeight(900),
    visible: true,
    title: localization.getString("actionsandevents_actions_create_action"),
    closeOnOutsideClick: true,
    showCloseButton: true,
    showScrollbar: true,
    onShown: function _0x4f1fcf() {
      _0x4fc0fc.find(".actionNameTextbox").dxTextBox("instance").focus();
    },
    onHiding: function _0x8bf80d(_0x11a974) {
      if (_0x45eee2) {
        _0x11a974.cancel = true;
        var _0x2bb536 = DevExpress.ui.dialog.confirm(localization.getString("actionsandevents_save_unchanged_action_text"), localization.getString("actionsandevents_save_unchanged_title"));
        _0x2bb536.done(function (_0x520ec0) {
          if (_0x520ec0) {
            _0x359f37.click();
          } else {
            _0x45eee2 = false;
            _0x4d5a91.dxPopup("instance").hide();
          }
        });
      }
    },
    contentTemplate: function _0x153f3a(_0x7d2861) {
      _0x7d2861.on("click", function () {
        _0x45eee2 = true;
      });
      _0x7d2861.on("keydown", function () {
        _0x45eee2 = true;
      });
      _0x4fc0fc.removeClass("hidden");
      _0x4fc0fc.find(".actionNameTextbox").dxTextBox({
        width: "200px",
        placeholder: localization.getString("actionsandevents_actions_modal_action_name_placeholder"),
        value: _0x4cfab9.name,
        maxLength: 30,
        onValueChanged: function _0x5bd542(_0x1b9cfc) {
          _0x4cfab9.name = _0x1b9cfc.value;
          console.log(_0x4cfab9);
        }
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x4fc0fc.find(".optionCheckbox").dxCheckBox({
        onInitialized: function _0x2f88d9(_0x5e7baf) {
          _0x5e7baf.component.option("text", _0x5e7baf.element.parent().parent().data("checkboxlabel"));
          var _0x806541 = _0x5e7baf.element.parent().parent().data("attribute");
          var _0x48e09c = "action_option_" + _0x806541;
          if (crossconnect.controlIsDisabledByProvider(_0x48e09c) && settings.get("channelId") != 39091914 && !crossconnect.getIsIframed()) {
            _0x5e7baf.component.option("disabled", true);
            _0x5e7baf.disabled = true;
          }
          if (_0x806541 && _0x4cfab9[_0x806541]) {
            _0x5e7baf.component.option("value", true);
            _0x5e7baf.value = true;
          }
          var _0x537b28 = _0x5e7baf.element.parent().parent().find(".hiddenByOptionCheckbox");
          if (_0x5e7baf.value) {
            _0x537b28.show();
          } else {
            _0x537b28.hide();
          }
        },
        onValueChanged: function _0x1612e3(_0x1017e6) {
          var _0x68c1ec = _0x1017e6.element.data("radioid");
          var _0x214067 = _0x1017e6.element.parent().parent().data("attribute");
          var _0x72d785 = _0x1017e6.element.parent().parent().parent().find("[data-radioid='" + _0x68c1ec + "']");
          if (!_0x1017e6.value) {
            var _0xb1ed3c = _0x1017e6.element.parent().parent().find(".actionFileUploader");
            var _0x21f6c6 = _0x1017e6.element.parent().parent().find(".actionNumberBox");
            if (_0xb1ed3c.length) {
              _0xb1ed3c.dxFileUploader("instance").reset();
            }
            if (_0x21f6c6.length) {
              _0x21f6c6.dxNumberBox("instance").option("value", 0);
            }
            if (_0x214067) {
              _0x395580(_0x214067, null, null);
            }
            _0x4fc0fc.find(".animationNameLabel").text("");
          }
          if (_0x1017e6.value) {
            _0x72d785.each(function (_0xe567de, _0x4e4b25) {
              if ($(_0x4e4b25).html() !== _0x1017e6.element.html()) {
                if ($(_0x4e4b25).dxCheckBox("instance").option("value")) {
                  $(_0x4e4b25).dxCheckBox("instance").option("value", false);
                }
              }
            });
            var _0x5ed6f8 = _0x1017e6.element.parent().parent().find(".dx-textbox").first();
            if (_0x5ed6f8 && _0x5ed6f8.length > 0) {
              setTimeout(function () {
                try {
                  _0x5ed6f8.dxTextBox("instance").focus();
                } catch (_0xad811d) {}
              }, 250);
            }
            if (_0x214067 === "mcCmd") {
              var _0x17cef1 = function _0xb77bae() {
                DevExpress.ui.dialog.alert("Could not connect to your Minecraft server.<br>Please check the settings under <b>Setup > Minecraft Connection</b>.", "Minecraft Connection Failed");
              };
              setup.queryMcApi("GET", "v1/server").then(function (_0x1ac624) {
                if (typeof _0x1ac624 !== "object") {
                  _0x17cef1();
                }
              }).catch(_0x17cef1);
            }
            if (_0x214067 === "message") {
              if (!chatbot.chatAllowed() || !chatbot.inputValues.checkboxEnableChatbot) {
                DevExpress.ui.dialog.alert("The chatbot is currently not set up.<br>Please go to the chatbot settings on the left menu to activate the chatbot.", "Chatbot Setup required");
              }
            }
            if (_0x214067 === "thirdPartyAction") {
              _0x3aa15f();
            }
          }
          var _0x504a24 = _0x1017e6.element.parent().parent().find(".hiddenByOptionCheckbox");
          if (_0x1017e6.value) {
            _0x504a24.show(200);
          } else {
            _0x504a24.hide(200);
          }
        }
      });
      if (_0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.animationUrlOriginalFilename) {
        _0x4fc0fc.find(".animationNameLabel").text(_0x4cfab9.dynamicConfig.animationUrlOriginalFilename);
      }
      if (_0x4cfab9.keystrokes) {
        _0x4fc0fc.find(".keystrokeLabel").text(_0x4cfab9.keystrokes.substring(0, 70) + (_0x4cfab9.keystrokes.length > 70 ? "..." : ""));
      }
      _0x4fc0fc.find(".animationChooseButton").dxButton({
        text: localization.getString("actionsandevents_actions_modal_option_show_animation_select"),
        onClick: function _0x4d9f4a() {
          actionsandevents.openAnimationChooser(function (_0x360b7c) {
            var _0x144b95 = actionsandevents.getAnimationNameFromPath(_0x360b7c);
            _0x395580("animationUrl", _0x360b7c, _0x144b95);
            _0x4fc0fc.find(".animationNameLabel").text(_0x144b95);
          });
        }
      });
      _0x4fc0fc.find(".actionFileUploader").css("margin-top", "-15px");
      _0x4fc0fc.find(".actionFileUploader").dxFileUploader({
        multiple: false,
        name: "mediaFile",
        uploadMode: "instantly",
        maxFileSize: 52428800,
        uploadUrl: window.appConfig.apiBasePath + "uploadMedia",
        onValueChanged: function _0x1eb562(_0x30c42e) {
          var _0x1e1c04 = _0x30c42e.value;
          if (!_0x1e1c04.length) {
            var _0x15e0cb = _0x30c42e.element.parent().parent().data("attribute");
            if (_0x15e0cb) {
              _0x395580(_0x15e0cb, null, null);
            }
          }
        },
        onUploaded: function _0x55237b(_0x1f8b96) {
          var _0x460515 = JSON.parse(_0x1f8b96.request.responseText);
          var _0x12ea16 = _0x1f8b96.element.parent().parent().data("attribute");
          _0x395580(_0x12ea16, _0x460515.url, _0x1f8b96.file.name);
          _0x519244 = false;
        },
        onBeforeSend: function _0x23e0fb(_0x286fcf) {
          api.addAuthHeader(_0x286fcf.request);
          _0x519244 = true;
        },
        onUploadError: function _0x1e2f24(_0x4a51d2) {
          var _0x3c4b54 = "Upload failed";
          if (_0x4a51d2.error.status) {
            _0x3c4b54 = "Error " + _0x4a51d2.error.status;
          }
          if (_0x4a51d2.error.responseText) {
            _0x3c4b54 = JSON.parse(_0x4a51d2.error.responseText).message;
          }
          _0x519244 = false;
          if (!window.session || !window.session.channel) {
            toastr.error("Setup > Login or register", "Login required");
          } else {
            toastr.error(_0x3c4b54, "Upload failed");
          }
          setTimeout(function () {
            _0x4a51d2.element.find(".dx-fileuploader-file-status-message").text(_0x3c4b54);
          }, 500);
        },
        onContentReady: function _0x16920e(_0x3806b4) {
          _0x3806b4.component.option("accept", _0x3806b4.element.data("accept"));
          var _0x208be9 = _0x3806b4.element.parent().parent().data("attribute");
          if (_0x4cfab9[_0x208be9] && _0x4cfab9.dynamicConfig[_0x208be9 + "OriginalFilename"]) {
            _0x3806b4.component.option("value", [new File([], "")]);
            var _0x2ea12a = _0x3806b4.element.find(".dx-fileuploader-file");
            _0x2ea12a.empty();
            _0x2ea12a.append($("<div class=\"dx-fileuploader-file-info\"><div class=\"dx-fileuploader-file-name\" style=\"max-width: 238.389px;\"></div></div>").find(".dx-fileuploader-file-name").text(_0x4cfab9.dynamicConfig[_0x208be9 + "OriginalFilename"]));
          }
        }
      });
      _0x4fc0fc.find(".actionSoundLibraryButton").dxButton({
        text: "Open Sound Library",
        onClick: function _0x4e4804() {
          soundlibrary.openPopup(function (_0xb9c99e) {
            if (_0xb9c99e) {
              _0x4fc0fc.find(".actionFileUploader.actionSoundFileUploader").last().dxFileUploader("instance").option("value", [new File([_0xb9c99e.name], _0xb9c99e.name, {
                type: "audio/mp3"
              })]);
              _0x4fc0fc.find(".actionFileUploader.actionSoundFileUploader").last().find(".dx-fileuploader-file-size").text("");
              _0x4fc0fc.find(".actionFileUploader.actionSoundFileUploader").last().find(".dx-fileuploader-file-status-message").text("Imported from Myinstants.com");
              _0x395580("audioUrl", _0xb9c99e.url, _0xb9c99e.name);
            }
          });
        }
      });
      _0x4fc0fc.find(".actionYouTubeUrl").dxTextBox({
        placeholder: "YouTube URL (https://www.youtube.com/watch?v=...)",
        onInitialized: function _0x22b0c5(_0x973b29) {
          var _0x244e52 = _0x973b29.element.parent().parent().data("attribute");
          var _0x45dd3e = _0x4cfab9[_0x244e52];
          _0x973b29.component.option("value", _0x45dd3e);
        },
        onValueChanged: function _0x6252c8(_0x5e80e5) {
          var _0x171399 = _0x5e80e5.element.parent().parent().data("attribute");
          _0x395580(_0x171399, _0x5e80e5.value, null);
        }
      });
      _0x4fc0fc.find(".actionText").dxTextBox({
        width: "329px",
        placeholder: "e.g. Thanks for {giftname}!",
        maxLength: 200,
        onInitialized: function _0x3791e3(_0x3e1dcc) {
          var _0x309615 = _0x3e1dcc.element.parent().parent().data("attribute");
          var _0x2da7c7 = _0x4cfab9[_0x309615];
          _0x3e1dcc.component.option("value", _0x2da7c7);
        },
        onValueChanged: function _0x2f2f4c(_0x25701e) {
          var _0x199c8a = _0x25701e.element.parent().parent().data("attribute");
          _0x395580(_0x199c8a, _0x25701e.value, null);
        }
      });
      _0x4fc0fc.find(".actionChatbotText").dxTextBox({
        width: "329px",
        placeholder: "e.g. Welcome to my broadcast!",
        maxLength: 200,
        onInitialized: function _0x2e0e74(_0xac3b75) {
          var _0x354dd8 = _0xac3b75.element.parent().parent().data("attribute");
          var _0x47c65a = _0x4cfab9[_0x354dd8];
          _0xac3b75.component.option("value", _0x47c65a);
        },
        onValueChanged: function _0x172a1e(_0x331be4) {
          var _0xe48dab = _0x331be4.element.parent().parent().data("attribute");
          _0x395580(_0xe48dab, _0x331be4.value, null);
        }
      });
      _0x4fc0fc.find(".actionTextColor").dxColorBox({
        width: "75px",
        onInitialized: function _0x24c5a3(_0x5d9c2a) {
          var _0x4f3771 = _0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.actionTextColor ? _0x4cfab9.dynamicConfig.actionTextColor : "rgb(223, 223, 223)";
          _0x5d9c2a.component.option("value", _0x4f3771);
        },
        onValueChanged: function _0x3f6959(_0xa5fa14) {
          _0x4cfab9.dynamicConfig.actionTextColor = _0xa5fa14.value;
        }
      });
      _0x4fc0fc.find(".actionTextOverlaySettings").dxButton({
        text: localization.getString("actionsandevents_actions_modal_option_play_text_overlay_settings"),
        width: "248px",
        icon: "preferences",
        onClick: function _0x4c761e(_0x13e69e) {
          obsoverlays.openSettings("myactions", obsoverlays.settings.myactions, null);
        }
      });
      _0x4fc0fc.find(".actionTextToSpeech").dxTextBox({
        width: "329px",
        placeholder: "e.g. Welcome {username}!",
        maxLength: 200,
        onInitialized: function _0x5373e9(_0x4dd615) {
          var _0x366d21 = _0x4dd615.element.parent().parent().data("attribute");
          var _0x589ca5 = _0x4cfab9[_0x366d21];
          _0x4dd615.component.option("value", _0x589ca5);
        },
        onValueChanged: function _0x3f956e(_0x23413a) {
          var _0x1ab33b = _0x23413a.element.parent().parent().data("attribute");
          _0x395580(_0x1ab33b, _0x23413a.value, null);
        }
      });
      function _0xec0479() {
        if ((!_0x4cfab9.dynamicConfig.ttsVoice || _0x4cfab9.dynamicConfig.ttsVoice === "default" || _0x4cfab9.dynamicConfig.ttsVoice.startsWith("google_")) && !_0x4cfab9.dynamicConfig.enableRandomVoice) {
          _0x4fc0fc.find(".ttsVoiceSettingsSlider").show(100);
        } else {
          _0x4fc0fc.find(".ttsVoiceSettingsSlider").hide(100);
        }
      }
      function _0x464ac0() {
        var _0x14b905;
        var _0x34f1f4;
        _0x4fc0fc.find(".ttsVoiceUsageHint").html("").css("color", "");
        var _0x45ea24 = _0x4cfab9.dynamicConfig.ttsVoice || tts.currentVoice;
        var _0x50f883 = (_0x14b905 = tts.isLegacyPremiumVoiceId) === null || _0x14b905 === undefined ? undefined : _0x14b905.call(tts, _0x45ea24);
        if ((_0x34f1f4 = window.session) !== null && _0x34f1f4 !== undefined && _0x34f1f4.me && (_0x50f883 || _0x4cfab9.dynamicConfig.enableRandomVoice)) {
          var _0x2732af;
          var _0x33f36a;
          if ((_0x2732af = window.session.me) === null || _0x2732af === undefined || (_0x33f36a = _0x2732af.userFeatures) === null || _0x33f36a === undefined || !_0x33f36a.isPro) {
            if (tts.isOverQuota()) {
              _0x4fc0fc.find(".ttsVoiceUsageHint").html("You have reached your daily quota of free TTS sentences for " + (_0x4cfab9.dynamicConfig.enableRandomVoice ? "random voices" : "the selected voice") + ". Please upgrade to <a onclick=\"setup.scrollToPaymentUi(`TTS_DAILY_QUOTA`, true);\">TikFinity Pro</a> or use the default voice.").css("color", "#ff2a54");
            } else if (_0x4cfab9.dynamicConfig.enableRandomVoice) {
              _0x4fc0fc.find(".ttsVoiceUsageHint").html("Please note that some voices can only be used " + tts.proVoiceUsageCountLimit + " times a day for free. Upgrade to TikFinity Pro to play an unlimited number of TTS sentences.");
            } else {
              _0x4fc0fc.find(".ttsVoiceUsageHint").html("Please note that this voice can only be used " + tts.proVoiceUsageCountLimit + " times a day for free. Upgrade to TikFinity Pro to play an unlimited number of TTS sentences.");
            }
          }
        }
      }
      function _0x19f4ee(_0x332b47, _0x4e3144) {
        return (_0x4e3144 === null || _0x4e3144 === undefined ? undefined : _0x4e3144.find(function (_0x16fe06) {
          return _0x16fe06.id === _0x332b47;
        })?.name) || _0x332b47 || "Default Voice";
      }
      function _0x33a400() {
        if (actionsandevents.ttsTestItem) {
          actionsandevents.ttsTestItem.stop();
          actionsandevents.ttsTestItem = null;
        }
      }
      function _0x591a82(_0x5a6b9e) {
        return _0x578730.apply(this, arguments);
      }
      function _0x578730() {
        _0x578730 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x14921d(_0x417748) {
          var _0x9e7bb8;
          var _0x320b96;
          var _0x151157;
          var _0xd57e39;
          var _0x12cac9;
          var _0x5ca845;
          return _regeneratorRuntime().wrap(function _0x1cef05(_0x38c188) {
            while (1) {
              switch (_0x38c188.prev = _0x38c188.next) {
                case 0:
                  _0x33a400();
                  _0x320b96 = _0x4fc0fc.find(".actionTextToSpeech").dxTextBox("instance").option("value");
                  _0x151157 = _0x4fc0fc.find(".actionTextToSpeechSpeed").dxSlider("instance").option("value");
                  _0xd57e39 = _0x4fc0fc.find(".actionTextToSpeechPitch").dxSlider("instance").option("value");
                  if (_0x4fc0fc.find(".actionTextToSpeechRandomVoice").dxCheckBox("instance").option("value")) {
                    _0x151157 = utils.randomIntFromInterval(30, 70);
                    _0xd57e39 = utils.randomIntFromInterval(20, 80);
                    _0x12cac9 = tts.getVoices(false, false, true);
                    _0x417748 = _0x12cac9[Math.floor(Math.random() * _0x12cac9.length)]?.id;
                  }
                  if (_0x320b96) {
                    _0x38c188.next = 9;
                    break;
                  }
                  _0x4fc0fc.find(".actionTextToSpeech").removeClass("shakeEffect");
                  setTimeout(function () {
                    _0x4fc0fc.find(".actionTextToSpeech").addClass("shakeEffect");
                  }, 100);
                  return _0x38c188.abrupt("return");
                case 9:
                  _0x320b96 = _0x320b96.replaceAll("{", "").replaceAll("}", "");
                  _0x5ca845 = (_0x9e7bb8 = tts.isAiVoiceId) !== null && _0x9e7bb8 !== undefined && _0x9e7bb8.call(tts, _0x417748) ? {} : {
                    requestType: "preview"
                  };
                  actionsandevents.ttsTestItem = new TTSItem(_0x320b96, tts.currentLanguage, _0x151157, _0xd57e39, 0.8, null, _0x417748, _0x5ca845);
                  _0x38c188.next = 14;
                  return actionsandevents.ttsTestItem.play();
                case 14:
                case "end":
                  return _0x38c188.stop();
              }
            }
          }, _0x14921d);
        }));
        return _0x578730.apply(this, arguments);
      }
      function _0x500c6b() {
        var _0x320dd8 = tts.getVoices(true, true, false, false).filter(Boolean);
        var _0x6b2dec = _0x4cfab9.dynamicConfig.ttsVoice || tts.currentVoice || "default";
        var _0x5d8feb = _0x4cfab9.dynamicConfig.ttsVoiceName || "Default Voice";
        var _0x1ce583 = _0x19f4ee(_0x6b2dec, _0x320dd8) || _0x5d8feb;
        var _0x52306a = _0x4fc0fc.find(".actionTextToSpeechVoice").dxTextBox("instance");
        if (_0x52306a === null || _0x52306a === undefined) {
          undefined;
        } else {
          _0x52306a.option("value", _0x1ce583);
        }
      }
      function _0x37d411() {
        var _0x13f1de;
        var _0x256e2a = tts.getVoices(true, true, false, false).filter(Boolean);
        var _0x45d996 = _0x4cfab9.dynamicConfig.ttsVoice || tts.currentVoice || "default";
        var _0x1bc985 = _0x4d5a91 === null || _0x4d5a91 === undefined ? undefined : (_0x13f1de = _0x4d5a91.dxPopup) === null || _0x13f1de === undefined ? undefined : _0x13f1de.call(_0x4d5a91, "instance");
        if (actionsandevents.ttsVoicePickerModalApp) {
          var _0x756ed4;
          var _0x281644;
          var _0x31a30f;
          if ((_0x756ed4 = window.ui) === null || _0x756ed4 === undefined) {
            undefined;
          } else if ((_0x281644 = _0x756ed4.modal) === null || _0x281644 === undefined) {
            undefined;
          } else if ((_0x31a30f = _0x281644.closeModal) === null || _0x31a30f === undefined) {
            undefined;
          } else {
            _0x31a30f.call(_0x281644, "actionTtsVoicePickerModal");
          }
        }
        if (_0x1bc985 === null || _0x1bc985 === undefined) {
          undefined;
        } else {
          _0x1bc985.option("closeOnOutsideClick", false);
        }
        renderModal({
          name: "actionTtsVoicePickerModal",
          closeOnEsc: true,
          padding: "0",
          width: "520px",
          height: "auto",
          body: "<div id='action-tts-voice-picker-modal-app' class='tw-preflight relative'></div>",
          onClose: function _0xe486ff() {
            _0x33a400();
            if (_0x1bc985 === null || _0x1bc985 === undefined) {
              undefined;
            } else {
              _0x1bc985.option("closeOnOutsideClick", true);
            }
            if (actionsandevents.ttsVoicePickerModalApp) {
              actionsandevents.ttsVoicePickerModalApp.unmount();
              actionsandevents.ttsVoicePickerModalApp = null;
            }
          }
        });
        var _0x5c8d2a = document.querySelector("#action-tts-voice-picker-modal-app");
        if (!_0x5c8d2a || !window.createTtsVoicePickerModal) {
          var _0x587796;
          var _0x94b533;
          var _0x580cad;
          if (_0x1bc985 === null || _0x1bc985 === undefined) {
            undefined;
          } else {
            _0x1bc985.option("closeOnOutsideClick", true);
          }
          if ((_0x587796 = window.ui) === null || _0x587796 === undefined) {
            undefined;
          } else if ((_0x94b533 = _0x587796.modal) === null || _0x94b533 === undefined) {
            undefined;
          } else if ((_0x580cad = _0x94b533.closeModal) === null || _0x580cad === undefined) {
            undefined;
          } else {
            _0x580cad.call(_0x94b533, "actionTtsVoicePickerModal");
          }
          utils.showError("TTS Voice Picker", "Failed to open voice picker modal.");
          return;
        }
        tts.loadAiVoiceState().catch(function () {});
        actionsandevents.ttsVoicePickerModalApp = window.createTtsVoicePickerModal({
          voices: _0x256e2a,
          includeRandomVoice: false,
          selectedVoiceId: _0x45d996,
          onSelect: function _0xe1e213(_0x473ce8) {
            var _0x3dc4e7;
            var _0x2b888a;
            var _0x1230e9;
            var _0x479cdb = _0x256e2a.find(function (_0x4335ff) {
              return _0x4335ff.id === _0x473ce8;
            });
            _0x4cfab9.dynamicConfig.ttsVoice = _0x473ce8;
            _0x4cfab9.dynamicConfig.ttsVoiceName = _0x479cdb?.name || _0x473ce8;
            _0x500c6b();
            _0x464ac0();
            _0xec0479();
            if ((_0x3dc4e7 = window.ui) === null || _0x3dc4e7 === undefined) {
              undefined;
            } else if ((_0x2b888a = _0x3dc4e7.modal) === null || _0x2b888a === undefined) {
              undefined;
            } else if ((_0x1230e9 = _0x2b888a.closeModal) === null || _0x1230e9 === undefined) {
              undefined;
            } else {
              _0x1230e9.call(_0x2b888a, "actionTtsVoicePickerModal");
            }
          },
          onTest: function _0xcd219b(_0x1768b6) {
            return _0x591a82(_0x1768b6);
          },
          onStopTest: function _0x1a7578() {
            _0x33a400();
          }
        });
        actionsandevents.ttsVoicePickerModalApp.mount(_0x5c8d2a);
      }
      _0x4fc0fc.find(".actionTextToSpeechVoice").dxTextBox({
        width: "280px",
        readOnly: true,
        inputAttr: {
          style: "cursor:pointer;"
        },
        buttons: [{
          name: "voice-picker",
          location: "after",
          options: {
            icon: "chevrondown",
            stylingMode: "text",
            onClick: function _0x1ce759() {
              return _0x37d411();
            }
          }
        }],
        onInitialized: function _0x1581a0(_0x409b64) {
          var _0x52a568 = _0x4cfab9.dynamicConfig.ttsVoice || tts.currentVoice;
          _0x4cfab9.dynamicConfig.ttsVoice = _0x52a568;
          _0x500c6b();
          _0x464ac0();
          _0xec0479();
          _0x409b64.component.element().off("click.actionTtsVoicePicker").on("click.actionTtsVoicePicker", function () {
            _0x37d411();
          });
        }
      });
      _0x4fc0fc.find(".actionTextToSpeechSpeed").dxSlider({
        min: 1,
        max: 100,
        step: 1,
        width: "280px",
        disabled: _0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.enableRandomVoice,
        onInitialized: function _0x1031b9(_0x175b7c) {
          var _0x5a30ef = _0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.ttsSpeed ? _0x4cfab9.dynamicConfig.ttsSpeed : 50;
          _0x175b7c.component.option("value", _0x5a30ef);
        },
        onValueChanged: function _0x131bc1(_0x5cb44a) {
          _0x4cfab9.dynamicConfig.ttsSpeed = _0x5cb44a.value;
        }
      });
      _0x4fc0fc.find(".actionTextToSpeechPitch").dxSlider({
        min: 1,
        max: 100,
        step: 1,
        width: "280px",
        disabled: _0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.enableRandomVoice,
        onInitialized: function _0x3e789e(_0x1a3e62) {
          var _0x5cc46e = _0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.ttsPitch ? _0x4cfab9.dynamicConfig.ttsPitch : 50;
          _0x1a3e62.component.option("value", _0x5cc46e);
        },
        onValueChanged: function _0x5e80f3(_0xd9f8e1) {
          _0x4cfab9.dynamicConfig.ttsPitch = _0xd9f8e1.value;
        }
      });
      _0x4fc0fc.find(".actionTextToSpeechRandomVoice").dxCheckBox({
        text: "Random Voice",
        onInitialized: function _0x287afd(_0x5de9ba) {
          var _0x283ca8 = _0x4cfab9.dynamicConfig && _0x4cfab9.dynamicConfig.enableRandomVoice ? _0x4cfab9.dynamicConfig.enableRandomVoice : false;
          _0x5de9ba.component.option("value", _0x283ca8);
        },
        onValueChanged: function _0xef8e86(_0xd88c48) {
          _0x4cfab9.dynamicConfig.enableRandomVoice = _0xd88c48.value;
          _0x4fc0fc.find(".actionTextToSpeechSpeed").dxSlider("instance").option("disabled", _0xd88c48.value);
          _0x4fc0fc.find(".actionTextToSpeechPitch").dxSlider("instance").option("disabled", _0xd88c48.value);
          _0x464ac0();
          _0xec0479();
        }
      });
      _0x4fc0fc.find(".actionTextToSpeechTestButton").dxButton({
        text: "Test",
        icon: "chevronright",
        onClick: function _0x151610() {
          var _0x1c524f = _0x4cfab9.dynamicConfig.ttsVoice || tts.currentVoice || "default";
          _0x591a82(_0x1c524f).catch(function () {
            utils.showError("TTS Error", "Voice or Language not supported!");
          });
        }
      });
      _0x4fc0fc.find(".actionWebhookUrl").dxTextBox({
        placeholder: "WebHook URL (https://maker.ifttt.com/trigger/...)",
        onInitialized: function _0x85c276(_0x417ae4) {
          var _0x443005 = _0x417ae4.element.parent().parent().data("attribute");
          var _0x14e679 = _0x4cfab9[_0x443005];
          _0x417ae4.component.option("value", _0x14e679);
        },
        onValueChanged: function _0x3131a2(_0x46b1f3) {
          var _0x14fa8a = _0x46b1f3.element.parent().parent().data("attribute");
          _0x395580(_0x14fa8a, _0x46b1f3.value, null);
        }
      });
      _0x4fc0fc.find(".actionMcCmd").dxTextArea({
        placeholder: "or enter your commands here (without slash)",
        height: 90,
        valueChangeEvent: "keyup",
        onInitialized: function _0x5d9282(_0x236bb2) {
          var _0x222dec;
          var _0x31200d = _0x236bb2.element.parent().parent().data("attribute");
          var _0x5df2e5 = _0x4cfab9[_0x31200d];
          if (!_0x5df2e5 && (_0x222dec = _0x4cfab9.dynamicConfig) !== null && _0x222dec !== undefined && _0x222dec.mcCmdTemplate) {
            delete _0x4cfab9.dynamicConfig.mcCmdTemplate;
            delete _0x4cfab9.dynamicConfig.mcCmdTemplateData;
          }
          _0x236bb2.component.option("value", _0x5df2e5);
        },
        onValueChanged: function _0x2a001(_0x285e0d) {
          var _0x17d549;
          var _0x3a095e;
          var _0x40219a;
          var _0x2de21a = _0x285e0d.element.parent().parent().data("attribute");
          _0x395580(_0x2de21a, _0x285e0d.value, null);
          if ((_0x17d549 = _0x4cfab9.dynamicConfig) !== null && _0x17d549 !== undefined && (_0x3a095e = _0x17d549.mcCmdTemplate) !== null && _0x3a095e !== undefined && (_0x40219a = _0x3a095e.info) !== null && _0x40219a !== undefined && _0x40219a.template_text) {
            _0x4cfab9.dynamicConfig.mcCmdTemplate.edited = _0x4cfab9.dynamicConfig.mcCmdTemplate.info.template_text !== _0x285e0d.value;
          }
          actionsandevents.setMcTemplateUi(_0x4cfab9, _0x4fc0fc);
        }
      });
      _0x4fc0fc.find(".keystrokeChooseButton").dxButton({
        text: localization.getString("actionsandevents_actions_modal_option_show_keystroke_select"),
        onClick: function _0x4e3225() {
          if (!window.session.isElectron) {
            return DevExpress.ui.dialog.alert("The keystroke simulation feature is only available via the <a href=\"/app\">TikFinity Desktop App</a>.", "Desktop App required");
          }
          actionsandevents.openKeystrokeConfigurator(_0x4cfab9.keystrokes, function (_0x80fcfe) {
            _0x395580("keystrokes", _0x80fcfe, null);
            _0x4fc0fc.find(".keystrokeLabel").text(_0x80fcfe.substring(0, 70) + (_0x80fcfe.length > 70 ? "..." : ""));
          }, _0x4cfab9.dynamicConfig);
        }
      });
      _0x4fc0fc.find(".buttonMcCommandLibrary").dxButton({
        text: "Import Code from Template",
        icon: "import",
        width: "325px",
        onClick: function _0x56dbea() {
          var _0x185471 = window.open("https://tikblocks.vercel.app/", "_blank");
          window.addEventListener("message", function () {
            var _0x3946df = _asyncToGenerator(_regeneratorRuntime().mark(function _0x1dd99a(_0x39b9e2) {
              var _0x248c73;
              var _0x12ae25;
              var _0x92e054;
              var _0xd2919c;
              var _0x39cae9;
              return _regeneratorRuntime().wrap(function _0x1fa3f0(_0x5a1b95) {
                while (1) {
                  switch (_0x5a1b95.prev = _0x5a1b95.next) {
                    case 0:
                      if (!!_0x185471 && !_0x185471.closed) {
                        _0x5a1b95.next = 2;
                        break;
                      }
                      return _0x5a1b95.abrupt("return");
                    case 2:
                      if (!!_0x39b9e2.data && typeof _0x39b9e2.data === "object" && typeof _0x39b9e2.data.templateId === "string") {
                        _0x5a1b95.next = 4;
                        break;
                      }
                      return _0x5a1b95.abrupt("return");
                    case 4:
                      _0x248c73 = _0x39b9e2.data.templateId;
                      _0x12ae25 = _0x39b9e2.data.templateData;
                      _0x5a1b95.prev = 6;
                      _0x5a1b95.next = 9;
                      return actionsandevents.fetchMcTemplate(_0x248c73);
                    case 9:
                      _0x92e054 = _0x5a1b95.sent;
                      _0x185471.close();
                      _0xd2919c = function _0xc9d7a8() {
                        actionsandevents.updateMcTemplate(_0x248c73, _0x92e054, _0x4cfab9, _0x4fc0fc, _0x12ae25);
                      };
                      if (_0x4cfab9.mcCmd) {
                        _0x39cae9 = DevExpress.ui.dialog.confirm("Do you really want to replace the existing code with this template?", "Overwrite extisting code");
                        _0x39cae9.done(function (_0x157195) {
                          if (_0x157195) {
                            _0xd2919c();
                          }
                        });
                      } else {
                        _0xd2919c();
                      }
                      _0x5a1b95.next = 19;
                      break;
                    case 15:
                      _0x5a1b95.prev = 15;
                      _0x5a1b95.t0 = _0x5a1b95.catch(6);
                      DevExpress.ui.dialog.alert("Failed to retrieve template data.<br>" + _0x5a1b95.t0.toString(), "Template Import Failed");
                      _0x185471.close();
                    case 19:
                    case "end":
                      return _0x5a1b95.stop();
                  }
                }
              }, _0x1dd99a, null, [[6, 15]]);
            }));
            return function (_0x5263e8) {
              return _0x3946df.apply(this, arguments);
            };
          }());
        }
      });
      actionsandevents.setMcTemplateUi(_0x4cfab9, _0x4fc0fc);
      _0x4fc0fc.find(".mcCmdTemplateUnlink").click(function () {
        var _0x502e0e = DevExpress.ui.dialog.confirm("Do you really want to remove the connection to the template?<br>This will no longer allow automatic updates of the code.<br>The current code remains in place.", "Unlink Template");
        _0x502e0e.done(function (_0x55f8da) {
          if (_0x55f8da) {
            delete _0x4cfab9.dynamicConfig.mcCmdTemplate;
            actionsandevents.setMcTemplateUi(_0x4cfab9, _0x4fc0fc);
          }
        });
      });
      _0x4fc0fc.find(".mcCmdTemplateUpdateLink").click(_asyncToGenerator(_regeneratorRuntime().mark(function _0x413bb9() {
        var _0x553554;
        var _0x4b982c;
        var _0x54885e;
        return _regeneratorRuntime().wrap(function _0x26831d(_0x58ea95) {
          while (1) {
            switch (_0x58ea95.prev = _0x58ea95.next) {
              case 0:
                _0x58ea95.prev = 0;
                _0x553554 = _0x4cfab9.dynamicConfig.mcCmdTemplate.id;
                _0x58ea95.next = 4;
                return actionsandevents.fetchMcTemplate(_0x553554);
              case 4:
                _0x4b982c = _0x58ea95.sent;
                if (_0x4cfab9.dynamicConfig.mcCmdTemplate.info.template_text !== _0x4b982c.template_text) {
                  _0x58ea95.next = 9;
                  break;
                }
                return _0x58ea95.abrupt("return", DevExpress.ui.dialog.alert("Hooray, this template up to date!", "Template Update"));
              case 9:
                _0x54885e = DevExpress.ui.dialog.confirm("There is a new version of the template available.<br>Do you want to update the code?" + (_0x4cfab9.dynamicConfig.mcCmdTemplate.edited ? "<br><br><b>Important:</b> Please keep in mind that all adjustments you<br>made to the code will be overwritten by the new version!" : ""), "Template Update");
                _0x54885e.done(function (_0x135323) {
                  if (_0x135323) {
                    actionsandevents.updateMcTemplate(_0x553554, _0x4b982c, _0x4cfab9, _0x4fc0fc);
                  }
                });
              case 11:
                _0x58ea95.next = 16;
                break;
              case 13:
                _0x58ea95.prev = 13;
                _0x58ea95.t0 = _0x58ea95.catch(0);
                DevExpress.ui.dialog.alert("Failed to retrieve template data.<br>" + _0x58ea95.t0.toString(), "Template Update Failed");
              case 16:
              case "end":
                return _0x58ea95.stop();
            }
          }
        }, _0x413bb9, null, [[0, 13]]);
      })));
      _0x4fc0fc.find(".mcCmdExpandEditor").click(function () {
        actionsandevents.openMcCodeEditor(_0x4cfab9.mcCmd, _0x4cfab9.dynamicConfig?.mcCmdTemplateData, function (_0x222a73) {
          _0x4fc0fc.find(".actionMcCmd").dxTextArea("instance").option("value", _0x222a73);
        });
      });
      var _0x229d06 = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function _0x3fe633(_0xac15d9) {
          return new Promise(function (_0x1f88b, _0x4af5d9) {
            setup.execObsCommand("GetSceneList", null, function (_0xb3b0a3) {
              if (_0xb3b0a3 && _0xb3b0a3.scenes && _0xb3b0a3.scenes.length > 0) {
                _0x1f88b(_0xb3b0a3.scenes);
              } else {
                _0x4af5d9();
              }
            }, function (_0x21e009) {
              DevExpress.ui.dialog.alert(localization.getString("actionsandevents_actions_modal_obs_error"), "OBS Communication Error");
              _0x4af5d9();
            });
          });
        },
        byKey: function _0x17c693(_0x1cf814, _0x462a83) {
          return new Promise(function (_0xcfa5c5, _0x571d95) {
            setup.execObsCommand("GetSceneList", null, function (_0x544cdb) {
              if (_0x544cdb && _0x544cdb.scenes && _0x544cdb.scenes.find(function (_0x1313cb) {
                return _0x1313cb.sceneName === _0x1cf814;
              })) {
                _0xcfa5c5(_0x544cdb.scenes.find(function (_0x3663af) {
                  return _0x3663af.sceneName === _0x1cf814;
                }));
              } else {
                DevExpress.ui.dialog.alert("The last selected OBS scene '" + _0x1cf814 + "' could not be found.<br>It may have been deleted or renamed. Please select the scene again.", "Scene not found");
                _0x571d95();
              }
            }, function (_0x3b5c21) {
              _0x571d95();
            });
          });
        }
      });
      var _0xa9e2ca = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function _0x34be3e(_0x3760bd) {
          return new Promise(function (_0x43d572, _0x9138e2) {
            actionsandevents.loadAllObsSources().then(function (_0x191f49) {
              _0x43d572(_0x191f49);
            }).catch(function (_0x579342) {
              DevExpress.ui.dialog.alert(localization.getString("actionsandevents_actions_modal_obs_error"), "OBS Communication Error");
              _0x9138e2();
            });
          });
        },
        byKey: function _0x16ed77(_0x43293a, _0x4f1cb1) {
          return new Promise(function (_0xe2f381, _0x53f5d1) {
            actionsandevents.loadAllObsSources().then(function (_0x2df4db) {
              var _0x3a7375 = _0x2df4db.find(function (_0x540fdd) {
                return _0x540fdd.id === _0x43293a;
              });
              if (_0x3a7375) {
                _0xe2f381(_0x3a7375);
              } else {
                DevExpress.ui.dialog.alert("The last selected OBS source '" + _0x43293a + "' could not be found.<br>It may have been deleted or renamed. Please select the source again.", "Source not found");
                _0x53f5d1();
              }
            }).catch(function (_0x4bdd50) {
              DevExpress.ui.dialog.alert(localization.getString("actionsandevents_actions_modal_obs_error"), "OBS Communication Error");
              _0x53f5d1();
            });
          });
        }
      });
      var _0x4d3759 = new DevExpress.data.DataSource({
        store: _0x229d06,
        paginate: false
      });
      var _0x246663 = new DevExpress.data.DataSource({
        store: _0xa9e2ca,
        paginate: false
      });
      _0x4fc0fc.find(".actionObsSceneSelect").dxSelectBox({
        width: "289px",
        dataSource: _0x4d3759,
        placeholder: "Select Scene...",
        noDataText: "No scenes available",
        displayExpr: "sceneName",
        valueExpr: "sceneName",
        onInitialized: function _0x3a39d0(_0xd79451) {
          var _0x1dd075 = _0xd79451.element.parent().parent().data("attribute");
          var _0x5669bb = _0x4cfab9[_0x1dd075];
          _0xd79451.component.option("value", _0x5669bb);
        },
        onValueChanged: function _0x2463f2(_0x475d8e) {
          var _0x1e9d63 = _0x475d8e.element.parent().parent().data("attribute");
          _0x395580(_0x1e9d63, _0x475d8e.value, null);
        }
      });
      _0x4fc0fc.find(".actionObsSourceSelect").dxSelectBox({
        width: "329px",
        dataSource: _0x246663,
        placeholder: "Select Source...",
        noDataText: "No sources available",
        displayExpr: "label",
        valueExpr: "id",
        onInitialized: function _0x33b82a(_0x4de4c3) {
          var _0x10ee74 = _0x4de4c3.element.parent().parent().data("attribute");
          var _0x4919e7 = _0x4cfab9[_0x10ee74];
          _0x4de4c3.component.option("value", _0x4919e7);
        },
        onValueChanged: function _0x21d991(_0x40a8ec) {
          var _0x3722c6 = _0x40a8ec.element.parent().parent().data("attribute");
          _0x395580(_0x3722c6, _0x40a8ec.value, null);
          _0x4cfab9.dynamicConfig.obsSourceLabel = _0x40a8ec.component.option("text");
        }
      });
      _0x4fc0fc.find(".actionObsSceneSettingsButton").dxButton({
        icon: "preferences",
        onClick: function _0x383c23() {
          var _0x139b41 = $("#obsSceneSettingsModal");
          if (!_0x139b41.length) {
            _0x139b41 = $("<div>").attr("id", "obsSceneSettingsModal");
            $("#pages").append(_0x139b41);
          }
          _0x139b41.dxPopup({
            width: 400,
            height: 300,
            visible: true,
            title: localization.getString("actionsandevents_actions_modal_obs"),
            closeOnOutsideClick: true,
            showCloseButton: true,
            contentTemplate: function _0x10a38d(_0x525277) {
              _0x525277.append($("<div>").text(localization.getString("actionsandevents_actions_modal_obs_option_behavior")).css("margin-bottom", "15px"));
              var _0x5e4b7e = [{
                id: 1,
                text: localization.getString("actionsandevents_actions_modal_obs_option_behavior_1")
              }, {
                id: 2,
                text: localization.getString("actionsandevents_actions_modal_obs_option_behavior_2")
              }];
              if (!_0x4cfab9.dynamicConfig.obsSceneBehaviorId) {
                _0x4cfab9.dynamicConfig.obsSceneBehaviorId = 1;
              }
              _0x525277.append($("<div>").dxRadioGroup({
                items: _0x5e4b7e,
                value: _0x5e4b7e[_0x4cfab9.dynamicConfig.obsSceneBehaviorId - 1],
                onValueChanged: function _0x399ee5(_0x45057f) {
                  _0x4cfab9.dynamicConfig.obsSceneBehaviorId = _0x45057f.value.id;
                }
              }));
              _0x525277.append($("<div>").addClass("obsBehaviorModalCloseButton").dxButton({
                width: "100px",
                text: "OK",
                onClick: function _0x5e90c7() {
                  _0x139b41.dxPopup("instance").hide();
                }
              }));
            }
          });
        }
      });
      var _0x5a6010 = function _0x3ce79e() {
        DevExpress.ui.dialog.alert(localization.getString("actionsandevents_actions_modal_snapcam_error"), "Snap Camera Communcation Error");
      };
      var _0x5a61ba = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function _0x395c02(_0x1bc6e1) {
          return new Promise(function (_0x5a7dc5, _0x1f59fa) {
            snapcamintegration.getEffects(_0x5a7dc5, function () {
              _0x1f59fa();
              _0x5a6010();
            });
          });
        },
        byKey: function _0xfe5408(_0x46ec0e, _0x100734) {
          return new Promise(function (_0x2c5237, _0x13003c) {
            snapcamintegration.getEffects(function (_0x330724) {
              var _0x593b53 = _0x330724.find(function (_0x5537d1) {
                return _0x5537d1.unlockable_id.toString() === _0x46ec0e.toString();
              });
              if (_0x593b53) {
                _0x2c5237(_0x593b53);
              } else {
                _0x13003c();
              }
            }, function () {
              _0x13003c();
              _0x5a6010();
            });
          });
        }
      });
      var _0x157d4b = new DevExpress.data.DataSource({
        store: _0x5a61ba,
        paginate: false
      });
      _0x4fc0fc.find(".actionSnapCamEffectSelect").dxSelectBox({
        width: "329px",
        dataSource: _0x157d4b,
        placeholder: "Select Effect...",
        noDataText: "No effects available",
        displayExpr: "lens_name",
        valueExpr: "unlockable_id",
        onInitialized: function _0x25e167(_0x5b5af4) {
          var _0x533ac0 = _0x5b5af4.element.parent().parent().data("attribute");
          var _0x132ea9 = _0x4cfab9[_0x533ac0];
          _0x5b5af4.component.option("value", _0x132ea9);
        },
        onValueChanged: function _0x2fa87b(_0x4556f3) {
          var _0x35bf87 = _0x4556f3.element.parent().parent().data("attribute");
          var _0x3a2881 = _0x4556f3.component.option("selectedItem");
          _0x395580(_0x35bf87, _0x4556f3.value, _0x3a2881.lens_name);
        }
      });
      var _0x4dfc35 = false;
      var _0x36ce22 = false;
      var _0x3c75aa = function _0xcd0a02() {
        if (_0x36ce22) {
          return;
        }
        _0x36ce22 = true;
        DevExpress.ui.dialog.alert("\n                    No third-party application seems to be running on port 8832.<br>\n                    Please start the desired application first.<br>\n                    Then reload TikFinity to establish a connection.\n                ", "Not Available");
      };
      var _0x41b04c = function _0x470ff4() {
        return new Promise(function (_0x12b817, _0x59b7d2) {
          _0x3aa15f();
          actionsandevents.doGenericInterfaceRequest("GET", "features/categories").then(_0x12b817, function (_0x2cd0cb) {
            _0x59b7d2(_0x2cd0cb);
            _0x3c75aa();
          });
        });
      };
      var _0x2b91d4 = function _0x5d7d19(_0x838a5f) {
        _0x3aa15f();
        return actionsandevents.doGenericInterfaceRequest("GET", "features/actions", {
          categoryId: _0x838a5f
        });
      };
      var _0x37b412 = null;
      var _0x3aa15f = function _0x3b1d07() {
        if (_0x4dfc35) {
          return;
        }
        _0x4dfc35 = true;
        _0x4fc0fc.find(".tpInfo").html("Connecting...").css("color", "");
        actionsandevents.doGenericInterfaceRequest("GET", "app/info").then(function (_0x440e6d) {
          _0x37b412 = _0x440e6d;
          _0x4fc0fc.find(".tpInfo").html(`
                        Connected with ${(_0x440e6d.name || "Unknown App").replaceAll("<", "")}<br>
                        Version ${(_0x440e6d.version || "0").replaceAll("<", "")} by ${(_0x440e6d.author || "Unknown Author").replaceAll("<", "")}
                    `).css("color", "");
        }).catch(function (_0x50fc65) {
          _0x4dfc35 = false;
          _0x4fc0fc.find(".tpInfo").html("Unable to connect!<br>Check your integration.").css("color", "#e44646");
        });
      };
      var _0x37e7c6 = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: _0x41b04c,
        byKey: function _0x25843d(_0x1ab4db, _0x3267bd) {
          return new Promise(function (_0xc646cd, _0x4ca8d8) {
            _0x41b04c().then(function (_0x2626c8) {
              _0xc646cd(_0x2626c8.find(function (_0x16b79a) {
                return _0x16b79a.categoryId === _0x1ab4db;
              }));
            }).catch(function (_0x328e59) {
              _0x4ca8d8(_0x328e59);
            });
          });
        }
      });
      var _0x3e9ff8 = new DevExpress.data.DataSource({
        store: _0x37e7c6,
        paginate: false
      });
      var _0x4675fa = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function _0x55bfa3() {
          return _0x2b91d4(_0x4fc0fc.find(".tpSelectBoxCategory").dxSelectBox("instance").option("value") || "");
        },
        byKey: function _0x46b626(_0x21484e, _0x5b065d) {
          return new Promise(function (_0x26c7c7, _0x4992ac) {
            _0x2b91d4(_0x4fc0fc.find(".tpSelectBoxCategory").dxSelectBox("instance").option("value")).then(function (_0x446f15) {
              _0x26c7c7(_0x446f15.find(function (_0x260f38) {
                return _0x260f38.actionId === _0x21484e;
              }));
            }).catch(function (_0x520566) {
              _0x4992ac(_0x520566);
            });
          });
        }
      });
      var _0x4a8d37 = new DevExpress.data.DataSource({
        store: _0x4675fa,
        paginate: false
      });
      _0x4fc0fc.find(".tpSelectBoxCategory").dxSelectBox({
        width: "329px",
        dataSource: _0x3e9ff8,
        placeholder: "Select Category",
        noDataText: "Please start a third-party tool",
        displayExpr: "categoryName",
        valueExpr: "categoryId",
        searchEnabled: true,
        onInitialized: function _0x5bf67a(_0x35bd85) {
          var _0x6c96b7 = _0x35bd85.element.parent().parent().data("attribute");
          var _0x254664 = _0x4cfab9[_0x6c96b7];
          _0x35bd85.component.option("value", _0x254664?.categoryId);
        },
        onValueChanged: function _0xffb5f2(_0x40fcf7) {
          _0x4fc0fc.find(".tpSelectBoxAction").dxSelectBox("instance").option("value", null);
          _0x4a8d37.reload();
          var _0x4c3757 = _0x40fcf7.element.parent().parent().data("attribute");
          if (!_0x4cfab9[_0x4c3757]) {
            _0x4cfab9[_0x4c3757] = {};
          }
          _0x4cfab9[_0x4c3757].categoryId = _0x40fcf7.value;
        }
      });
      _0x4fc0fc.find(".tpSelectBoxAction").dxSelectBox({
        width: "329px",
        dataSource: _0x4a8d37,
        placeholder: "Select Action",
        noDataText: "Please select a category above",
        displayExpr: "actionName",
        valueExpr: "actionId",
        searchEnabled: true,
        onInitialized: function _0x523fbd(_0x5af41b) {
          var _0x246cd8 = _0x5af41b.element.parent().parent().data("attribute");
          var _0x3ed85f = _0x4cfab9[_0x246cd8];
          _0x5af41b.component.option("value", _0x3ed85f?.actionId);
        },
        onValueChanged: function _0x451fcd(_0x416676) {
          var _0x774dcd = _0x416676.element.parent().parent().data("attribute");
          if (!_0x416676.value) {
            return;
          }
          _0x395580(_0x774dcd, {
            categoryId: _0x4fc0fc.find(".tpSelectBoxCategory").dxSelectBox("instance").option("value"),
            actionId: _0x416676.value,
            appInfo: _0x37b412 || {},
            label: (_0x37b412?.name || "Third-Party:") + ": " + _0x416676.component.option("selectedItem")?.actionName
          }, null);
        }
      });
      _0x4fc0fc.find(".tpButtonTest").dxButton({
        text: "Test",
        icon: "chevronright",
        width: "120px",
        onClick: function _0xb9548d() {
          var _0x1213b7;
          var _0x36af38;
          if ((_0x1213b7 = _0x4cfab9.thirdPartyAction) === null || _0x1213b7 === undefined || !_0x1213b7.categoryId || (_0x36af38 = _0x4cfab9.thirdPartyAction) === null || _0x36af38 === undefined || !_0x36af38.actionId) {
            return toastr.error("Please select Category and Action");
          }
          actionsandevents.execTpAction(_0x4cfab9.thirdPartyAction.categoryId, _0x4cfab9.thirdPartyAction.actionId, "0", "Testuser123", 0);
        }
      });
      _0x4fc0fc.find(".customGoalSelectboxGoal").dxSelectBox({
        dataSource: actionsandevents.customGoalDataSource,
        valueExpr: "id",
        displayExpr: "name",
        noDataText: "Select Custom Goal...",
        width: "329px",
        value: _0x4cfab9.customGoalConfig?.goalId || "custom1"
      });
      _0x4fc0fc.find(".customGoalSelectboxType").dxSelectBox({
        dataSource: [{
          id: 0,
          name: "Increase Progress by:"
        }, {
          id: 1,
          name: "Decrease Progress by:"
        }, {
          id: 2,
          name: "Set Progress to:"
        }],
        valueExpr: "id",
        displayExpr: "name",
        noDataText: "Select Goal Action...",
        width: "210px",
        value: _0x4cfab9.customGoalConfig?.goalActionId || 0
      });
      _0x4fc0fc.find(".customGoalNumberboxValue").dxNumberBox({
        showSpinButtons: true,
        min: 0,
        max: 10000000,
        value: _0x4cfab9.customGoalConfig?.goalValue || 1
      });
      var _0x12d7a9 = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: actionsandevents.getVoicemodVoicesWithErrorHandling,
        byKey: function () {
          var _0x14f666 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x5eb5c4(_0x3d5b31, _0x213003) {
            var _0x2c83dc;
            return _regeneratorRuntime().wrap(function _0x416abf(_0x10a4fd) {
              while (1) {
                switch (_0x10a4fd.prev = _0x10a4fd.next) {
                  case 0:
                    _0x10a4fd.next = 2;
                    return actionsandevents.getVoicemodVoicesWithErrorHandling();
                  case 2:
                    _0x2c83dc = _0x10a4fd.sent;
                    return _0x10a4fd.abrupt("return", _0x2c83dc.find(function (_0x607308) {
                      return _0x607308.id === _0x3d5b31;
                    }));
                  case 4:
                  case "end":
                    return _0x10a4fd.stop();
                }
              }
            }, _0x5eb5c4);
          }));
          function _0x116686(_0x259097, _0x1f56bc) {
            return _0x14f666.apply(this, arguments);
          }
          return _0x116686;
        }()
      });
      var _0x5d476e = new DevExpress.data.DataSource({
        store: _0x12d7a9,
        paginate: false
      });
      _0x4fc0fc.find(".voicemodVoiceSelectbox").dxSelectBox({
        width: "329px",
        dataSource: _0x5d476e,
        placeholder: "Select Voice",
        noDataText: "Connection Failed",
        displayExpr: "name",
        valueExpr: "id",
        searchEnabled: true,
        onInitialized: function _0xf9cf0b(_0x50049d) {
          var _0x556b3d = _0x50049d.element.parent().parent().data("attribute");
          var _0x407a4c = _0x4cfab9[_0x556b3d];
          _0x50049d.component.option("value", _0x407a4c?.voiceId);
        }
      });
      _0x4fc0fc.find(".voicemodVoiceDurationNumberbox").dxNumberBox({
        width: "236px",
        format: "Keep for #0' Seconds'",
        showSpinButtons: true,
        min: 1,
        max: 100000,
        value: _0x4cfab9.voicemodVoiceConfig?.duration || 10
      });
      _0x4fc0fc.find(".voicemodVoiceTestButton").dxButton({
        text: "Test",
        icon: "chevronright",
        width: "90px",
        onClick: function _0x3cb85e() {
          var _0x33da28 = _0x4fc0fc.find(".voicemodVoiceSelectbox").dxSelectBox("instance").option("value");
          var _0x267772 = _0x4fc0fc.find(".voicemodVoiceDurationNumberbox").dxNumberBox("instance").option("value");
          if (_0x33da28) {
            actionsandevents.setVoicemodVoice(_0x33da28, _0x267772, true, 100, true);
          } else {
            _0x4fc0fc.find(".voicemodVoiceSelectbox").removeClass("shakeEffect");
            setTimeout(function () {
              _0x4fc0fc.find(".voicemodVoiceSelectbox").addClass("shakeEffect");
            }, 100);
          }
        }
      });
      var _0x283efe = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: actionsandevents.getStreamerbotActionsWithErrorHandling,
        byKey: function () {
          var _0x4ea43f = _asyncToGenerator(_regeneratorRuntime().mark(function _0x3926cd(_0x25b66c, _0x4f0cf6) {
            var _0x31ffa4;
            return _regeneratorRuntime().wrap(function _0x12da64(_0x2b8b9b) {
              while (1) {
                switch (_0x2b8b9b.prev = _0x2b8b9b.next) {
                  case 0:
                    _0x2b8b9b.next = 2;
                    return actionsandevents.getStreamerbotActionsWithErrorHandling();
                  case 2:
                    _0x31ffa4 = _0x2b8b9b.sent;
                    return _0x2b8b9b.abrupt("return", _0x31ffa4.find(function (_0x2979d5) {
                      return _0x2979d5.id === _0x25b66c;
                    }));
                  case 4:
                  case "end":
                    return _0x2b8b9b.stop();
                }
              }
            }, _0x3926cd);
          }));
          function _0x2e1399(_0x426228, _0x370c47) {
            return _0x4ea43f.apply(this, arguments);
          }
          return _0x2e1399;
        }()
      });
      var _0x1104c2 = new DevExpress.data.DataSource({
        store: _0x283efe,
        paginate: false
      });
      _0x4fc0fc.find(".streamerbotActionSelectbox").dxSelectBox({
        width: "329px",
        dataSource: _0x1104c2,
        placeholder: "Select Action",
        noDataText: "Connection Failed",
        displayExpr: "name",
        valueExpr: "id",
        searchEnabled: true,
        onInitialized: function _0x148902(_0x1127f0) {
          var _0x5586ea = _0x1127f0.element.parent().parent().data("attribute");
          var _0x43dcdb = _0x4cfab9[_0x5586ea];
          _0x1127f0.component.option("value", _0x43dcdb);
        },
        onValueChanged: function _0x238a4e(_0x591980) {
          var _0x5801e5 = _0x591980.element.parent().parent().data("attribute");
          var _0xcba76 = _0x591980.component.option("selectedItem");
          _0x395580(_0x5801e5, _0x591980.value, _0xcba76.name);
        }
      });
      _0x4fc0fc.find(".timerControlSecondsNumberbox").dxNumberBox({
        width: "329px",
        showSpinButtons: true,
        min: -10000000,
        max: 10000000,
        format: "#0.0' Seconds'",
        step: 1,
        onInitialized: function _0xda827(_0x39d789) {
          var _0x34e0ab = _0x39d789.element.parent().parent().data("attribute");
          var _0x39db4a = _0x4cfab9[_0x34e0ab] || 0;
          _0x39d789.component.option("value", _0x39db4a);
        },
        onValueChanged: function _0xea94ff(_0x375292) {
          var _0x7d4599 = _0x375292.element.parent().parent().data("attribute");
          _0x395580(_0x7d4599, _0x375292.value || null, null);
        }
      });
      _0x4fc0fc.find(".actionViewDuration").dxNumberBox({
        width: "78%",
        min: 1,
        max: 1000,
        showSpinButtons: true,
        onInitialized: function _0xce35b6(_0x50ddcb) {
          var _0x1ce53b = _0x50ddcb.element.parent().parent().data("attribute");
          var _0x3c1747 = _0x4cfab9[_0x1ce53b];
          _0x50ddcb.component.option("value", _0x3c1747);
        },
        onValueChanged: function _0x71fe1e(_0x2285a2) {
          var _0x1cf184 = _0x2285a2.element.parent().parent().data("attribute");
          _0x395580(_0x1cf184, _0x2285a2.value, null);
        }
      });
      _0x4fc0fc.find(".actionNumberBox").dxNumberBox({
        width: "150px",
        value: 0,
        min: 0,
        max: 99999999,
        showSpinButtons: true,
        onContentReady: function _0x3119b2(_0x3232a0) {
          var _0x2a6bf3 = _0x3232a0.element.parent().parent().data("attribute");
          var _0x44d704 = _0x4cfab9[_0x2a6bf3];
          if (_0x44d704) {
            _0x3232a0.component.option("value", _0x44d704);
          }
        },
        onValueChanged: function _0x4741e4(_0x30d4ae) {
          var _0x34c905 = _0x30d4ae.element.parent().parent().data("attribute");
          _0x395580(_0x34c905, _0x30d4ae.value, null);
        }
      });
      _0x4fc0fc.find(".mediaSoundVolume").dxSlider({
        width: "80%",
        min: 1,
        max: 100,
        value: _0x4cfab9.dynamicConfig.mediaSoundVolume,
        onValueChanged: function _0x1ee1d6(_0x32bae1) {
          _0x4cfab9.dynamicConfig.mediaSoundVolume = _0x32bae1.value;
        }
      });
      _0x4fc0fc.find(".screenSelect").dxSelectBox({
        width: "78%",
        items: utils.getScreenList(),
        value: _0x4cfab9.screenId,
        displayExpr: "screenName",
        valueExpr: "screenId",
        onValueChanged: function _0x2db530(_0x57e3d1) {
          _0x4cfab9.screenId = _0x57e3d1.value;
          _0x328592(_0x57e3d1.value);
        }
      });
      _0x4fc0fc.find(".cooldownTextbox").dxNumberBox({
        width: "78%",
        value: _0x4cfab9.dynamicConfig.cooldown,
        min: 0,
        max: 999999,
        step: 10,
        showSpinButtons: true,
        format: "#0' Seconds'",
        onValueChanged: function _0x51ae7c(_0x455030) {
          _0x4cfab9.dynamicConfig.cooldown = _0x455030.value;
        }
      });
      _0x4fc0fc.find(".cooldownUserTextbox").dxNumberBox({
        width: "78%",
        value: _0x4cfab9.dynamicConfig.userCooldown,
        min: 0,
        max: 999999,
        step: 10,
        showSpinButtons: true,
        format: "#0' Seconds'",
        onValueChanged: function _0x39a18b(_0x26d087) {
          _0x4cfab9.dynamicConfig.userCooldown = _0x26d087.value;
        }
      });
      _0x4fc0fc.find(".enableFadeEffect").dxCheckBox({
        value: _0x4cfab9.enableFadeEffect,
        onValueChanged: function _0x55def3(_0x1c15ae) {
          _0x4cfab9.enableFadeEffect = _0x1c15ae.value;
        }
      });
      _0x4fc0fc.find(".enableStreakRepeat").dxCheckBox({
        value: _0x4cfab9.dynamicConfig.enableStreaks,
        onValueChanged: function _0xdc3826(_0x5ed9ec) {
          _0x4cfab9.dynamicConfig.enableStreaks = _0x5ed9ec.value;
        }
      });
      _0x4fc0fc.find(".enableSkipOnNext").dxCheckBox({
        value: _0x4cfab9.dynamicConfig.skipOnNext,
        onValueChanged: function _0x1d0de4(_0x17b9e1) {
          _0x4cfab9.dynamicConfig.skipOnNext = _0x17b9e1.value;
        }
      });
      _0x359f37 = _0x4fc0fc.find(".actionSaveButton").dxButton({
        width: "190px",
        text: localization.getString("dialog_save"),
        icon: "check",
        onClick: function _0x50fe20(_0x492b07) {
          var _0x276afd;
          var _0x445f24;
          if (!_0x4cfab9.name) {
            toastr.warning("please enter a name.", "Action Name");
            _0x4fc0fc.find(".actionNameTextbox").dxValidator("instance").validate();
            scrollView.dxScrollView("instance").scrollTo(0);
            return;
          }
          if (_0x519244) {
            toastr.warning("Please wait some seconds...", "Upload in progress");
            scrollView.dxScrollView("instance").scrollTo(0);
            return;
          }
          if (actionsandevents.actions.find(function (_0x1e6be2) {
            return _0x1e6be2.id !== _0x4cfab9.id && _0x1e6be2.name.trim().toLowerCase() === _0x4cfab9.name.trim().toLowerCase();
          })) {
            _0x4fc0fc.find(".actionNameExistsError").removeClass("hidden");
            scrollView.dxScrollView("instance").scrollTo(0);
            return;
          }
          if (!_0x4cfab9.amountToAdd) {
            _0x4cfab9.amountToAdd = 0;
          }
          if (_0x4cfab9.amountToRemove) {
            _0x4cfab9.amountToAdd = _0x4cfab9.amountToRemove * -1;
            delete _0x4cfab9.amountToRemove;
          }
          if (!_0x4cfab9.videoUrl && _0x4cfab9.videoFile) {
            _0x4cfab9.videoUrl = _0x4cfab9.videoFile;
            delete _0x4cfab9.videoFile;
          }
          if (_0x4fc0fc.find("[data-attribute=\"customGoalConfig\"]").find(".optionCheckbox").dxCheckBox("instance").option("value")) {
            _0x4cfab9.customGoalConfig = {
              goalId: _0x4fc0fc.find(".customGoalSelectboxGoal").dxSelectBox("instance").option("value"),
              goalActionId: _0x4fc0fc.find(".customGoalSelectboxType").dxSelectBox("instance").option("value"),
              goalValue: _0x4fc0fc.find(".customGoalNumberboxValue").dxNumberBox("instance").option("value")
            };
          }
          if (_0x4fc0fc.find("[data-attribute=\"voicemodVoiceConfig\"]").find(".optionCheckbox").dxCheckBox("instance").option("value") && _0x4fc0fc.find(".voicemodVoiceSelectbox").dxSelectBox("instance").option("value")) {
            _0x4cfab9.voicemodVoiceConfig = {
              voiceId: _0x4fc0fc.find(".voicemodVoiceSelectbox").dxSelectBox("instance").option("value"),
              voiceName: _0x4fc0fc.find(".voicemodVoiceSelectbox").dxSelectBox("instance").option("selectedItem")?.name || _0x4cfab9.voicemodVoiceConfig?.voiceName,
              duration: _0x4fc0fc.find(".voicemodVoiceDurationNumberbox").dxNumberBox("instance").option("value")
            };
          }
          _0x4cfab9.profileId = ((_0x276afd = window.session) === null || _0x276afd === undefined ? undefined : (_0x445f24 = _0x276afd.me) === null || _0x445f24 === undefined ? undefined : _0x445f24.channel?.profileId) || 1;
          _0x492b07.component.option("disabled", true);
          actionsandevents.saveActionForm(_0x4cfab9, function (_0x5c1739) {
            _0x45eee2 = false;
            _0x4d5a91.dxPopup("instance").hide();
            _0x7db69(_0x5c1739);
          }, function () {
            _0x492b07.component.option("disabled", false);
          });
        }
      });
      _0x4fc0fc.find(".actionCancelButton").dxButton({
        width: "190px",
        text: localization.getString("dialog_cancel"),
        icon: "close",
        onClick: function _0x5a86d6() {
          _0x45eee2 = false;
          _0x4d5a91.dxPopup("instance").hide();
        }
      });
      scrollView = $("<div>");
      scrollView.append(_0x4fc0fc);
      scrollView.dxScrollView({
        width: "100%",
        height: "100%",
        direction: "vertical",
        showScrollbar: "always"
      });
      _0x7d2861.append(scrollView);
    }
  });
};
actionsandevents.saveActionForm = function (_0x4f3447, _0x1cee25, _0x38738b) {
  if (_0x4f3447.id) {
    api.doAction("PATCH", "rest/action/" + _0x4f3447.id, _0x4f3447, function (_0x2df074) {
      _0x1cee25(_0x2df074.action);
      toastr.success(null, localization.getString("actionsandevents_saved_action"));
    }, function () {
      _0x38738b();
    });
  } else {
    api.doAction("PUT", "rest/action", _0x4f3447, function (_0x31a08d) {
      _0x1cee25(_0x31a08d.action);
      toastr.success(null, localization.getString("actionsandevents_saved_action"));
    }, function () {
      _0x38738b();
    });
  }
  console.log("save", window.testItem);
};
actionsandevents.getActionById = function (_0x209dd2, _0xcd54a5) {
  api.get("rest/action/" + _0x209dd2, null, function (_0x429393) {
    _0xcd54a5(_0x429393.record);
  }, function (_0x1a4ef4, _0x149ec7) {
    if (_0x1a4ef4 === 404) {
      _0xcd54a5(null);
    }
  });
};
actionsandevents.executeActionsFromEvent = function () {
  var _0x382dc3 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x2ee564(_0x493a64, _0x380daa, _0x913a0a, _0x3bcc83, _0x412f6b, _0x2b70f3, _0x5c3286, _0x20b0e4, _0x46e68c, _0x21857b, _0x15637b, _0x2b56d4, _0x581c1b, _0x773562, _0x5f4362, _0x40b4a5, _0xcc50eb) {
    var _0x5f59fe;
    var _0x56b1da;
    var _0x20ce7d;
    var _0x3bdd2d;
    return _regeneratorRuntime().wrap(function _0x46069c(_0x2b1b6f) {
      while (1) {
        switch (_0x2b1b6f.prev = _0x2b1b6f.next) {
          case 0:
            _0x5f59fe = function _0x3c4494(_0x23eb36) {
              var _0x12e8f7;
              var _0x58c21e;
              var _0xc76c2c = actionsandevents.actions.find(function (_0x2632d8) {
                return _0x2632d8.id === _0x23eb36;
              });
              if (!_0xc76c2c) {
                return false;
              }
              if (!_0x581c1b) {
                return true;
              }
              if (((_0x12e8f7 = _0xc76c2c.dynamicConfig) === null || _0x12e8f7 === undefined || !_0x12e8f7.enableStreaks) && !_0x2b56d4) {
                return true;
              } else if ((_0x58c21e = _0xc76c2c.dynamicConfig) !== null && _0x58c21e !== undefined && _0x58c21e.enableStreaks && _0x2b56d4) {
                return true;
              }
              return false;
            };
            if (_0x493a64.actionId) {
              if (_0x5f59fe(_0x493a64.actionId)) {
                actionsandevents.executeAction(_0x493a64.actionId, _0x380daa, _0x913a0a, _0x3bcc83, _0x412f6b, _0x2b70f3, _0x5c3286, _0x20b0e4, _0x46e68c, _0x21857b, _0x15637b, _0x773562, _0x581c1b, _0x5f4362, _0x40b4a5, _0xcc50eb);
              }
            }
            if (!Array.isArray(_0x493a64.actionIds)) {
              _0x2b1b6f.next = 12;
              break;
            }
            _0x2b1b6f.t0 = _regeneratorRuntime().keys(_0x493a64.actionIds);
          case 4:
            if ((_0x2b1b6f.t1 = _0x2b1b6f.t0()).done) {
              _0x2b1b6f.next = 12;
              break;
            }
            _0x56b1da = _0x2b1b6f.t1.value;
            if (!_0x5f59fe(_0x493a64.actionIds[_0x56b1da])) {
              _0x2b1b6f.next = 10;
              break;
            }
            actionsandevents.executeAction(_0x493a64.actionIds[_0x56b1da], _0x380daa, _0x913a0a, _0x3bcc83, _0x412f6b, _0x2b70f3, _0x5c3286, _0x20b0e4, _0x46e68c, _0x21857b, _0x15637b, _0x773562, _0x581c1b, _0x5f4362, _0x40b4a5, _0xcc50eb);
            _0x2b1b6f.next = 10;
            return utils.sleep(_0x2b56d4 ? 50 : 200);
          case 10:
            _0x2b1b6f.next = 4;
            break;
          case 12:
            if (Array.isArray(_0x493a64.actionRandomIds) && _0x493a64.actionRandomIds.length > 0) {
              _0x20ce7d = _0x493a64.actionRandomIds.filter(function (_0x1f6a6c) {
                return actionsandevents.actions.find(function (_0x1c6ec8) {
                  return _0x1c6ec8.id === _0x1f6a6c;
                });
              });
              if (_0x20ce7d.length > 0) {
                _0x3bdd2d = utils.getSequentialRandomValueFromArray(_0x20ce7d);
                if (_0x5f59fe(_0x3bdd2d)) {
                  actionsandevents.executeAction(_0x3bdd2d, _0x380daa, _0x913a0a, _0x3bcc83, _0x412f6b, _0x2b70f3, _0x5c3286, _0x20b0e4, _0x46e68c, _0x21857b, _0x15637b, _0x773562, _0x581c1b, _0x5f4362, _0x40b4a5, _0xcc50eb);
                }
              }
            }
          case 13:
          case "end":
            return _0x2b1b6f.stop();
        }
      }
    }, _0x2ee564);
  }));
  return function (_0x1c366d, _0x247873, _0x5aab30, _0x30a30a, _0x4aff11, _0x23c891, _0x460c45, _0xb60e1, _0x3084ff, _0x2228d6, _0x5f3479, _0x4ac548, _0x25b816, _0x319606, _0x2bb5ef, _0x4443f6, _0x21dc0e) {
    return _0x382dc3.apply(this, arguments);
  };
}();
actionsandevents.executeAction = function (_0x11afd1, _0x1f19a6, _0x147694, _0x5891a8, _0xf2a1, _0x3856e2, _0x4da7e2, _0x1e3dc4, _0xac05c, _0x287187, _0x417a4f, _0x12ec0d, _0x2ffd71, _0xf0214, _0x5212f9, _0x3d2fca) {
  if (actionsandevents.inputValues.actionsEnabledCheckbox === false) {
    if (_0x5891a8 === "Testuser123" || _0x5891a8 === "Testuser") {
      var _0x1713b6;
      if ((_0x1713b6 = actionsandevents.inputs.actionsEnabledCheckbox) === null || _0x1713b6 === undefined) {
        undefined;
      } else {
        _0x1713b6.option("value", true);
      }
    } else {
      return;
    }
  }
  var _0x1e1afd = actionsandevents.actions.find(function (_0x45d943) {
    return _0x45d943.id === _0x11afd1;
  });
  if (!_0x1e1afd) {
    return;
  }
  if (_0x1e1afd.isTempDisabled) {
    return toastr.error("Please upgrade to TikFinity Pro", "Action Disabled");
  }
  var _0x18a275 = new Date().getTime();
  if (_0x1e1afd.dynamicConfig && _0x1e1afd.dynamicConfig.cooldown > 0) {
    var _0xf2ec74 = actionsandevents.actionsLastExecTs[_0x1e1afd.id];
    var _0x1310f1 = _0x1e1afd.dynamicConfig.cooldown * 1000;
    if (_0xf2ec74 && _0xf2ec74 + _0x1310f1 > _0x18a275) {
      toastr.warning("Action " + _0x1e1afd.name + " (" + _0x1e1afd.dynamicConfig.cooldown + " seconds) triggered by " + _0x5891a8, "Global Cooldown!");
      return false;
    }
  }
  if (_0x1e1afd.dynamicConfig && _0x1e1afd.dynamicConfig.userCooldown > 0 && _0x147694) {
    var _0x1b4fca = actionsandevents.actionsLastUserExecTs[_0x1e1afd.id + "_" + _0x147694];
    var _0xc01eec = _0x1e1afd.dynamicConfig.userCooldown * 1000;
    if (_0x1b4fca && _0x1b4fca + _0xc01eec > _0x18a275) {
      toastr.warning("Action " + _0x1e1afd.name + " (" + _0x1e1afd.dynamicConfig.userCooldown + " seconds) triggered by " + _0x5891a8, "User Cooldown!");
      return false;
    }
  }
  actionsandevents.actionsLastExecTs[_0x1e1afd.id] = _0x18a275;
  actionsandevents.actionsLastUserExecTs[_0x1e1afd.id + "_" + _0x147694] = _0x18a275;
  var _0x4bac39 = _0x1e1afd.imageUrl || _0x1e1afd.audioUrl || _0x1e1afd.videoUrl || _0x1e1afd.animationUrl || _0x1e1afd.text || _0x1e1afd.textToSpeech;
  var _0x43a380 = utils.getScreenList().find(function (_0x245222) {
    return _0x245222.screenId === _0x1e1afd.screenId;
  });
  if (_0x43a380.statusId === 0 && _0x4bac39) {
    console.warn("screen is offline");
    if (!_0x147694) {
      toastr.error(localization.getString("actionsandevents_action_exec_screen_offline_error"));
    }
  }
  var _0x4757bd = function () {
    var _0x1017d7 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x33bbe0() {
      var _0x463755;
      var _0x9a45f4;
      var _0x4b5a73;
      var _0x448065;
      var _0xf048a7;
      var _0x37fd0a;
      var _0x902e0c;
      var _0xfcfd26;
      var _0x9f86ef;
      var _0x10111c;
      var _0x4e06eb;
      var _0x2d0161;
      var _0x85dd8;
      var _0x24ea5d;
      var _0x1a455c;
      var _0x233907;
      var _0x36caa5;
      var _0x40553c;
      var _0x3a4914;
      var _0x550d2b;
      var _0x12a9cb;
      var _0x100b06;
      var _0x932131;
      var _0x4f5a74;
      var _0x28ce48;
      var _0x4a6b53;
      var _0x514145;
      var _0x52be33;
      return _regeneratorRuntime().wrap(function _0x2df075(_0x50c3ef) {
        while (1) {
          switch (_0x50c3ef.prev = _0x50c3ef.next) {
            case 0:
              if (!(_0x43a380.currentQueueSize > _0x43a380.queueSize) || !_0x4bac39) {
                _0x50c3ef.next = 10;
                break;
              }
              console.warn("screen screen.currentQueueSize >= screen.queueSize");
              if (!_0x147694) {
                toastr.warning(localization.getString("actionsandevents_action_exec_queue_limit_warning"));
              }
              if (!_0x147694 || _0x1f19a6 !== 2) {
                _0x50c3ef.next = 9;
                break;
              }
              _0x9a45f4 = chatbot.chatbotSnippets.find(function (_0x832d97) {
                return _0x832d97.id === "ACTION_QUEUE_LIMITATION" && _0x832d97.enabled;
              });
              if (_0x9a45f4) {
                _0x50c3ef.next = 7;
                break;
              }
              return _0x50c3ef.abrupt("return");
            case 7:
              _0x4b5a73 = _0x9a45f4.message.replaceAll("%username%", _0x5891a8);
              chatservice.sendMessage(_0x4b5a73, _0x5891a8, _0x9a45f4.id);
            case 9:
              return _0x50c3ef.abrupt("return");
            case 10:
              if (_0x4bac39) {
                utils.increaseScreenQueueCountTemp(_0x43a380.screenId);
              }
              if (!!actionsandevents.actionExecCounter[_0x11afd1] && !(actionsandevents.actionExecCounter[_0x11afd1] < 50)) {
                _0x50c3ef.next = 39;
                break;
              }
              if (!actionsandevents.actionExecCounter[_0x11afd1]) {
                actionsandevents.actionExecCounter[_0x11afd1] = 0;
              }
              actionsandevents.actionExecCounter[_0x11afd1] += 1;
              _0x902e0c = tts.getVoices(false, false, true);
              _0xfcfd26 = _0x902e0c[Math.floor(Math.random() * _0x902e0c.length)]?.id;
              _0x9f86ef = undefined;
              _0x10111c = ((_0x448065 = _0x1e1afd.dynamicConfig) !== null && _0x448065 !== undefined && _0x448065.enableRandomVoice ? _0xfcfd26 : _0x1e1afd.dynamicConfig?.ttsVoice) || "default";
              _0x4e06eb = (_0xf048a7 = tts.isAiVoiceId) === null || _0xf048a7 === undefined ? undefined : _0xf048a7.call(tts, _0x10111c);
              _0x2d0161 = (_0x37fd0a = tts.isLegacyPremiumVoiceId) === null || _0x37fd0a === undefined ? undefined : _0x37fd0a.call(tts, _0x10111c);
              if (_0x1e1afd.textToSpeech) {
                if (_0x2d0161) {
                  _0x9f86ef = tts.isOverQuota();
                  if (_0x9f86ef) {
                    toastr.error("Please select the default voice or upgrade to TikFinity Pro (Setup -> TikFinity Pro)", "Daily TTS Limit exceeded");
                    setup.createPaymentUi();
                  } else {
                    tts.countUsage();
                  }
                } else if (_0x4e06eb) {
                  _0x9f86ef = (_0x85dd8 = tts.shouldBlockAiGenerate) !== null && _0x85dd8 !== undefined && !!_0x85dd8.call(tts) || (_0x24ea5d = tts.isAiFreeQuotaExceeded) !== null && _0x24ea5d !== undefined && !!_0x24ea5d.call(tts);
                }
              }
              _0x1a455c = {
                userId: _0x147694,
                username: _0x5891a8,
                nickname: _0xf2a1,
                giftData: _0x2ffd71,
                giftName: _0x1e3dc4,
                repeatCount: _0xac05c,
                likeCount: _0x287187,
                totalLikeCount: _0x417a4f,
                subMonth: _0x12ec0d,
                thumbnailUrl: getCachedImageUrl(_0x147694) || _0x3d2fca,
                commandParams: _0x3856e2,
                ttsLanguage: tts.currentLanguage,
                ttsRandomVoice: _0xfcfd26,
                ttsBlocked: _0x9f86ef
              };
              if (!_0x1e1afd.textToSpeech || !_0x4e06eb || !!_0x9f86ef) {
                _0x50c3ef.next = 36;
                break;
              }
              _0x50c3ef.prev = 23;
              _0x233907 = (_0x1e1afd.textToSpeech || "").replaceAll("{username}", _0x5891a8 || "").replaceAll("{nickname}", _0xf2a1 || "").replaceAll("{giftname}", _0x1e3dc4 || "").replaceAll("{coins}", (_0x2ffd71?.value || 0).toLocaleString()).replaceAll("{comment}", _0x3856e2 || "").replaceAll("{repeatcount}", _0xac05c || "").replaceAll("{likecount}", _0x287187 || "").replaceAll("{totallikecount}", _0x417a4f || "").replaceAll("{submonth}", _0x12ec0d || "").replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").trim();
              if (!_0x233907) {
                _0x50c3ef.next = 31;
                break;
              }
              _0x50c3ef.next = 28;
              return window.aiTts.generateAudio(_0x10111c, _0x233907);
            case 28:
              _0x40553c = _0x50c3ef.sent;
              if ((_0x36caa5 = tts.applyAiCreditsFromApiUser) === null || _0x36caa5 === undefined) {
                undefined;
              } else {
                _0x36caa5.call(tts, {
                  user: _0x40553c.user,
                  quota: _0x40553c.quota
                });
              }
              _0x1a455c.ttsAudioUrl = _0x40553c.audioUrl || null;
            case 31:
              _0x50c3ef.next = 36;
              break;
            case 33:
              _0x50c3ef.prev = 33;
              _0x50c3ef.t0 = _0x50c3ef.catch(23);
              console.warn("Failed to pre-generate AI TTS audio for action screen", _0x50c3ef.t0);
            case 36:
              api.doAction("POST", "executeAction", {
                actionId: _0x11afd1,
                context: _0x1a455c
              }, function () {
                if (_0x147694 && _0x147694 !== window.session.channelId && _0x1e1afd.amountToAdd !== 0) {
                  var _0x5b38ba = _0x1e1afd.name.toLowerCase().includes("(level up)");
                  transaction.put(_0x147694, _0x5891a8, _0x1e1afd.amountToAdd, _0x5b38ba, false, "Action '" + _0x1e1afd.name + "'", false, function () {}, function () {});
                }
              }, function () {});
              _0x50c3ef.next = 40;
              break;
            case 39:
              console.warn("actionExecCounter limit exceeded, action:", _0x11afd1);
            case 40:
              if (_0x1e1afd.message) {
                _0x3a4914 = _0x1e1afd.message.replaceAll("{username}", _0x5891a8 || "").replaceAll("{nickname}", _0xf2a1 || "").replaceAll("{giftname}", _0x1e3dc4 || "").replaceAll("{coins}", (_0x2ffd71?.value || 0).toLocaleString()).replaceAll("{comment}", _0x3856e2 || "").replaceAll("{repeatcount}", _0xac05c || "").replaceAll("{likecount}", _0x287187 || "").replaceAll("{totallikecount}", _0x417a4f || "").replaceAll("{submonth}", _0x12ec0d || "");
                if (_0x5891a8) {
                  _0x3a4914 = "@" + _0x5891a8 + " " + _0x3a4914;
                }
                if (!chatbot.inputValues.checkboxEnableChatbot) {
                  toastr.error("Chatbot is disabled. Please enable it in the Chatbot settings.", "Chatbot Disabled");
                }
                chatservice.sendMessage(_0x3a4914, _0x5891a8, "ACTION_MESSAGE");
              }
              if (_0x1e1afd.keystrokes) {
                if (window.session.isElectron) {
                  _0x550d2b = _0x1e1afd.keystrokes.replaceAll("{username}", utils.sanitizeKeystrokePlaceholder(_0x5891a8) || "").replaceAll("{nickname}", utils.sanitizeKeystrokePlaceholder(_0xf2a1) || "").replaceAll("{giftname}", utils.sanitizeKeystrokePlaceholder(_0x1e3dc4) || "").replaceAll("{coins}", _0x2ffd71?.value || 0).replaceAll("{comment}", utils.sanitizeKeystrokePlaceholder(_0x3856e2) || "").replaceAll("{repeatcount}", _0xac05c || "").replaceAll("{likecount}", _0x287187 || "").replaceAll("{totallikecount}", _0x417a4f || "").replaceAll("{submonth}", _0x12ec0d || "");
                  if (_0x5891a8 === "Testuser123") {
                    toastr.warning("The keystrokes are executed in 5 seconds. Please set the focus to the correct application window.", "Keystrokes Pending");
                    setTimeout(function () {
                      API.setAutoItNotInstalledListener(function () {
                        actionsandevents.showAutoItNotInstalledMsg();
                      });
                      if (utils.sendKeys(_0x550d2b, _0x1e1afd.dynamicConfig?.keystrokeCompatibilityModeEnabled, _0x1e1afd.dynamicConfig?.keystrokeKeyHoldDuration, setup.inputValues.checkboxQueueKeystrokes, _0x1e1afd.screenId, 100)) {
                        toastr.success("Keystrokes Executed");
                      }
                    }, 5000);
                  } else {
                    API.setAutoItNotInstalledListener(function () {
                      utils.showError("AutoIt not installed", "In order to simulate Keystrokes you need to install the software \"AutoIt\" on your system. Please download it from https://www.autoitscript.com/");
                    });
                    setTimeout(function () {
                      return utils.sendKeys(_0x550d2b, _0x1e1afd.dynamicConfig?.keystrokeCompatibilityModeEnabled, _0x1e1afd.dynamicConfig?.keystrokeKeyHoldDuration, setup.inputValues.checkboxQueueKeystrokes, _0x1e1afd.screenId, 100);
                    }, 250);
                  }
                } else {
                  utils.showError("Desktop App Required", "You need the TikFinity Desktop app in order to simulate keystrokes!");
                }
              }
              if (_0x1e1afd.webhookUrl) {
                _0x932131 = _0x1e1afd.name;
                if (_0x3856e2) {
                  _0x932131 = _0x3856e2;
                }
                if (!_0x147694) {
                  _0x147694 = 0;
                  _0x5891a8 = "Testuser123";
                  _0x3856e2 = "This is a Test";
                  _0x4da7e2 = 10;
                  _0x932131 = "It works! This is a test.";
                }
                _0x4f5a74 = _0x1e1afd.webhookUrl.replaceAll("{username}", encodeURIComponent(_0x5891a8 || "")).replaceAll("{nickname}", encodeURIComponent(_0xf2a1 || "")).replaceAll("{giftname}", encodeURIComponent(_0x1e3dc4 || "")).replaceAll("{coins}", _0x2ffd71?.value || 0).replaceAll("{comment}", encodeURIComponent(_0x3856e2 || "")).replaceAll("{repeatcount}", _0xac05c || "").replaceAll("{likecount}", _0x287187 || "").replaceAll("{totallikecount}", _0x417a4f || "").replaceAll("{submonth}", _0x12ec0d || "").replaceAll("{emoteId}", _0xf0214 || "").replaceAll("{emoteImageUrl}", _0x5212f9 || "");
                $.post(_0x4f5a74, {
                  value1: _0x5891a8,
                  value2: _0x3856e2,
                  value3: _0x4da7e2,
                  content: _0x932131,
                  avatar_url: getCachedImageUrl(_0x147694),
                  userId: _0x147694,
                  username: _0x5891a8,
                  nickname: _0xf2a1,
                  commandParams: _0x3856e2,
                  giftId: _0x4da7e2,
                  giftName: _0x1e3dc4,
                  coins: _0x2ffd71?.value || undefined,
                  repeatCount: _0xac05c,
                  likeCount: _0x287187,
                  totalLikeCount: _0x417a4f,
                  subMonth: _0x12ec0d,
                  emoteId: _0xf0214,
                  emoteImageUrl: _0x5212f9,
                  triggerTypeId: _0x1f19a6,
                  tikfinityUserId: window.session?.channelId,
                  tikfinityUsername: (_0x12a9cb = window.session) === null || _0x12a9cb === undefined ? undefined : (_0x100b06 = _0x12a9cb.me) === null || _0x100b06 === undefined ? undefined : _0x100b06.channel?.channelName
                });
              }
              if (_0x1e1afd.obsSceneId) {
                actionsandevents.switchSceneActionQueue.push(_0x1e1afd);
                actionsandevents.switchObsSceneQueueProcessor();
              }
              if (_0x1e1afd.obsSourceId) {
                actionsandevents.activateSourceQueue.push(_0x1e1afd);
                actionsandevents.appendToObsSourceQueueProcessor(_0x1e1afd.obsSourceId, _0x1e1afd.duration);
              }
              if (_0x1e1afd.snapCamEffectId) {
                snapcamintegration.setEffect(_0x1e1afd.snapCamEffectId, _0x1e1afd.duration, function (_0x1a6169) {
                  if (_0x1a6169.lensFound === false) {
                    utils.showError("Snap Camera Error", "Effect not favorited.");
                  }
                }, function () {
                  utils.showError("Snap Camera Error", "Failed to apply effect.");
                });
              }
              if (_0x1e1afd.mcCmd) {
                actionsandevents.execMcCmd(_0x1e1afd.mcCmd, _0x5891a8, _0xf2a1, _0x1e3dc4, _0xac05c, _0x287187, _0x417a4f, _0x2ffd71, _0x3856e2, _0x1e1afd.dynamicConfig?.mcCmdTemplateData, _0x12ec0d);
              }
              if (_0x1e1afd.thirdPartyAction && _0x1e1afd.thirdPartyAction.categoryId && _0x1e1afd.thirdPartyAction.actionId) {
                actionsandevents.execTpAction(_0x1e1afd.thirdPartyAction.categoryId, _0x1e1afd.thirdPartyAction.actionId, _0x147694, _0x5891a8, _0x2ffd71?.value || 0, {
                  userId: _0x147694,
                  username: _0x5891a8,
                  nickname: _0xf2a1,
                  profilePicturUrl: getCachedImageUrl(_0x147694 || "1"),
                  commandParams: _0x3856e2 || undefined,
                  giftId: _0x4da7e2,
                  giftName: _0x1e3dc4,
                  coins: _0x2ffd71?.value || undefined,
                  repeatCount: _0xac05c,
                  likeCount: _0x287187,
                  totalLikeCount: _0x417a4f,
                  subMonth: _0x12ec0d,
                  emoteId: _0xf0214,
                  emoteImageUrl: _0x5212f9,
                  triggerTypeId: _0x1f19a6,
                  tikfinityUserId: window.session?.channelId,
                  tikfinityUsername: (_0x28ce48 = window.session) === null || _0x28ce48 === undefined ? undefined : (_0x4a6b53 = _0x28ce48.me) === null || _0x4a6b53 === undefined ? undefined : _0x4a6b53.channel?.channelName
                });
              }
              if ((_0x463755 = _0x1e1afd.voicemodVoiceConfig) !== null && _0x463755 !== undefined && _0x463755.voiceId) {
                _0x514145 = utils.getScreenList().find(function (_0x13631e) {
                  return _0x13631e.screenId === _0x1e1afd.screenId;
                })?.queueSize || 100;
                actionsandevents.setVoicemodVoice(_0x1e1afd.voicemodVoiceConfig.voiceId, _0x1e1afd.voicemodVoiceConfig.duration, _0x1e1afd.dynamicConfig?.skipOnNext, _0x514145, false);
              }
              if (_0x1e1afd.customGoalConfig) {
                _0x52be33 = function _0x540126(_0x4a3d0a) {
                  var _0xe56150;
                  switch (_0x1e1afd.customGoalConfig.goalActionId) {
                    case 0:
                      _0xe56150 = "increase";
                      break;
                    case 1:
                      _0xe56150 = "decrease";
                      break;
                    case 2:
                      _0xe56150 = "set";
                  }
                  goals.setCustomGoal(_0x4a3d0a, _0xe56150, _0x1e1afd.customGoalConfig.goalValue);
                };
                if (_0x1e1afd.customGoalConfig.goalId === "all") {
                  actionsandevents.customGoalDataSource.filter(function (_0x5a1e75) {
                    return _0x5a1e75.id !== "all";
                  }).forEach(function (_0xb07b6c) {
                    return _0x52be33(_0xb07b6c.id);
                  });
                } else {
                  _0x52be33(_0x1e1afd.customGoalConfig.goalId);
                }
              }
              if (_0x1e1afd.streamerbotActionId) {
                actionsandevents.execStreamerbotAction(_0x1e1afd.streamerbotActionId, {
                  userId: _0x147694,
                  username: _0x5891a8,
                  nickname: _0xf2a1,
                  profilePicturUrl: getCachedImageUrl(_0x147694 || "1"),
                  commandParams: _0x3856e2 || undefined,
                  giftId: _0x4da7e2,
                  giftName: _0x1e3dc4,
                  coins: _0x2ffd71?.value || undefined,
                  repeatCount: _0xac05c,
                  likeCount: _0x287187,
                  totalLikeCount: _0x417a4f,
                  subMonth: _0x12ec0d,
                  emoteId: _0xf0214,
                  emoteImageUrl: _0x5212f9,
                  triggerTypeId: _0x1f19a6
                });
              }
              if (_0x1e1afd.timerSeconds && typeof timer !== "undefined") {
                if (timer.state.isStarted) {
                  timer.state.addedOffsetMillis += _0x1e1afd.timerSeconds * 1000;
                  timer.emitState(true);
                }
              }
            case 52:
            case "end":
              return _0x50c3ef.stop();
          }
        }
      }, _0x33bbe0, null, [[23, 33]]);
    }));
    return function _0x3595d2() {
      return _0x1017d7.apply(this, arguments);
    };
  }();
  if (_0x147694 && _0x147694 !== window.session.channelId && _0x1e1afd.amountToAdd < 0) {
    api.get("rest/channeluser", {
      channelId: settings.get("channelId"),
      userId: _0x147694
    }, function (_0xd63db0) {
      if (_0xd63db0.channelusers.length === 0 || parseFloat(_0xd63db0.channelusers[0].totalAmount) < _0x1e1afd.amountToAdd * -1) {
        console.info("insufficent user balance");
        if (_0x147694 && _0x1f19a6 === 2) {
          var _0xf8fa82 = chatbot.chatbotSnippets.find(function (_0x4380b8) {
            return _0x4380b8.id === "ACTION_FAILED_AMOUNT" && _0x4380b8.enabled;
          });
          if (!_0xf8fa82) {
            return;
          }
          var _0x2d08fc = _0xf8fa82.message.replaceAll("%username%", _0x5891a8).replaceAll("%actionamount%", (_0x1e1afd.amountToAdd * -1).toLocaleString()).replaceAll("%currencyname%", settings.get("textboxCurrencyName"));
          chatservice.sendMessage(_0x2d08fc, _0x5891a8, _0xf8fa82.id);
        }
        return;
      }
      _0x4757bd();
    }, function () {});
  } else {
    _0x4757bd();
  }
  return true;
};
actionsandevents.initEventGrid = function (_0x543ceb) {
  _0x543ceb.empty();
  var _0x284280 = $("<div>").dxButton({
    icon: "add",
    text: localization.getString("actionsandevents_events_create_event_button"),
    onClick: function _0x72ab3a() {
      actionsandevents.openNewEventModal(function (_0x4e841f) {
        if (!_0x4e841f) {
          return;
        }
        _0x4e841f.id = utils.uuidv4();
        actionsandevents.events.unshift(_0x4e841f);
        settings.set("events", JSON.stringify(actionsandevents.events));
        socketiowrapper.emitWidgetSettingsToWidgets();
        actionsandevents.refreshEvents(_0x815043);
        toastr.success(null, localization.getString("actionsandevents_saved_event"));
      });
    }
  }).css("margin-bottom", "10px").css("z-index", "9").css("position", "absolute");
  var _0x815043 = $("<div>").addClass("eventGrid").dxDataGrid({
    width: "100%",
    dataSource: actionsandevents.events,
    showBorders: true,
    noDataText: localization.getString("actionsandevents_events_empty"),
    columnAutoWidth: true,
    columnHidingEnabled: true,
    wordWrapEnabled: true,
    scrolling: {
      mode: "standard"
    },
    paging: {
      enabled: actionsandevents.events.length >= actionsandevents.eventsPageSize,
      pageSize: actionsandevents.eventsPageSize
    },
    pager: {
      visible: actionsandevents.events.length >= actionsandevents.eventsPageSize,
      showPageSizeSelector: false
    },
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: "Search existing events..."
    },
    editing: {
      allowUpdating: true,
      allowDeleting: true,
      mode: "cell",
      texts: {
        confirmDeleteMessage: localization.getString("actionsandevents_events_delete_confirm")
      }
    },
    repaintChangesOnly: true,
    columns: [{
      dataField: "id",
      visible: false,
      dataType: "string"
    }, {
      type: "buttons",
      width: 80,
      buttons: [{
        icon: "edit",
        hint: "Edit",
        onClick: function _0x49ba4a(_0x1cc25f) {
          var _0x548fd0 = _0x1cc25f.row.data;
          actionsandevents.openNewEventModal(function (_0xf20d32) {
            var _0x4bac13 = actionsandevents.events.findIndex(function (_0x140bf5) {
              return _0x140bf5.id === _0x548fd0.id;
            });
            actionsandevents.events[_0x4bac13] = _0xf20d32;
            settings.set("events", JSON.stringify(actionsandevents.events));
            socketiowrapper.emitWidgetSettingsToWidgets();
            actionsandevents.refreshEvents(_0x815043);
            toastr.success(null, localization.getString("actionsandevents_saved_event"));
          }, _0x548fd0);
        }
      }, {
        name: "delete",
        icon: "trash"
      }]
    }, {
      dataField: "active",
      caption: localization.getString("actionsandevents_events_list_active"),
      dataType: "boolean",
      width: "70px"
    }, {
      caption: localization.getString("actionsandevents_events_list_user"),
      dataType: "string",
      width: "200px",
      allowSearch: true,
      allowSorting: true,
      calculateCellValue: function _0x19de4b(_0x83d324) {
        if (_0x83d324.whichUserId === 1) {
          return "Any";
        }
        if (_0x83d324.whichUserId === 2) {
          return _0x83d324.username;
        }
        if (_0x83d324.whichUserId === 3) {
          return "Any Super Fan / Subscriber";
        }
        if (_0x83d324.whichUserId === 4) {
          return "Any Moderator";
        }
        if (_0x83d324.whichUserId === 5) {
          return "Any Follower";
        }
        if (_0x83d324.whichUserId === 6) {
          return "Top " + (_0x83d324.topGiftersN || 3) + " Gifter";
        }
      }
    }, {
      caption: localization.getString("actionsandevents_events_list_trigger"),
      dataType: "string",
      width: "300px",
      allowSearch: true,
      allowSorting: true,
      calculateCellValue: function _0x526beb(_0x1622d0) {
        var _0x23a9f4 = "";
        if (_0x1622d0.triggerTypeId === 1) {
          _0x23a9f4 = "Share";
        }
        if (_0x1622d0.triggerTypeId === 6) {
          _0x23a9f4 = "Join" + (_0x1622d0.minTriggerTeamLevel > 0 ? " (Team Level " + _0x1622d0.minTriggerTeamLevel + "+)" : "");
        }
        if (_0x1622d0.triggerTypeId === 13) {
          _0x23a9f4 = "First user activity" + (_0x1622d0.minTriggerTeamLevel > 0 ? " (Team Level " + _0x1622d0.minTriggerTeamLevel + "+)" : "");
        }
        if (_0x1622d0.triggerTypeId === 9) {
          _0x23a9f4 = "Follow";
        }
        if (_0x1622d0.triggerTypeId === 10) {
          _0x23a9f4 = "Subscribe / Super Fan";
        }
        if (_0x1622d0.triggerTypeId === 11) {
          _0x23a9f4 = "Chat";
        }
        if (_0x1622d0.triggerTypeId === 8) {
          _0x23a9f4 = "Raiding";
        }
        if (_0x1622d0.triggerTypeId === 2) {
          _0x23a9f4 = _0x1622d0.chatCmd + (_0x1622d0.minTriggerLevel > 0 ? " (Points Level " + _0x1622d0.minTriggerLevel + "+) " : "") + (_0x1622d0.minTriggerTeamLevel > 0 ? " (Team Level " + _0x1622d0.minTriggerTeamLevel + "+)" : "");
        }
        if (_0x1622d0.triggerTypeId === 3) {
          _0x23a9f4 = "Gift " + _0x1622d0.minBarsAmount + "+ Coins";
        }
        if (_0x1622d0.triggerTypeId === 7) {
          _0x23a9f4 = "Tap " + _0x1622d0.minLikesAmount + "+ Likes";
        }
        if (_0x1622d0.triggerTypeId === 12) {
          _0x23a9f4 = "Subscriber Emote #" + _0x1622d0.emoteId;
        }
        if (_0x1622d0.triggerTypeId === 15) {
          _0x23a9f4 = "Fan Club Sticker #" + _0x1622d0.emoteId;
        }
        if (_0x1622d0.triggerTypeId === 14) {
          _0x23a9f4 = "Purchase " + (_0x1622d0.productName ? `"${_0x1622d0.productName}"` : "Any Product");
        }
        if (_0x1622d0.triggerTypeId === 4) {
          _0x23a9f4 = "Gift " + _0x1622d0.giftName;
        }
        if (_0x1622d0.triggerTypeId === 5 && _0x1622d0.sticker) {
          if (_0x1622d0.sticker.userId) {
            if (_0x1622d0.sticker.stickerId === 0) {
              _0x23a9f4 = "Any " + _0x1622d0.sticker.profile + " Sticker";
            } else {
              _0x23a9f4 = "Sticker " + _0x1622d0.sticker.profile + " #" + _0x1622d0.sticker.stickerId;
            }
          } else {
            _0x23a9f4 = "Sticker " + _0x1622d0.sticker.assetSku;
          }
        }
        return _0x23a9f4;
      },
      cellTemplate: function _0x1fb3e5(_0x4acbe9, _0x4540dd) {
        var _0xa48460 = _0x4540dd.data;
        var _0x384858 = function _0x243a8d(_0xc1d95e) {
          _0x4acbe9.append($("<img>").attr("onerror", "this.remove()").attr("src", _0xc1d95e).css("width", "25px").css("height", "25px").css("margin-top", "-3px").css("position", "absolute"));
        };
        var _0x5c7d0f = function _0xab7e67(_0x18d274) {
          _0x4acbe9.append($("<span>").addClass(_0x18d274).css("width", "25px").css("height", "25px").css("position", "absolute").css("font-size", "1.5em").css("color", "#31b5d5"));
        };
        if (_0xa48460.triggerTypeId === 6 || _0xa48460.triggerTypeId === 13) {
          _0x5c7d0f("fas fa-sign-in-alt");
        }
        if (_0xa48460.triggerTypeId === 9) {
          _0x5c7d0f("fas fa-user-check");
        }
        if (_0xa48460.triggerTypeId === 10) {
          _0x5c7d0f("fas fa-star");
        }
        if (_0xa48460.triggerTypeId === 11) {
          _0x5c7d0f("fas fa-comment");
        }
        if (_0xa48460.triggerTypeId === 1) {
          _0x5c7d0f("fas fa-share");
        }
        if (_0xa48460.triggerTypeId === 2) {
          _0x5c7d0f("fas fa-terminal");
        }
        if (_0xa48460.triggerTypeId === 3) {
          _0x384858("/img/bars.png");
        }
        if (_0xa48460.triggerTypeId === 12 || _0xa48460.triggerTypeId === 15) {
          _0x384858(_0xa48460.emoteImage);
        }
        if (_0xa48460.triggerTypeId === 14) {
          _0x5c7d0f("fas fa-shopping-cart");
        }
        if (_0xa48460.triggerTypeId === 7) {
          _0x5c7d0f("fas fa-thumbs-up");
        }
        if (_0xa48460.triggerTypeId === 8) {
          _0x5c7d0f("fas fa-biohazard");
        }
        if (_0xa48460.triggerTypeId === 4 && _0xa48460.giftId) {
          _0x384858(_0xa48460.giftImage);
        }
        if (_0xa48460.triggerTypeId === 5 && _0xa48460.sticker) {
          if (_0xa48460.sticker.userId) {
            if (_0xa48460.sticker.stickerId === 0) {
              _0x384858("https://ynassets.younow.com/user/live/" + _0xa48460.sticker.userId + "/" + _0xa48460.sticker.userId + ".jpg");
            } else {
              _0x384858("https://ynassets.younow.com/subscriptionsTiers/usersAssets/live/" + _0xa48460.sticker.userId + "/STICKER_TIER_1_" + _0xa48460.sticker.stickerId + "/web_STICKER_TIER_1_" + _0xa48460.sticker.stickerId + ".png");
            }
          } else {
            _0x384858("https://ynassets.younow.com/subscriptionsTiers/usersAssets/live/1/" + _0xa48460.sticker.assetSku + "/web_" + _0xa48460.sticker.assetSku + ".png?assetRevision=1");
          }
        }
        _0x4acbe9.append($("<div>").text(_0x4540dd.displayValue).css("position", "absolute").css("margin-left", "32px"));
        return _0x4acbe9;
      }
    }, {
      caption: localization.getString("actionsandevents_events_list_action"),
      dataType: "string",
      allowSearch: true,
      allowSorting: true,
      calculateCellValue: function _0x6f553b(_0x46defb) {
        var _0x30b9e9 = "";
        function _0x256019(_0x73ebac) {
          var _0x50518a = actionsandevents.actions.find(function (_0x32cbc8) {
            return _0x32cbc8.id === _0x73ebac;
          });
          if (_0x50518a && typeof _0x50518a.name === "string") {
            _0x30b9e9 += _0x50518a.name + ", ";
          }
        }
        if (_0x46defb.actionId) {
          _0x256019(_0x46defb.actionId);
        }
        if (_0x46defb.actionIds && Array.isArray(_0x46defb.actionIds)) {
          _0x46defb.actionIds.forEach(function (_0x1951e4) {
            _0x256019(_0x1951e4);
          });
        }
        if (_0x46defb.actionRandomIds && Array.isArray(_0x46defb.actionRandomIds) && _0x46defb.actionRandomIds.length > 0) {
          _0x30b9e9 += "RANDOM(";
          _0x46defb.actionRandomIds.forEach(function (_0x24118c) {
            _0x256019(_0x24118c);
          });
          _0x30b9e9 += ")";
        }
        if (_0x30b9e9.endsWith(", )")) {
          _0x30b9e9 = _0x30b9e9.slice(0, -3);
          _0x30b9e9 += ")";
        }
        if (_0x30b9e9.endsWith(", ")) {
          _0x30b9e9 = _0x30b9e9.slice(0, -2);
        }
        return _0x30b9e9 || "-";
      }
    }],
    onRowRemoved: function _0x1764af(_0x5a9773) {
      settings.set("events", JSON.stringify(actionsandevents.events));
      actionsandevents.refreshEventsGridPagination(_0x815043);
      toastr.success(null, localization.getString("actionsandevents_deleted_event"));
      socketiowrapper.emitWidgetSettingsToWidgets();
    },
    onRowUpdated: function _0x4e8632(_0x47c09e) {
      settings.set("events", JSON.stringify(actionsandevents.events));
      actionsandevents.refreshEventsGridPagination(_0x815043);
      toastr.success(null, localization.getString("actionsandevents_saved_event"));
      socketiowrapper.emitWidgetSettingsToWidgets();
    }
  });
  _0x543ceb.append(_0x284280);
  _0x543ceb.append(_0x815043);
  return _0x815043;
};
actionsandevents.initScreenGrid = function (_0x754366) {
  _0x754366.empty();
  var _0x55b083 = $("<div>").dxDataGrid({
    width: "1100px",
    dataSource: utils.getScreenList(),
    showBorders: true,
    repaintChangesOnly: true,
    editing: {
      allowUpdating: true,
      mode: "cell"
    },
    columns: [{
      dataField: "screenId",
      visible: false,
      dataType: "string"
    }, {
      dataField: "screenName",
      caption: localization.getString("actionsandevents_screens_list_screename"),
      visible: true,
      dataType: "string",
      width: 150,
      allowEditing: false
    }, {
      caption: "Screen URL (widget for OBS or Live Studio)",
      visible: true,
      dataType: "number",
      alignment: "left",
      width: 500,
      allowEditing: false,
      cellTemplate: function _0x1e0488(_0xf4858f, _0x247ec0) {
        var _0x192ad2 = $("<a>");
        var _0x3f4d8e = actionsandevents.getScreenUrl(_0x247ec0.data.screenId);
        _0x192ad2.text(_0x3f4d8e);
        _0x192ad2.attr("href", _0x3f4d8e);
        _0x192ad2.click(function (_0x2ef48a) {
          _0x2ef48a.preventDefault();
          utils.copyTextToClipboard(_0x3f4d8e, localization.getString("obsoverlays_widget_copy_success_message"), localization.getString("obsoverlays_widget_copy_success_title"));
        });
        _0xf4858f.append(_0x192ad2);
      }
    }, {
      dataField: "queueSize",
      caption: localization.getString("actionsandevents_screens_list_queuesize"),
      visible: true,
      dataType: "number",
      width: 200,
      alignment: "left",
      showEditorAlways: true,
      editorOptions: {
        showSpinButtons: true,
        min: 0,
        max: 1000
      }
    }, {
      dataField: "statusText",
      caption: localization.getString("actionsandevents_screens_list_status"),
      visible: true,
      dataType: "number",
      alignment: "left",
      allowEditing: false
    }],
    onCellPrepared: function _0x21fbfe(_0x4f20cd) {
      if (_0x4f20cd.rowType === "data" && _0x4f20cd.column.dataField === "statusText") {
        _0x4f20cd.cellElement.css("color", _0x4f20cd.data.statusColor);
      }
    },
    onRowUpdated: function _0x41dbed(_0x4e89de) {
      if (_0x4e89de.data.queueSize !== _0x4e89de.data.defaultQueueSize) {
        localStorage.setItem(_0x4e89de.data.queueSizeLcKey, _0x4e89de.data.queueSize || 0);
      } else {
        localStorage.removeItem(_0x4e89de.data.queueSizeLcKey);
      }
      settings.save();
      _0x55b083.dxDataGrid("instance").option("dataSource", utils.getScreenList());
    }
  });
  _0x754366.append(_0x55b083);
  window.screenGrid = _0x55b083;
  if (actionsandevents.screenGridRefreshInterval) {
    clearInterval(actionsandevents.screenGridRefreshInterval);
  }
  actionsandevents.screenGridRefreshInterval = setInterval(function () {
    if (navigation.currentPage !== "actionsandevents") {
      return;
    }
    if (_0x55b083.find(".dx-focused").length > 0) {
      return;
    }
    _0x55b083.dxDataGrid("instance").option("dataSource", utils.getScreenList());
  }, 1000);
  return _0x55b083;
};
actionsandevents.openNewEventModal = function (_0xb12cba, _0x4a8052) {
  if (_0x4a8052) {
    _0x4a8052 = JSON.parse(JSON.stringify(_0x4a8052));
  }
  var _0x119863 = $("#newEventModal");
  if (!_0x119863.length) {
    console.log("create new");
    _0x119863 = $("<div>").attr("id", "newEventModal");
    $("#pages").append(_0x119863);
  }
  var _0x29acd0 = $("<div>");
  _0x119863.append(_0x29acd0);
  var _0x59b7a0 = false;
  var _0x52a7cd = null;
  var _0x1855e7 = null;
  _0x29acd0.dxPopup({
    width: 650,
    height: utils.getResponsiveDialogHeight(940),
    visible: true,
    title: localization.getString("actionsandevents_events_create_event"),
    closeOnOutsideClick: true,
    showCloseButton: true,
    showScrollbar: true,
    onHiding: function _0x388ecc(_0x566ae9) {
      if (_0x59b7a0) {
        _0x566ae9.cancel = true;
        var _0x30dff6 = DevExpress.ui.dialog.confirm(localization.getString("actionsandevents_save_unchanged_event_text"), localization.getString("actionsandevents_save_unchanged_title"));
        _0x30dff6.done(function (_0x278eb7) {
          if (_0x278eb7) {
            _0x1855e7.dxScrollView("instance").scrollTo(99999);
            setTimeout(function () {
              _0x52a7cd.click();
            }, 100);
          } else {
            _0x59b7a0 = false;
            _0x29acd0.dxPopup("instance").hide();
          }
        });
      }
    },
    contentTemplate: function _0x168b4a(_0x23d880) {
      _0x23d880.on("click", function () {
        _0x59b7a0 = true;
      });
      _0x23d880.on("keydown", function () {
        _0x59b7a0 = true;
      });
      var _0x114d13 = $(".newEventTemplate").first().clone();
      _0x114d13.removeClass("hidden");
      var _0x4a73be = null;
      var _0x9e4920 = null;
      var _0xeb514d = null;
      var _0x6742cd = null;
      var _0x1ba028 = null;
      var _0x1c575a = null;
      var _0x32bc38 = null;
      var _0x5b92ed = null;
      var _0x2d2e5d = null;
      var _0x26453e = null;
      var _0x12e5c4 = null;
      var _0x588996 = null;
      var _0x24a6a2 = null;
      var _0x3cd12e = null;
      var _0x6637d3 = null;
      _0x114d13.find(".trigger-option-2").hide();
      _0x114d13.find(".trigger-option-3").hide();
      _0x114d13.find(".trigger-option-4").hide();
      _0x114d13.find(".trigger-option-5").hide();
      _0x114d13.find(".trigger-option-6").hide();
      _0x114d13.find(".trigger-option-7").hide();
      _0x114d13.find(".trigger-option-12").hide();
      _0x114d13.find(".trigger-option-13").hide();
      _0x114d13.find(".trigger-option-14").hide();
      _0x114d13.find(".trigger-option-15").hide();
      _0x114d13.find(".whichuser-option-6").hide();
      _0x4a73be = _0x114d13.find(".radio-group-whichuser").dxRadioGroup({
        items: actionsandevents.optionsWhich,
        value: actionsandevents.optionsWhich[0],
        onValueChanged: function _0x553c7c(_0x3533bb) {
          var _0x3e312f = _0x3533bb.value.value;
          if (_0x3e312f === 2) {
            _0xeb514d.show(100);
          } else {
            _0xeb514d.hide(100);
          }
          _0x114d13.find(".whichuser-option-6").hide();
          _0x114d13.find(".whichuser-option-" + _0x3e312f).show(250);
        }
      }).dxRadioGroup("instance");
      _0x9e4920 = _0x114d13.find(".radio-group-trigger").dxRadioGroup({
        items: actionsandevents.optionsTrigger,
        value: actionsandevents.optionsTrigger[0],
        onValueChanged: function _0x4448de(_0x5c3bda) {
          var _0x49440d = _0x5c3bda.value.value;
          _0x114d13.find(".trigger-option-2").hide();
          _0x114d13.find(".trigger-option-3").hide();
          _0x114d13.find(".trigger-option-4").hide();
          _0x114d13.find(".trigger-option-5").hide();
          _0x114d13.find(".trigger-option-6").hide();
          _0x114d13.find(".trigger-option-7").hide();
          _0x114d13.find(".trigger-option-12").hide();
          _0x114d13.find(".trigger-option-13").hide();
          _0x114d13.find(".trigger-option-14").hide();
          _0x114d13.find(".trigger-option-15").hide();
          _0x114d13.find(".trigger-option-" + _0x49440d).show(250);
        }
      }).dxRadioGroup("instance");
      _0xeb514d = _0x114d13.find(".select-box-specificuser").dxSelectBox({
        dataSource: new DevExpress.data.DataSource({
          store: {
            type: "odata",
            url: window.appConfig.apiBasePath + "odata/channeluser",
            key: "id",
            version: 4
          },
          filter: ["channelId", "=", window.session.channelId],
          sort: [{
            selector: "lastUpsertAt",
            desc: true
          }]
        }),
        valueExpr: "userId",
        displayExpr: "username",
        searchEnabled: true,
        placeholder: localization.getString("misc_enter_username"),
        noDataText: "User not found in Points System!"
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      }).hide().css("margin-bottom", "10px");
      var _0x37bc93 = 8;
      _0x24a6a2 = _0x114d13.find(".tag-box-actions").dxTagBox({
        dataSource: actionsandevents.actions,
        valueExpr: "id",
        displayExpr: "name",
        searchEnabled: true,
        showDropButton: true,
        noDataText: localization.getString("actionsandevents_events_modal_no_action"),
        onValueChanged: function _0x2d52c0(_0x55721a) {
          if (_0x55721a.value.length > _0x37bc93) {
            var _0x13b999 = _0x55721a.value.slice(0, _0x37bc93);
            _0x55721a.component.option("value", _0x13b999);
            DevExpress.ui.dialog.alert("An event can trigger a maximum of 8 actions at the same time.", "Limit reached");
          }
        }
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x3cd12e = _0x114d13.find(".tag-box-actions-random").dxTagBox({
        dataSource: actionsandevents.actions,
        valueExpr: "id",
        displayExpr: "name",
        searchEnabled: true,
        showDropButton: true,
        noDataText: localization.getString("actionsandevents_events_modal_no_action")
      });
      _0x1ba028 = _0x114d13.find(".text-box-customcommand").dxTextBox({
        placeholder: "!command"
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x6742cd = _0x114d13.find(".number-box-topgiftern").dxNumberBox({
        min: 1,
        max: 20,
        value: 3,
        showSpinButtons: true
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x1c575a = _0x114d13.find(".text-box-mintriggerlevel").dxNumberBox({
        min: 0,
        max: 99999,
        showSpinButtons: true
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x32bc38 = _0x114d13.find(".text-box-mintriggerteamlevel").dxNumberBox({
        min: 0,
        max: 99999,
        showSpinButtons: true
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x5b92ed = _0x114d13.find(".text-box-productname").dxTextBox({
        placeholder: "Product Name",
        maxLength: 100
      });
      _0x2d2e5d = _0x114d13.find(".number-box-minbarsamount").dxNumberBox({
        placeholder: "Coins",
        value: 1,
        min: 1,
        max: 500000,
        showSpinButtons: true
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x26453e = _0x114d13.find(".number-box-minlikesamount").dxNumberBox({
        placeholder: "Likes",
        value: 15,
        min: 1,
        max: 10000,
        showSpinButtons: true
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x12e5c4 = _0x114d13.find(".select-box-specificgift").dxSelectBox({
        dataSource: actionsandevents.getGiftDataSource(),
        valueExpr: "id",
        displayExpr: "name",
        searchEnabled: true,
        itemTemplate: actionsandevents.getGiftItemTemplate,
        onValueChanged: function _0x134677(_0x13bda4) {}
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      var _0x3a1e95 = _0x4a8052 && _0x4a8052.sticker ? _0x4a8052.sticker : null;
      selectBoxSpecificSticker = _0x114d13.find(".button-specificsticker").dxButton({
        text: localization.getString("actionsandevents_events_modal_select_sticker_btn"),
        onClick: function _0x3425d1() {
          actionsandevents.openStickerDialog(function (_0x2af703) {
            _0x3a1e95 = _0x2af703;
            _0xddb0f2(_0x2af703);
          });
        }
      });
      function _0xddb0f2(_0x1c67d9) {
        if (_0x1c67d9.userId) {
          if (_0x1c67d9.stickerId === 0) {
            _0x114d13.find(".button-specificsticker-info").html("<small>Any " + _0x1c67d9.profile + " Sticker</small>");
          } else {
            _0x114d13.find(".button-specificsticker-info").html("<img src='https://ynassets.younow.com/subscriptionsTiers/usersAssets/live/" + _0x1c67d9.userId + "/STICKER_TIER_1_" + _0x1c67d9.stickerId + "/web_STICKER_TIER_1_" + _0x1c67d9.stickerId + ".png?assetRevision=" + Math.random() + "' style='margin-top: -10px;' width='40px' /> <small style='position: absolute; margin-left: 13px; width: 110px; margin-top: 3px;'>" + _0x1c67d9.profile + " #" + _0x1c67d9.stickerId + "</small>");
          }
        } else if (_0x1c67d9.assetSku) {
          _0x114d13.find(".button-specificsticker-info").html("<img src='https://ynassets.younow.com/subscriptionsTiers/usersAssets/live/1/" + _0x1c67d9.assetSku + "/web_" + _0x1c67d9.assetSku + ".png?assetRevision=1' style='margin-top: -10px;' width='40px' /> <small style='position: absolute; margin-left: 13px; width: 110px; margin-top: 3px;'>" + _0x1c67d9.assetSku + "</small>");
        }
      }
      if (_0x3a1e95) {
        _0xddb0f2(_0x3a1e95);
      }
      _0x588996 = _0x114d13.find(".select-box-specificemote").dxSelectBox({
        dataSource: actionsandevents.getEmoteDataSource(),
        valueExpr: "emoteId",
        displayExpr: "emoteId",
        searchEnabled: true,
        itemTemplate: function _0x75a548(_0x3309a3) {
          var _0x25b959 = $("<div>").css("display", "table-row").css("height", "40px");
          var _0xe3f6f9 = $("<img>").attr("src", _0x3309a3.imageUrl).attr("onerror", "this.style.opacity='0'");
          var _0x2ddb4a = $("<div>").html("<i>#" + _0x3309a3.emoteId + "</i>");
          var _0x2ddc7e = _0x3309a3.sourceId === 4 ? "Fan Club" : "Super Fan";
          _0xe3f6f9.css("display", "table-cell");
          _0xe3f6f9.attr("height", "40px");
          _0xe3f6f9.attr("width", "40px");
          var _0xfbede7 = $("<span>");
          _0xfbede7.css("display", "table-cell");
          _0xfbede7.css("padding-left", "20px");
          _0xfbede7.css("vertical-align", "top");
          _0xfbede7.append(_0x2ddb4a);
          _0xfbede7.append($("<div>").text(_0x2ddc7e).css("font-size", "0.8em").css("margin-top", "3px"));
          return _0x25b959.append(_0xe3f6f9).append(_0xfbede7);
        },
        fieldTemplate: function _0xea165(_0x3f787e, _0x299765) {
          var _0x14e794 = _0x3f787e?.emoteId || null;
          if (_0x14e794) {
            _0x14e794 = "#" + _0x14e794;
          }
          var _0x1cfbee = $("<div>").dxTextBox({
            text: _0x14e794,
            placeholder: "Select Emote..."
          });
          if (_0x3f787e !== null && _0x3f787e !== undefined && _0x3f787e.imageUrl) {
            var _0x48f0f9 = $("<div>");
            _0x48f0f9.css("width", "30px");
            _0x48f0f9.css("text-align", "center");
            _0x48f0f9.css("margin-top", "3px");
            _0x48f0f9.append($("<img>").attr("src", _0x3f787e.imageUrl).css("width", "28px").css("height", "28px"));
            _0x48f0f9.css("position", "absolute");
            _0x48f0f9.css("margin-left", "10px");
            _0x1cfbee.css("margin-left", "45px");
            _0x299765.append(_0x48f0f9);
          }
          _0x299765.append(_0x1cfbee);
        },
        onValueChanged: function _0x3fa949(_0x273c29) {}
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      var _0x2bda09 = _0x114d13.find(".select-box-specific-subscriber-emote").dxSelectBox({
        dataSource: actionsandevents.getSubscriberEmoteDataSource(),
        valueExpr: "emoteId",
        displayExpr: "emoteId",
        searchEnabled: true,
        itemTemplate: function _0x1c2e03(_0x1e1b76) {
          var _0x385499 = $("<div>").css("display", "table-row").css("height", "40px");
          var _0x1300fe = $("<img>").attr("src", _0x1e1b76.imageUrl).attr("onerror", "this.style.opacity='0'");
          var _0x31ade8 = $("<div>").html("<i>#" + _0x1e1b76.emoteId + "</i>");
          _0x1300fe.css("display", "table-cell");
          _0x1300fe.attr("height", "40px");
          _0x1300fe.attr("width", "40px");
          var _0x375568 = $("<span>");
          _0x375568.css("display", "table-cell");
          _0x375568.css("padding-left", "20px");
          _0x375568.css("vertical-align", "top");
          _0x375568.append(_0x31ade8);
          _0x375568.append($("<div>").text(_0x1e1b76.sourceId === 5 ? "Super Fan (Subscriber) Emote" : "Subscriber Emote").css("font-size", "0.8em").css("margin-top", "3px"));
          return _0x385499.append(_0x1300fe).append(_0x375568);
        },
        fieldTemplate: function _0x334246(_0x434d9d, _0x44c96a) {
          var _0xfbdcc4 = _0x434d9d?.emoteId || null;
          if (_0xfbdcc4) {
            _0xfbdcc4 = "#" + _0xfbdcc4;
          }
          var _0x5a21d0 = $("<div>").dxTextBox({
            text: _0xfbdcc4,
            placeholder: localization.getString("actionsandevents_events_modal_select_subscriber_emote_placeholder")
          });
          if (_0x434d9d !== null && _0x434d9d !== undefined && _0x434d9d.imageUrl) {
            var _0x460354 = $("<div>");
            _0x460354.css("width", "30px");
            _0x460354.css("text-align", "center");
            _0x460354.css("margin-top", "3px");
            _0x460354.append($("<img>").attr("src", _0x434d9d.imageUrl).css("width", "28px").css("height", "28px"));
            _0x460354.css("position", "absolute");
            _0x460354.css("margin-left", "10px");
            _0x5a21d0.css("margin-left", "45px");
            _0x44c96a.append(_0x460354);
          }
          _0x44c96a.append(_0x5a21d0);
        }
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      var _0x2dd77f = _0x114d13.find(".select-box-specific-fanclub-sticker").dxSelectBox({
        dataSource: actionsandevents.getFanClubStickerDataSource(),
        valueExpr: "emoteId",
        displayExpr: "emoteId",
        searchEnabled: true,
        itemTemplate: function _0x3e1070(_0x40a3b0) {
          var _0x2b2848 = $("<div>").css("display", "table-row").css("height", "40px");
          var _0x14c234 = $("<img>").attr("src", _0x40a3b0.imageUrl).attr("onerror", "this.style.opacity='0'");
          var _0x584f72 = $("<div>").html("<i>#" + _0x40a3b0.emoteId + "</i>");
          _0x14c234.css("display", "table-cell");
          _0x14c234.attr("height", "40px");
          _0x14c234.attr("width", "40px");
          var _0x6cbd78 = $("<span>");
          _0x6cbd78.css("display", "table-cell");
          _0x6cbd78.css("padding-left", "20px");
          _0x6cbd78.css("vertical-align", "top");
          _0x6cbd78.append(_0x584f72);
          _0x6cbd78.append($("<div>").text("Fan Club Sticker").css("font-size", "0.8em").css("margin-top", "3px"));
          return _0x2b2848.append(_0x14c234).append(_0x6cbd78);
        },
        fieldTemplate: function _0x313d9d(_0x44664b, _0x5037e7) {
          var _0x2ff34f = _0x44664b?.emoteId || null;
          if (_0x2ff34f) {
            _0x2ff34f = "#" + _0x2ff34f;
          }
          var _0x253c26 = $("<div>").dxTextBox({
            text: _0x2ff34f,
            placeholder: localization.getString("actionsandevents_events_modal_select_fan_club_sticker_placeholder")
          });
          if (_0x44664b !== null && _0x44664b !== undefined && _0x44664b.imageUrl) {
            var _0x131800 = $("<div>");
            _0x131800.css("width", "30px");
            _0x131800.css("text-align", "center");
            _0x131800.css("margin-top", "3px");
            _0x131800.append($("<img>").attr("src", _0x44664b.imageUrl).css("width", "28px").css("height", "28px"));
            _0x131800.css("position", "absolute");
            _0x131800.css("margin-left", "10px");
            _0x253c26.css("margin-left", "45px");
            _0x5037e7.append(_0x131800);
          }
          _0x5037e7.append(_0x253c26);
        }
      }).dxValidator({
        validationRules: [{
          type: "required"
        }]
      });
      _0x52a7cd = _0x114d13.find(".eventSaveButton").dxButton({
        width: "190px",
        text: localization.getString("dialog_save"),
        icon: "check",
        onClick: function _0x36369a(_0x451e3a) {
          var _0x374a9b = _0x4a73be.option("value").value;
          var _0x2ecaf1 = _0x9e4920.option("value").value;
          var _0x13b8f4 = {
            whichUserId: _0x374a9b,
            triggerTypeId: _0x2ecaf1,
            active: true
          };
          if (_0x4a8052 && _0x4a8052.id) {
            _0x13b8f4.id = _0x4a8052.id;
          }
          if (_0x4a8052 && !_0x4a8052.active) {
            _0x13b8f4.active = false;
          }
          switch (_0x374a9b) {
            case 2:
              if (!_0xeb514d.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.userId = _0xeb514d.dxSelectBox("instance").option("selectedItem").userId;
              _0x13b8f4.username = _0xeb514d.dxSelectBox("instance").option("selectedItem").username;
              break;
            case 6:
              if (!_0x6742cd.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.topGiftersN = _0x6742cd.dxNumberBox("instance").option("value");
              break;
          }
          switch (_0x2ecaf1) {
            case 2:
              if (!_0x1ba028.dxValidator("instance").validate().isValid) {
                return;
              }
              if (!_0x1c575a.dxValidator("instance").validate().isValid) {
                return;
              }
              if (!_0x32bc38.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.chatCmd = _0x1ba028.dxTextBox("instance").option("value");
              _0x13b8f4.minTriggerLevel = _0x1c575a.dxNumberBox("instance").option("value");
              _0x13b8f4.minTriggerTeamLevel = _0x32bc38.dxNumberBox("instance").option("value");
              break;
            case 3:
              if (!_0x2d2e5d.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.minBarsAmount = _0x2d2e5d.dxNumberBox("instance").option("value");
              break;
            case 6:
            case 13:
              if (!_0x32bc38.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.minTriggerTeamLevel = _0x32bc38.dxNumberBox("instance").option("value");
              break;
            case 7:
              if (!_0x26453e.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.minLikesAmount = _0x26453e.dxNumberBox("instance").option("value");
              break;
            case 4:
              if (!_0x12e5c4.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.giftId = _0x12e5c4.dxSelectBox("instance").option("selectedItem").id;
              _0x13b8f4.giftName = _0x12e5c4.dxSelectBox("instance").option("selectedItem").name;
              _0x13b8f4.giftImage = _0x12e5c4.dxSelectBox("instance").option("selectedItem").image.url_list[0];
              break;
            case 12:
              if (!_0x2bda09.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.emoteId = _0x2bda09.dxSelectBox("instance").option("selectedItem").emoteId;
              _0x13b8f4.emoteImage = _0x2bda09.dxSelectBox("instance").option("selectedItem").imageUrl;
              break;
            case 15:
              if (!_0x2dd77f.dxValidator("instance").validate().isValid) {
                return;
              }
              _0x13b8f4.emoteId = _0x2dd77f.dxSelectBox("instance").option("selectedItem").emoteId;
              _0x13b8f4.emoteImage = _0x2dd77f.dxSelectBox("instance").option("selectedItem").imageUrl;
              break;
            case 14:
              _0x13b8f4.productName = _0x5b92ed.dxTextBox("instance").option("value") || null;
              break;
            case 5:
              if (!_0x3a1e95) {
                _0x114d13.find(".button-specificsticker-info").html("<span style='color: #d9534f'><i class='fas fa-exclamation-circle'></i> " + localization.getString("misc_please_select") + "</span>");
                return;
              }
              _0x13b8f4.sticker = _0x3a1e95;
              break;
          }
          if (_0x24a6a2.dxTagBox("instance").option("value").length === 0 && _0x3cd12e.dxTagBox("instance").option("value").length === 0) {
            _0x24a6a2.dxValidator("instance").validate();
            return;
          }
          if (actionsandevents.events.find(function (_0x5eca57) {
            return _0x5eca57.id !== _0x13b8f4.id && _0x5eca57.whichUserId === _0x13b8f4.whichUserId && _0x5eca57.triggerTypeId === _0x13b8f4.triggerTypeId && _0x5eca57.userId === _0x13b8f4.userId && _0x5eca57.chatCmd === _0x13b8f4.chatCmd && _0x5eca57.minBarsAmount === _0x13b8f4.minBarsAmount && _0x5eca57.minLikesAmount === _0x13b8f4.minLikesAmount && _0x5eca57.giftId === _0x13b8f4.giftId && _0x5eca57.emoteId === _0x13b8f4.emoteId && _0x5eca57.topGiftersN === _0x13b8f4.topGiftersN && JSON.stringify(_0x5eca57.sticker) === JSON.stringify(_0x13b8f4.sticker);
          })) {
            _0x114d13.find(".eventWithSameTriggerExists").removeClass("hidden");
            return;
          }
          _0x13b8f4.actionIds = _0x24a6a2.dxTagBox("instance").option("value");
          _0x13b8f4.actionRandomIds = _0x3cd12e.dxTagBox("instance").option("value");
          _0x13b8f4.actionRandomIds = _0x13b8f4.actionRandomIds.filter(function (_0x27c28b) {
            return !_0x13b8f4.actionIds.includes(_0x27c28b);
          });
          _0x59b7a0 = false;
          _0x29acd0.dxPopup("instance").hide();
          _0xb12cba(_0x13b8f4);
        }
      });
      _0x114d13.find(".eventCancelButton").dxButton({
        width: "190px",
        text: localization.getString("dialog_cancel"),
        icon: "close",
        onClick: function _0x2ac896() {
          _0x29acd0.dxPopup("instance").hide();
        }
      });
      if (_0x4a8052) {
        _0x4a73be.option("value", actionsandevents.optionsWhich.find(function (_0x5b1268) {
          return _0x5b1268.value === _0x4a8052.whichUserId;
        }));
        _0x9e4920.option("value", actionsandevents.optionsTrigger.find(function (_0x37f130) {
          return _0x37f130.value === _0x4a8052.triggerTypeId;
        }));
        if (_0x4a8052.userId) {
          _0xeb514d.dxSelectBox("instance").option("value", _0x4a8052.userId);
        }
        if (_0x4a8052.chatCmd) {
          _0x1ba028.dxTextBox("instance").option("value", _0x4a8052.chatCmd);
        }
        if (_0x4a8052.topGiftersN) {
          _0x6742cd.dxNumberBox("instance").option("value", _0x4a8052.topGiftersN);
        }
        if (_0x4a8052.minTriggerLevel) {
          _0x1c575a.dxNumberBox("instance").option("value", _0x4a8052.minTriggerLevel);
        }
        if (_0x4a8052.minTriggerTeamLevel) {
          _0x32bc38.dxNumberBox("instance").option("value", _0x4a8052.minTriggerTeamLevel);
        }
        if (_0x4a8052.productName) {
          _0x5b92ed.dxTextBox("instance").option("value", _0x4a8052.productName);
        }
        if (_0x4a8052.minBarsAmount) {
          _0x2d2e5d.dxNumberBox("instance").option("value", _0x4a8052.minBarsAmount);
        }
        if (_0x4a8052.minLikesAmount) {
          _0x26453e.dxNumberBox("instance").option("value", _0x4a8052.minLikesAmount);
        }
        if (_0x4a8052.giftId) {
          _0x12e5c4.dxSelectBox("instance").option("value", _0x4a8052.giftId);
        }
        if (_0x4a8052.emoteId && _0x4a8052.triggerTypeId === 12) {
          _0x2bda09.dxSelectBox("instance").option("value", _0x4a8052.emoteId);
        }
        if (_0x4a8052.emoteId && _0x4a8052.triggerTypeId === 15) {
          _0x2dd77f.dxSelectBox("instance").option("value", _0x4a8052.emoteId);
        }
        if (_0x4a8052.emoteId && !_0x4a8052.triggerTypeId) {
          _0x588996.dxSelectBox("instance").option("value", _0x4a8052.emoteId);
        }
        if (_0x4a8052.actionId) {
          if (Array.isArray(_0x4a8052.actionIds)) {
            _0x4a8052.actionIds.push(parseInt(_0x4a8052.actionId));
          } else {
            _0x4a8052.actionIds = [parseInt(_0x4a8052.actionId)];
          }
          delete _0x4a8052.actionId;
        }
        if (_0x4a8052.actionIds && Array.isArray(_0x4a8052.actionIds) && _0x4a8052.actionIds.length > 0) {
          _0x24a6a2.dxTagBox("instance").option("value", _0x4a8052.actionIds.filter(function (_0x4439c0) {
            return actionsandevents.actions.find(function (_0x4bdb40) {
              return _0x4bdb40.id === _0x4439c0;
            });
          }));
        }
        if (_0x4a8052.actionRandomIds && Array.isArray(_0x4a8052.actionRandomIds)) {
          _0x3cd12e.dxTagBox("instance").option("value", _0x4a8052.actionRandomIds.filter(function (_0x36606a) {
            return actionsandevents.actions.find(function (_0xd093ee) {
              return _0xd093ee.id === _0x36606a;
            });
          }));
        }
      } else {
        _0x114d13.find(".trigger-option-" + actionsandevents.optionsTrigger[0].value).show();
      }
      _0x6637d3 = $("<div>");
      _0x6637d3.append(_0x114d13);
      _0x6637d3.dxScrollView({
        width: "100%",
        height: "100%",
        direction: "vertical",
        showScrollbar: "always"
      });
      _0x1855e7 = _0x6637d3;
      _0x23d880.append(_0x6637d3);
    }
  });
};
actionsandevents.openStickerDialog = function (_0x24c573) {
  $("#selectStickerModal").dxPopup({
    width: "400px",
    height: "420px",
    title: localization.getString("actionsandevents_events_modal_select_sticker_btn"),
    visible: true,
    closeOnOutsideClick: true,
    showCloseButton: true,
    showScrollbar: true,
    contentTemplate: function _0x4b8d71(_0x269524) {
      _0x269524.append($("#stickerModalTemplate").clone().removeAttr("id").removeClass("hidden"));
      var _0x321e7e = window.session.me && window.session.me.channel ? window.session.me.channel.channelName : null;
      _0x269524.find(".textboxStickerPartnerName").dxTextBox({
        value: _0x321e7e,
        width: "150px",
        onEnterKey: _0x172c78
      });
      _0x269524.find(".buttonStickerPartnerLoad").dxButton({
        icon: "refresh",
        onClick: _0x172c78
      });
      if (_0x321e7e) {
        _0x172c78();
      }
      function _0x172c78() {
        var _0x4f1b28 = _0x269524.find(".textboxStickerPartnerName").dxTextBox("instance").option("value");
        if (!_0x4f1b28) {
          return;
        }
        _0x269524.find(".partnerStickers").empty();
        _0x269524.find(".partnerStickers").html("<small>Loading...</small>");
        _0x4f1b28 = _0x4f1b28.toString().trim();
        api.get("younow/channel/getInfo", {
          user: _0x4f1b28
        }, function (_0x1d06b3) {
          if (!_0x1d06b3.younowData || !_0x1d06b3.younowData.userId) {
            _0x269524.find(".partnerStickers").html("<small>Error: User not found</small>");
            return;
          }
          _0x269524.find(".partnerStickers").empty();
          var _0x191f3c = false;
          var _0x2e1185 = function _0x281199(_0x44b073) {
            var _0x31cb61 = "STICKER_TIER_1_" + _0x44b073;
            var _0x7aa145 = "https://ynassets.younow.com/subscriptionsTiers/usersAssets/live/" + _0x1d06b3.younowData.userId + "/" + _0x31cb61 + "/web_" + _0x31cb61 + ".png?assetRevision=" + Math.random();
            _0x56fd9a = $("<img>").css("width", "35px").css("height", "35px").css("padding", "2px").css("margin", "5px");
            _0x56fd9a.addClass("stickerSelectImg");
            _0x56fd9a.attr("src", _0x7aa145);
            _0x56fd9a.attr("onerror", "this.remove()");
            _0x56fd9a.on("load", _0x22d8c9);
            _0x269524.find(".partnerStickers").append(_0x56fd9a);
            _0x56fd9a.click(function () {
              $("#selectStickerModal").dxPopup("instance").hide();
              _0x24c573({
                userId: _0x1d06b3.younowData.userId,
                stickerId: _0x44b073,
                profile: _0x1d06b3.younowData.profile
              });
            });
          };
          for (var _0x21ee99 = 1; _0x21ee99 <= 6; _0x21ee99++) {
            var _0x56fd9a;
            _0x2e1185(_0x21ee99);
          }
          function _0x22d8c9() {
            if (_0x191f3c) {
              return;
            }
            _0x191f3c = true;
            var _0x311526 = $("<a>").text(localization.getString("actionsandevents_events_modal_select_sticker_apply_all", _0x1d06b3.younowData.profile)).css("font-size", "0.8em");
            _0x269524.find(".partnerStickers").append("<br>");
            _0x269524.find(".partnerStickers").append(_0x311526);
            _0x311526.click(function () {
              $("#selectStickerModal").dxPopup("instance").hide();
              _0x24c573({
                userId: _0x1d06b3.younowData.userId,
                stickerId: 0,
                profile: _0x1d06b3.younowData.profile
              });
            });
          }
        }, function () {});
      }
      _0x269524.find(".freeStickers").empty();
      var _0x16751a = [];
      window.appConfig.globalStickers.forEach(function (_0x4b3232) {
        if (_0x16751a.includes(_0x4b3232.assetSku)) {
          return;
        }
        _0x16751a.push(_0x4b3232.assetSku);
        var _0x4e4fa9 = "https://ynassets.younow.com/subscriptionsTiers/usersAssets/live/1/" + _0x4b3232.assetSku + "/web_" + _0x4b3232.assetSku + ".png";
        var _0x25df41 = $("<img>").css("width", "30px").css("height", "30px").css("padding", "2px").css("margin", "2px");
        _0x25df41.addClass("stickerSelectImg");
        _0x25df41.attr("src", _0x4e4fa9);
        _0x25df41.attr("onerror", "this.remove()");
        _0x269524.find(".freeStickers").append(_0x25df41);
        _0x25df41.click(function () {
          $("#selectStickerModal").dxPopup("instance").hide();
          _0x24c573({
            assetSku: _0x4b3232.assetSku
          });
        });
      });
    }
  });
};
actionsandevents.getEventByShare = function (_0x3fe0ba) {
  var _0x3d27ff = null;
  var _0x10f7ab = null;
  var _0x512930 = null;
  var _0x5be1da = null;
  var _0x4ae0e9 = null;
  var _0x5067f2 = null;
  actionsandevents.events.filter(function (_0x26bbee) {
    return _0x26bbee.active && _0x26bbee.triggerTypeId === 1;
  }).forEach(function (_0x2bbfb5) {
    if (_0x2bbfb5.whichUserId === 2 && _0x2bbfb5.userId === _0x3fe0ba.userId) {
      _0x3d27ff = _0x2bbfb5;
    }
    if (_0x2bbfb5.whichUserId === 3 && utils.isSubscriber(_0x3fe0ba)) {
      _0x10f7ab = _0x2bbfb5;
    }
    if (_0x2bbfb5.whichUserId === 4 && utils.isModerator(_0x3fe0ba)) {
      _0x512930 = _0x2bbfb5;
    }
    if (_0x2bbfb5.whichUserId === 6 && utils.isTopGifterNG(_0x3fe0ba, _0x2bbfb5)) {
      _0x5be1da = _0x2bbfb5;
    }
    if (_0x2bbfb5.whichUserId === 5 && utils.isFollower(_0x3fe0ba)) {
      _0x4ae0e9 = _0x2bbfb5;
    }
    if (_0x2bbfb5.whichUserId === 1) {
      _0x5067f2 = _0x2bbfb5;
    }
  });
  if (_0x3d27ff) {
    return _0x3d27ff;
  }
  if (_0x512930) {
    return _0x512930;
  }
  if (_0x10f7ab) {
    return _0x10f7ab;
  }
  if (_0x5be1da) {
    return _0x5be1da;
  }
  if (_0x4ae0e9) {
    return _0x4ae0e9;
  }
  if (_0x5067f2) {
    return _0x5067f2;
  }
  return null;
};
actionsandevents.getEventByFollow = function (_0x43502c) {
  var _0x58f062 = null;
  var _0x36f890 = null;
  var _0x36ac1d = null;
  var _0x57bf54 = null;
  var _0x5873d8 = null;
  actionsandevents.events.filter(function (_0x2703d9) {
    return _0x2703d9.active && _0x2703d9.triggerTypeId === 9;
  }).forEach(function (_0x379415) {
    if (_0x379415.whichUserId === 2 && _0x379415.userId === _0x43502c.userId) {
      _0x58f062 = _0x379415;
    }
    if (_0x379415.whichUserId === 3 && utils.isSubscriber(_0x43502c)) {
      _0x36f890 = _0x379415;
    }
    if (_0x379415.whichUserId === 4 && utils.isModerator(_0x43502c)) {
      _0x36ac1d = _0x379415;
    }
    if (_0x379415.whichUserId === 6 && utils.isTopGifterNG(_0x43502c, _0x379415)) {
      _0x57bf54 = _0x379415;
    }
    if (_0x379415.whichUserId === 5) {
      _0x5873d8 = _0x379415;
    }
    if (_0x379415.whichUserId === 1) {
      _0x5873d8 = _0x379415;
    }
  });
  if (_0x58f062) {
    return _0x58f062;
  }
  if (_0x36ac1d) {
    return _0x36ac1d;
  }
  if (_0x36f890) {
    return _0x36f890;
  }
  if (_0x57bf54) {
    return _0x57bf54;
  }
  if (_0x5873d8) {
    return _0x5873d8;
  }
  return null;
};
actionsandevents.getEventBySubscribe = function (_0x45f3eb) {
  var _0x297cd9 = null;
  var _0x32e557 = null;
  var _0x21949e = null;
  var _0x20a843 = null;
  var _0x54cbc3 = actionsandevents.events.filter(function (_0x46f3d5) {
    return _0x46f3d5.active && _0x46f3d5.triggerTypeId === 10;
  });
  _0x54cbc3.forEach(function (_0x542155) {
    if (_0x542155.whichUserId === 2 && _0x542155.userId === _0x45f3eb.userId) {
      _0x297cd9 = _0x542155;
    }
    if (_0x542155.whichUserId === 3 && (utils.isSubscriber(_0x45f3eb) || _0x45f3eb.oldSubscribeStatus)) {
      _0x32e557 = _0x542155;
    }
    if (_0x542155.whichUserId === 4 && utils.isModerator(_0x45f3eb)) {
      _0x21949e = _0x542155;
    }
    if (_0x542155.whichUserId === 6 && utils.isTopGifterNG(_0x45f3eb, _0x542155)) {
      _0x20a843 = _0x542155;
    }
  });
  if (_0x297cd9) {
    return _0x297cd9;
  }
  if (_0x21949e) {
    return _0x21949e;
  }
  if (_0x32e557) {
    return _0x32e557;
  }
  if (_0x20a843) {
    return _0x20a843;
  }
  if (_0x54cbc3.length > 0 && [5, 1].includes(_0x54cbc3[0].whichUserId)) {
    return _0x54cbc3[0];
  } else {
    return null;
  }
};
actionsandevents.getEventByEmote = function (_0x443760) {
  var _0x20db92 = null;
  var _0x3d4b59 = null;
  var _0x5e1396 = null;
  var _0x51b29f = null;
  var _0x1b9884 = (window.cachedEmotes || []).find(function (_0x1a886a) {
    return _0x1a886a.emoteId === _0x443760.emoteId;
  });
  var _0x4332eb = _0x1b9884 && _0x1b9884.sourceId !== 4;
  var _0x19eb59 = _0x1b9884 && _0x1b9884.sourceId === 4;
  var _0x21de46 = [];
  if (_0x4332eb) {
    _0x21de46 = actionsandevents.events.filter(function (_0x21c651) {
      return _0x21c651.active && _0x21c651.triggerTypeId === 12 && (_0x21c651.emoteId === _0x443760.emoteId || (_0x1b9884 === null || _0x1b9884 === undefined ? undefined : _0x1b9884.otherIds.includes(_0x21c651.emoteId)));
    });
  } else if (_0x19eb59) {
    _0x21de46 = actionsandevents.events.filter(function (_0x13685f) {
      return _0x13685f.active && _0x13685f.triggerTypeId === 15 && (_0x13685f.emoteId === _0x443760.emoteId || (_0x1b9884 === null || _0x1b9884 === undefined ? undefined : _0x1b9884.otherIds.includes(_0x13685f.emoteId)));
    });
  } else {
    _0x21de46 = actionsandevents.events.filter(function (_0x44d4a2) {
      return _0x44d4a2.active && (_0x44d4a2.triggerTypeId === 12 || _0x44d4a2.triggerTypeId === 15) && _0x44d4a2.emoteId === _0x443760.emoteId;
    });
  }
  _0x21de46.forEach(function (_0x4a9df2) {
    if (_0x4a9df2.whichUserId === 2 && _0x4a9df2.userId === _0x443760.userId) {
      _0x20db92 = _0x4a9df2;
    }
    if (_0x4a9df2.whichUserId === 3 && true) {
      _0x3d4b59 = _0x4a9df2;
    }
    if (_0x4a9df2.whichUserId === 4 && utils.isModerator(_0x443760)) {
      _0x5e1396 = _0x4a9df2;
    }
    if (_0x4a9df2.whichUserId === 6 && utils.isTopGifterNG(_0x443760, _0x4a9df2)) {
      _0x51b29f = _0x4a9df2;
    }
  });
  if (_0x20db92) {
    return _0x20db92;
  }
  if (_0x5e1396) {
    return _0x5e1396;
  }
  if (_0x3d4b59) {
    return _0x3d4b59;
  }
  if (_0x51b29f) {
    return _0x51b29f;
  }
  if (_0x21de46.length > 0 && [5, 1].includes(_0x21de46[0].whichUserId)) {
    return _0x21de46[0];
  } else {
    return null;
  }
};
actionsandevents.getEventByMessage = function (_0x5b4f06) {
  var _0x38a813 = _0x5b4f06.userId;
  var _0x57430f = _0x5b4f06.comment.trim().toLowerCase();
  var _0x1a06cf = null;
  var _0x149c36 = null;
  var _0x3f4350 = null;
  var _0x2b8844 = null;
  var _0x2bd574 = null;
  var _0x4f1d72 = null;
  actionsandevents.events.filter(function (_0xfd0a52) {
    return _0xfd0a52.active && _0xfd0a52.triggerTypeId === 2 && _0xfd0a52.chatCmd;
  }).sort(function (_0x443d61, _0x246638) {
    return _0x443d61.chatCmd.length - _0x246638.chatCmd.length;
  }).forEach(function (_0xee7781) {
    if (_0x57430f.indexOf(_0xee7781.chatCmd.trim().toLowerCase()) === 0 && _0xee7781.whichUserId === 2 && _0xee7781.userId === _0x38a813) {
      _0x1a06cf = _0xee7781;
    }
    if (_0x57430f.indexOf(_0xee7781.chatCmd.trim().toLowerCase()) === 0 && _0xee7781.whichUserId === 3 && utils.isSubscriber(_0x5b4f06)) {
      _0x149c36 = _0xee7781;
    }
    if (_0x57430f.indexOf(_0xee7781.chatCmd.trim().toLowerCase()) === 0 && _0xee7781.whichUserId === 4 && utils.isModerator(_0x5b4f06)) {
      _0x3f4350 = _0xee7781;
    }
    if (_0x57430f.indexOf(_0xee7781.chatCmd.trim().toLowerCase()) === 0 && _0xee7781.whichUserId === 6 && utils.isTopGifterNG(_0x5b4f06, _0xee7781)) {
      _0x2b8844 = _0xee7781;
    }
    if (_0x57430f.indexOf(_0xee7781.chatCmd.trim().toLowerCase()) === 0 && _0xee7781.whichUserId === 5 && utils.isFollower(_0x5b4f06)) {
      _0x2bd574 = _0xee7781;
    }
    if (_0x57430f.indexOf(_0xee7781.chatCmd.trim().toLowerCase()) === 0 && _0xee7781.whichUserId === 1) {
      _0x4f1d72 = _0xee7781;
    }
  });
  if (_0x1a06cf) {
    return _0x1a06cf;
  }
  if (_0x3f4350) {
    return _0x3f4350;
  }
  if (_0x149c36) {
    return _0x149c36;
  }
  if (_0x2b8844) {
    return _0x2b8844;
  }
  if (_0x2bd574) {
    return _0x2bd574;
  }
  if (_0x4f1d72) {
    return _0x4f1d72;
  }
  var _0x1b65ed = null;
  var _0x1a012b = null;
  var _0x1fc2c1 = null;
  var _0x324e58 = null;
  var _0x336bf3 = null;
  var _0x5168db = null;
  actionsandevents.events.filter(function (_0x230733) {
    return _0x230733.active && _0x230733.triggerTypeId === 11;
  }).forEach(function (_0x16cbe2) {
    if (_0x16cbe2.whichUserId === 2 && _0x16cbe2.userId === _0x38a813) {
      _0x1b65ed = _0x16cbe2;
    }
    if (_0x16cbe2.whichUserId === 3 && utils.isSubscriber(_0x5b4f06)) {
      _0x1a012b = _0x16cbe2;
    }
    if (_0x16cbe2.whichUserId === 4 && utils.isModerator(_0x5b4f06)) {
      _0x1fc2c1 = _0x16cbe2;
    }
    if (_0x16cbe2.whichUserId === 6 && utils.isTopGifterNG(_0x5b4f06, _0x16cbe2)) {
      _0x324e58 = _0x16cbe2;
    }
    if (_0x16cbe2.whichUserId === 5 && utils.isFollower(_0x5b4f06)) {
      _0x336bf3 = _0x16cbe2;
    }
    if (_0x16cbe2.whichUserId === 1) {
      _0x5168db = _0x16cbe2;
    }
  });
  if (_0x1b65ed) {
    return _0x1b65ed;
  }
  if (_0x1fc2c1) {
    return _0x1fc2c1;
  }
  if (_0x1a012b) {
    return _0x1a012b;
  }
  if (_0x324e58) {
    return _0x324e58;
  }
  if (_0x336bf3) {
    return _0x336bf3;
  }
  if (_0x5168db) {
    return _0x5168db;
  }
  return null;
};
actionsandevents.getEventByGift = function (_0x3336ee) {
  var _0x50f693 = _0x3336ee.userId;
  var _0x28fdbd = _0x3336ee.giftId;
  var _0x50f573 = _0x3336ee.value;
  var _0x5a2a63 = actionsandevents.events.find(function (_0x295736) {
    return _0x295736.active && _0x295736.triggerTypeId === 4 && _0x295736.giftId === _0x28fdbd && _0x295736.whichUserId === 2 && _0x50f693 === _0x295736.userId;
  });
  var _0x131929 = actionsandevents.events.find(function (_0x113e37) {
    return _0x113e37.active && _0x113e37.triggerTypeId === 4 && _0x113e37.giftId === _0x28fdbd && _0x113e37.whichUserId === 4 && utils.isModerator(_0x3336ee);
  });
  var _0x4176cc = actionsandevents.events.find(function (_0x4d8877) {
    return _0x4d8877.active && _0x4d8877.triggerTypeId === 4 && _0x4d8877.giftId === _0x28fdbd && _0x4d8877.whichUserId === 3 && utils.isSubscriber(_0x3336ee);
  });
  var _0x512cae = actionsandevents.events.find(function (_0xabd774) {
    return _0xabd774.active && _0xabd774.triggerTypeId === 4 && _0xabd774.giftId === _0x28fdbd && _0xabd774.whichUserId === 5 && utils.isFollower(_0x3336ee);
  });
  var _0x4d667d = actionsandevents.events.find(function (_0x59c176) {
    return _0x59c176.active && _0x59c176.triggerTypeId === 4 && _0x59c176.giftId === _0x28fdbd && _0x59c176.whichUserId === 6 && utils.isTopGifterNG(_0x3336ee, _0x59c176);
  });
  var _0x5b44af = actionsandevents.events.find(function (_0x3fccad) {
    return _0x3fccad.active && _0x3fccad.triggerTypeId === 4 && _0x3fccad.giftId === _0x28fdbd && _0x3fccad.whichUserId === 1;
  });
  var _0x466f63 = actionsandevents.events.filter(function (_0x41a55f) {
    return _0x41a55f.active && _0x41a55f.triggerTypeId === 3 && _0x41a55f.minBarsAmount;
  }).sort(function (_0x4e2ea7, _0x3213bb) {
    return _0x3213bb.minBarsAmount - _0x4e2ea7.minBarsAmount;
  }).find(function (_0x2d0a31) {
    return _0x50f573 >= _0x2d0a31.minBarsAmount && _0x2d0a31.whichUserId === 2 && _0x50f693 === _0x2d0a31.userId;
  });
  var _0x5e0e5c = actionsandevents.events.filter(function (_0x54f25f) {
    return _0x54f25f.active && _0x54f25f.triggerTypeId === 3 && _0x54f25f.minBarsAmount;
  }).sort(function (_0x2ff1ac, _0xf23dc9) {
    return _0xf23dc9.minBarsAmount - _0x2ff1ac.minBarsAmount;
  }).find(function (_0x279166) {
    return _0x50f573 >= _0x279166.minBarsAmount && _0x279166.whichUserId === 4 && utils.isModerator(_0x3336ee);
  });
  var _0x349953 = actionsandevents.events.filter(function (_0x41b6aa) {
    return _0x41b6aa.active && _0x41b6aa.triggerTypeId === 3 && _0x41b6aa.minBarsAmount;
  }).sort(function (_0x457b9a, _0xa7694b) {
    return _0xa7694b.minBarsAmount - _0x457b9a.minBarsAmount;
  }).find(function (_0x46ac45) {
    return _0x50f573 >= _0x46ac45.minBarsAmount && _0x46ac45.whichUserId === 3 && utils.isSubscriber(_0x3336ee);
  });
  var _0x5c56b8 = actionsandevents.events.filter(function (_0x1215dc) {
    return _0x1215dc.active && _0x1215dc.triggerTypeId === 3 && _0x1215dc.minBarsAmount;
  }).sort(function (_0x32b44f, _0x3cd1fe) {
    return _0x3cd1fe.minBarsAmount - _0x32b44f.minBarsAmount;
  }).find(function (_0x18010c) {
    return _0x50f573 >= _0x18010c.minBarsAmount && _0x18010c.whichUserId === 5 && utils.isFollower(_0x3336ee);
  });
  var _0x824fe0 = actionsandevents.events.filter(function (_0x561760) {
    return _0x561760.active && _0x561760.triggerTypeId === 3 && _0x561760.minBarsAmount;
  }).sort(function (_0x4a37a8, _0x5ca93f) {
    return _0x5ca93f.minBarsAmount - _0x4a37a8.minBarsAmount;
  }).find(function (_0x1a3ecd) {
    return _0x50f573 >= _0x1a3ecd.minBarsAmount && _0x1a3ecd.whichUserId === 6 && utils.isTopGifterNG(_0x3336ee, _0x1a3ecd);
  });
  var _0x2e2921 = actionsandevents.events.filter(function (_0x2c9386) {
    return _0x2c9386.active && _0x2c9386.triggerTypeId === 3 && _0x2c9386.minBarsAmount;
  }).sort(function (_0x5ad7bc, _0x5b43fc) {
    return _0x5b43fc.minBarsAmount - _0x5ad7bc.minBarsAmount;
  }).find(function (_0x23293b) {
    return _0x50f573 >= _0x23293b.minBarsAmount && _0x23293b.whichUserId === 1;
  });
  if (_0x5a2a63) {
    return _0x5a2a63;
  }
  if (_0x466f63) {
    return _0x466f63;
  }
  if (_0x131929) {
    return _0x131929;
  }
  if (_0x5e0e5c) {
    return _0x5e0e5c;
  }
  if (_0x4176cc) {
    return _0x4176cc;
  }
  if (_0x349953) {
    return _0x349953;
  }
  if (_0x4d667d) {
    return _0x4d667d;
  }
  if (_0x824fe0) {
    return _0x824fe0;
  }
  if (_0x512cae) {
    return _0x512cae;
  }
  if (_0x5c56b8) {
    return _0x5c56b8;
  }
  if (_0x5b44af) {
    return _0x5b44af;
  }
  if (_0x2e2921) {
    return _0x2e2921;
  }
  return null;
};
actionsandevents.getEventByLike = function (_0x4f9e97) {
  var _0x71c6c = _0x4f9e97.userId;
  var _0x2d4ae4 = _0x4f9e97.likeCount;
  function _0x3ca068(_0x409252) {
    if (_0x409252.minLikesAmount <= 0) {
      return false;
    }
    var _0x4d5e26 = Math.floor((_0x4f9e97.totalUserLikeCount - _0x4f9e97.likeCount) / _0x409252.minLikesAmount);
    var _0x12f57a = Math.floor(_0x4f9e97.totalUserLikeCount / _0x409252.minLikesAmount);
    return _0x12f57a > _0x4d5e26;
  }
  var _0x292ade = actionsandevents.events.filter(function (_0x31962f) {
    return _0x31962f.active && _0x31962f.triggerTypeId === 7 && _0x31962f.minLikesAmount;
  }).sort(function (_0x33e68a, _0xe624af) {
    return _0xe624af.minLikesAmount - _0x33e68a.minLikesAmount;
  }).find(function (_0x2d86c6) {
    return (_0x2d4ae4 >= _0x2d86c6.minLikesAmount || _0x3ca068(_0x2d86c6)) && _0x2d86c6.whichUserId === 2 && _0x71c6c === _0x2d86c6.userId;
  });
  var _0x1b1ade = actionsandevents.events.filter(function (_0x4c6f90) {
    return _0x4c6f90.active && _0x4c6f90.triggerTypeId === 7 && _0x4c6f90.minLikesAmount;
  }).sort(function (_0x19b15e, _0x45be0b) {
    return _0x45be0b.minLikesAmount - _0x19b15e.minLikesAmount;
  }).find(function (_0x50d2bb) {
    return (_0x2d4ae4 >= _0x50d2bb.minLikesAmount || _0x3ca068(_0x50d2bb)) && _0x50d2bb.whichUserId === 4 && utils.isModerator(_0x4f9e97);
  });
  var _0x5c601c = actionsandevents.events.filter(function (_0x3c07ca) {
    return _0x3c07ca.active && _0x3c07ca.triggerTypeId === 7 && _0x3c07ca.minLikesAmount;
  }).sort(function (_0x5601ee, _0x1e06ff) {
    return _0x1e06ff.minLikesAmount - _0x5601ee.minLikesAmount;
  }).find(function (_0x409f15) {
    return (_0x2d4ae4 >= _0x409f15.minLikesAmount || _0x3ca068(_0x409f15)) && _0x409f15.whichUserId === 3 && utils.isSubscriber(_0x4f9e97);
  });
  var _0x2e171e = actionsandevents.events.filter(function (_0x67025) {
    return _0x67025.active && _0x67025.triggerTypeId === 7 && _0x67025.minLikesAmount;
  }).sort(function (_0x2fdb30, _0x416f52) {
    return _0x416f52.minLikesAmount - _0x2fdb30.minLikesAmount;
  }).find(function (_0x1b156a) {
    return (_0x2d4ae4 >= _0x1b156a.minLikesAmount || _0x3ca068(_0x1b156a)) && _0x1b156a.whichUserId === 5 && utils.isFollower(_0x4f9e97);
  });
  var _0x25c2ad = actionsandevents.events.filter(function (_0x30ab64) {
    return _0x30ab64.active && _0x30ab64.triggerTypeId === 7 && _0x30ab64.minLikesAmount;
  }).sort(function (_0x18f33f, _0x18968b) {
    return _0x18968b.minLikesAmount - _0x18f33f.minLikesAmount;
  }).find(function (_0x35ab95) {
    return (_0x2d4ae4 >= _0x35ab95.minLikesAmount || _0x3ca068(_0x35ab95)) && _0x35ab95.whichUserId === 6 && utils.isTopGifterNG(_0x4f9e97, _0x35ab95);
  });
  var _0xa11515 = actionsandevents.events.filter(function (_0x1725e1) {
    return _0x1725e1.active && _0x1725e1.triggerTypeId === 7 && _0x1725e1.minLikesAmount;
  }).sort(function (_0x28b8ca, _0x4fa35a) {
    return _0x4fa35a.minLikesAmount - _0x28b8ca.minLikesAmount;
  }).find(function (_0x3bddf4) {
    return (_0x2d4ae4 >= _0x3bddf4.minLikesAmount || _0x3ca068(_0x3bddf4)) && _0x3bddf4.whichUserId === 1;
  });
  if (_0x292ade) {
    return _0x292ade;
  }
  if (_0x1b1ade) {
    return _0x1b1ade;
  }
  if (_0x5c601c) {
    return _0x5c601c;
  }
  if (_0x25c2ad) {
    return _0x25c2ad;
  }
  if (_0x2e171e) {
    return _0x2e171e;
  }
  if (_0xa11515) {
    return _0xa11515;
  }
  return null;
};
actionsandevents.processChatEvent = function (_0x295a52, _0x774633) {
  var _0x422458 = null;
  if (_0x295a52.triggerTypeId === 2 && _0x295a52.chatCmd) {
    _0x422458 = _0x774633.comment.replace(_0x295a52.chatCmd, "").trim();
  }
  if (_0x295a52.triggerTypeId === 11) {
    _0x422458 = _0x774633.comment.trim();
  }
  if (!_0x422458) {
    _0x422458 = " ";
  }
  actionsandevents.executeActionsFromEvent(_0x295a52, _0x295a52.triggerTypeId, _0x774633.userId, _0x774633.name, _0x774633.nickname, _0x422458, null);
};
actionsandevents.onMember = function (_0x188bcf) {
  actionsandevents.handleUserJoin(_0x188bcf.userId, _0x188bcf.name, _0x188bcf.nickname, utils.isSubscriber(_0x188bcf), utils.isModerator(_0x188bcf), utils.isFollower(_0x188bcf), _0x188bcf.teamMemberLevel, true);
};
actionsandevents.onShare = function (_0xa74521) {
  actionsandevents.handleUserJoin(_0xa74521.userId, _0xa74521.name, _0xa74521.nickname, utils.isSubscriber(_0xa74521), utils.isModerator(_0xa74521), utils.isFollower(_0xa74521), _0xa74521.teamMemberLevel);
  var _0xa08111 = actionsandevents.getEventByShare(_0xa74521);
  if (_0xa08111) {
    actionsandevents.executeActionsFromEvent(_0xa08111, _0xa08111.triggerTypeId, _0xa74521.userId, _0xa74521.name, _0xa74521.nickname, null);
  }
};
actionsandevents.onFollow = function (_0x212306) {
  actionsandevents.handleUserJoin(_0x212306.userId, _0x212306.name, _0x212306.nickname, utils.isSubscriber(_0x212306), utils.isModerator(_0x212306), utils.isFollower(_0x212306), _0x212306.teamMemberLevel);
  var _0x19a777 = actionsandevents.getEventByFollow(_0x212306);
  if (_0x19a777) {
    actionsandevents.executeActionsFromEvent(_0x19a777, _0x19a777.triggerTypeId, _0x212306.userId, _0x212306.name, _0x212306.nickname, null);
  }
};
actionsandevents.onSubscribe = function (_0x1db42b) {
  actionsandevents.handleUserJoin(_0x1db42b.userId, _0x1db42b.name, _0x1db42b.nickname, utils.isSubscriber(_0x1db42b), utils.isModerator(_0x1db42b), utils.isFollower(_0x1db42b), _0x1db42b.teamMemberLevel);
  var _0x564df1 = actionsandevents.getEventBySubscribe(_0x1db42b);
  if (_0x564df1) {
    actionsandevents.executeActionsFromEvent(_0x564df1, _0x564df1.triggerTypeId, _0x1db42b.userId, _0x1db42b.name, _0x1db42b.nickname, null, null, null, null, null, null, null, null, _0x1db42b.subMonth);
  }
};
actionsandevents.onEmote = function (_0xa4d8f8) {
  if (setup.inputValues.checkboxProcessOnlyFirstEmoteByActions && _0xa4d8f8.emoteIndex > 0) {
    return;
  }
  actionsandevents.handleUserJoin(_0xa4d8f8.userId, _0xa4d8f8.name, _0xa4d8f8.nickname, utils.isSubscriber(_0xa4d8f8), utils.isModerator(_0xa4d8f8), utils.isFollower(_0xa4d8f8), _0xa4d8f8.teamMemberLevel);
  var _0x15b897 = actionsandevents.getEventByEmote(_0xa4d8f8);
  if (_0x15b897) {
    actionsandevents.executeActionsFromEvent(_0x15b897, _0x15b897.triggerTypeId, _0xa4d8f8.userId, _0xa4d8f8.name, _0xa4d8f8.nickname, null, null, null, null, null, null, null, null, null);
  }
};
actionsandevents.onChat = function (_0x318783) {
  actionsandevents.handleUserJoin(_0x318783.userId, _0x318783.name, _0x318783.nickname, utils.isSubscriber(_0x318783), utils.isModerator(_0x318783), utils.isFollower(_0x318783), _0x318783.teamMemberLevel);
  var _0x44f20e = actionsandevents.getEventByMessage(_0x318783);
  if (_0x44f20e) {
    if (_0x44f20e.triggerTypeId === 2 && _0x44f20e.minTriggerTeamLevel && _0x318783.teamMemberLevel >= _0x44f20e.minTriggerTeamLevel) {
      actionsandevents.processChatEvent(_0x44f20e, _0x318783);
      return;
    }
    if (_0x44f20e.triggerTypeId === 2 && _0x44f20e.minTriggerLevel) {
      api.get("rest/channeluser", {
        channelId: settings.get("channelId"),
        userId: _0x318783.userId
      }, function (_0x2391f4) {
        var _0x6d9294 = 0;
        if (_0x2391f4.channelusers && _0x2391f4.channelusers.length) {
          _0x6d9294 = parseFloat(_0x2391f4.channelusers[0].totalRewardAmount);
        }
        var _0x58b11d = utils.getLevelByPoints(_0x6d9294);
        if (_0x58b11d >= _0x44f20e.minTriggerLevel) {
          actionsandevents.processChatEvent(_0x44f20e, _0x318783);
        } else {
          var _0x498251 = chatbot.chatbotSnippets.find(function (_0x1a823e) {
            return _0x1a823e.id === "ACTION_FAILED_LEVEL" && _0x1a823e.enabled;
          });
          if (!_0x498251) {
            return;
          }
          var _0x137276 = _0x498251.message.replaceAll("%username%", _0x318783.name).replaceAll("%requiredlevel%", _0x44f20e.minTriggerLevel);
          chatservice.sendMessage(_0x137276, _0x318783.name, _0x498251.id);
        }
      });
    }
    if (_0x44f20e.triggerTypeId !== 2 || !_0x44f20e.minTriggerTeamLevel && !_0x44f20e.minTriggerLevel) {
      actionsandevents.processChatEvent(_0x44f20e, _0x318783);
    }
  }
};
actionsandevents.onGift = function (_0x1335c2) {
  if (_0x1335c2.isBroadcaster) {
    return;
  }
  actionsandevents.handleUserJoin(_0x1335c2.userId, _0x1335c2.name, _0x1335c2.nickname, utils.isSubscriber(_0x1335c2), utils.isModerator(_0x1335c2), utils.isFollower(_0x1335c2), _0x1335c2.teamMemberLevel);
  var _0x23a050 = actionsandevents.getEventByGift(_0x1335c2);
  if (_0x23a050) {
    actionsandevents.executeActionsFromEvent(_0x23a050, _0x23a050.triggerTypeId, _0x1335c2.userId, _0x1335c2.name, _0x1335c2.nickname, null, _0x1335c2.giftId, _0x1335c2.giftName, _0x1335c2.repeatCount, undefined, undefined, false, _0x1335c2);
  }
};
actionsandevents.onRawGift = function () {
  var _0x11c214 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x482386(_0x5c9d8) {
    var _0x4cbb58;
    var _0xc35115;
    var _0x37e1cd;
    var _0xdc3e6d;
    var _0x16d636;
    var _0x513b56;
    return _regeneratorRuntime().wrap(function _0x11a01e(_0xebfd42) {
      while (1) {
        switch (_0xebfd42.prev = _0xebfd42.next) {
          case 0:
            _0x5c9d8 = JSON.parse(JSON.stringify(_0x5c9d8));
            _0x4cbb58 = `${_0x5c9d8.giftId}_${_0x5c9d8.userId}_${_0x5c9d8.groupId}`;
            if (_0x5c9d8.diamondCount) {
              _0x5c9d8.value = _0x5c9d8.diamondCount;
            }
            if (!_0x5c9d8.isBroadcaster) {
              _0xebfd42.next = 5;
              break;
            }
            return _0xebfd42.abrupt("return");
          case 5:
            actionsandevents.handleUserJoin(_0x5c9d8.userId, _0x5c9d8.name, _0x5c9d8.nickname, utils.isSubscriber(_0x5c9d8), utils.isModerator(_0x5c9d8), utils.isFollower(_0x5c9d8), _0x5c9d8.teamMemberLevel);
            _0xc35115 = actionsandevents.getEventByGift(_0x5c9d8);
            if (!_0xc35115 || !(_0x5c9d8.repeatCount > 0)) {
              _0xebfd42.next = 21;
              break;
            }
            _0x37e1cd = actionsandevents.giftRepeatInfo[_0x4cbb58] || 0;
            _0xdc3e6d = _0x5c9d8.repeatCount - _0x37e1cd;
            actionsandevents.giftRepeatInfo[_0x4cbb58] = _0x5c9d8.repeatCount;
            if (!(_0xdc3e6d > 0)) {
              _0xebfd42.next = 21;
              break;
            }
            _0x16d636 = 0;
          case 13:
            if (!(_0x16d636 < _0xdc3e6d)) {
              _0xebfd42.next = 21;
              break;
            }
            _0x513b56 = JSON.parse(JSON.stringify(_0x5c9d8));
            _0x513b56.repeatCount = _0x37e1cd + _0x16d636 + 1;
            _0xebfd42.next = 18;
            return actionsandevents.executeActionsFromEvent(_0xc35115, _0xc35115.triggerTypeId, _0x513b56.userId, _0x513b56.name, _0x513b56.nickname, null, _0x513b56.giftId, _0x513b56.giftName, _0x513b56.repeatCount, undefined, undefined, true, _0x513b56);
          case 18:
            _0x16d636++;
            _0xebfd42.next = 13;
            break;
          case 21:
            if (_0x5c9d8.repeatEnd || _0x5c9d8.giftType > 1) {
              delete actionsandevents.giftRepeatInfo[_0x4cbb58];
            }
          case 22:
          case "end":
            return _0xebfd42.stop();
        }
      }
    }, _0x482386);
  }));
  return function (_0x46be7e) {
    return _0x11c214.apply(this, arguments);
  };
}();
actionsandevents.onLike = function (_0x4d5e2b) {
  if (_0x4d5e2b.isBroadcaster) {
    return;
  }
  actionsandevents.handleUserJoin(_0x4d5e2b.userId, _0x4d5e2b.name, _0x4d5e2b.nickname, utils.isSubscriber(_0x4d5e2b), utils.isModerator(_0x4d5e2b), utils.isFollower(_0x4d5e2b), _0x4d5e2b.teamMemberLevel);
  var _0x3c0dd6 = actionsandevents.getEventByLike(_0x4d5e2b);
  if (_0x3c0dd6) {
    actionsandevents.executeActionsFromEvent(_0x3c0dd6, _0x3c0dd6.triggerTypeId, _0x4d5e2b.userId, _0x4d5e2b.name, _0x4d5e2b.nickname, null, _0x4d5e2b.id, _0x4d5e2b.giftName, _0x4d5e2b.repeatCount, Math.max(_0x4d5e2b.likeCount, _0x3c0dd6.minLikesAmount), _0x4d5e2b.totalUserLikeCount);
  }
};
actionsandevents.onShopItemPurchased = function (_0xb4aeeb) {
  console.log("Shop item purchased", _0xb4aeeb);
  var _0x25bdb0 = actionsandevents.events.find(function (_0x47945c) {
    var _0x36e496;
    return _0x47945c.active && _0x47945c.triggerTypeId === 14 && _0x47945c.productName && ((_0x36e496 = _0xb4aeeb.productName) === null || _0x36e496 === undefined ? undefined : _0x36e496.toLowerCase().includes(_0x47945c.productName.toLowerCase().trim()));
  });
  var _0x4a7122 = actionsandevents.events.find(function (_0x94cd3c) {
    return _0x94cd3c.active && _0x94cd3c.triggerTypeId === 14 && !_0x94cd3c.productName;
  });
  var _0x1943bb = _0x25bdb0 || _0x4a7122;
  if (_0x1943bb) {
    actionsandevents.executeActionsFromEvent(_0x1943bb, _0x1943bb.triggerTypeId, 0, _0xb4aeeb.productName || "Product Purchased", _0xb4aeeb.productName || "Product Purchased", null, null, null, null, null, null, null, null, null, null, null, _0xb4aeeb.productPictureUrl);
  }
};
actionsandevents.openAnimationChooser = function (_0x2943f2) {
  var _0x4a7873 = $("#animationChooserModas");
  if (!_0x4a7873.length) {
    _0x4a7873 = $("<div>").attr("id", "animationChooserModas");
    $("#pages").append(_0x4a7873);
  }
  var _0x1a0da2 = $("<div>");
  _0x4a7873.append(_0x1a0da2);
  _0x1a0da2.dxPopup({
    width: 650,
    height: 720,
    visible: true,
    title: localization.getString("actionsandevents_actions_modal_option_show_animation_select"),
    closeOnOutsideClick: true,
    showCloseButton: true,
    showScrollbar: true,
    contentTemplate: function _0x504262(_0x54d47b) {
      var _0x41de7b = $("<div>");
      var _0x45dd30 = $("<div>");
      var _0x1bfbe8 = $("<div>");
      _0x41de7b.attr("id", "animationChooserTabView");
      _0x54d47b.append(_0x41de7b);
      _0x54d47b.append(_0x1bfbe8);
      _0x1bfbe8.attr("style", "\n                font-size: 0.8em;\n                position: absolute;\n                top: 124px;\n                left: 272px;\n                z-index: 9999;\n            ");
      _0x1bfbe8.hide();
      var _0x63c412 = ["LEVEL_CHEST", "LEVEL_GUN", "LEVEL_RAIN", "LIKE_STORM", "MONKEY_BANANA", "MUCKLAUS", "NBRAS", "ROYAL_FLUSH", "SHIN_CHAN", "CORVETTE", "PLATINUM_CONVOY", "MAKE_IT_RAIN", "JUANDEAMORES_GIFT"];
      api.get("getAllAnimations", null, function (_0x522c2a) {
        var _0xc3749 = _0x522c2a.animations;
        _0x41de7b.dxTabs({
          selectedIndex: 0,
          dataSource: [{
            id: 0,
            text: "General Animations (" + _0xc3749.filter(function (_0x230d8a) {
              return _0x230d8a.vendor === "lottiefiles";
            }).length + ")",
            icon: "globe"
          }, {
            id: 1,
            text: "Gift Animations (" + _0xc3749.filter(function (_0x280377) {
              return _0x280377.vendor === "younowgifts";
            }).length + ")",
            icon: "gift"
          }],
          onItemClick: function _0x34fef0(_0x13b5da) {
            _0x45dd30.dxDataGrid("instance").option("dataSource", []);
            setTimeout(function () {
              if (_0x13b5da.itemData.id === 0) {
                _0x1bfbe8.fadeOut(100);
                _0x45dd30.dxDataGrid("instance").option("dataSource", _0xc3749.filter(function (_0x4907b9) {
                  return _0x4907b9.vendor === "lottiefiles";
                }));
              } else {
                _0x1bfbe8.fadeIn(100);
                _0x45dd30.dxDataGrid("instance").option("dataSource", _0xc3749.filter(function (_0x2c3da5) {
                  return _0x2c3da5.vendor === "younowgifts";
                }).sort(function (_0x152bcc, _0x37b941) {
                  var _0x11842b = -1;
                  _0x63c412.forEach(function (_0x29fcb5) {
                    if (_0x37b941.url.includes(_0x29fcb5)) {
                      _0x11842b = 1;
                      return;
                    }
                  });
                  return _0x11842b;
                }));
              }
            }, 100);
          }
        });
        _0x41de7b.css("margin-bottom", "10px");
        _0x45dd30.addClass("animationChooserGrid");
        _0x54d47b.append(_0x45dd30);
        _0x45dd30.dxDataGrid({
          height: 575,
          noDataText: " ",
          scrolling: {
            mode: "virtual",
            showScrollbar: "always",
            rowRenderingMode: "virtual",
            columnRenderingMode: "virtual",
            preloadEnabled: false
          },
          dataSource: _0xc3749.filter(function (_0xe0350e) {
            return _0xe0350e.vendor === "lottiefiles";
          }),
          searchPanel: {
            visible: true,
            width: 240
          },
          hoverStateEnabled: true,
          columns: [{
            dataField: "url",
            caption: "Name",
            width: "30%",
            cellTemplate: function _0x36f3ec(_0x4d0a94, _0x459eb4) {
              var _0x1815f5 = actionsandevents.getAnimationNameFromPath(_0x459eb4.text);
              _0x4d0a94.css("height", "220px");
              _0x4d0a94.css("text-align", "center");
              _0x4d0a94.css("vertical-align", "middle");
              _0x4d0a94.css("cursor", "pointer");
              _0x4d0a94.append($("<div>").text(_0x1815f5));
            }
          }, {
            dataField: "url",
            caption: "Preview",
            cellTemplate: function _0x5cb715(_0x5c46e4, _0x334d63) {
              _0x5c46e4.css("height", "220px");
              _0x5c46e4.css("text-align", "center");
              _0x5c46e4.css("cursor", "pointer");
              if (_0x334d63.value.includes("/gifts/")) {
                var _0x5d5110 = $("<lottie-player background=\"transparent\" speed=\"1\" style=\"width: 100%; height: 100%; margin: 0px auto; margin-top: 10px\" loop autoplay></lottie-player>");
                _0x5c46e4.append(_0x5d5110);
                _0x5d5110.attr("src", _0x334d63.value);
              } else {
                var _0x5d5110 = $("<lottie-player background=\"transparent\" speed=\"1\" style=\"width: 180px; height: 180px; margin: 0px auto; margin-top: 10px\" loop autoplay></lottie-player>");
                _0x5c46e4.append(_0x5d5110);
                _0x5d5110.attr("src", _0x334d63.value);
              }
            }
          }],
          onRowClick: function _0x76ee1a(_0x1ee17a) {
            _0x2943f2(_0x1ee17a.data.url);
            _0x1a0da2.dxPopup("instance").hide();
          }
        });
      });
      return _0x54d47b;
    }
  });
};
actionsandevents.getAnimationNameFromPath = function (_0x291c7e) {
  if (_0x291c7e.includes("/gifts/")) {
    return _0x291c7e.split("/").slice(-1)[0].replace("gift_", "").split("_full_lottie.json")[0];
  } else {
    return _0x291c7e.split("/").slice(-1)[0].replace(/[0-9]/g, "").replace(".json", "").replaceAll("-", " ");
  }
};
actionsandevents.openWebhookHint = function () {
  var _0x5a9565 = $("#webhookHintPopup");
  if (!_0x5a9565.length) {
    console.log("create new");
    _0x5a9565 = $("<div>").attr("id", "webhookHintPopup");
    $("#pages").append(_0x5a9565);
  }
  _0x5a9565.dxPopup({
    width: 550,
    height: 480,
    visible: true,
    title: "WebHooks",
    closeOnOutsideClick: true,
    showCloseButton: true,
    contentTemplate: function _0x2a537c(_0x33b650) {
      var _0x598b6c = $("<div>");
      var _0x51fff7 = $("<div>").html(localization.getString("actionsandevents_actions_modal_option_trigger_webhook_hint_text"));
      _0x598b6c.append(_0x51fff7);
      _0x598b6c.dxScrollView({
        showScrollbar: "always"
      });
      _0x33b650.append(_0x598b6c);
      return _0x33b650;
    }
  });
};
actionsandevents.openMcCmdHint = function () {
  var _0x3fdbf3 = $("#mcCmdHintPopup");
  if (!_0x3fdbf3.length) {
    console.log("create new");
    _0x3fdbf3 = $("<div>").attr("id", "mcCmdHintPopup");
    $("#pages").append(_0x3fdbf3);
  }
  _0x3fdbf3.dxPopup({
    width: 550,
    height: 480,
    visible: true,
    title: "Minecraft Commands",
    closeOnOutsideClick: true,
    showCloseButton: true,
    contentTemplate: function _0x20b286(_0x55d818) {
      var _0xbe3e0d = $("<div>");
      var _0x54a3f5 = $("<div>").html(localization.getString("actionsandevents_actions_modal_option_trigger_mccmd_hint_text"));
      _0xbe3e0d.append(_0x54a3f5);
      _0xbe3e0d.dxScrollView({
        showScrollbar: "always"
      });
      _0x55d818.append(_0xbe3e0d);
      return _0x55d818;
    }
  });
};
actionsandevents.handleUserJoin = function (_0x1c9327, _0x770987, _0x4acd38, _0x373878, _0x278fd1, _0x42f936, _0x3f14ec, _0x534d07) {
  if (_0x1c9327 === window.session.channelId) {
    return;
  }
  if (broadcastlistener.currentBroadcast && broadcastlistener.currentBroadcast.roomId !== actionsandevents.joinedUserCurrentBroadcastId) {
    actionsandevents.joinedUserCurrentBroadcastId = broadcastlistener.currentBroadcast.roomId;
    actionsandevents.joinedUserIds = [];
    actionsandevents.firstActivityUserIds = [];
  }
  var _0xdf0033 = function _0x1ab1fc(_0x772750) {
    var _0x4f3fe7 = actionsandevents.events.find(function (_0x108ba2) {
      return _0x108ba2.active && _0x108ba2.triggerTypeId === _0x772750 && _0x108ba2.whichUserId === 2 && _0x1c9327 === _0x108ba2.userId;
    });
    var _0x53aa54 = actionsandevents.events.find(function (_0x74e6b5) {
      return _0x74e6b5.active && _0x74e6b5.triggerTypeId === _0x772750 && _0x74e6b5.whichUserId === 4 && _0x278fd1;
    });
    var _0x1943de = actionsandevents.events.find(function (_0x22a7e2) {
      return _0x22a7e2.active && _0x22a7e2.triggerTypeId === _0x772750 && _0x22a7e2.whichUserId === 3 && _0x373878;
    });
    var _0x2657c3 = actionsandevents.events.find(function (_0x29cfbd) {
      return _0x29cfbd.active && _0x29cfbd.triggerTypeId === _0x772750 && _0x29cfbd.whichUserId === 5 && _0x42f936;
    });
    var _0x14782c = actionsandevents.events.find(function (_0x1e7d5f) {
      return _0x1e7d5f.active && _0x1e7d5f.triggerTypeId === _0x772750 && _0x1e7d5f.whichUserId === 1;
    });
    if (_0x4f3fe7) {
      return _0x4f3fe7;
    }
    if (_0x53aa54) {
      return _0x53aa54;
    }
    if (_0x1943de) {
      return _0x1943de;
    }
    if (_0x2657c3) {
      return _0x2657c3;
    }
    if (_0x14782c) {
      return _0x14782c;
    }
  };
  if (_0x534d07 || !actionsandevents.joinedUserIds.includes(_0x1c9327)) {
    var _0x3cee9f = _0xdf0033(6);
    if (_0x3cee9f) {
      if (_0x3cee9f.minTriggerTeamLevel > 0 && _0x3f14ec < _0x3cee9f.minTriggerTeamLevel) {} else {
        if (!actionsandevents.joinedUserIds.includes(_0x1c9327)) {
          actionsandevents.joinedUserIds.push(_0x1c9327);
        }
        actionsandevents.executeActionsFromEvent(_0x3cee9f, _0x3cee9f.triggerTypeId, _0x1c9327, _0x770987, _0x4acd38);
      }
    }
  }
  if (!_0x534d07 && !actionsandevents.firstActivityUserIds.includes(_0x1c9327)) {
    var _0x3cee9f = _0xdf0033(13);
    if (_0x3cee9f) {
      if (_0x3cee9f.minTriggerTeamLevel > 0 && _0x3f14ec < _0x3cee9f.minTriggerTeamLevel) {} else {
        actionsandevents.firstActivityUserIds.push(_0x1c9327);
        actionsandevents.executeActionsFromEvent(_0x3cee9f, _0x3cee9f.triggerTypeId, _0x1c9327, _0x770987, _0x4acd38);
      }
    }
  }
};
actionsandevents.initTimerGrid = function (_0x3004f7) {
  _0x3004f7.empty();
  var _0x27561f = $("<div>").dxDataGrid({
    width: "700px",
    showBorders: true,
    dataSource: actionsandevents.timer,
    editing: {
      allowUpdating: true,
      allowDeleting: true,
      mode: "row",
      texts: {
        confirmDeleteMessage: ""
      }
    },
    scrolling: {
      mode: "standard"
    },
    paging: {
      enabled: false
    },
    noDataText: localization.getString("actionsandevents_timerevents_empty"),
    columns: [{
      type: "buttons",
      width: 80,
      buttons: [{
        name: "save",
        icon: "check"
      }, {
        name: "edit",
        icon: "edit",
        hint: "Edit"
      },, {
        name: "cancel",
        icon: "close",
        hint: "Cancel"
      }, {
        name: "delete",
        icon: "trash"
      }]
    }, {
      dataField: "active",
      caption: localization.getString("actionsandevents_events_list_active"),
      dataType: "boolean",
      width: "70px"
    }, {
      dataField: "intervalMinutes",
      caption: localization.getString("actionsandevents_timerevents_interval"),
      dataType: "number",
      width: "150px",
      alignment: "left",
      editorOptions: {
        showSpinButtons: true,
        min: 1,
        max: 240
      }
    }, {
      dataField: "actionId",
      caption: localization.getString("actionsandevents_timerevents_action"),
      dataType: "number",
      alignment: "left",
      lookup: {
        dataSource: actionsandevents.actions,
        displayExpr: "name",
        valueExpr: "id"
      },
      editorOptions: {
        noDataText: localization.getString("actionsandevents_events_modal_no_action")
      },
      customizeText: function _0x1c7993(_0x1340b4) {
        if (!_0x1340b4.value) {
          return "-";
        }
        return _0x1340b4.value;
      }
    }],
    onInitNewRow: function _0x1fcc3a(_0x379565) {
      _0x379565.data.id = utils.uuidv4();
      _0x379565.data.active = true;
      _0x379565.data.intervalMinutes = 5;
    },
    onRowInserted: function _0xd9a00(_0x2c36f3) {
      settings.set("timer", JSON.stringify(actionsandevents.timer));
      toastr.success(null, localization.getString("actionsandevents_saved_timer"));
    },
    onRowUpdated: function _0x30afb7(_0x421db7) {
      settings.set("timer", JSON.stringify(actionsandevents.timer));
      toastr.success(null, localization.getString("actionsandevents_saved_timer"));
    },
    onRowRemoved: function _0x45c181(_0x50cf20) {
      settings.set("timer", JSON.stringify(actionsandevents.timer));
      toastr.success(null, localization.getString("actionsandevents_deleted_timer"));
    },
    onRowClick: function _0x3265f5(_0x4fccd3) {
      _0x4fccd3.component.saveEditData();
      _0x4fccd3.component.editRow(_0x4fccd3.rowIndex);
    }
  });
  var _0x581234 = $("<div>").dxButton({
    icon: "add",
    text: localization.getString("actionsandevents_timerevents_new"),
    onClick: function _0x3ac787() {
      _0x27561f.dxDataGrid("instance").addRow();
    }
  }).css("margin-bottom", "10px");
  $("body").on("mouseup", function (_0x1d89c0) {
    if ($(_0x1d89c0.target).closest(_0x27561f).length == 1) {
      return;
    }
    if ($(_0x1d89c0.target).closest(_0x581234).length == 1) {
      return;
    }
    setTimeout(function () {
      try {
        _0x27561f.dxDataGrid("instance").saveEditData();
      } catch (_0x32b103) {}
    }, 300);
  });
  _0x3004f7.append(_0x581234);
  _0x3004f7.append(_0x27561f);
  return _0x27561f;
};
actionsandevents.refreshTimerGrid = function () {
  var _0x5aad86 = actionsandevents.localTimerGrid.dxDataGrid("instance");
  _0x5aad86.beginUpdate();
  _0x5aad86.columnOption("actionId", "lookup.dataSource", actionsandevents.actions);
  _0x5aad86.option("dataSource", []);
  _0x5aad86.option("dataSource", actionsandevents.timer);
  _0x5aad86.endUpdate();
  console.log("refreshTimerGrid called");
};
actionsandevents.timerTick = function () {
  if (!broadcastlistener.isLive) {
    return;
  }
  var _0x498058 = new Date().getTime();
  actionsandevents.timer.filter(function (_0x29e7a7) {
    return _0x29e7a7.active;
  }).forEach(function (_0x29da46) {
    if (!actionsandevents.timerLastExecutionTs[_0x29da46.id]) {
      actionsandevents.timerLastExecutionTs[_0x29da46.id] = _0x498058;
    }
    var _0x2ca06a = _0x29da46.intervalMinutes * 60 * 1000;
    if (_0x498058 >= actionsandevents.timerLastExecutionTs[_0x29da46.id] + _0x2ca06a) {
      actionsandevents.timerLastExecutionTs[_0x29da46.id] = _0x498058;
      console.info("exec timer actionId", _0x29da46.actionId);
      actionsandevents.executeAction(_0x29da46.actionId);
    }
  });
};
actionsandevents.switchObsSceneQueueProcessor = function () {
  var _0x2116b1 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x1c20d1(_0x3891b8) {
    var _0x619cd1;
    var _0x29753a;
    var _0x5ea3f3;
    return _regeneratorRuntime().wrap(function _0x53754d(_0x37f53b) {
      while (1) {
        switch (_0x37f53b.prev = _0x37f53b.next) {
          case 0:
            _0x5ea3f3 = function _0x204339() {
              return new Promise(function (_0x37afc5, _0x25ce3f) {
                setup.execObsCommand("SetCurrentProgramScene", {
                  sceneName: action.obsSceneId
                }, function () {
                  _0x37afc5();
                }, function (_0x2e14c4) {
                  _0x25ce3f();
                });
                setTimeout(function () {
                  return _0x25ce3f();
                }, 1000);
              });
            };
            if (!actionsandevents.switchSceneInProgress && actionsandevents.switchSceneActionQueue.length !== 0) {
              _0x37f53b.next = 3;
              break;
            }
            return _0x37f53b.abrupt("return");
          case 3:
            action = actionsandevents.switchSceneActionQueue.shift();
            actionsandevents.switchSceneInProgress = true;
            _0x619cd1 = action.dynamicConfig && action.dynamicConfig.obsSceneBehaviorId > 1 ? false : true;
            if (!_0x619cd1) {
              _0x37f53b.next = 17;
              break;
            }
            if (!_0x3891b8 && !actionsandevents.restoreSceneInterval) {
              _0x37f53b.next = 11;
              break;
            }
            if (actionsandevents.restoreSceneInterval) {
              clearIntervalFix(actionsandevents.restoreSceneInterval);
              actionsandevents.restoreSceneInterval = null;
            }
            _0x37f53b.next = 13;
            break;
          case 11:
            _0x37f53b.next = 13;
            return new Promise(function (_0x24a64a) {
              setup.execObsCommand("GetCurrentProgramScene", null, function (_0x2f5a8d) {
                actionsandevents.sceneIdToRestore = _0x2f5a8d.currentProgramSceneName;
                _0x24a64a();
              }, function (_0xa64efd) {
                _0x24a64a();
              });
            });
          case 13:
            _0x29753a = action.duration;
            actionsandevents.restoreSceneInterval = setIntervalFix(function () {
              actionsandevents.switchSceneInProgress = false;
              clearIntervalFix(actionsandevents.restoreSceneInterval);
              actionsandevents.restoreSceneInterval = null;
              if (actionsandevents.switchSceneActionQueue.length > 0) {
                actionsandevents.switchObsSceneQueueProcessor(true);
              } else {
                setup.execObsCommand("SetCurrentProgramScene", {
                  sceneName: actionsandevents.sceneIdToRestore
                });
              }
            }, _0x29753a * 1000);
            _0x37f53b.next = 22;
            break;
          case 17:
            clearIntervalFix(actionsandevents.restoreSceneInterval);
            actionsandevents.restoreSceneInterval = null;
            actionsandevents.sceneIdToRestore = null;
            actionsandevents.switchSceneInProgress = false;
            actionsandevents.switchObsSceneQueueProcessor();
          case 22:
            _0x5ea3f3().catch(function () {
              utils.showError("OBS Error", "Communication Error");
            });
          case 23:
          case "end":
            return _0x37f53b.stop();
        }
      }
    }, _0x1c20d1);
  }));
  return function (_0x5a4f16) {
    return _0x2116b1.apply(this, arguments);
  };
}();
actionsandevents.appendToObsSourceQueueProcessor = function () {
  var _0x5e2662 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x3def22(_0x4cbc61, _0x22aa08) {
    var _0x118513;
    var _0x48aca9;
    return _regeneratorRuntime().wrap(function _0x237720(_0x521b5b) {
      while (1) {
        switch (_0x521b5b.prev = _0x521b5b.next) {
          case 0:
            actionsandevents.activateSourceQueue.push({
              sourceId: _0x4cbc61,
              duration: _0x22aa08
            });
            if (!actionsandevents.activateSourceInProgress[_0x4cbc61]) {
              _0x521b5b.next = 3;
              break;
            }
            return _0x521b5b.abrupt("return");
          case 3:
            _0x118513 = _regeneratorRuntime().mark(function _0x3f7cf1() {
              var _0x5a62f8;
              return _regeneratorRuntime().wrap(function _0x31528b(_0x203eb2) {
                while (1) {
                  switch (_0x203eb2.prev = _0x203eb2.next) {
                    case 0:
                      _0x5a62f8 = actionsandevents.activateSourceQueue.find(function (_0x5bae9c) {
                        return _0x5bae9c.sourceId === _0x4cbc61;
                      });
                      if (!_0x5a62f8) {
                        _0x203eb2.next = 14;
                        break;
                      }
                      actionsandevents.activateSourceQueue = actionsandevents.activateSourceQueue.filter(function (_0x32b094) {
                        return _0x32b094 !== _0x5a62f8;
                      });
                      actionsandevents.activateSourceInProgress[_0x4cbc61] = true;
                      _0x203eb2.prev = 4;
                      _0x203eb2.next = 7;
                      return actionsandevents.activateObsSource(_0x5a62f8.sourceId, _0x5a62f8.duration * 1000);
                    case 7:
                      _0x203eb2.next = 12;
                      break;
                    case 9:
                      _0x203eb2.prev = 9;
                      _0x203eb2.t0 = _0x203eb2.catch(4);
                      utils.showError("OBS Error", `Failed to activate source "${_0x5a62f8.sourceId}" - ${_0x203eb2.t0 === null || _0x203eb2.t0 === undefined ? undefined : _0x203eb2.t0.toString()}`);
                    case 12:
                      _0x203eb2.next = 15;
                      break;
                    case 14:
                      return _0x203eb2.abrupt("return", "break");
                    case 15:
                    case "end":
                      return _0x203eb2.stop();
                  }
                }
              }, _0x3f7cf1, null, [[4, 9]]);
            });
          case 4:
            if (!true) {
              _0x521b5b.next = 11;
              break;
            }
            return _0x521b5b.delegateYield(_0x118513(), "t0", 6);
          case 6:
            _0x48aca9 = _0x521b5b.t0;
            if (_0x48aca9 !== "break") {
              _0x521b5b.next = 9;
              break;
            }
            return _0x521b5b.abrupt("break", 11);
          case 9:
            _0x521b5b.next = 4;
            break;
          case 11:
            actionsandevents.activateSourceInProgress[_0x4cbc61] = false;
          case 12:
          case "end":
            return _0x521b5b.stop();
        }
      }
    }, _0x3def22);
  }));
  return function (_0x4bd3d3, _0x5bd534) {
    return _0x5e2662.apply(this, arguments);
  };
}();
actionsandevents.activateObsSource = function (_0x3dac22, _0x34973e) {
  return new Promise(function (_0x962b62, _0xd3440f) {
    var _0x26372f = _0x3dac22.split(";")[0];
    var _0x4c1236 = parseInt(_0x3dac22.split(";")[1]);
    setup.execObsCommand("SetSceneItemEnabled", {
      sceneName: _0x26372f,
      sceneItemId: _0x4c1236,
      sceneItemEnabled: true
    }, function (_0x33b6a2) {
      setTimeoutFix(function () {
        setup.execObsCommand("SetSceneItemEnabled", {
          sceneName: _0x26372f,
          sceneItemId: _0x4c1236,
          sceneItemEnabled: false
        }, function () {
          _0x962b62();
        }, function (_0x58f1cf) {
          _0xd3440f(_0x58f1cf);
        });
      }, _0x34973e);
    }, function (_0x2612a2) {
      _0xd3440f(_0x2612a2);
    });
  });
};
actionsandevents.loadAllObsSources = function () {
  return new Promise(function (_0x5199b3, _0x2a72e6) {
    var _0xd68c6c = 0;
    var _0x9d9d4a = [];
    setup.execObsCommand("GetSceneList", {}, function (_0xc2d89f) {
      _0xc2d89f.scenes.forEach(function (_0x215b8a) {
        _0xd68c6c += 1;
        setup.execObsCommand("GetSceneItemList", {
          sceneName: _0x215b8a.sceneName
        }, function (_0x512dd9) {
          _0xd68c6c -= 1;
          _0x512dd9.sceneItems.forEach(function (_0x1d9b4d) {
            _0x1d9b4d.sceneName = _0x215b8a.sceneName;
            _0x1d9b4d.label = _0x215b8a.sceneName + " - " + _0x1d9b4d.sourceName;
            _0x1d9b4d.id = _0x215b8a.sceneName + ";" + _0x1d9b4d.sceneItemId;
            _0x9d9d4a.push(_0x1d9b4d);
          });
          if (_0xd68c6c === 0) {
            _0x5199b3(_0x9d9d4a);
          }
        }, _0x2a72e6);
      });
    }, _0x2a72e6);
  });
};
actionsandevents.getScreenUrl = function (_0x37a4bf) {
  var _0x3fc608;
  return location.origin + "/widget/myactions?cid=" + (((_0x3fc608 = window.session) === null || _0x3fc608 === undefined ? undefined : _0x3fc608.me?.channelId) || 0) + "&screen=" + _0x37a4bf;
  ;
};
actionsandevents.getAllEmotes = function () {
  return new Promise(function (_0x1ecffe, _0x5a5e73) {
    var _0x27a937;
    var _0xae74f6;
    if ((_0x27a937 = window.session.me) === null || _0x27a937 === undefined || (_0xae74f6 = _0x27a937.channel) === null || _0xae74f6 === undefined || !_0xae74f6.channelName) {
      return _0x1ecffe([]);
    }
    if (window.cachedEmotes) {
      return _0x1ecffe(window.cachedEmotes);
    }
    api.get("getChannelEmotes", {
      uniqueId: window.session.me.channel.channelName
    }, function (_0x407567) {
      var _0xf75172 = _createForOfIteratorHelper(_0x407567.emotes);
      var _0x25ca5a;
      try {
        for (_0xf75172.s(); !(_0x25ca5a = _0xf75172.n()).done;) {
          emote = _0x25ca5a.value;
          emote.otherIds = _0x407567.emotes.filter(function (_0xfae17d) {
            return _0xfae17d.imageUrl === emote.imageUrl && _0xfae17d.emoteId !== emote.emoteId;
          }).map(function (_0x4c1256) {
            return _0x4c1256.emoteId;
          });
        }
      } catch (_0x503e56) {
        _0xf75172.e(_0x503e56);
      } finally {
        _0xf75172.f();
      }
      window.cachedEmotes = _0x407567.emotes;
      settings.set("broadcastEmotes", JSON.stringify(_0x407567.emotes));
      _0x1ecffe(_0x407567.emotes);
    }, function () {
      _0x5a5e73();
    });
  });
};
actionsandevents.getAllGiftsCached = _asyncToGenerator(_regeneratorRuntime().mark(function _callee33() {
  return _regeneratorRuntime().wrap(function _0xd10b52(_0x3c4896) {
    while (1) {
      switch (_0x3c4896.prev = _0x3c4896.next) {
        case 0:
          if (actionsandevents.getAllGiftsCalled) {
            _0x3c4896.next = 5;
            break;
          }
          console.warn("getAllGiftsCached called without getAllGifts");
          return _0x3c4896.abrupt("return", actionsandevents.getAllGifts());
        case 5:
          console.log("getAllGiftsCached called, using cached gifts");
        case 6:
          if (Array.isArray(actionsandevents.cachedGifts)) {
            _0x3c4896.next = 11;
            break;
          }
          _0x3c4896.next = 9;
          return new Promise(function (_0x38a7ef) {
            return setTimeout(_0x38a7ef, 100);
          });
        case 9:
          _0x3c4896.next = 6;
          break;
        case 11:
          return _0x3c4896.abrupt("return", actionsandevents.cachedGifts);
        case 12:
        case "end":
          return _0x3c4896.stop();
      }
    }
  }, _callee33);
}));
actionsandevents.getAllGifts = function (_0x48791d) {
  actionsandevents.getAllGiftsCalled = true;
  return new Promise(function (_0x5c0788, _0x2b7bc) {
    var _0x15450a;
    var _0x3ed10d;
    var _0xbaabf5;
    var _0x2bfbb3 = {};
    var _0x286306 = window.navigator.language || window.navigator.userLanguage;
    if (_0x286306.length === 2 && (_0x15450a = window.session) !== null && _0x15450a !== undefined && (_0x3ed10d = _0x15450a.me) !== null && _0x3ed10d !== undefined && _0x3ed10d.countryCode && ((_0xbaabf5 = window.session) === null || _0xbaabf5 === undefined ? undefined : _0xbaabf5.me?.countryCode) !== "??") {
      _0x2bfbb3.lang = _0x286306 + "-" + window.session.me.countryCode;
    } else {
      _0x2bfbb3.lang = _0x286306;
    }
    if (settings.get("lastRoomId")) {
      _0x2bfbb3.room_id = settings.get("lastRoomId");
    }
    api.get("getAllGifts", _0x2bfbb3, function (_0x375beb) {
      var _0xeb751a = _0x375beb.map(function (_0x15f86a) {
        return {
          id: _0x15f86a.id,
          name: _0x15f86a.name,
          describe: _0x15f86a.describe,
          diamond_count: _0x15f86a.diamond_count,
          image: _0x15f86a.image
        };
      });
      if (_0x48791d) {
        settings.set("broadcastGifts", JSON.stringify(_0xeb751a));
      } else {
        var _0x4b0487 = JSON.parse(settings.get("broadcastGifts") || "[]");
        var _0x5dd0db = _createForOfIteratorHelper(_0x4b0487);
        var _0x34f11b;
        try {
          var _0x4b6cfe = function _0x663e1() {
            var _0x3bd0a8 = _0x34f11b.value;
            if (!_0xeb751a.find(function (_0x4f85f4) {
              return _0x4f85f4.id === _0x3bd0a8.id;
            })) {
              _0xeb751a.push(_0x3bd0a8);
            }
          };
          for (_0x5dd0db.s(); !(_0x34f11b = _0x5dd0db.n()).done;) {
            _0x4b6cfe();
          }
        } catch (_0x46f3d7) {
          _0x5dd0db.e(_0x46f3d7);
        } finally {
          _0x5dd0db.f();
        }
      }
      var _0x13aea3 = _createForOfIteratorHelper(_0xeb751a);
      var _0x26756e;
      try {
        var _0x204730 = function _0x1cb376() {
          var _0x10422e = _0x26756e.value;
          _0x10422e.otherIds = _0xeb751a.filter(function (_0x1704cf) {
            return _0x1704cf.name === _0x10422e.name && _0x1704cf.diamondCount === _0x10422e.diamondCount && _0x1704cf.id !== _0x10422e.id;
          }).map(function (_0x24b872) {
            return _0x24b872.id;
          });
        };
        for (_0x13aea3.s(); !(_0x26756e = _0x13aea3.n()).done;) {
          _0x204730();
        }
      } catch (_0xd23b4f) {
        _0x13aea3.e(_0xd23b4f);
      } finally {
        _0x13aea3.f();
      }
      var _0x3603d1 = _0xeb751a.sort(function (_0x52c1d5, _0x533d96) {
        return _0x52c1d5.diamond_count - _0x533d96.diamond_count;
      });
      actionsandevents.cachedGifts = _0x3603d1;
      _0x5c0788(_0x3603d1);
    }, function (_0x268f5f) {
      _0x2b7bc(_0x268f5f);
    });
  });
};
actionsandevents.getGiftDataSource = function () {
  var _0x47e4ac = new DevExpress.data.CustomStore({
    loadMode: "raw",
    load: actionsandevents.getAllGifts,
    byKey: function _0x1ce72c(_0x97ef3c, _0x31773e) {
      return new Promise(function (_0x3dda14, _0x31476c) {
        actionsandevents.getAllGifts().then(function (_0x29d761) {
          _0x3dda14(_0x29d761.find(function (_0x3906b7) {
            return _0x3906b7.id == _0x97ef3c;
          }));
        }).catch(_0x31476c);
      });
    }
  });
  var _0x44e580 = new DevExpress.data.DataSource({
    store: _0x47e4ac,
    paginate: false
  });
  return _0x44e580;
};
actionsandevents.getGiftDataSourceCached = function () {
  var _0x3fafde = new DevExpress.data.CustomStore({
    loadMode: "raw",
    load: actionsandevents.getAllGiftsCached,
    byKey: function _0x285b22(_0x206c52, _0x17c7dc) {
      return new Promise(function (_0xe28396, _0x357c89) {
        actionsandevents.getAllGiftsCached().then(function (_0x89b59f) {
          _0xe28396(_0x89b59f.find(function (_0x5a6567) {
            return _0x5a6567.id == _0x206c52;
          }));
        }).catch(_0x357c89);
      });
    }
  });
  var _0xe469ba = new DevExpress.data.DataSource({
    store: _0x3fafde,
    paginate: false
  });
  return _0xe469ba;
};
actionsandevents.getEmoteDataSource = function () {
  var _0x254185 = new DevExpress.data.CustomStore({
    loadMode: "raw",
    load: actionsandevents.getAllEmotes,
    byKey: function _0x1f2cb9(_0x20e6ea, _0x71d560) {
      return new Promise(function (_0x553253, _0x5062f5) {
        actionsandevents.getAllEmotes().then(function (_0xd32d48) {
          _0x553253(_0xd32d48.find(function (_0x4dd56e) {
            return _0x4dd56e.emoteId == _0x20e6ea;
          }));
        }).catch(_0x5062f5);
      });
    }
  });
  var _0x5adf17 = new DevExpress.data.DataSource({
    store: _0x254185,
    paginate: false
  });
  return _0x5adf17;
};
actionsandevents.getSubscriberEmoteDataSource = function () {
  var _0x28dc27 = new DevExpress.data.CustomStore({
    loadMode: "raw",
    load: function _0x1a6e20() {
      return new Promise(function (_0x27b6b2, _0x16b231) {
        actionsandevents.getAllEmotes().then(function (_0x75e472) {
          var _0x217e09 = _0x75e472.filter(function (_0x31cbbc) {
            return _0x31cbbc.sourceId !== 4;
          });
          _0x27b6b2(_0x217e09);
        }).catch(_0x16b231);
      });
    },
    byKey: function _0x1c672e(_0x2b9584, _0x3e748d) {
      return new Promise(function (_0x3708f1, _0x5deb37) {
        actionsandevents.getAllEmotes().then(function (_0x4b1ace) {
          _0x3708f1(_0x4b1ace.find(function (_0x4c5fd1) {
            return _0x4c5fd1.emoteId == _0x2b9584 && _0x4c5fd1.sourceId !== 4;
          }));
        }).catch(_0x5deb37);
      });
    }
  });
  var _0x126861 = new DevExpress.data.DataSource({
    store: _0x28dc27,
    paginate: false
  });
  return _0x126861;
};
actionsandevents.getFanClubStickerDataSource = function () {
  var _0x168261 = new DevExpress.data.CustomStore({
    loadMode: "raw",
    load: function _0x161936() {
      return new Promise(function (_0x57ea77, _0x11acd6) {
        actionsandevents.getAllEmotes().then(function (_0x5a3618) {
          var _0x4639f5 = _0x5a3618.filter(function (_0x1653aa) {
            return _0x1653aa.sourceId === 4;
          });
          _0x57ea77(_0x4639f5);
        }).catch(_0x11acd6);
      });
    },
    byKey: function _0x369fe0(_0x420151, _0x16b200) {
      return new Promise(function (_0x28f3ba, _0x22bf35) {
        actionsandevents.getAllEmotes().then(function (_0x5087fe) {
          _0x28f3ba(_0x5087fe.find(function (_0x20b526) {
            return _0x20b526.emoteId == _0x420151 && _0x20b526.sourceId === 4;
          }));
        }).catch(_0x22bf35);
      });
    }
  });
  var _0x4c5c20 = new DevExpress.data.DataSource({
    store: _0x168261,
    paginate: false
  });
  return _0x4c5c20;
};
actionsandevents.getGiftItemTemplate = function (_0x3b4151, _0x13ef6a, _0x51db9d) {
  var _0x45a8ad = $("<div>").css("display", "table-row").css("height", "40px");
  var _0x3b8db9 = $("<img>").attr("src", _0x3b4151.image.url_list[0]).attr("onerror", "this.style.opacity='0'");
  var _0x3bc762 = $("<div>").html(_0x3b4151.name);
  var _0x22b85f = _0x3b4151.diamond_count ? _0x3b4151.diamond_count.toLocaleString() + " Coins" : "";
  _0x3b8db9.css("display", "table-cell");
  _0x3b8db9.attr("height", "40px");
  _0x3b8db9.attr("width", "40px");
  var _0x502a6e = $("<span>");
  _0x502a6e.css("display", "table-cell");
  _0x502a6e.css("padding-left", "20px");
  _0x502a6e.css("vertical-align", "top");
  _0x502a6e.append(_0x3bc762);
  _0x502a6e.append($("<div>").text(_0x22b85f).css("font-size", "0.8em").css("margin-top", "3px"));
  return _0x45a8ad.append(_0x3b8db9).append(_0x502a6e);
};
actionsandevents.openKeystrokeConfigurator = function (_0x2a8d68, _0x5a8e66, _0x1cda8d = {}) {
  if (!_0x2a8d68) {
    _0x2a8d68 = "";
  }
  var _0x52af3a = [{
    title: "CTRL",
    sign: "^",
    enabled: _0x2a8d68.includes("^")
  }, {
    title: "ALT",
    sign: "%",
    enabled: _0x2a8d68.includes("%")
  }, {
    title: "SHIFT",
    sign: "+",
    enabled: _0x2a8d68.includes("+")
  }];
  var _0x4e5b30 = [{
    title: "Left Mouse Click",
    sign: "{MOUSE_CLICK_LEFT}"
  }, {
    title: "Right Mouse Click",
    sign: "{MOUSE_CLICK_RIGHT}"
  }];
  var _0x133c06 = [{
    title: "ENTER",
    sign: "{ENTER}"
  }, {
    title: "SPACE",
    sign: "{SPACE}"
  }, {
    title: "ESC",
    sign: "{ESC}"
  }, {
    title: "TAB",
    sign: "{TAB}"
  }, {
    title: "BACKSPACE",
    sign: "{BACKSPACE}"
  }, {
    title: "BREAK",
    sign: "{BREAK}"
  }, {
    title: "CAPS LOCK",
    sign: "{CAPSLOCK}"
  }, {
    title: "DELETE",
    sign: "{DELETE}"
  }, {
    title: "UP ARROW",
    sign: "{UP}"
  }, {
    title: "RIGHT ARROW",
    sign: "{RIGHT}"
  }, {
    title: "LEFT ARROW",
    sign: "{LEFT}"
  }, {
    title: "DOWN ARROW",
    sign: "{DOWN}"
  }, {
    title: "END",
    sign: "{END}"
  }, {
    title: "HOME",
    sign: "{HOME}"
  }, {
    title: "INSERT",
    sign: "{INSERT}"
  }, {
    title: "F1",
    sign: "{F1}"
  }, {
    title: "F2",
    sign: "{F2}"
  }, {
    title: "F3",
    sign: "{F3}"
  }, {
    title: "F4",
    sign: "{F4}"
  }, {
    title: "F5",
    sign: "{F5}"
  }, {
    title: "F6",
    sign: "{F6}"
  }, {
    title: "F7",
    sign: "{F7}"
  }, {
    title: "F8",
    sign: "{F8}"
  }, {
    title: "F9",
    sign: "{F9}"
  }, {
    title: "F10",
    sign: "{F10}"
  }, {
    title: "F11",
    sign: "{F11}"
  }, {
    title: "F12",
    sign: "{F12}"
  }];
  var _0x502320 = $("#keystrokeConfigurationContainer");
  if (!_0x502320.length) {
    _0x502320 = $("<div>").attr("id", "keystrokeConfigurationContainer");
    $("#pages").append(_0x502320);
  }
  var _0x1cf077 = _0x502320.dxPopup({
    width: 630,
    height: 690,
    visible: true,
    title: "Keystroke Configurator",
    closeOnOutsideClick: true,
    showCloseButton: true,
    showScrollbar: true,
    contentTemplate: function _0x385187(_0x124888) {
      _0x52af3a.forEach(function (_0x374711) {
        _0x2a8d68 = _0x2a8d68.replace(_0x374711.sign, "");
        _0x124888.append($("<div>").dxCheckBox({
          text: _0x374711.title,
          value: _0x374711.enabled,
          onValueChanged: function _0x4d20e8(_0x3bade4) {
            _0x374711.enabled = _0x3bade4.value;
          }
        }).addClass("keystrokeConfigurationCheckbox"));
      });
      _0x124888.append("<br><br>");
      _0x124888.append("<div>Keys, letters or numbers to be pressed in sequence:</div>");
      var _0x3131c5 = $("<div>").dxTextArea({
        height: "80px",
        maxLength: 1000,
        value: _0x2a8d68,
        onValueChanged: function _0x1af7c8(_0x5390dd) {
          _0x2a8d68 = _0x5390dd.value;
        }
      }).css("margin-top", "5px").css("margin-bottom", "5px");
      _0x124888.append(_0x3131c5);
      _0x124888.append("<small><b>Placeholder Params: </b>{username} {nickname} {giftname} {repeatcount} {coins} {likecount} {totallikecount} {comment} {submonth}</small><br><br>");
      _0x4e5b30.forEach(function (_0x54cb2f) {
        _0x124888.append($("<div>").dxButton({
          text: _0x54cb2f.title,
          onClick: function _0x147f10() {
            _0x2a8d68 += _0x54cb2f.sign;
            _0x3131c5.dxTextArea("instance").option("value", _0x2a8d68);
          }
        }).css("margin", "2px"));
      });
      _0x124888.append("<br><br>");
      _0x133c06.forEach(function (_0x34b578) {
        _0x124888.append($("<div>").dxButton({
          text: _0x34b578.title,
          onClick: function _0x19479a() {
            _0x2a8d68 += _0x34b578.sign;
            _0x3131c5.dxTextArea("instance").option("value", _0x2a8d68);
          }
        }).css("margin", "2px"));
      });
      _0x124888.append("<br><br>");
      if (typeof _0x1cda8d.keystrokeCompatibilityModeEnabled === "undefined" && settings.get("gameCompatibilityModeLastState") !== null) {
        _0x1cda8d.keystrokeCompatibilityModeEnabled = settings.get("gameCompatibilityModeLastState") === "true";
      }
      if (_0x1cda8d.keystrokeCompatibilityModeEnabled) {
        actionsandevents.checkAutoItInstalled();
      }
      _0x124888.append($("<div>").dxCheckBox({
        text: "Enable Game compatibility mode (requires AutoIt installed)",
        value: _0x1cda8d.keystrokeCompatibilityModeEnabled || false,
        onValueChanged: function _0x51c6cc(_0x4459ea) {
          _0x1cda8d.keystrokeCompatibilityModeEnabled = _0x4459ea.value;
          _0x124888.find(".keystrokeKeyHoldDurationNumberBox").dxNumberBox("instance").option("disabled", !_0x4459ea.value);
          settings.set("gameCompatibilityModeLastState", _0x4459ea.value);
          if (_0x4459ea.value) {
            actionsandevents.checkAutoItInstalled();
          }
        }
      }));
      _0x124888.append($("<div>").text("👈 For Games (GTA, Forza)").addClass("keystrokeGamesHint"));
      _0x124888.append("<br><br>Key hold duration:  ");
      _0x124888.append($("<div>").dxNumberBox({
        value: _0x1cda8d.keystrokeKeyHoldDuration || 100,
        showSpinButtons: true,
        format: "#0' ms'",
        min: 1,
        max: 60000,
        step: 100,
        onValueChanged: function _0x5ccbe0(_0x5f1248) {
          _0x1cda8d.keystrokeKeyHoldDuration = _0x5f1248.value;
        }
      }).addClass("keystrokeKeyHoldDurationNumberBox").css("display", "inline-block").css("width", "140px"));
      _0x124888.append(" (requires compatibility mode)");
      _0x124888.find(".keystrokeKeyHoldDurationNumberBox").dxNumberBox("instance").option("disabled", !_0x1cda8d.keystrokeCompatibilityModeEnabled);
      _0x124888.append("<br><br>");
      _0x124888.append($("<div>").dxButton({
        width: "150px",
        text: "Save",
        icon: "check",
        onClick: function _0xda9aed() {
          var _0x1bbad3 = "";
          _0x52af3a.filter(function (_0x4aa29f) {
            return _0x4aa29f.enabled;
          }).forEach(function (_0x3b4552) {
            _0x1bbad3 += _0x3b4552.sign;
          });
          _0x1bbad3 += _0x2a8d68;
          _0x1cf077.hide();
          _0x5a8e66(_0x1bbad3);
        }
      }).addClass("keystrokeConfigurationOkButton"));
      _0x124888.append("<div style='font-size: 11px;bottom: 6px;position: absolute;left: 100px;color: #ff5252;'>Run TikFinity as administrator if the keystrokes are not recognized by your application!</div>");
    }
  }).dxPopup("instance");
};
actionsandevents.showUnlockAllActionsMessage = function () {
  DevExpress.ui.dialog.alert("This action is currently disabled because your <b>TikFinity Pro</b> subscription has expired.<br>Please upgrade to TikFinity Pro to unlock all actions again.", "TikFinity Pro Required").then(function () {
    setup.scrollToPaymentUi("ACTIONS_DOWNGRADE_LOCKED", true);
  });
};
actionsandevents.hasActionCountLimitReached = function () {
  if (!window.session || !window.session.channelId || !window.session.me.userFeatures.isPro) {
    if (actionsandevents.actions.length >= actionsandevents.freeLimit) {
      setup.createPaymentUi();
      DevExpress.ui.dialog.alert(`You have reached the limit of ${actionsandevents.freeLimit.toLocaleString()} custom actions!<br>You can upgrade your account to TikFinity Pro<br>to create unlimited Actions & Events.`, "Free Limit Reached").done(function () {
        setup.scrollToPaymentUi("ACTIONS_LIMIT", true);
      });
      return true;
    }
  }
  return false;
};
actionsandevents.copyAction = function (_0x66048f) {
  var _0x3f98a1 = JSON.parse(JSON.stringify(_0x66048f));
  delete _0x3f98a1.id;
  var _0x47bf24 = _0x66048f.name || "";
  if (!_0x47bf24.includes("(Copy ")) {
    _0x47bf24 += " " + _0x1dee2e(0);
  }
  function _0x1dee2e(_0x56ccf5) {
    return `(Copy ${_0x56ccf5})`;
  }
  for (var _0x49c405 = 0; _0x49c405 < 500; _0x49c405++) {
    var _0x475b4c = _0x1dee2e(_0x49c405);
    if (_0x47bf24.includes(_0x475b4c)) {
      _0x47bf24 = _0x47bf24.replace(_0x475b4c, _0x1dee2e(_0x49c405 + 1));
      if (!actionsandevents.actions.find(function (_0x40ccf3) {
        return _0x40ccf3.name === _0x47bf24;
      })) {
        break;
      }
    }
  }
  _0x3f98a1.name = _0x47bf24;
  api.doAction("PUT", "rest/action", _0x3f98a1, function (_0x500340) {
    toastr.success(null, "Action Duplicated");
    actionsandevents.refreshActions(actionsandevents.localActionGrid);
  }, function () {});
};
actionsandevents.fetchMcTemplate = function () {
  var _0x305754 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x46e9b3(_0x46efcd) {
    var _0x131418;
    var _0x35513c;
    return _regeneratorRuntime().wrap(function _0x207db3(_0x5079a4) {
      while (1) {
        switch (_0x5079a4.prev = _0x5079a4.next) {
          case 0:
            _0x5079a4.next = 2;
            return fetch(`https://tikblocks.vercel.app/api/templates/${_0x46efcd}`);
          case 2:
            _0x131418 = _0x5079a4.sent;
            _0x5079a4.next = 5;
            return _0x131418.json();
          case 5:
            _0x35513c = _0x5079a4.sent;
            return _0x5079a4.abrupt("return", _0x35513c);
          case 7:
          case "end":
            return _0x5079a4.stop();
        }
      }
    }, _0x46e9b3);
  }));
  return function (_0x1c3a22) {
    return _0x305754.apply(this, arguments);
  };
}();
actionsandevents.updateMcTemplate = function (_0x1e7071, _0x37e627, _0x255fec, _0x4e8901, _0x5587f5) {
  _0x255fec.dynamicConfig.mcCmdTemplate = {
    id: _0x1e7071,
    updateDate: new Date(),
    info: _0x37e627,
    edited: false
  };
  if (typeof _0x5587f5 === "object" && _0x5587f5) {
    _0x255fec.dynamicConfig.mcCmdTemplateData = _0x5587f5;
  }
  _0x4e8901.find(".actionMcCmd").dxTextArea("instance").option("value", _0x37e627.template_text);
  setTimeout(function () {
    actionsandevents.setMcTemplateUi(_0x255fec, _0x4e8901);
  }, 250);
};
actionsandevents.setMcTemplateUi = function (_0x2c4c56, _0x1acd52) {
  var _0x2803d2;
  if ((_0x2803d2 = _0x2c4c56.dynamicConfig) === null || _0x2803d2 === undefined || !_0x2803d2.mcCmdTemplate) {
    _0x1acd52.find(".mcCmdTemplateInfo").css("visibility", "hidden");
    return;
  }
  var _0x25333d = "";
  if (_0x2c4c56.dynamicConfig.mcCmdTemplateData) {
    for (var _0xedd73e in _0x2c4c56.dynamicConfig.mcCmdTemplateData) {
      if (!["playername", "username", "nickname", "comment", "giftname", "coins", "repeatcount", "likecount", "totallikecount"].includes(_0xedd73e)) {
        _0x25333d += _0xedd73e + ": " + _0x2c4c56.dynamicConfig.mcCmdTemplateData[_0xedd73e] + ", ";
      }
    }
  }
  _0x25333d &&= _0x25333d.substring(0, _0x25333d.length - 2);
  _0x1acd52.find(".mcCmdTemplateInfo").css("visibility", "visible");
  _0x1acd52.find(".mcCmdTemplateName").text(_0x2c4c56.dynamicConfig.mcCmdTemplate.info.name + (_0x25333d ? "\n(" + _0x25333d + ")" : "")).css("white-space", "pre-line");
  _0x1acd52.find(".mcCmdTemplateIsEdited").text(_0x2c4c56.dynamicConfig.mcCmdTemplate.edited ? "(edited)" : "");
};
actionsandevents.openMcCodeEditor = function (_0x45303f, _0x487f1b, _0x414321) {
  var _0x44aad2 = $(".mcCommandEditorContainer");
  if (_0x44aad2.length === 0) {
    _0x44aad2 = $("<div>").addClass("mcCommandEditorContainer");
    $("#pages").append(_0x44aad2);
  }
  var _0x525d28 = false;
  var _0x137496 = false;
  var _0x5c104d = function _0x9a6958() {
    if (!_0x525d28) {
      return _0x46c504.hide();
    }
    var _0x3b7434 = DevExpress.ui.dialog.confirm("Do you really want to discard the changes?", "Discard Changes?");
    _0x3b7434.done(function (_0x28daf0) {
      if (_0x28daf0) {
        _0x137496 = true;
        _0x46c504.hide();
      }
    });
  };
  var _0x46c504 = _0x44aad2.dxPopup({
    width: window.innerWidth > 1400 ? 1000 : window.innerWidth - 400,
    height: utils.getResponsiveDialogHeight(750),
    visible: true,
    title: "Minecraft Command Editor",
    closeOnOutsideClick: false,
    showCloseButton: true,
    showScrollbar: true,
    onHiding: function _0x262793(_0x2e23b4) {
      if (_0x525d28 && !_0x137496) {
        _0x2e23b4.cancel = true;
        _0x5c104d();
      }
    },
    contentTemplate: function _0x1579f0(_0x154b9e) {
      _0x154b9e.append(`
                <small style="margin-top: 0px; margin-bottom: 10px; display: block;">Enter the commands in the text box below. One command per line. The commands are executed sequentially.<br>${localization.getString("actionsandevents_actions_modal_option_mccmd_option_hint")}</small>
                <textarea placeholder="Enter your Minecraft commands here..." style="width: 100%; height: calc(100% - 110px); background-color: #252525; outline: none; border: 1px solid; border-color: #444444; color: #fff; padding: 10px; font-family: monospace; resize: none; white-space: nowrap; overflow: scroll;"></textarea>
                <div class="mcCommandEditorButtons" style="margin: 0px auto; width: fit-content; margin-top: 13px;">
                    <div class="mcCommandEditorApply" style="margin-right: 30px"></div>
                    <div class="mcCommandEditorDiscard" style="margin-right: 30px"></div>
                    <div class="mcCommandEditorExecute"></div>
                </div>
            `);
      _0x154b9e.find(".mcCommandEditorApply").dxButton({
        text: "Apply",
        icon: "check",
        width: "160px",
        onClick: function _0x51ed8d() {
          _0x414321(_0x154b9e.find("textarea").val().trim());
          _0x525d28 = false;
          _0x46c504.hide();
        }
      });
      _0x154b9e.find(".mcCommandEditorDiscard").dxButton({
        text: "Discard",
        icon: "close",
        width: "160px",
        onClick: _0x5c104d
      });
      _0x154b9e.find(".mcCommandEditorExecute").dxButton({
        text: "Run",
        icon: "chevronright",
        width: "160px",
        onClick: function _0x238b1c() {
          actionsandevents.execMcCmd(_0x154b9e.find("textarea").val(), "Testuser123", "Test User 123", "Rose", 1, 15, 100, {
            value: 1
          }, "", _0x487f1b, 1);
        }
      });
      _0x154b9e.find("textarea").val(_0x45303f);
      _0x154b9e.find("textarea").change(function (_0x398d98) {
        _0x525d28 = true;
      });
      setTimeout(function () {
        return _0x154b9e.find("textarea").focus();
      }, 500);
    }
  }).dxPopup("instance");
};
actionsandevents.cachedMcServerInfo = null;
setInterval(function () {
  actionsandevents.cachedMcServerInfo = null;
}, 10000);
actionsandevents.getCachedMcServerInfo = function () {
  return new Promise(function (_0x5dc2bc, _0x2cc08b) {
    if (actionsandevents.cachedMcServerInfo) {
      return _0x5dc2bc(actionsandevents.cachedMcServerInfo);
    }
    setup.queryMcApi("GET", "v1/server").then(function (_0x2efd00) {
      if (_0x2efd00 && typeof _0x2efd00 === "object") {
        actionsandevents.cachedMcServerInfo = _0x2efd00;
        _0x5dc2bc(_0x2efd00);
      } else {
        utils.showError("Minecraft Connection Error", "Unexpected response received");
        _0x2cc08b();
      }
    }).catch(function (_0x199f4c) {
      utils.showError("Minecraft Connection Error", "Could not connect to mod or plugin. Please check your settings under \"Setup\" -> \"Minecraft Connection\"");
      _0x2cc08b();
    });
  });
};
actionsandevents.execMcCmd = function (_0x1dd8be, _0x27151d, _0x1f6b1c, _0x43f8bd, _0x643a34, _0x1e9c22, _0x2e98d8, _0xc57ab6, _0x19fa3a, _0xf680bf, _0x587c1f) {
  var _0x55cfdf = function _0x5509b8(_0x140cb3) {
    setup.queryMcApi("POST", "v1/server/exec", "command=" + encodeURIComponent(_0x140cb3)).then(function (_0x173a23) {
      if (typeof _0x173a23 === "string" && (_0x173a23.toLowerCase().includes("unknown") || _0x173a23.toLowerCase().includes("error") || _0x173a23.toLowerCase().includes("fail"))) {
        utils.showError("Minecraft Error", _0x140cb3 + " - " + _0x173a23);
      }
    }).catch(function (_0x4bc3d7) {
      utils.showError("Minecraft Connection Error", "Could not execute command");
    });
  };
  actionsandevents.getCachedMcServerInfo().then(function () {
    var _0x17a19b = _asyncToGenerator(_regeneratorRuntime().mark(function _0x24d56c(_0x234acd) {
      var _0x5e0f1f;
      var _0x419fbf;
      var _0x71f9be;
      var _0x9c5cae;
      var _0x3b1ff0;
      var _0x3dbc3f;
      var _0x8d563a;
      var _0x5c4391;
      var _0x41fd6d;
      var _0x4c0a5f;
      var _0x1d49e6;
      var _0x3d2ee8;
      var _0x155169;
      var _0x5b9e2f;
      var _0x10972e;
      var _0x544164;
      var _0x20875c;
      var _0x2b9781;
      var _0x2bf9da;
      var _0xc91c71;
      var _0x2abfc4;
      return _regeneratorRuntime().wrap(function _0x2a2f09(_0x5bb5a9) {
        while (1) {
          switch (_0x5bb5a9.prev = _0x5bb5a9.next) {
            case 0:
              _0x5e0f1f = _0x234acd.name === "TikFinity Mod";
              _0x419fbf = _0x234acd.playerName || setup.inputValues.mcPlayerName || "@a";
              if (_0x27151d === "Testuser123") {
                if (_0x1dd8be.includes("playername")) {
                  toastr.success(`Player: ${_0x419fbf}`, "Minecraft Command Executed!");
                } else {
                  toastr.success("Minecraft Command Executed!");
                }
              }
              _0x71f9be = Handlebars.compile(_0x1dd8be);
              _0x9c5cae = _0x71f9be(_objectSpread(_objectSpread({}, _0xf680bf || {}), {}, {
                username: _0x27151d || "",
                nickname: _0x1f6b1c || "",
                giftname: _0x43f8bd || "",
                submonth: _0x587c1f || "",
                repeatcount: _0x643a34 || "",
                likecount: _0x1e9c22 || "",
                totallikecount: _0x2e98d8 || "",
                coins: _0xc57ab6?.value || 0,
                comment: _0x19fa3a || "",
                playername: _0x419fbf,
                [_0x419fbf]: _0x419fbf
              }));
              _0x3b1ff0 = _0x9c5cae.replaceAll("{username}", _0x27151d || "").replaceAll("{nickname}", _0x1f6b1c || "").replaceAll("{giftname}", _0x43f8bd || "").replaceAll("{submonth}", _0x587c1f || "").replaceAll("{repeatcount}", _0x643a34 || "").replaceAll("{likecount}", _0x1e9c22 || "").replaceAll("{totallikecount}", _0x2e98d8 || "").replaceAll("{coins}", _0xc57ab6?.value || 0).replaceAll("{comment}", _0x19fa3a || "").replaceAll("{playername}", _0x419fbf || "").replaceAll("PlayerName", _0x419fbf || "");
              _0x3dbc3f = _0x3b1ff0.split("\n");
              for (_0x8d563a in _0x3dbc3f) {
                _0x5c4391 = _0x3dbc3f[_0x8d563a].replaceAll("\r", "").trim();
                if (_0x5e0f1f && _0x5c4391.charAt(0) !== "/") {
                  _0x5c4391 = "/" + _0x5c4391;
                }
                if (!_0x5e0f1f && _0x5c4391.charAt(0) === "/") {
                  _0x5c4391 = _0x5c4391.substring(1);
                }
                _0x3dbc3f[_0x8d563a] = _0x5c4391;
              }
              if (!_0x5e0f1f) {
                _0x5bb5a9.next = 12;
                break;
              }
              _0x55cfdf(_0x3dbc3f.filter(function (_0x495dba) {
                return _0x495dba !== "";
              }).join("\n"));
              _0x5bb5a9.next = 49;
              break;
            case 12:
              _0x41fd6d = false;
              _0x4c0a5f = _createForOfIteratorHelper(_0x3dbc3f);
              _0x5bb5a9.prev = 14;
              _0x4c0a5f.s();
            case 16:
              if ((_0x1d49e6 = _0x4c0a5f.n()).done) {
                _0x5bb5a9.next = 41;
                break;
              }
              _0x3d2ee8 = _0x1d49e6.value;
              if (_0x3d2ee8 === "") {
                _0x5bb5a9.next = 39;
                break;
              }
              _0x155169 = _0x3d2ee8.toLowerCase();
              _0x5b9e2f = 0;
              if (_0x155169.indexOf("sleep") === 0) {
                _0x5b9e2f = parseInt(_0x155169.replace("sleep", "").trim());
              }
              if (_0x155169.indexOf("delay") === 0) {
                _0x5b9e2f = parseInt(_0x155169.replace("delay", "").trim());
              }
              if (_0x155169.indexOf("break_delays") !== 0) {
                _0x5bb5a9.next = 27;
                break;
              }
              _0x10972e = _createForOfIteratorHelper(actionsandevents.mcScriptPromises);
              try {
                for (_0x10972e.s(); !(_0x544164 = _0x10972e.n()).done;) {
                  _0x20875c = _0x544164.value;
                  _0x20875c.break = true;
                  _0x20875c.resolve();
                }
              } catch (_0x32f4ab) {
                _0x10972e.e(_0x32f4ab);
              } finally {
                _0x10972e.f();
              }
              return _0x5bb5a9.abrupt("continue", 39);
            case 27:
              if (_0x155169.indexOf("skip_delays") !== 0) {
                _0x5bb5a9.next = 31;
                break;
              }
              _0x2b9781 = _createForOfIteratorHelper(actionsandevents.mcScriptPromises);
              try {
                for (_0x2b9781.s(); !(_0x2bf9da = _0x2b9781.n()).done;) {
                  _0xc91c71 = _0x2bf9da.value;
                  _0xc91c71.skipAll = true;
                  _0xc91c71.resolve();
                }
              } catch (_0x4d1cf0) {
                _0x2b9781.e(_0x4d1cf0);
              } finally {
                _0x2b9781.f();
              }
              return _0x5bb5a9.abrupt("continue", 39);
            case 31:
              if (!(_0x5b9e2f > 0)) {
                _0x5bb5a9.next = 38;
                break;
              }
              return _0x5bb5a9.delegateYield(_regeneratorRuntime().mark(function _0x41f6ee() {
                var _0x251333;
                return _regeneratorRuntime().wrap(function _0x577910(_0x488afd) {
                  while (1) {
                    switch (_0x488afd.prev = _0x488afd.next) {
                      case 0:
                        if (!_0x41fd6d) {
                          _0x488afd.next = 2;
                          break;
                        }
                        return _0x488afd.abrupt("return", "continue");
                      case 2:
                        _0x251333 = new utils.deffered(_0x5b9e2f);
                        actionsandevents.mcScriptPromises.push(_0x251333);
                        _0x488afd.next = 6;
                        return _0x251333;
                      case 6:
                        actionsandevents.mcScriptPromises = actionsandevents.mcScriptPromises.filter(function (_0x537185) {
                          return _0x537185 !== _0x251333;
                        });
                        if (!_0x251333.skipAll) {
                          _0x488afd.next = 10;
                          break;
                        }
                        _0x41fd6d = true;
                        return _0x488afd.abrupt("return", "continue");
                      case 10:
                        if (!_0x251333.break) {
                          _0x488afd.next = 14;
                          break;
                        }
                        return _0x488afd.abrupt("return", "break");
                      case 14:
                        return _0x488afd.abrupt("return", "continue");
                      case 15:
                      case "end":
                        return _0x488afd.stop();
                    }
                  }
                }, _0x41f6ee);
              })(), "t0", 33);
            case 33:
              _0x2abfc4 = _0x5bb5a9.t0;
              if (_0x2abfc4 !== "continue") {
                _0x5bb5a9.next = 36;
                break;
              }
              return _0x5bb5a9.abrupt("continue", 39);
            case 36:
              if (_0x2abfc4 !== "break") {
                _0x5bb5a9.next = 38;
                break;
              }
              return _0x5bb5a9.abrupt("break", 41);
            case 38:
              _0x55cfdf(_0x3d2ee8);
            case 39:
              _0x5bb5a9.next = 16;
              break;
            case 41:
              _0x5bb5a9.next = 46;
              break;
            case 43:
              _0x5bb5a9.prev = 43;
              _0x5bb5a9.t1 = _0x5bb5a9.catch(14);
              _0x4c0a5f.e(_0x5bb5a9.t1);
            case 46:
              _0x5bb5a9.prev = 46;
              _0x4c0a5f.f();
              return _0x5bb5a9.finish(46);
            case 49:
            case "end":
              return _0x5bb5a9.stop();
          }
        }
      }, _0x24d56c, null, [[14, 43, 46, 49]]);
    }));
    return function (_0x5ea399) {
      return _0x17a19b.apply(this, arguments);
    };
  }());
};
actionsandevents.checkAutoItInstalled = function () {
  API.setAutoItNotInstalledListener(function () {
    actionsandevents.showAutoItNotInstalledMsg();
    settings.set("gameCompatibilityModeLastState", false);
  });
  API.toMain({
    action: "execAutoItCommand",
    command: "sleep(1)"
  });
};
actionsandevents.showAutoItNotInstalledMsg = function () {
  var _0x598549 = DevExpress.ui.dialog.confirm("The game compatibility mode requires the software \"AutoIt\" installed on your system.<br><br>Do you want to install it now?", "AutoIt not installed");
  _0x598549.done(function (_0x3a2b81) {
    if (_0x3a2b81) {
      window.open("https://www.autoitscript.com/cgi-bin/getfile.pl?autoit3/autoit-v3-setup.zip", "_blank");
    }
  });
};
actionsandevents.execTpAction = function () {
  var _0x535149 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x4fca6f(_0x38c830, _0x3588fb, _0x159cee, _0x554b3d, _0x1dbae1, _0x4d3acf) {
    var _0x1b1bf2;
    return _regeneratorRuntime().wrap(function _0x467ba9(_0x33e96a) {
      while (1) {
        switch (_0x33e96a.prev = _0x33e96a.next) {
          case 0:
            _0x33e96a.prev = 0;
            _0x33e96a.next = 3;
            return actionsandevents.doGenericInterfaceRequest("POST", "features/actions/exec", null, {
              categoryId: _0x38c830,
              actionId: _0x3588fb,
              context: _objectSpread(_objectSpread({}, _0x4d3acf || {}), {}, {
                userId: _0x159cee,
                username: _0x554b3d,
                coins: _0x1dbae1
              })
            });
          case 3:
            _0x1b1bf2 = _0x33e96a.sent;
            if (_0x554b3d === "Testuser123" && _0x1b1bf2?.success === true) {
              toastr.success("Third-Party Action Executed!");
            }
            _0x33e96a.next = 10;
            break;
          case 7:
            _0x33e96a.prev = 7;
            _0x33e96a.t0 = _0x33e96a.catch(0);
            toastr.error("Make sure your third-party app is running.", "Integration Error");
          case 10:
          case "end":
            return _0x33e96a.stop();
        }
      }
    }, _0x4fca6f, null, [[0, 7]]);
  }));
  return function (_0x2b4f0d, _0x312a71, _0x51b02f, _0x470e93, _0x51e804, _0x141e41) {
    return _0x535149.apply(this, arguments);
  };
}();
actionsandevents.doGenericInterfaceRequest = function () {
  var _0x5f4693 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x20cbd3(_0x42e1fa, _0xc0e7b1, _0x54947e, _0x240059) {
    var _0x2c24fb;
    var _0x2a686e;
    var _0x488b56;
    var _0x291c85;
    return _regeneratorRuntime().wrap(function _0x4d317b(_0x23211d) {
      while (1) {
        switch (_0x23211d.prev = _0x23211d.next) {
          case 0:
            _0x2c24fb = `http://127.0.0.1:8832/api/${_0xc0e7b1}?${new URLSearchParams(_0x54947e || {})}`;
            _0x2a686e = {
              method: _0x42e1fa || "GET",
              headers: {
                "Content-Type": "application/json",
                "X-TikFinity-Version": window.appConfig.appVersion,
                "X-TikFinity-UID": settings.get("channelId"),
                "X-TikFinity-Language": navigator.language.substring(0, 1)
              },
              body: _0x42e1fa !== "GET" ? JSON.stringify(_0x240059 || {}) : null
            };
            _0x23211d.next = 4;
            return fetch(_0x2c24fb, _0x2a686e);
          case 4:
            _0x488b56 = _0x23211d.sent;
            _0x23211d.next = 7;
            return _0x488b56.json();
          case 7:
            _0x291c85 = _0x23211d.sent;
            if (!_0x291c85.message) {
              _0x23211d.next = 11;
              break;
            }
            toastr.error(_0x291c85.message, "Integration Error");
            return _0x23211d.abrupt("return", []);
          case 11:
            if (_0x291c85.data) {
              _0x23211d.next = 14;
              break;
            }
            toastr.error("Missing data attribute", "Integration Error");
            return _0x23211d.abrupt("return", []);
          case 14:
            return _0x23211d.abrupt("return", _0x291c85.data);
          case 15:
          case "end":
            return _0x23211d.stop();
        }
      }
    }, _0x20cbd3);
  }));
  return function (_0x374b05, _0x21f348, _0x293e37, _0x4b305a) {
    return _0x5f4693.apply(this, arguments);
  };
}();
actionsandevents.getConnectedVoicemod = _asyncToGenerator(_regeneratorRuntime().mark(function _callee39() {
  return _regeneratorRuntime().wrap(function _0xd14078(_0xd6e8fd) {
    while (1) {
      switch (_0xd6e8fd.prev = _0xd6e8fd.next) {
        case 0:
          if (!actionsandevents.voicemodConnection) {
            actionsandevents.voicemodConnection = new VoiceMod(window.appConfig.voicemodClientKey);
          }
          if (actionsandevents.voicemodConnection.isConnected()) {
            _0xd6e8fd.next = 4;
            break;
          }
          _0xd6e8fd.next = 4;
          return actionsandevents.voicemodConnection.connect();
        case 4:
          return _0xd6e8fd.abrupt("return", actionsandevents.voicemodConnection);
        case 5:
        case "end":
          return _0xd6e8fd.stop();
      }
    }
  }, _callee39);
}));
actionsandevents.getVoicemodVoices = _asyncToGenerator(_regeneratorRuntime().mark(function _callee40() {
  var _0x1a006e;
  var _0x17acd1;
  return _regeneratorRuntime().wrap(function _0x7a2c28(_0x1d9644) {
    while (1) {
      switch (_0x1d9644.prev = _0x1d9644.next) {
        case 0:
          _0x1d9644.next = 2;
          return actionsandevents.getConnectedVoicemod();
        case 2:
          _0x1a006e = _0x1d9644.sent;
          _0x1d9644.next = 5;
          return _0x1a006e.getAllVoices();
        case 5:
          _0x17acd1 = _0x1d9644.sent;
          _0x17acd1 = _0x17acd1.map(function (_0x4c2f3d) {
            return {
              id: _0x4c2f3d.id,
              name: _0x4c2f3d.friendlyName
            };
          });
          _0x17acd1.unshift({
            id: "random_fav",
            name: "Random Favorited Voice"
          });
          return _0x1d9644.abrupt("return", _0x17acd1);
        case 9:
        case "end":
          return _0x1d9644.stop();
      }
    }
  }, _callee40);
}));
actionsandevents.getVoicemodVoicesWithErrorHandling = _asyncToGenerator(_regeneratorRuntime().mark(function _callee41() {
  return _regeneratorRuntime().wrap(function _0xad3cc0(_0x1dc32c) {
    while (1) {
      switch (_0x1dc32c.prev = _0x1dc32c.next) {
        case 0:
          _0x1dc32c.prev = 0;
          _0x1dc32c.next = 3;
          return actionsandevents.getVoicemodVoices();
        case 3:
          return _0x1dc32c.abrupt("return", _0x1dc32c.sent);
        case 6:
          _0x1dc32c.prev = 6;
          _0x1dc32c.t0 = _0x1dc32c.catch(0);
          DevExpress.ui.dialog.alert("\n            The connection to <a href=\"https://www.voicemod.net/\" target=\"_blank\">Voicemod</a> could not be established.<br>\n            Please make sure that Voicemod is installed and<br>\n            running on this computer.<br><br>\n\n            <a href=\"https://www.voicemod.net/\" target=\"_blank\">Download Voicemod</a> \n        ", "Connection Error");
          return _0x1dc32c.abrupt("return", []);
        case 10:
        case "end":
          return _0x1dc32c.stop();
      }
    }
  }, _callee41, null, [[0, 6]]);
}));
actionsandevents.getStreamerbotActionsWithErrorHandling = _asyncToGenerator(_regeneratorRuntime().mark(function _callee42() {
  var _0x5929b9;
  var _0x1d83bc;
  return _regeneratorRuntime().wrap(function _0x379b36(_0x24c5e0) {
    while (1) {
      switch (_0x24c5e0.prev = _0x24c5e0.next) {
        case 0:
          _0x24c5e0.prev = 0;
          _0x24c5e0.next = 3;
          return setup.getStreamerbotConnection();
        case 3:
          _0x5929b9 = _0x24c5e0.sent;
          if (_0x5929b9) {
            _0x24c5e0.next = 6;
            break;
          }
          throw new Error("Streamer.bot not connected! Please configure the Websocket Server!");
        case 6:
          _0x24c5e0.next = 8;
          return _0x5929b9.getActions();
        case 8:
          _0x1d83bc = _0x24c5e0.sent;
          if (_0x1d83bc.status === "ok") {
            _0x24c5e0.next = 11;
            break;
          }
          throw new Error(`Error Status: ${_0x1d83bc.status}`);
        case 11:
          if (_0x1d83bc.actions.length !== 0) {
            _0x24c5e0.next = 13;
            break;
          }
          throw new Error("No actions found. Please create an action in the Streamer.bot app.");
        case 13:
          return _0x24c5e0.abrupt("return", _0x1d83bc.actions);
        case 16:
          _0x24c5e0.prev = 16;
          _0x24c5e0.t0 = _0x24c5e0.catch(0);
          DevExpress.ui.dialog.alert(`
            Unable to retrieve actions from <a href="https://streamer.bot/" target="_blank">Streamer.bot</a>!<br>
            ${_0x24c5e0.t0.message}<br><br>
            Please read the <a href="/streamerbot-integration" target="_blank">Setup Instructions</a> for more information.
        `, "Streamer.bot");
          return _0x24c5e0.abrupt("return", []);
        case 20:
        case "end":
          return _0x24c5e0.stop();
      }
    }
  }, _callee42, null, [[0, 16]]);
}));
actionsandevents.execStreamerbotAction = function () {
  var _0x520dbe = _asyncToGenerator(_regeneratorRuntime().mark(function _0x53604e(_0x22f72a, _0x5e0cb1) {
    var _0x437313;
    var _0x59abe7;
    return _regeneratorRuntime().wrap(function _0x210d98(_0x21d371) {
      while (1) {
        switch (_0x21d371.prev = _0x21d371.next) {
          case 0:
            _0x21d371.prev = 0;
            _0x21d371.next = 3;
            return setup.getStreamerbotConnection();
          case 3:
            _0x437313 = _0x21d371.sent;
            if (_0x437313) {
              _0x21d371.next = 6;
              break;
            }
            throw new Error("Not connected!");
          case 6:
            _0x21d371.prev = 6;
            _0x21d371.next = 9;
            return _0x437313.doAction(_0x22f72a, _0x5e0cb1);
          case 9:
            _0x59abe7 = _0x21d371.sent;
            if (_0x59abe7.status === "ok") {
              _0x21d371.next = 12;
              break;
            }
            throw new Error(_0x59abe7.status);
          case 12:
            _0x21d371.next = 17;
            break;
          case 14:
            _0x21d371.prev = 14;
            _0x21d371.t0 = _0x21d371.catch(6);
            throw new Error(`Action ${_0x22f72a} not found.`);
          case 17:
            return _0x21d371.abrupt("return", true);
          case 20:
            _0x21d371.prev = 20;
            _0x21d371.t1 = _0x21d371.catch(0);
            toastr.error(_0x21d371.t1.message, "Streamer.bot Error");
            return _0x21d371.abrupt("return", false);
          case 24:
          case "end":
            return _0x21d371.stop();
        }
      }
    }, _0x53604e, null, [[0, 20], [6, 14]]);
  }));
  return function (_0x500cdc, _0x430635) {
    return _0x520dbe.apply(this, arguments);
  };
}();
actionsandevents.setVoicemodVoice = function () {
  var _0x14a92f = _asyncToGenerator(_regeneratorRuntime().mark(function _0x5cc94a(_0x332fd8, _0x4dcf13, _0x93707d, _0x395cbf, _0x5edc10) {
    var _0x4813c1;
    return _regeneratorRuntime().wrap(function _0x2e4acb(_0x1493bd) {
      while (1) {
        switch (_0x1493bd.prev = _0x1493bd.next) {
          case 0:
            _0x1493bd.prev = 0;
            _0x1493bd.next = 3;
            return actionsandevents.getConnectedVoicemod();
          case 3:
            _0x4813c1 = _0x1493bd.sent;
            _0x4813c1.addVoiceToQueue(_0x332fd8, _0x4dcf13 * 1000, _0x93707d, _0x395cbf, function (_0xcf5101) {
              toastr.error(_0xcf5101.toString(), "Voicemod Error");
            });
            if (_0x5edc10) {
              toastr.success("Voice Set");
            }
            _0x1493bd.next = 11;
            break;
          case 8:
            _0x1493bd.prev = 8;
            _0x1493bd.t0 = _0x1493bd.catch(0);
            toastr.error(_0x1493bd.t0.toString(), "Voicemod Error");
          case 11:
          case "end":
            return _0x1493bd.stop();
        }
      }
    }, _0x5cc94a, null, [[0, 8]]);
  }));
  return function (_0x464431, _0x1e355a, _0x323f19, _0x21a374, _0x364266) {
    return _0x14a92f.apply(this, arguments);
  };
}();
var sounds = {
  inputs: {},
  inputValues: {},
  triggerDataSource: [],
  soundsDataSource: [],
  giftRepeatInfo: {},
  playQueues: {},
  playQueueIsBusy: {},
  audioObjects: {},
  maxFree: 5
};
sounds.init = function () {
  sounds.soundsDataSource = JSON.parse(settings.get("soundsDataSource") || "[]");
  sounds.reregisterShortcuts();
  utils.createMyInstantsBackup(sounds.soundsDataSource);
  var _0x1837dd = _createForOfIteratorHelper(sounds.soundsDataSource);
  var _0x1807c4;
  try {
    for (_0x1837dd.s(); !(_0x1807c4 = _0x1837dd.n()).done;) {
      var _0x5ead94 = _0x1807c4.value;
      _0x5ead94.isTempDisabled = false;
      if (typeof _0x5ead94.triggerId === "number") {
        _0x5ead94.triggerId = _0x5ead94.triggerId.toString();
      }
    }
  } catch (_0x3fe6d1) {
    _0x1837dd.e(_0x3fe6d1);
  } finally {
    _0x1837dd.f();
  }
  utils.initDxInput(sounds, "dxCheckBox", $("#checkboxSoundsPlaySimultaneously"), true);
  utils.initDxInput(sounds, "dxCheckBox", $("#checkboxSoundsPlayEmotesOnce"), true);
  utils.initDxInput(sounds, "dxNumberBox", $("#numberboxSoundsMaxQueueLength"), 100, {
    min: 1,
    max: 5000,
    step: 1,
    showSpinButtons: true
  });
  utils.initDxInput(sounds, "dxCheckBox", $("#soundsEnabledCheckbox"), true, {
    text: "Sounds enabled",
    width: "300px"
  });
  $("#soundsEnabledCheckbox").css("margin-top", "8px").css("position", "absolute").css("margin-left", "20px");
  if (settings.get("channelId") === "0") {
    sounds.onChannelContextChanged();
  }
};
sounds.setGridLoading = function (_0x55bb70) {
  $("#sounds-grid").toggleClass("is-loading", !!_0x55bb70);
};
sounds.refreshDataSource = function (_0x9060e7) {
  sounds.setGridLoading(true);
  sounds.loadTriggers(_0x9060e7).then(function (_0x5553af) {
    var _0x1769f4 = _createForOfIteratorHelper(_0x5553af);
    var _0x4538c9;
    try {
      for (_0x1769f4.s(); !(_0x4538c9 = _0x1769f4.n()).done;) {
        var _0x45a72d;
        var _0x51bc42 = _0x4538c9.value;
        _0x51bc42.id = (_0x45a72d = _0x51bc42.id) === null || _0x45a72d === undefined ? undefined : _0x45a72d.toString();
      }
    } catch (_0x59a39a) {
      _0x1769f4.e(_0x59a39a);
    } finally {
      _0x1769f4.f();
    }
    sounds.triggerDataSource = _0x5553af;
    sounds.loadData();
    sounds.setGridLoading(false);
  }).catch(function (_0x4d26d3) {
    $("#soundsInitError").html("<i><b>Error:</b> Failed to load TikTok gifts. Refresh the website or contact support.</i>");
    $("#soundsEnabledCheckbox").hide();
    sounds.setGridLoading(false);
  });
};
sounds.onChannelContextChanged = function () {
  var _0x24620b;
  var _0x41dd13;
  var _0x13e3a8;
  sounds.refreshDataSource();
  if ((_0x24620b = window.session) === null || _0x24620b === undefined || (_0x41dd13 = _0x24620b.me) === null || _0x41dd13 === undefined || (_0x13e3a8 = _0x41dd13.userFeatures) === null || _0x13e3a8 === undefined || !_0x13e3a8.isPro) {
    sounds.soundsDataSource.slice().reverse().slice(sounds.maxFree).forEach(function (_0x52fb6d) {
      _0x52fb6d.isTempDisabled = true;
    });
  }
  if (sounds.soundsDataSource.find(function (_0x1e0bf1) {
    return _0x1e0bf1.isTempDisabled;
  })) {
    sounds.loadData();
    $("#soundsProExpiredWarning").removeClass("hidden");
  }
};
sounds.onVisible = function () {
  $("#soundsProExpiredWarning").removeClass("shakeEffect");
  setTimeout(function () {
    return $("#soundsProExpiredWarning").addClass("shakeEffect");
  }, 500);
  try {
    var _0x335e64 = $("#datagridSounds").dxDataGrid("instance");
    if (_0x335e64) {
      _0x335e64.updateDimensions();
    }
  } catch (_0x1c5d11) {}
};
sounds.save = function () {
  settings.set("soundsDataSource", JSON.stringify(sounds.soundsDataSource));
  socketiowrapper.emitWidgetSettingsToWidgets();
};
sounds.checkCount = function () {
  if (sounds.soundsDataSource.length > 1) {
    try {
      setup.createPaymentUi();
    } catch (_0x4c7bcc) {}
  }
};
sounds.loadTriggers = function () {
  var _0x2e254f = _asyncToGenerator(_regeneratorRuntime().mark(function _0x48c882(_0x6cac8e) {
    var _0x4522a5;
    var _0x498190;
    return _regeneratorRuntime().wrap(function _0x2ef411(_0x4da4fe) {
      while (1) {
        switch (_0x4da4fe.prev = _0x4da4fe.next) {
          case 0:
            _0x4522a5 = [];
            _0x4522a5.push({
              id: 505001,
              name: "Follow",
              diamond_count: 0,
              icon: "fas fa-user-check"
            });
            _0x4522a5.push({
              id: 505002,
              name: "Share",
              diamond_count: 0,
              icon: "fas fa-share"
            });
            _0x4522a5.push({
              id: 505003,
              name: "Subscribe / Super Fan",
              diamond_count: 0,
              icon: "fas fa-star"
            });
            _0x4522a5.push({
              id: 505004,
              name: "Any Gift",
              diamond_count: 0,
              icon: "fas fa-gift"
            });
            _0x4522a5.push({
              id: 505005,
              name: "Product Purchase",
              diamond_count: 0,
              icon: "fas fa-cart-shopping"
            });
            _0x4da4fe.t0 = _0x4522a5;
            _0x4da4fe.next = 9;
            return _asyncToGenerator(_regeneratorRuntime().mark(function _0x4f6901() {
              return _regeneratorRuntime().wrap(function _0x7ef180(_0x5738df) {
                while (1) {
                  switch (_0x5738df.prev = _0x5738df.next) {
                    case 0:
                      _0x5738df.prev = 0;
                      _0x5738df.next = 3;
                      return actionsandevents.getAllEmotes();
                    case 3:
                      return _0x5738df.abrupt("return", _0x5738df.sent.map(function (_0x3d5033) {
                        return {
                          type: "emote",
                          diamond_count: 0,
                          id: _0x3d5033.emoteId,
                          name: "Sticker",
                          imageUrl: _0x3d5033.imageUrl,
                          otherIds: _0x3d5033.otherIds,
                          sourceId: _0x3d5033.sourceId
                        };
                      }));
                    case 6:
                      _0x5738df.prev = 6;
                      _0x5738df.t0 = _0x5738df.catch(0);
                      return _0x5738df.abrupt("return", []);
                    case 9:
                    case "end":
                      return _0x5738df.stop();
                  }
                }
              }, _0x4f6901, null, [[0, 6]]);
            }))();
          case 9:
            _0x4da4fe.t1 = _0x4da4fe.sent;
            _0x4522a5 = _0x4da4fe.t0.concat.call(_0x4da4fe.t0, _0x4da4fe.t1);
            _0x4da4fe.t2 = structuredClone;
            _0x4da4fe.t3 = _0x6cac8e;
            if (_0x4da4fe.t3) {
              _0x4da4fe.next = 17;
              break;
            }
            _0x4da4fe.next = 16;
            return actionsandevents.getAllGiftsCached();
          case 16:
            _0x4da4fe.t3 = _0x4da4fe.sent;
          case 17:
            _0x4da4fe.t4 = _0x4da4fe.t3;
            _0x498190 = (0, _0x4da4fe.t2)(_0x4da4fe.t4);
            _0x4522a5 = _0x4522a5.concat(_0x498190.sort(function (_0x372e7f, _0x2fba0e) {
              return _0x372e7f.diamond_count - _0x2fba0e.diamond_count;
            }));
            if (!(_0x4522a5.length < 30)) {
              _0x4da4fe.next = 22;
              break;
            }
            throw new Error("Failed to retrieve TikTok Gifts");
          case 22:
            return _0x4da4fe.abrupt("return", _0x4522a5);
          case 23:
          case "end":
            return _0x4da4fe.stop();
        }
      }
    }, _0x48c882);
  }));
  return function (_0x458708) {
    return _0x2e254f.apply(this, arguments);
  };
}();
sounds.onInputChange = function (_0x57eab6, _0x1695e6) {
  if (["checkboxSoundsPlaySimultaneously", "soundsEnabledCheckbox"].includes(_0x57eab6)) {
    sounds.stopAll();
  }
  if (_0x57eab6 === "soundsEnabledCheckbox") {
    $("#soundsDisabledHint").css("display", _0x1695e6 ? "none" : "block");
  }
};
sounds.loadData = function () {
  $("#buttonSoundsNew").dxButton({
    icon: "add",
    text: "Create Sound Alert",
    onClick: function _0x4802a3() {
      if (!window.session.channelId) {
        soundlibrary.openPopup(function (_0x5a7a5c) {
          if (_0x5a7a5c) {
            toastr.error("Login required!");
            navigation.pageChange("setup");
            setTimeout(function () {
              $(".setupBasic").addClass("shakeEffect");
            }, 1000);
          }
        }, true);
        return;
      }
      if (sounds.soundsDataSource.length >= sounds.maxFree && !window.session.me.userFeatures.isPro) {
        DevExpress.ui.dialog.alert(`You have reached the limit of ${sounds.maxFree.toLocaleString()} sounds!<br>You can upgrade your account to <b>TikFinity Pro</b> in order to<br>create unlimited Sounds.`, "Free Limit Reached").done(function () {
          setup.scrollToPaymentUi("SOUNDS_LIMIT", true);
        });
        return;
      }
      $("#datagridSounds").dxDataGrid("instance").addRow();
    }
  }).css("margin-bottom", "10px");
  $("#datagridSounds").dxDataGrid({
    dataSource: sounds.soundsDataSource,
    showBorders: true,
    repaintChangesOnly: true,
    width: "100%",
    noDataText: "No Sound Alerts defined",
    keyExpr: "id",
    columnAutoWidth: true,
    columnHidingEnabled: true,
    wordWrapEnabled: true,
    editing: {
      allowUpdating: true,
      allowDeleting: true,
      mode: "cell",
      useIcons: true,
      texts: {
        confirmDeleteMessage: "Are you sure you want to delete this sound alert?"
      }
    },
    paging: {
      enabled: false
    },
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: "Search..."
    },
    columns: [{
      type: "buttons",
      buttons: [{
        icon: "video",
        hint: "Play",
        onClick: function _0x4a20f6(_0x593871) {
          if (_0x593871.row.data.isTempDisabled) {
            return sounds.showUnlockAllSoundsMessage();
          }
          if (_0x593871.row.data.soundUrl) {
            sounds.playSoundItem(_0x593871.row.data);
          } else {
            toastr.warning("Please select sound!", "No Sound Mapped");
          }
        }
      }, {
        name: "delete",
        icon: "trash"
      }]
    }, {
      dataField: "id",
      dataType: "string",
      visible: false
    }, {
      dataField: "createdAt",
      dataType: "date",
      visible: false,
      sortIndex: 0,
      sortOrder: "desc"
    }, {
      caption: "Enabled",
      dataField: "enabled",
      dataType: "boolean",
      showEditorAlways: true,
      alignment: "center",
      width: "80px",
      calculateCellValue: function _0x1a7d6f(_0x5bd087) {
        return _0x5bd087.enabled && !_0x5bd087.isTempDisabled;
      }
    }, {
      caption: "Trigger",
      dataField: "triggerId",
      showEditorAlways: true,
      alignment: "left",
      width: "300px",
      dataType: "string",
      calculateSortValue: function _0x4d7ab9(_0x495e28) {
        return sounds.triggerDataSource.find(function (_0x511d77) {
          return _0x511d77.id === _0x495e28.triggerId;
        })?.diamond_count;
      }
    }, {
      dataField: "triggerName",
      dataType: "string",
      visible: false,
      calculateCellValue: function _0xf7f96a(_0x2c77ca) {
        return sounds.triggerDataSource.find(function (_0x1f11ee) {
          return _0x1f11ee.id === _0x2c77ca.triggerId;
        })?.name;
      }
    }, {
      dataField: "soundUrl",
      dataType: "string",
      visible: false
    }, {
      caption: "Sound",
      dataField: "soundName",
      alignment: "left",
      showEditorAlways: true
    }, {
      caption: "Key Shortcut",
      dataField: "shortcut",
      alignment: "left",
      showEditorAlways: true,
      width: "110px"
    }, {
      caption: "Volume",
      dataField: "volume",
      alignment: "left",
      showEditorAlways: true,
      width: "250px"
    }],
    onRowPrepared: function _0x465570(_0x16c316) {
      if (_0x16c316.rowType === "data") {
        if (_0x16c316.data.isTempDisabled) {
          _0x16c316.rowElement.css("background", "#561623");
        }
      }
    },
    onInitNewRow: function _0x3c4e6f(_0x25ac6f) {
      _0x25ac6f.data.id = utils.uuidv4();
      _0x25ac6f.data.enabled = true;
      _0x25ac6f.data.volume = 80;
      _0x25ac6f.data.createdAt = new Date();
      setTimeout(function () {
        var _0x1536ea = _0x25ac6f.component.getCellElement(0, "triggerId");
        _0x25ac6f.component.focus(_0x1536ea);
      }, 100);
    },
    onEditorPreparing: function _0x5d87dc(_0x3bf340) {
      if (_0x3bf340.dataField == "soundName") {
        _0x3bf340.editorName = "dxButton";
        _0x3bf340.editorOptions.text = "Select Sound";
        _0x3bf340.editorOptions.onClick = function () {
          if (_0x3bf340.row.data.isTempDisabled) {
            return sounds.showUnlockAllSoundsMessage();
          }
          soundlibrary.openPopup(function (_0x2ac7b7) {
            if (_0x2ac7b7) {
              _0x3bf340.component.cellValue(_0x3bf340.row.rowIndex, "soundUrl", _0x2ac7b7.url);
              _0x3bf340.component.cellValue(_0x3bf340.row.rowIndex, "soundName", _0x2ac7b7.name);
              _0x3bf340.component.saveEditData();
              toastr.success("Sound added!");
            }
          }, true);
        };
        _0x3bf340.editorElement.css("margin", "3px");
        if (_0x3bf340.row.data.soundName) {
          _0x3bf340.editorElement.parent().append($("<div>").css("display", "inline").css("margin-left", "10px").text(_0x3bf340.row.data.soundName));
        }
      }
      if (_0x3bf340.dataField == "triggerId") {
        _0x3bf340.editorName = "dxSelectBox";
        _0x3bf340.editorOptions.dataSource = sounds.triggerDataSource;
        _0x3bf340.editorOptions.displayExpr = "name";
        _0x3bf340.editorOptions.valueExpr = "id";
        _0x3bf340.editorOptions.searchEnabled = true;
        _0x3bf340.editorOptions.noDataText = "Select...";
        _0x3bf340.editorOptions.valueChangeEvent = "keyup";
        _0x3bf340.editorOptions.itemTemplate = function (_0x314222, _0x399b8e, _0x553c7a) {
          var _0x1d66d8 = $("<div>").css("display", "table-row").css("height", "40px");
          var _0x4fa2e4;
          if (_0x314222.icon) {
            _0x4fa2e4 = $("<div>").attr("class", _0x314222.icon);
            _0x4fa2e4.css("font-size", "30px");
            _0x4fa2e4.css("color", "#31b5d5");
          } else {
            var _0x5ece82;
            _0x4fa2e4 = $("<img>").attr("src", ((_0x5ece82 = _0x314222.image) === null || _0x5ece82 === undefined ? undefined : _0x5ece82.url_list?.[0]) || _0x314222.imageUrl).attr("onerror", "this.style.opacity='0'");
          }
          var _0x477ac3 = $("<div>").html(_0x314222.name);
          if (_0x314222.icon) {
            _0x477ac3.css("font-size", "1.2em");
          }
          var _0x5e3a27 = _0x314222.diamond_count ? _0x314222.diamond_count.toLocaleString() + " Coins" : "";
          if (_0x314222.type === "emote") {
            _0x5e3a27 = _0x314222.sourceId === 4 ? "Fan Club" : "Super Fan";
          }
          _0x4fa2e4.css("height", "40px");
          _0x4fa2e4.css("width", "40px");
          _0x4fa2e4.css("text-align", "center");
          var _0x42495b = $("<span>");
          _0x42495b.css("display", "table-cell");
          _0x42495b.css("padding-left", "20px");
          _0x42495b.css("vertical-align", "top");
          _0x42495b.append(_0x477ac3);
          _0x42495b.append($("<div>").text(_0x5e3a27).css("font-size", "0.8em").css("margin-top", "3px"));
          return _0x1d66d8.append(_0x4fa2e4).append(_0x42495b);
        };
        _0x3bf340.editorOptions.fieldTemplate = function (_0x2a3f9d, _0x2394c7) {
          var _0x29e25a = _0x2a3f9d?.name;
          if (_0x2a3f9d && _0x2a3f9d.diamond_count > 0) {
            _0x29e25a += " (" + _0x2a3f9d.diamond_count.toLocaleString() + " Coins)";
          }
          var _0x651623 = $("<div>").dxTextBox({
            text: _0x29e25a,
            placeholder: "Select Trigger..."
          });
          if (_0x2a3f9d && (_0x2a3f9d.icon || _0x2a3f9d.image || _0x2a3f9d.imageUrl)) {
            var _0x2bc499 = $("<div>");
            _0x2bc499.css("width", "30px");
            _0x2bc499.css("text-align", "center");
            _0x2bc499.css("margin-top", "3px");
            if (_0x2a3f9d.icon) {
              _0x2bc499.append($("<div>").attr("class", _0x2a3f9d.icon).css("color", "#31b5d5").css("font-size", "25px"));
            } else {
              var _0x5e3d63;
              _0x2bc499.append($("<img>").attr("src", ((_0x5e3d63 = _0x2a3f9d.image) === null || _0x5e3d63 === undefined ? undefined : _0x5e3d63.url_list?.[0]) || _0x2a3f9d.imageUrl).css("width", "28px").css("height", "28px"));
            }
            _0x2bc499.css("position", "absolute");
            _0x2bc499.css("margin-left", "10px");
            _0x651623.css("margin-left", "45px");
            _0x2394c7.append(_0x2bc499);
          }
          _0x2394c7.append(_0x651623);
        };
        var _0x5ed5cb = _0x3bf340.editorOptions.onValueChanged;
        _0x3bf340.editorOptions.onValueChanged = function (_0x4b3253) {
          _0x5ed5cb(_0x4b3253);
          _0x3bf340.component.saveEditData();
        };
      }
      if (_0x3bf340.dataField == "shortcut") {
        var _0x481184 = utils.getShortcutList();
        var _0x26b13c = _0x481184.map(function (_0x1715e4) {
          return {
            id: _0x1715e4
          };
        });
        _0x26b13c.unshift({
          id: null
        });
        _0x3bf340.editorName = "dxSelectBox";
        _0x3bf340.editorOptions.dataSource = _0x26b13c;
        _0x3bf340.editorOptions.displayExpr = "id";
        _0x3bf340.editorOptions.valueExpr = "id";
        _0x3bf340.editorOptions.searchEnabled = true;
        _0x3bf340.editorOptions.noDataText = "Not Set";
        _0x3bf340.editorOptions.valueChangeEvent = "keyup";
        _0x3bf340.editorOptions.itemTemplate = function (_0x11ea7e, _0x76f2c9, _0x2a0603) {
          var _0x1fc6e2 = $("<div>");
          _0x1fc6e2.text(_0x11ea7e.id);
          if (_0x11ea7e.id) {
            if (utils.isShortcutInUse(_0x11ea7e.id)) {
              _0x1fc6e2.css("color", "rgb(84 84 84)");
              _0x1fc6e2.text(_0x1fc6e2.text() + " (assigned)");
            }
          } else {
            _0x1fc6e2.text("Not Set");
            _0x1fc6e2.css("color", "#999");
          }
          return _0x1fc6e2;
        };
        _0x3bf340.editorOptions.fieldTemplate = function (_0x3fa8ed, _0x5f0152) {
          var _0xb6686 = _0x3fa8ed?.id;
          var _0x2eb945 = $("<div>").dxTextBox({
            text: _0xb6686,
            placeholder: "Not Set"
          });
          _0x5f0152.append(_0x2eb945);
        };
        var _0xea8ff1 = _0x3bf340.editorOptions.onValueChanged;
        _0x3bf340.editorOptions.onValueChanged = function (_0x2eb29f) {
          _0xea8ff1(_0x2eb29f);
          _0x3bf340.component.saveEditData();
        };
      }
      if (_0x3bf340.dataField == "volume") {
        _0x3bf340.editorName = "dxSlider";
        _0x3bf340.editorOptions.min = 1;
        _0x3bf340.editorOptions.max = 100;
        _0x3bf340.editorOptions.onValueChanged = function (_0x52a85e) {
          _0x3bf340.row.data.volume = _0x52a85e.value;
          sounds.save();
        };
      }
    },
    onRowInserted: function _0x2db4a2(_0x1df0ea) {
      sounds.save();
    },
    onRowUpdating: function _0x539a82(_0x318bed) {
      var _0x2d4fbc;
      var _0x14e643;
      if ((_0x2d4fbc = _0x318bed.newData) !== null && _0x2d4fbc !== undefined && _0x2d4fbc.shortcut && !window.session.isElectron) {
        DevExpress.ui.dialog.alert("Keyboard Shortcuts are only available in the TikFinity Desktop App.<br><br><a href=\"/app/\">Download TikFinity Desktop App</a>", "Desktop App Required");
      }
      if ((_0x14e643 = _0x318bed.newData) !== null && _0x14e643 !== undefined && _0x14e643.shortcut && utils.isShortcutInUse(_0x318bed.newData.shortcut)) {
        DevExpress.ui.dialog.alert("This keyboard shortcut you selected is already in use by another Sound Alert.<br>This means that multiple sounds are played when you press the key.", "Shortcut in use");
      }
    },
    onRowUpdated: function _0x4b90a0(_0x3d684c) {
      sounds.save();
      sounds.reregisterShortcuts();
    },
    onRowRemoved: function _0x2bd405(_0x303c0a) {
      sounds.save();
    }
  }).css("margin-top", "-30px");
  if (sounds.inputValues.soundsEnabledCheckbox === false) {
    $("#soundsDisabledHint").css("display", "block");
  }
};
sounds.playSoundByTriggerId = function (_0x1c0539) {
  if (!_0x1c0539) {
    throw new Error("No trigger ID set for event");
  }
  _0x1c0539 = _0x1c0539.toString();
  if (!sounds.inputValues.soundsEnabledCheckbox) {
    return false;
  }
  var _0x219279 = sounds.triggerDataSource.find(function (_0x438c85) {
    return _0x438c85.id === _0x1c0539;
  });
  var _0x42c82d = [_0x1c0539].concat(_toConsumableArray(_0x219279?.otherIds || []));
  var _0x55a535 = sounds.soundsDataSource.filter(function (_0x45e36f) {
    return _0x42c82d.includes(_0x45e36f.triggerId) && _0x45e36f.enabled && _0x45e36f.soundUrl;
  });
  var _0x235011 = _0x55a535[Math.floor(Math.random() * _0x55a535.length)];
  if (_0x235011) {
    sounds.playSoundItem(_0x235011);
    return true;
  }
  return false;
};
sounds.playSoundItem = function (_0x2edb0e) {
  if (_0x2edb0e.isTempDisabled) {
    return toastr.error("Please upgrade to TikFinity Pro", "Sound Disabled");
  }
  var _0x35a83a = sounds.inputValues.checkboxSoundsPlaySimultaneously ? `queue_${_0x2edb0e.triggerId}` : "queue_main";
  if (!sounds.playQueues[_0x35a83a]) {
    sounds.playQueues[_0x35a83a] = [];
  }
  if (sounds.playQueues[_0x35a83a].length < sounds.inputValues.numberboxSoundsMaxQueueLength) {
    sounds.playQueues[_0x35a83a].push(_0x2edb0e);
    sounds.processQueues();
  }
};
sounds.processQueues = function () {
  var _0x41ab56 = function _0x562363(_0x1d7a3b) {
    var _0x2a95f0 = sounds.playQueues[_0x1d7a3b];
    if (!sounds.playQueueIsBusy[_0x1d7a3b] && _0x2a95f0.length > 0) {
      var _0x3d015d = _0x2a95f0.shift();
      sounds.playQueueIsBusy[_0x1d7a3b] = true;
      sounds.playSound(_0x3d015d.soundUrl, _0x3d015d.volume / 100).then(function () {
        sounds.playQueueIsBusy[_0x1d7a3b] = false;
        sounds.processQueues();
      }).catch(function (_0x2190f9) {
        sounds.playQueueIsBusy[_0x1d7a3b] = false;
        sounds.processQueues();
        if (_0x2190f9 && (_0x2190f9.toString().includes("interact with the document") || _0x2190f9.toString().includes("user denied permission"))) {
          utils.showError("Audio blocked by browser", "Please interact with the website first to allow auto-play. (e.g. click on a empty area)");
        } else {
          utils.showError("Failed to play sound", _0x3d015d.soundName);
        }
        api.logError({
          type: "AudioError",
          message: `${_0x2190f9}`,
          soundUrl: _0x3d015d.soundUrl
        });
      });
    }
  };
  for (var _0x361699 in sounds.playQueues) {
    _0x41ab56(_0x361699);
  }
};
sounds.onRawGift = function (_0x4c8f87) {
  var _0x2b4866 = `${_0x4c8f87.giftId}_${_0x4c8f87.userId}`;
  if (_0x4c8f87.repeatCount > 1) {
    var _0x35ad5b = sounds.giftRepeatInfo[_0x2b4866] || 1;
    var _0x3df6ee = _0x4c8f87.repeatCount - _0x35ad5b;
    sounds.giftRepeatInfo[_0x2b4866] = _0x4c8f87.repeatCount;
    if (_0x3df6ee > 0) {
      for (var _0xca0aef = 0; _0xca0aef < _0x3df6ee; _0xca0aef++) {
        if (!sounds.playSoundByTriggerId(_0x4c8f87.giftId)) {
          sounds.playSoundByTriggerId(505004);
        }
      }
    }
    if (_0x4c8f87.repeatEnd) {
      delete sounds.giftRepeatInfo[_0x2b4866];
    }
  } else {
    delete sounds.giftRepeatInfo[_0x2b4866];
    if (!_0x4c8f87.repeatEnd) {
      if (!sounds.playSoundByTriggerId(_0x4c8f87.giftId)) {
        sounds.playSoundByTriggerId(505004);
      }
    }
  }
};
sounds.onShare = function () {
  sounds.playSoundByTriggerId(505002);
};
sounds.onFollow = function () {
  sounds.playSoundByTriggerId(505001);
};
sounds.onSubscribe = function () {
  sounds.playSoundByTriggerId(505003);
};
sounds.onShopItemPurchased = function () {
  sounds.playSoundByTriggerId(505005);
};
sounds.onEmote = function (_0x4caae2) {
  if (sounds.inputValues.checkboxSoundsPlayEmotesOnce && _0x4caae2.emoteIndex > 0) {
    return;
  }
  sounds.playSoundByTriggerId(_0x4caae2.emoteId);
};
sounds.playSound = function (_0xbbc6e1, _0x1a2fa2 = 1) {
  if (_0xbbc6e1.includes(".zerody.one")) {
    _0xbbc6e1 += "?requestby=soundalerts";
  }
  if (setup.debugEnabled) {
    setup.logDebugModeEvent("SoundOnPlay", {
      url: _0xbbc6e1,
      volume: _0x1a2fa2
    });
  }
  return new Promise(function (_0x33b7d0, _0x446f7c) {
    var _0x570451 = sounds.audioObjects[_0xbbc6e1] || new Audio(_0xbbc6e1);
    sounds.audioObjects[_0xbbc6e1] = _0x570451;
    if (_0x570451.listeners) {
      if (_0x570451.listeners.error) {
        _0x570451.removeEventListener("error", _0x570451.listeners.error);
      }
      if (_0x570451.listeners.abort) {
        _0x570451.removeEventListener("abort", _0x570451.listeners.abort);
      }
      if (_0x570451.listeners.play) {
        _0x570451.removeEventListener("play", _0x570451.listeners.play);
      }
      if (_0x570451.listeners.playing) {
        _0x570451.removeEventListener("playing", _0x570451.listeners.playing);
      }
      if (_0x570451.listeners.pause) {
        _0x570451.removeEventListener("pause", _0x570451.listeners.pause);
      }
      if (_0x570451.listeners.ended) {
        _0x570451.removeEventListener("ended", _0x570451.listeners.ended);
      }
      console.log("Removed listeners");
    }
    _0x570451.listeners = {};
    _0x570451.currentTime = 0;
    _0x570451.volume = _0x1a2fa2;
    _0x570451.addEventListener("error", _0x446f7c);
    _0x570451.addEventListener("abort", _0x446f7c);
    _0x570451.listeners.error = _0x446f7c;
    _0x570451.listeners.abort = _0x446f7c;
    var _0x5473c6 = setTimeout(_0x446f7c, 8000);
    var _0xc8e15 = Date.now();
    var _0x18abfd = _0x570451.duration > 0;
    var _0x12827e = function _0x34bc28() {
      clearTimeout(_0x5473c6);
      _0x570451.addEventListener("pause", _0x33b7d0);
      _0x570451.addEventListener("ended", _0x33b7d0);
      _0x570451.listeners.pause = _0x33b7d0;
      _0x570451.listeners.ended = _0x33b7d0;
    };
    var _0x5938cf = function _0x1a869b() {
      if (setup.debugEnabled) {
        setup.logDebugModeEvent("SoundOnPlaying", {
          url: _0xbbc6e1,
          loadtimeMs: Date.now() - _0xc8e15,
          fromCache: _0x18abfd
        });
      }
    };
    _0x570451.addEventListener("play", _0x12827e);
    _0x570451.addEventListener("playing", _0x5938cf);
    _0x570451.listeners.play = _0x12827e;
    _0x570451.listeners.playing = _0x5938cf;
    try {
      var _0x323a00 = _0x570451.play();
      if (_0x323a00) {
        _0x323a00.catch(function (_0x317166) {
          _0x446f7c(_0x317166);
        });
      }
    } catch (_0x396415) {
      _0x446f7c(_0x396415);
    }
  });
};
sounds.stopAll = function () {
  sounds.playQueues = {};
  sounds.playQueueIsBusy = {};
  for (var _0x31bc87 in sounds.audioObjects) {
    try {
      sounds.audioObjects[_0x31bc87].pause();
    } catch (_0x1ec3a) {
      console.error("Failed to pause audio", _0x31bc87);
    }
  }
};
sounds.showUnlockAllSoundsMessage = function () {
  DevExpress.ui.dialog.alert("This sound is currently disabled because your <b>TikFinity Pro</b> subscription has expired.<br>Please upgrade to TikFinity Pro to unlock all sounds again.", "TikFinity Pro Required").then(function () {
    setup.scrollToPaymentUi("SOUNDS_DOWNGRADE_LOCKED", true);
  });
};
sounds.reregisterShortcuts = function () {
  utils.unregisterKeyboardShortcutsForFeature("sounds");
  var _0xe30c5d = _createForOfIteratorHelper(sounds.soundsDataSource);
  var _0x463e0a;
  try {
    var _0x402306 = function _0x4b45e5() {
      var _0x51c3b8 = _0x463e0a.value;
      if (_0x51c3b8.shortcut) {
        utils.registerKeyboardShortcut("sounds", _0x51c3b8.shortcut, function () {
          sounds.playSoundItem(_0x51c3b8);
        });
      }
    };
    for (_0xe30c5d.s(); !(_0x463e0a = _0xe30c5d.n()).done;) {
      _0x402306();
    }
  } catch (_0x138f9d) {
    _0xe30c5d.e(_0x138f9d);
  } finally {
    _0xe30c5d.f();
  }
};
var user = {
  inputs: {},
  inputValues: {},
  dataGrid: null
};
user.refreshUserList = function () {
  if (!window.session.channelId) {
    return;
  }
  try {
    transaction.checkLimit();
  } catch (_0x41ca71) {}
  user.dataGrid = $("#dataGridUser").dxDataGrid({
    height: "calc(100vh - 160px)",
    dataSource: {
      store: {
        type: "odata",
        url: window.appConfig.apiBasePath + "odata/channeluser",
        version: 4,
        deserializeDates: false
      },
      filter: ["channelId", "=", window.session.channelId]
    },
    loadPanel: {
      enabled: true,
      text: "Loading Users...",
      indicatorSrc: "/img/loading.svg"
    },
    remoteOperations: true,
    showBorders: true,
    filterRow: {
      visible: true,
      applyFilter: "auto"
    },
    scrolling: {
      mode: "infinite",
      showScrollbar: "always"
    },
    columns: [{
      dataField: "username",
      caption: localization.getString("user_list_username"),
      dataType: "string",
      alignment: "left",
      cellTemplate: function _0x4f73a7(_0x2b66ff, _0x38e97b) {
        _0x2b66ff.append(utils.generateUsernameCell(_0x38e97b.row.data));
      }
    }, {
      caption: localization.getString("user_list_level"),
      dataType: "number",
      alignment: "left",
      calculateCellValue: function _0x36b326(_0x5c40f9) {
        return utils.getLevelByPoints(_0x5c40f9.totalRewardAmount);
      }
    }, {
      dataField: "totalAmount",
      caption: localization.getString("user_list_total_amount", settings.get("textboxCurrencyName")),
      dataType: "number",
      alignment: "left",
      sortOrder: "desc",
      cellTemplate: function _0x10bcc4(_0x113eb9, _0x2aebcf) {
        var _0x25900d = parseFloat(_0x2aebcf.row.data.totalAmount) < 0;
        if (_0x25900d) {
          _0x113eb9.append("<div style='color: #f64a4a'>- " + _0x2aebcf.row.data.totalAmount.toLocaleString().replace("-", "") + "</div>");
        } else {
          _0x113eb9.append(_0x2aebcf.row.data.totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));
        }
      }
    }, {
      dataField: "totalRewardAmount",
      caption: localization.getString("user_list_total_reward_amount", settings.get("textboxCurrencyName")),
      dataType: "number",
      alignment: "left",
      cellTemplate: function _0x368dce(_0x538104, _0x453d04) {
        _0x538104.append(_0x453d04.row.data.totalRewardAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }));
      }
    }, {
      dataField: "createdAt",
      caption: localization.getString("user_list_created_at"),
      dataType: "datetime",
      alignment: "left"
    }, {
      dataField: "lastUpsertAt",
      caption: localization.getString("user_list_updated_at"),
      dataType: "datetime",
      alignment: "left"
    }],
    onContentReady: function _0x2cdd6a(_0x32ba85) {},
    hoverStateEnabled: true,
    onContextMenuPreparing: function _0x42e0c0(_0x2748f9) {
      if (_0x2748f9.target == "content" && _0x2748f9.row && _0x2748f9.row.rowType === "data") {
        if (!_0x2748f9.items) {
          _0x2748f9.items = [];
        }
        _0x2748f9.items.push({
          text: localization.getString("user_list_context_menu_add_points", settings.get("textboxCurrencyName")),
          onItemClick: function _0x5a7d97() {
            if (transactions && transactions.addManualTransaction) {
              navigation.pageChange("transactions");
              setTimeout(function () {
                transactions.addManualTransaction(_0x2748f9.row.data.userId);
              }, 250);
            }
          }
        });
        _0x2748f9.items.push({
          text: "Delete User",
          onItemClick: function _0x164073() {
            var _0x4e1a8e = DevExpress.ui.dialog.confirm(`Do you really want to delete the user <b>${_0x2748f9.row.data.username}</b> from your Channel Points database?<br>The points and the level of the user will be deleted!`, "Delete User?");
            _0x4e1a8e.done(function () {
              var _0xd2dc87 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x1b1afa(_0x3b8006) {
                return _regeneratorRuntime().wrap(function _0x467978(_0x471866) {
                  while (1) {
                    switch (_0x471866.prev = _0x471866.next) {
                      case 0:
                        if (_0x3b8006) {
                          api.doAction("POST", "deleteChannelUsers", {
                            userIds: [_0x2748f9.row.data.userId]
                          }, function (_0x54dc2e) {
                            toastr.success(_0x2748f9.row.data.username, "User Deleted");
                          }, function (_0x517933) {});
                        }
                      case 1:
                      case "end":
                        return _0x471866.stop();
                    }
                  }
                }, _0x1b1afa);
              }));
              return function (_0x4b8e16) {
                return _0xd2dc87.apply(this, arguments);
              };
            }());
          }
        });
        _0x2748f9.items.push({
          text: localization.getString("user_list_context_menu_open_younow_profile"),
          onItemClick: function _0x4da816() {
            utils.openTiktokProfile(_0x2748f9.row.data.username);
          }
        });
      }
    },
    onContentReady(_0x1c0429) {
      try {
        _0x1c0429.element[0].querySelector(".dx-datagrid-bottom-load-panel").innerHTML = "<img height='50px' src='/img/loading.svg'>";
      } catch (_0x28b889) {}
    }
  });
};
user.onVisible = function () {
  setTimeout(user.refreshUserList, 1000);
};
user.init = function () {};
user.onChannelContextChanged = function () {
  if (!user.dataGrid) {
    setTimeout(user.refreshUserList, 1000);
  }
};
user.onInputChange = function (_0x3bad0f, _0x43b735) {};
user.onAmountChanged = function () {
  if (navigation.currentPage === "user") {
    user.dataGrid.dxDataGrid("instance").refresh();
  }
  ;
};
var transactions = {
  inputs: {},
  inputValues: {},
  dataGrid: null,
  selectboxTransactionUser: null
};
transactions.refreshTransactionList = function () {
  if (!window.session.channelId) {
    return;
  }
  transactions.dataGrid = $("#dataGridTransactions").dxDataGrid({
    height: "calc(100vh - 200px)",
    dataSource: {
      store: {
        type: "odata",
        url: window.appConfig.apiBasePath + "odata/transaction",
        version: 4,
        deserializeDates: false
      },
      filter: [["channelId", "=", window.session.channelId], "and", ["isDeleted", "=", 0], ["isDuringChallenge", "=", window.session.me.channel.challengeRunning]]
    },
    loadPanel: {
      enabled: true,
      text: "Loading Transactions...",
      indicatorSrc: "/img/loading.svg"
    },
    remoteOperations: true,
    showBorders: true,
    noDataText: window.session.me && window.session.me.channel.challengeRunning ? localization.getString("transactions_list_no_data_during_challenge") : localization.getString("transactions_list_no_data"),
    filterRow: {
      visible: true,
      applyFilter: "auto"
    },
    scrolling: {
      mode: "infinite",
      showScrollbar: "always"
    },
    sorting: {
      mode: "none"
    },
    editing: {
      allowDeleting: true,
      mode: "popup",
      texts: {
        confirmDeleteMessage: localization.getString("transactions_list_delete_confirm", settings.get("textboxCurrencyName"))
      }
    },
    columns: [{
      type: "buttons",
      caption: localization.getString("transactions_list_actions"),
      width: 110,
      buttons: [{
        name: "delete"
      }]
    }, {
      dataField: "username",
      caption: localization.getString("transactions_list_username"),
      dataType: "string",
      alignment: "left",
      cellTemplate: function _0x5054ba(_0x4f834c, _0x278078) {
        _0x4f834c.append(utils.generateUsernameCell(_0x278078.row.data));
      }
    }, {
      dataField: "amount",
      caption: settings.get("textboxCurrencyName"),
      dataType: "number",
      alignment: "left",
      cellTemplate: function _0x238574(_0x22045f, _0x45ff7f) {
        var _0x5a1c89 = parseFloat(_0x45ff7f.row.data.amount) > 0;
        if (_0x5a1c89) {
          _0x22045f.append("<div class='yngreen'>+ " + _0x45ff7f.row.data.amount.toLocaleString() + "</div>");
        } else {
          _0x22045f.append("<div style='color: #f64a4a'>- " + _0x45ff7f.row.data.amount.toLocaleString().replace("-", "") + "</div>");
        }
      }
    }, {
      dataField: "description",
      caption: localization.getString("transactions_list_description"),
      dataType: "string",
      alignment: "left"
    }, {
      dataField: "isReward",
      caption: localization.getString("transactions_list_is_reward"),
      dataType: "boolean",
      alignment: "left"
    }, {
      dataField: "isManual",
      caption: localization.getString("transactions_list_is_manual"),
      dataType: "boolean",
      alignment: "left"
    }, {
      dataField: "createdAt",
      caption: localization.getString("transactions_list_created_at"),
      dataType: "datetime",
      alignment: "left",
      sortOrder: "desc"
    }],
    onContentReady: function _0x25e6df(_0x1a9ac2) {},
    onRowRemoving: function _0x2f0368(_0x347710) {
      _0x347710.cancel = true;
      var _0x40147e = _0x347710.data.id;
      api.doAction("DELETE", "rest/transaction/" + _0x40147e, null, function () {
        transactions.dataGrid.dxDataGrid("instance").refresh();
      }, function () {
        transactions.dataGrid.dxDataGrid("instance").refresh();
      });
    },
    onContextMenuPreparing: function _0x346a9c(_0x3a25d7) {
      if (_0x3a25d7.target == "content" && _0x3a25d7.row && _0x3a25d7.row.rowType === "data") {
        if (!_0x3a25d7.items) {
          _0x3a25d7.items = [];
        }
        _0x3a25d7.items.push({
          text: localization.getString("transactions_list_context_menu_add_transaction", settings.get("textboxCurrencyName")),
          onItemClick: function _0x2bf673() {
            if (transactions && transactions.addManualTransaction) {
              transactions.addManualTransaction(_0x3a25d7.row.data.userId);
            }
          }
        });
        _0x3a25d7.items.push({
          text: localization.getString("transactions_list_context_menu_open_younow_profile"),
          onItemClick: function _0xc181ad() {
            utils.openTiktokProfile(_0x3a25d7.row.data.username);
          }
        });
      }
    },
    onContentReady(_0x588af4) {
      try {
        _0x588af4.element[0].querySelector(".dx-datagrid-bottom-load-panel").innerHTML = "<img height='50px' src='/img/loading.svg'>";
      } catch (_0x290645) {}
    },
    hoverStateEnabled: true
  });
};
transactions.onVisible = function () {
  setTimeout(transactions.refreshTransactionList, 1000);
};
transactions.init = function () {
  utils.initDxInput(transactions, "dxButton", $("#buttonAddTranasction"), null, {
    text: localization.getString("transactions_add"),
    width: "200px",
    onClick: transactions.addManualTransaction
  });
  utils.initDxInput(transactions, "dxButton", $("#buttonSubmitTransaction"), null, {
    text: localization.getString("transactions_add_confirm"),
    width: "150px",
    onClick: transactions.onSubmitTranasctionButtonClick
  });
  utils.initDxInput(transactions, "dxButton", $("#buttonCancelTransaction"), null, {
    text: localization.getString("transactions_add_cancel"),
    width: "150px",
    onClick: transactions.onCancelTranasctionButtonClick
  });
  $("#controlsSubmitTransaction").hide();
};
transactions.onChannelContextChanged = function () {
  if (!transactions.dataGrid) {
    setTimeout(transactions.refreshTransactionList, 1000);
  }
};
transactions.onInputChange = function (_0x4bde4c, _0x3c2a15) {};
transactions.addManualTransaction = function (_0x21a11d) {
  $("#controlsSubmitTransaction").find(".error").hide(100);
  $("#controlsAddTransaction").hide(100);
  $("#buttonDeleteAllTransactions").hide(0);
  $("#controlsSubmitTransaction").show(100);
  transactions.selectboxTransactionUser = $("#selectboxTransactionUser").dxSelectBox({
    dataSource: new DevExpress.data.DataSource({
      store: {
        type: "odata",
        url: window.appConfig.apiBasePath + "odata/channeluser",
        key: "id",
        version: 4
      },
      filter: ["channelId", "=", window.session.channelId],
      sort: [{
        selector: "lastUpsertAt",
        desc: true
      }]
    }),
    valueExpr: "userId",
    displayExpr: "username",
    searchEnabled: true,
    placeholder: localization.getString("misc_enter_username")
  }).dxSelectBox("instance");
  if (_0x21a11d) {
    transactions.selectboxTransactionUser.option("value", _0x21a11d);
  }
  $("#transactiondetailsCurrency").text(settings.get("textboxCurrencyName"));
  utils.initDxInput(transactions, "dxNumberBox", $("#numberboxTransactionAmount"), 0, {
    value: 0,
    min: -999999999,
    max: 999999999,
    showSpinButtons: true
  });
  utils.initDxInput(transactions, "dxCheckBox", $("#checkboxTransactionIsReward"), false);
  utils.initDxInput(transactions, "dxTextBox", $("#textboxTransactionDescription"), null, {
    value: null,
    placeholder: localization.getString("transactions_add_transaction_description_placeholder")
  });
};
transactions.onSubmitTranasctionButtonClick = function () {
  $("#controlsSubmitTransaction").find(".error").hide(100);
  var _0x5af8aa = transactions.selectboxTransactionUser.option("value");
  var _0x279229 = transactions.inputValues.numberboxTransactionAmount;
  var _0x388c67 = transactions.inputValues.checkboxTransactionIsReward;
  var _0xc68904 = transactions.inputValues.textboxTransactionDescription;
  var _0x3dcc5c = function _0x654857(_0x5e4496) {
    $("#controlsSubmitTransaction").find(".error").html("<i class=\"fas fa-exclamation-triangle\"></i> " + _0x5e4496 + "<br><br>");
    $("#controlsSubmitTransaction").find(".error").show(100);
    setTimeout(function () {
      $("#controlsSubmitTransaction").find(".error").hide(100);
    }, 3000);
    return;
  };
  if (!_0x5af8aa) {
    _0x3dcc5c(localization.getString("transactions_add_require_user"));
    return;
  }
  if (_0x279229 === null || _0x279229 === 0) {
    _0x3dcc5c(localization.getString("transactions_add_require_field"));
    return;
  }
  transaction.put(_0x5af8aa, null, _0x279229, _0x388c67, true, _0xc68904, false, function (_0x81658c) {
    if (_0x81658c) {
      transactions.onCancelTranasctionButtonClick();
      setTimeout(function () {
        transactions.refreshTransactionList();
      }, 500);
    } else {
      _0x3dcc5c(localization.getString("transactions_add_error"));
    }
  });
};
transactions.onCancelTranasctionButtonClick = function () {
  $("#controlsAddTransaction").show(100);
  $("#buttonDeleteAllTransactions").show(100);
  $("#controlsSubmitTransaction").hide(100);
};
transactions.onAmountChanged = function () {
  if (navigation.currentPage === "transactions" && transactions.dataGrid) {
    transactions.dataGrid.dxDataGrid("instance").refresh();
  }
};
var challenge = {
  inputs: {},
  inputValues: {}
};
challenge.init = function () {
  utils.initDxInput(challenge, "dxTextBox", $("#textboxChallengeName"), "", {
    placeholder: localization.getString("challenge_name_placeholder")
  });
  utils.initDxInput(challenge, "dxButton", $("#buttonChallengeStart"), null, {
    text: localization.getString("challenge_start"),
    width: "180px",
    onClick: challenge.start,
    icon: "chevronright"
  });
  utils.initDxInput(challenge, "dxButton", $("#buttonChallengeStop"), null, {
    text: localization.getString("challenge_end"),
    width: "200px",
    onClick: challenge.stop,
    icon: "close"
  });
  $(".challengeDisabled").hide(0);
  $(".challengeEnabled").hide(0);
  if (settings.get("channelId") == 0) {
    challenge.onChannelContextChanged();
  }
  setInterval(challenge.updateStats, 1000);
};
challenge.onChannelContextChanged = function () {
  if (window.session.me && window.session.me.channel.challengeRunning) {
    $(".challengeDisabled").hide(0);
    $(".challengeEnabled").show(0);
    $(".menuitemmain[data-pageid=challenge]").addClass("runningChallenge");
  } else {
    $(".challengeDisabled").show(0);
    $(".challengeEnabled").hide(0);
    $(".menuitemmain[data-pageid=challenge]").removeClass("runningChallenge");
  }
  challenge.updateStats();
};
challenge.start = function () {
  var _0x3751ed = challenge.inputs.buttonChallengeStart.option("text");
  challenge.inputs.buttonChallengeStart.option("text", localization.getString("challenge_starting"));
  challenge.inputs.buttonChallengeStart.option("disabled", true);
  api.doAction("POST", "startChallenge", {
    challengeName: challenge.inputValues.textboxChallengeName
  }, function () {
    challenge.inputs.buttonChallengeStart.option("disabled", false);
    challenge.inputs.buttonChallengeStart.option("text", _0x3751ed);
    window.session.me.channel.challengeRunning = true;
    window.session.me.channel.challengeName = challenge.inputValues.textboxChallengeName;
    window.session.me.channel.challengeStartAt = new Date().toISOString();
    challenge.updateStats();
    $(".challengeDisabled").hide(100);
    $(".challengeEnabled").show(100);
    $(".menuitemmain[data-pageid=challenge]").addClass("runningChallenge");
    toastr.success(localization.getString("challenge_started_message"), localization.getString("challenge_started_title"));
  }, function () {
    challenge.inputs.buttonChallengeStart.option("disabled", false);
    challenge.inputs.buttonChallengeStart.option("text", _0x3751ed);
  });
};
challenge.stop = function () {
  var _0x2f3334 = challenge.inputs.buttonChallengeStop.option("text");
  challenge.inputs.buttonChallengeStop.option("text", "Stoppen...");
  challenge.inputs.buttonChallengeStop.option("disabled", true);
  var _0x2dee3a = DevExpress.ui.dialog.confirm(localization.getString("challenge_ending_rollover_text", settings.get("textboxCurrencyName"), settings.get("textboxCurrencyName"), settings.get("textboxCurrencyName")), localization.getString("challenge_ending_rollover_title"));
  _0x2dee3a.done(function (_0x52ce49) {
    api.doAction("POST", "endChallenge", {
      keepChallengePoints: _0x52ce49
    }, function () {
      challenge.inputs.buttonChallengeStop.option("disabled", false);
      challenge.inputs.buttonChallengeStop.option("text", _0x2f3334);
      window.session.me.channel.challengeRunning = false;
      window.session.me.channel.challengeName = null;
      window.session.me.channel.challengeStartAt = null;
      $(".challengeDisabled").show(100);
      $(".challengeEnabled").hide(100);
      $(".menuitemmain[data-pageid=challenge]").removeClass("runningChallenge");
      toastr.success("", localization.getString("challenge_ended"));
    }, function () {
      challenge.inputs.buttonChallengeStop.option("disabled", false);
      challenge.inputs.buttonChallengeStop.option("text", _0x2f3334);
    });
  });
};
challenge.updateStats = function () {
  if (!window.session.me || !window.session.me.channel.challengeRunning) {
    return;
  }
  $("#challengeName").text(window.session.me.channel.challengeName);
  var _0x1f1e43 = new Date(window.session.me.channel.challengeStartAt);
  var _0x4d3347 = new Date();
  var _0x46d388 = utils.getFormattedDateDiff(_0x1f1e43, _0x4d3347);
  $("#challengeDuration").text(_0x46d388);
};
var wheel = {
  inputs: {},
  inputValues: {},
  spinQueue: [],
  userLastSpinExecuted: {},
  currentSpin: null,
  customSegments: [],
  customSegmentsMax: 24
};
wheel.init = function () {
  utils.initDxInput(wheel, "dxNumberBox", $("#textboxSpinCost"), 5, {
    min: 0,
    max: 100000,
    showSpinButtons: true
  });
  utils.initDxInput(wheel, "dxNumberBox", $("#textboxSpinMaxWin"), 10, {
    min: 1,
    max: 100000,
    showSpinButtons: true
  });
  utils.initDxInput(wheel, "dxNumberBox", $("#textboxSpinMainPrice"), 30, {
    min: 1,
    max: 1000000,
    showSpinButtons: true
  });
  utils.initDxInput(wheel, "dxNumberBox", $("#textboxSpinDelay"), 10, {
    min: 0,
    max: 120,
    showSpinButtons: true
  });
  utils.initDxInput(wheel, "dxNumberBox", $("#textboxMaxGambleAmount"), 200, {
    min: 20,
    max: 1000000,
    showSpinButtons: true,
    step: 100
  });
  utils.initDxInput(wheel, "dxCheckBox", $("#wheelUseCustomSegments"), false, {
    text: localization.getString("wheel_advanced_settings_checkbox_segments")
  });
  utils.initDxInput(wheel, "dxCheckBox", $("#wheelAllowChatGamble"), false, {
    text: localization.getString("wheel_advanced_settings_checkbox_chat_gamble")
  });
  wheel.initCustomSegmentList();
  wheel.setMode();
  setIntervalFix(wheel.pickNewSpin, 500);
  var _0x13d713 = parseInt(settings.get("wheelMainWinActionId"));
  if (_0x13d713) {
    $(".wheelMainWinActionName").addClass("action-name-" + _0x13d713);
  }
};
wheel.onInputChange = function (_0x21e5b2, _0x315df2) {
  if (_0x21e5b2 === "wheelUseCustomSegments") {
    wheel.setMode();
  }
};
wheel.setMode = function () {
  wheel.inputs.textboxSpinMaxWin.option("disabled", wheel.inputValues.wheelUseCustomSegments);
  wheel.inputs.textboxSpinMainPrice.option("disabled", wheel.inputValues.wheelUseCustomSegments);
};
wheel.initCustomSegmentList = function () {
  wheel.customSegments = JSON.parse(settings.get("wheelCustomSegments", "[]"));
  wheel.updateCustomSegmentCount();
  $("#wheelButtonAddSegment").dxButton({
    text: localization.getString("wheel_advanced_settings_add_segment"),
    icon: "add",
    onClick: function _0x27f880(_0x3dcfb9) {
      if (wheel.customSegments.length >= wheel.customSegmentsMax) {
        return;
      }
      $("#wheelCustomSegmentList").dxDataGrid("instance").addRow();
    }
  });
  $("#wheelCustomSegmentList").dxDataGrid({
    dataSource: wheel.customSegments,
    showBorders: true,
    width: "800px",
    noDataText: localization.getString("wheel_advanced_settings_no_segments"),
    paging: {
      enabled: false
    },
    editing: {
      mode: "cell",
      allowUpdating: true,
      allowDeleting: true,
      useIcons: true,
      texts: {
        confirmDeleteMessage: ""
      }
    },
    columns: [{
      type: "buttons"
    }, {
      dataField: "id",
      visible: false
    }, {
      dataField: "createdAt",
      dataType: "date",
      visible: false,
      sortIndex: 0,
      sortOrder: "desc"
    }, {
      dataField: "segmentColor",
      caption: localization.getString("wheel_advanced_settings_segment_list_color"),
      dataType: "string",
      allowEditing: false,
      cellTemplate: function _0x5156d8(_0xf296a8, _0x498548) {
        _0xf296a8.dxColorBox({
          value: _0x498548.data.segmentColor,
          onValueChanged: function _0x4e2a0e(_0x26fdb4) {
            _0x498548.data.segmentColor = _0x26fdb4.value;
            wheel.saveCustomSegments();
          }
        });
      }
    }, {
      dataField: "amount",
      caption: localization.getString("wheel_advanced_settings_segment_list_points"),
      dataType: "number",
      alignment: "left",
      editorOptions: {
        showSpinButtons: true,
        min: -1000000,
        max: 1000000
      }
    }, {
      dataField: "text",
      caption: localization.getString("wheel_advanced_settings_segment_list_text"),
      dataType: "string",
      editorOptions: {
        maxLength: 10
      }
    }, {
      dataField: "actionId",
      caption: localization.getString("wheel_advanced_settings_segment_list_action"),
      dataType: "number",
      alignment: "left",
      allowEditing: false,
      cellTemplate: function _0x54e06b(_0x30954f, _0x1db080) {
        var _0x2bca03 = $("<a>");
        _0x2bca03.text(localization.getString("wheel_advanced_settings_segment_list_action_empty"));
        if (_0x1db080.row.data.actionId) {
          _0x2bca03.addClass("action-name-" + _0x1db080.row.data.actionId);
          var _0x5420ee = actionsandevents && actionsandevents.actions ? actionsandevents.actions.find(function (_0x18135c) {
            return _0x18135c.id === _0x1db080.row.data.actionId;
          }) : null;
          if (_0x5420ee) {
            _0x2bca03.text(_0x5420ee.name);
          }
        }
        _0x30954f.on("dxclick", function () {
          actionsandevents.openSelectActionDialog($("#selectWheelActionDialog"), function (_0x3a4550) {
            if (!_0x3a4550) {
              return;
            }
            wheel.customSegments.find(function (_0x329ba0) {
              return _0x329ba0.id === _0x1db080.row.data.id;
            }).actionId = _0x3a4550.id;
            $("#wheelCustomSegmentList").dxDataGrid("instance").refresh();
            wheel.saveCustomSegments();
          });
        });
        _0x30954f.append(_0x2bca03);
        _0x30954f.css("cursor", "pointer");
      }
    }],
    onRowUpdated: function _0x4ae375(_0x420169) {
      wheel.saveCustomSegments();
    },
    onRowInserting: function _0x19d2d5(_0x33d143) {
      wheel.saveCustomSegments();
    },
    onRowRemoved: function _0xb1354f() {
      wheel.saveCustomSegments();
    },
    onInitNewRow: function _0x2a0273(_0x3e762c) {
      _0x3e762c.data.id = utils.uuidv4();
      _0x3e762c.data.createdAt = new Date();
      _0x3e762c.data.segmentColor = "#69cbef";
      _0x3e762c.data.amount = 0;
    }
  });
};
wheel.saveCustomSegments = function () {
  setTimeout(function () {
    settings.set("wheelCustomSegments", JSON.stringify(wheel.customSegments));
    wheel.updateCustomSegmentCount();
  }, 100);
};
wheel.updateCustomSegmentCount = function () {
  $("#wheelCustomSegmentCount").text(localization.getString("wheel_advanced_settings_segment_count", wheel.customSegments.length, wheel.customSegmentsMax));
};
wheel.spinWheel = function (_0x133a00, _0x24c63, _0x1cf65e, _0x3f1c67, _0x5a6426) {
  if (!_0x3f1c67) {
    _0x3f1c67 = 1;
  }
  var _0x3a5d8f = wheel.getSpinSegments(_0x3f1c67);
  var _0xe2ad8c = _0x3a5d8f[0];
  var _0x9120b1 = isNaN(_0xe2ad8c.text) ? 0 : parseInt(_0xe2ad8c.text);
  var _0x61ed7 = null;
  if (typeof _0xe2ad8c.amount !== "undefined") {
    _0x9120b1 = _0xe2ad8c.amount;
  }
  if (typeof _0xe2ad8c.actionId !== "undefined") {
    _0x61ed7 = _0xe2ad8c.actionId;
  }
  socketiowrapper.emitSocketEvent("spinWheel", {
    userId: _0x133a00,
    segments: _0x3a5d8f,
    soundEnabled: obsoverlays.publicSettings.wheel_soundEnabled,
    gambleAmount: _0x5a6426,
    thumbnailUrl: getCachedImageUrl(_0x133a00)
  });
  console.log(_0x9120b1);
  if (!_0x1cf65e) {
    wheel.userLastSpinExecuted[_0x133a00] = new Date().getTime();
    setTimeoutFix(function () {
      setTimeoutFix(function () {
        wheel.currentSpin = null;
        console.log("spin cleared");
      }, 3000);
      if (_0x9120b1 > 0) {
        transaction.put(_0x133a00, _0x24c63, _0x9120b1, false, false, "Spin Reward", false, function () {});
      }
      if (_0x9120b1 < 0) {
        transaction.put(_0x133a00, _0x24c63, _0x9120b1, false, false, "Spin Loss", true, function () {});
      }
      var _0x3743f4 = _0x9120b1 > 0 ? "SPIN_WON" : "SPIN_EMPTY";
      var _0xef71b4 = chatbot.chatbotSnippets.find(function (_0x5ff3b3) {
        return _0x5ff3b3.id === _0x3743f4 && _0x5ff3b3.enabled;
      });
      if (_0xef71b4) {
        var _0x5f5831 = _0xef71b4.message.replaceAll("%username%", _0x24c63).replaceAll("%amount%", _0x9120b1.toLocaleString()).replaceAll("%currencyname%", settings.get("textboxCurrencyName"));
        chatservice.sendMessage(_0x5f5831, _0x24c63, _0xef71b4.id);
      }
      if (_0x3a5d8f[0].isMainWin && settings.get("wheelMainWinActionId")) {
        actionsandevents.executeAction(parseInt(settings.get("wheelMainWinActionId")), null, _0x133a00, _0x24c63);
      }
      if (_0x61ed7) {
        actionsandevents.executeAction(_0x61ed7, null, _0x133a00, _0x24c63);
      }
    }, 10000);
  }
};
wheel.testSpinWidget = function () {
  wheel.spinWheel(17294003, "FunEngine", true);
};
wheel.getSpinSegments = function (_0x530872) {
  var _0x5c6c04 = this;
  if (!_0x530872) {
    _0x530872 = 1;
  }
  var _0x3308b4 = 99999999;
  var _0x5930ad = function _0x291356(_0x53787d, _0x1c53ec, _0x5c7054, _0x4860de) {
    var _0x444314;
    var _0x50c02f;
    var _0x3b3673;
    var _0x4d3ad7;
    var _0x2b4f1d;
    var _0x1bc599;
    var _0x52555b;
    var _0x1f27a = parseInt;
    var _0x272449 = Math.round;
    var _0x568ce5 = typeof _0x5c7054 == "string";
    if (typeof _0x53787d != "number" || _0x53787d < -1 || _0x53787d > 1 || typeof _0x1c53ec != "string" || _0x1c53ec[0] != "r" && _0x1c53ec[0] != "#" || _0x5c7054 && !_0x568ce5) {
      return null;
    }
    if (!_0x5c6c04.pSBCr) {
      _0x5c6c04.pSBCr = function (_0x3919dd) {
        var _0x4ee209 = _0x3919dd.length;
        var _0x35e5b3 = {};
        if (_0x4ee209 > 9) {
          var _0xf0ffdc;
          var _0x7aaa42;
          _0xf0ffdc = _0x3919dd = _0x3919dd.split(",");
          _0x7aaa42 = _slicedToArray(_0xf0ffdc, 4);
          _0x444314 = _0x7aaa42[0];
          _0x50c02f = _0x7aaa42[1];
          _0x3b3673 = _0x7aaa42[2];
          _0x568ce5 = _0x7aaa42[3];
          _0x4ee209 = _0x3919dd.length;
          if (_0x4ee209 < 3 || _0x4ee209 > 4) {
            return null;
          }
          _0x35e5b3.r = _0x1f27a(_0x444314[3] == "a" ? _0x444314.slice(5) : _0x444314.slice(4));
          _0x35e5b3.g = _0x1f27a(_0x50c02f);
          _0x35e5b3.b = _0x1f27a(_0x3b3673);
          _0x35e5b3.a = _0x568ce5 ? parseFloat(_0x568ce5) : -1;
        } else {
          if (_0x4ee209 == 8 || _0x4ee209 == 6 || _0x4ee209 < 4) {
            return null;
          }
          if (_0x4ee209 < 6) {
            _0x3919dd = "#" + _0x3919dd[1] + _0x3919dd[1] + _0x3919dd[2] + _0x3919dd[2] + _0x3919dd[3] + _0x3919dd[3] + (_0x4ee209 > 4 ? _0x3919dd[4] + _0x3919dd[4] : "");
          }
          _0x3919dd = _0x1f27a(_0x3919dd.slice(1), 16);
          if (_0x4ee209 == 9 || _0x4ee209 == 5) {
            _0x35e5b3.r = _0x3919dd >> 24 & 255;
            _0x35e5b3.g = _0x3919dd >> 16 & 255;
            _0x35e5b3.b = _0x3919dd >> 8 & 255;
            _0x35e5b3.a = _0x272449((_0x3919dd & 255) / 0.255) / 1000;
          } else {
            _0x35e5b3.r = _0x3919dd >> 16;
            _0x35e5b3.g = _0x3919dd >> 8 & 255;
            _0x35e5b3.b = _0x3919dd & 255;
            _0x35e5b3.a = -1;
          }
        }
        return _0x35e5b3;
      };
    }
    _0x52555b = _0x1c53ec.length > 9;
    _0x52555b = _0x568ce5 ? _0x5c7054.length > 9 ? true : _0x5c7054 == "c" ? !_0x52555b : false : _0x52555b;
    _0x2b4f1d = _0x5c6c04.pSBCr(_0x1c53ec);
    _0x4d3ad7 = _0x53787d < 0;
    _0x1bc599 = _0x5c7054 && _0x5c7054 != "c" ? _0x5c6c04.pSBCr(_0x5c7054) : _0x4d3ad7 ? {
      r: 0,
      g: 0,
      b: 0,
      a: -1
    } : {
      r: 255,
      g: 255,
      b: 255,
      a: -1
    };
    _0x53787d = _0x4d3ad7 ? _0x53787d * -1 : _0x53787d;
    _0x4d3ad7 = 1 - _0x53787d;
    if (!_0x2b4f1d || !_0x1bc599) {
      return null;
    }
    if (_0x4860de) {
      _0x444314 = _0x272449(_0x4d3ad7 * _0x2b4f1d.r + _0x53787d * _0x1bc599.r);
      _0x50c02f = _0x272449(_0x4d3ad7 * _0x2b4f1d.g + _0x53787d * _0x1bc599.g);
      _0x3b3673 = _0x272449(_0x4d3ad7 * _0x2b4f1d.b + _0x53787d * _0x1bc599.b);
    } else {
      _0x444314 = _0x272449(Math.pow(_0x4d3ad7 * Math.pow(_0x2b4f1d.r, 2) + _0x53787d * Math.pow(_0x1bc599.r, 2), 0.5));
      _0x50c02f = _0x272449(Math.pow(_0x4d3ad7 * Math.pow(_0x2b4f1d.g, 2) + _0x53787d * Math.pow(_0x1bc599.g, 2), 0.5));
      _0x3b3673 = _0x272449(Math.pow(_0x4d3ad7 * Math.pow(_0x2b4f1d.b, 2) + _0x53787d * Math.pow(_0x1bc599.b, 2), 0.5));
    }
    _0x568ce5 = _0x2b4f1d.a;
    _0x1bc599 = _0x1bc599.a;
    _0x2b4f1d = _0x568ce5 >= 0 || _0x1bc599 >= 0;
    _0x568ce5 = _0x2b4f1d ? _0x568ce5 < 0 ? _0x1bc599 : _0x1bc599 < 0 ? _0x568ce5 : _0x568ce5 * _0x4d3ad7 + _0x1bc599 * _0x53787d : 0;
    if (_0x52555b) {
      return "rgb" + (_0x2b4f1d ? "a(" : "(") + _0x444314 + "," + _0x50c02f + "," + _0x3b3673 + (_0x2b4f1d ? "," + _0x272449(_0x568ce5 * 1000) / 1000 : "") + ")";
    } else {
      return "#" + (4294967296 + _0x444314 * 16777216 + _0x50c02f * 65536 + _0x3b3673 * 256 + (_0x2b4f1d ? _0x272449(_0x568ce5 * 255) : 0)).toString(16).slice(1, _0x2b4f1d ? undefined : -2);
    }
  };
  function _0x146b73(_0x49cd44) {
    var _0x2a6b5f;
    var _0x315540;
    var _0x50d162;
    for (_0x50d162 = _0x49cd44.length - 1; _0x50d162 > 0; _0x50d162--) {
      _0x2a6b5f = Math.floor(Math.random() * (_0x50d162 + 1));
      _0x315540 = _0x49cd44[_0x50d162];
      _0x49cd44[_0x50d162] = _0x49cd44[_0x2a6b5f];
      _0x49cd44[_0x2a6b5f] = _0x315540;
    }
    return _0x49cd44;
  }
  function _0x5f11b6() {
    var _0x5ddafa = obsoverlays.publicSettings.wheel_normalWinSegmentColor;
    var _0x2c428b = parseInt(settings.get("textboxSpinMaxWin"));
    var _0x272af7 = parseInt(settings.get("textboxSpinMainPrice"));
    var _0x4217d6 = _0x2c428b / 21;
    var _0x4fa150 = _0x2c428b;
    var _0x1aaa27 = [];
    var _0x34298e = _0x5ddafa;
    for (var _0x331730 = 0; _0x331730 < 21; _0x331730++) {
      _0x34298e = _0x5930ad(-0.05, _0x34298e);
      _0x4fa150 = _0x4fa150 -= _0x4217d6;
      var _0x29bec1 = Math.round(_0x4fa150);
      if (_0x29bec1 < 1) {
        _0x29bec1 = 1;
      }
      _0x29bec1 = Math.round(_0x29bec1 * _0x530872);
      if (_0x29bec1 > _0x3308b4) {
        _0x29bec1 = _0x3308b4;
      }
      _0x1aaa27.push({
        fillStyle: _0x34298e,
        text: _0x29bec1.toString(),
        textFontSize: wheel.getSegmentFontSizeByText(_0x29bec1),
        textFillStyle: obsoverlays.publicSettings.wheel_fontColor
      });
    }
    _0x1aaa27.push({
      fillStyle: obsoverlays.publicSettings.wheel_noWinSegmentColor,
      text: "",
      textFontSize: 25,
      textFillStyle: "#8a8a8a"
    });
    _0x1aaa27.push({
      fillStyle: obsoverlays.publicSettings.wheel_noWinSegmentColor,
      text: "",
      textFontSize: 25,
      textFillStyle: "#8a8a8a"
    });
    _0x272af7 = Math.round(_0x272af7 * _0x530872);
    if (_0x272af7 > _0x3308b4) {
      _0x272af7 = _0x3308b4;
    }
    _0x1aaa27.push({
      fillStyle: obsoverlays.publicSettings.wheel_mainWinSegmentColor,
      text: _0x272af7.toString(),
      textFontSize: wheel.getSegmentFontSizeByText(_0x272af7),
      textFillStyle: obsoverlays.publicSettings.wheel_fontColor,
      isMainWin: true
    });
    _0x1aaa27 = _0x146b73(_0x1aaa27);
    return _0x1aaa27;
  }
  if (!wheel.inputValues.wheelUseCustomSegments || wheel.customSegments.length === 0) {
    return _0x5f11b6();
  }
  var _0x3277a4 = [];
  wheel.customSegments.forEach(function (_0x522fbf) {
    var _0x4594ac = Math.round(_0x522fbf.amount * _0x530872);
    var _0x2003df = _0x522fbf.text;
    if (_0x4594ac > _0x3308b4) {
      _0x4594ac = _0x3308b4;
    }
    if (!_0x2003df) {
      _0x2003df = _0x4594ac.toString();
    }
    _0x3277a4.push({
      fillStyle: _0x522fbf.segmentColor,
      text: _0x2003df,
      textFillStyle: obsoverlays.publicSettings.wheel_fontColor,
      textFontSize: wheel.getSegmentFontSizeByText(_0x2003df),
      amount: _0x4594ac,
      actionId: _0x522fbf.actionId
    });
  });
  _0x3277a4 = _0x146b73(_0x3277a4);
  return _0x3277a4;
};
wheel.getSegmentFontSizeByText = function (_0x551e76) {
  var _0x500046 = 40;
  if (_0x551e76.toString().length >= 3) {
    _0x500046 = 35;
  }
  if (_0x551e76.toString().length >= 4) {
    _0x500046 = 30;
  }
  if (_0x551e76.toString().length >= 5) {
    _0x500046 = 25;
  }
  if (_0x551e76.toString().length >= 6) {
    _0x500046 = 20;
  }
  if (_0x551e76.toString().length >= 7) {
    _0x500046 = 18;
  }
  if (_0x551e76.toString().length >= 9) {
    _0x500046 = 12;
  }
  return _0x500046;
};
wheel.pickNewSpin = function () {
  if (wheel.currentSpin) {
    return;
  }
  wheel.currentSpin = wheel.spinQueue.shift();
  if (!wheel.currentSpin) {
    return;
  }
  if (wheel.currentSpin.cost === 0) {
    console.log("execute free spin");
    wheel.spinWheel(wheel.currentSpin.userId, wheel.currentSpin.username, false);
    return;
  }
  api.get("rest/channeluser", {
    channelId: settings.get("channelId"),
    userId: wheel.currentSpin.userId
  }, function (_0x1002a0) {
    if (_0x1002a0.channelusers.length === 0 || parseFloat(_0x1002a0.channelusers[0].totalAmount) < wheel.currentSpin.cost) {
      var _0x16643f = 0;
      if (_0x1002a0.channelusers.length > 0) {
        _0x16643f = parseFloat(_0x1002a0.channelusers[0].totalAmount);
      }
      var _0x330a4e = chatbot.chatbotSnippets.find(function (_0x4bc542) {
        return _0x4bc542.id === "SPIN_FAILED_AMOUNT" && _0x4bc542.enabled;
      });
      if (_0x330a4e) {
        var _0x12d865 = _0x330a4e.message.replaceAll("%username%", wheel.currentSpin.username).replaceAll("%requiredpoints%", (wheel.currentSpin.cost - _0x16643f).toLocaleString()).replaceAll("%currencyname%", settings.get("textboxCurrencyName"));
        chatservice.sendMessage(_0x12d865, wheel.currentSpin.username, _0x330a4e.id);
      }
      wheel.currentSpin = null;
      return;
    }
    transaction.put(wheel.currentSpin.userId, wheel.currentSpin.username, wheel.currentSpin.cost * -1, false, false, "Spin Cost", false, function () {});
    wheel.spinWheel(wheel.currentSpin.userId, wheel.currentSpin.username, false, wheel.currentSpin.winMultiplier, wheel.currentSpin.cost);
  }, function () {
    wheel.currentSpin = null;
  });
};
wheel.handleSpinCommand = function (_0x5c2be5, _0x46dff4, _0x5786f4) {
  var _0x30a723 = parseFloat(settings.get("textboxSpinCost"));
  var _0x48d007 = parseInt(_0x5786f4.substr(settings.get("textboxChatCmdSpin").trim().length, _0x5786f4.length).replaceAll(",", "."));
  var _0x10a0bb = 1;
  if (wheel.inputValues.wheelAllowChatGamble && _0x30a723 > 0 && _0x48d007 && _0x48d007 > _0x30a723) {
    if (_0x48d007 > wheel.inputValues.textboxMaxGambleAmount) {
      _0x48d007 = wheel.inputValues.textboxMaxGambleAmount;
    }
    _0x10a0bb = _0x48d007 / _0x30a723;
    _0x30a723 = _0x48d007;
  }
  console.info("cost", _0x30a723);
  if (wheel.spinQueue.length > 4) {
    console.log("list too long");
    return;
  }
  if (wheel.currentSpin && wheel.currentSpin.userId === _0x5c2be5) {
    console.log("user currently spinning");
    return;
  }
  if (wheel.spinQueue.find(function (_0x457090) {
    return _0x457090.userId === _0x5c2be5;
  })) {
    console.log("user already queued");
    return;
  }
  if (!wheel.checkUserCanSpinByDelay(_0x5c2be5, _0x46dff4)) {
    console.log("user must wait");
    return;
  }
  wheel.spinQueue.push({
    userId: _0x5c2be5,
    username: _0x46dff4,
    cost: _0x30a723,
    winMultiplier: _0x10a0bb
  });
  wheel.pickNewSpin();
};
wheel.checkUserCanSpinByDelay = function (_0x36765a, _0x15daf3) {
  var _0x5dcbd2 = parseFloat(settings.get("textboxSpinDelay"));
  if (_0x5dcbd2 === 0) {
    return true;
  }
  if (!wheel.userLastSpinExecuted[_0x36765a]) {
    return true;
  }
  var _0x1ebd44 = _0x5dcbd2 * 60 * 1000;
  var _0x2896df = new Date().getTime() - wheel.userLastSpinExecuted[_0x36765a];
  var _0x3ed498 = _0x2896df > _0x1ebd44;
  if (!_0x3ed498) {
    var _0x282098 = chatbot.chatbotSnippets.find(function (_0x1ad338) {
      return _0x1ad338.id === "SPIN_DELAY" && _0x1ad338.enabled;
    });
    if (_0x282098) {
      var _0xa30d67 = _0x282098.message.replaceAll("%username%", _0x15daf3).replaceAll("%minutes%", Math.floor((_0x1ebd44 - _0x2896df) / 60 / 1000) + 1);
      chatservice.sendMessage(_0xa30d67, _0x15daf3, _0x282098.id);
    }
  }
  return _0x3ed498;
};
wheel.onChat = function (_0x9c7cc8) {
  if (settings.get("checkboxChatCmdSpinEnabled") === "true" && settings.get("textboxChatCmdSpin").trim().length > 0 && _0x9c7cc8.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdSpin").trim().toLowerCase()) === 0) {
    wheel.handleSpinCommand(_0x9c7cc8.userId, _0x9c7cc8.name, _0x9c7cc8.comment.trim().toLowerCase());
  }
};
wheel.changeMainWinAction = function () {
  actionsandevents.openSelectActionDialog($("#selectWheelActionDialog"), function (_0xc3579c) {
    settings.set("wheelMainWinActionId", _0xc3579c.id);
    $(".wheelMainWinActionName").text(_0xc3579c.name);
    $(".wheelMainWinActionName").removeClass().addClass("wheelMainWinActionName");
    $(".wheelMainWinActionName").addClass("action-name-" + _0xc3579c.id);
  });
};
var coindrop = {
  inputs: {},
  inputValues: {},
  currentCoins: [],
  automationInterval: null,
  automationCountdown: null,
  collectedUserIds: []
};
coindrop.init = function () {
  utils.initDxInput(coindrop, "dxNumberBox", $("#textboxCoinValue"), 1, {
    min: 0.01,
    max: 100000,
    showSpinButtons: true,
    step: 0.1
  });
  utils.initDxInput(coindrop, "dxNumberBox", $("#textboxCoinAmount"), 5, {
    min: 1,
    max: 100,
    showSpinButtons: true
  });
  utils.initDxInput(coindrop, "dxNumberBox", $("#textboxCoinTimeout"), 20, {
    min: 5,
    max: 480,
    showSpinButtons: true
  });
  utils.initDxInput(coindrop, "dxCheckBox", $("#checkboxCoinDropSingleCollect"), false);
  utils.initDxInput(coindrop, "dxButton", $("#buttonCoinRun"), null, {
    text: localization.getString("coindrop_execute"),
    width: "120px",
    onClick: function _0x5b2178() {
      coindrop.inputs.buttonCoinRun.option("disabled", true);
      var _0x2d9570 = coindrop.inputs.buttonCoinRun.option("text");
      coindrop.inputs.buttonCoinRun.option("text", "Sending...");
      setTimeout(function () {
        coindrop.inputs.buttonCoinRun.option("text", _0x2d9570);
        coindrop.inputs.buttonCoinRun.option("disabled", false);
      }, 1000);
      coindrop.run(false);
    }
  });
  utils.initDxInput(coindrop, "dxCheckBox", $("#checkboxCoinDropAutomatic"), false);
  utils.initDxInput(coindrop, "dxNumberBox", $("#checkboxCoinDropInterval"), 5, {
    min: 1,
    max: 120,
    showSpinButtons: true
  });
  coindrop.automationCountdown = coindrop.inputValues.checkboxCoinDropInterval * 60;
  coindrop.automationInterval = setIntervalFix(coindrop.automationTick, 1000);
};
coindrop.onInputChange = function (_0x17712d, _0x42210c) {
  if (_0x17712d === "checkboxCoinDropAutomatic" || _0x17712d === "checkboxCoinDropInterval") {
    coindrop.automationCountdown = coindrop.inputValues.checkboxCoinDropInterval * 60;
  }
};
coindrop.automationTick = function () {
  if (!coindrop.inputValues.checkboxCoinDropAutomatic || !broadcastlistener.isLive) {
    $("#coinDropCountdown").hide();
    return;
  }
  $("#coinDropCountdown").show();
  coindrop.automationCountdown -= 1;
  $("#coinDropCountdown").text(localization.getString("coindrop_automation_countdown", coindrop.automationCountdown));
  if (coindrop.automationCountdown === 0) {
    $("#coinDropCountdown").text("Coins droppen...");
    coindrop.automationCountdown = coindrop.inputValues.checkboxCoinDropInterval * 60;
    coindrop.run(false);
  }
};
coindrop.run = function (_0x216296) {
  console.info("Run coindrop", _0x216296);
  coindrop.collectedUserIds = [];
  var _0x573bc2 = [];
  var _0x174808 = 2000;
  for (var _0x585825 = 0; _0x585825 < parseInt(coindrop.inputValues.textboxCoinAmount); _0x585825++) {
    var _0x256836 = {
      uuid: utils.uuidv4()
    };
    coindrop.currentCoins.push(_0x256836);
    _0x573bc2.push(_0x256836);
    if (_0x216296) {
      setTimeout(function () {
        coindrop.collect(17294003, "FunEngine", true);
      }, _0x174808);
      _0x174808 += 800;
    }
  }
  socketiowrapper.emitSocketEvent("createCoins", _0x573bc2);
  setTimeoutFix(function () {
    socketiowrapper.emitSocketEvent("timeoutCoins", _0x573bc2.filter(function (_0x2ec360) {
      return !_0x2ec360.collectedBy;
    }));
    _0x573bc2.forEach(function (_0xa70811) {
      _0xa70811.timeout = true;
    });
  }, parseInt(settings.get("textboxCoinTimeout")) * 1000);
};
coindrop.collect = function (_0x133498, _0x3dd160, _0x5255f7) {
  if (coindrop.inputValues.checkboxCoinDropSingleCollect && coindrop.collectedUserIds.includes(_0x133498)) {
    return;
  }
  while (true) {
    var _0x304d9b = coindrop.currentCoins.shift();
    if (!_0x304d9b) {
      break;
    }
    if (_0x304d9b.timeout) {
      continue;
    }
    _0x304d9b.collectedBy = {
      userId: _0x133498,
      username: _0x3dd160
    };
    socketiowrapper.emitSocketEvent("collectCoin", _0x304d9b);
    if (_0x5255f7) {
      return;
    }
    coindrop.collectedUserIds.push(_0x133498);
    transaction.put(_0x133498, _0x3dd160, parseFloat(settings.get("textboxCoinValue")), false, false, "Points Drop", false, function () {}, function () {});
    return;
  }
};
coindrop.onChat = function (_0x51de24) {
  if (settings.get("textboxChatCmdCoinDrop").trim().length > 0 && _0x51de24.comment.trim().toLowerCase().indexOf(settings.get("textboxChatCmdCoinDrop").trim().toLowerCase()) === 0) {
    coindrop.collect(_0x51de24.userId, _0x51de24.name, false);
  }
};
var obsoverlays = {
  stretchDone: false,
  iframes: []
};
obsoverlays.settings = {
  emojify: [{
    type: "number",
    name: "animationDuration",
    default: 3,
    text: "Animation Duration",
    min: 1,
    max: 30,
    format: "#0' Seconds'",
    step: 1
  }, {
    type: "number",
    name: "disappearAfter",
    default: 2,
    text: "Disappear After",
    min: 1,
    max: 1000,
    format: "#0' Seconds'",
    step: 1
  }, {
    type: "bool",
    name: "showEmojis",
    default: true,
    text: "Show Chat Emojis"
  }, {
    type: "bool",
    name: "showSubEmotes",
    default: true,
    text: "Show Subscriber Emotes"
  }, {
    type: "bool",
    name: "showPictures",
    default: true,
    text: "Show Profile Pictures"
  }, {
    type: "number",
    name: "emojiSize",
    default: 50,
    text: "Chat Emoji Size",
    min: 10,
    max: 200,
    format: "#0' px'"
  }, {
    type: "number",
    name: "emoteSize",
    default: 70,
    text: "Sub Emote Size",
    min: 10,
    max: 200,
    format: "#0' px'"
  }, {
    type: "number",
    name: "profilePictureSize",
    default: 50,
    text: "Profile Picture Size",
    min: 10,
    max: 200,
    format: "#0' px'"
  }, {
    type: "number",
    name: "opacity",
    default: 100,
    text: "Opacity",
    min: 10,
    max: 100,
    format: "#0' %'"
  }, {
    type: "number",
    name: "rotations",
    default: 4,
    text: "Rotations",
    min: 0,
    max: 100,
    step: 1
  }],
  chat: [{
    type: "number",
    name: "hideAfter",
    default: 0,
    text: "Hide Entries After",
    min: 0,
    max: 5000,
    format: "#0' Seconds'"
  }, {
    type: "bool",
    name: "showPictures",
    default: true,
    text: "Show Profile Pictures"
  }, {
    type: "bool",
    name: "slideEffect",
    default: true,
    text: "Slide Effect"
  }, {
    type: "bool",
    name: "mini",
    default: true,
    text: "Single Line (mini chat)"
  }, {
    type: "bool",
    name: "autoWidth",
    default: true,
    text: "Fit width to message"
  }, {
    type: "bool",
    name: "rightAlignment",
    default: false,
    text: "Right to left alignment"
  }, {
    type: "bool",
    name: "usernameRgb",
    default: true,
    text: "Random username colors"
  }, {
    type: "head",
    text: "Normal Users"
  }, {
    type: "bool",
    name: "showChatNormal",
    default: true,
    text: "Show Chats"
  }, {
    type: "color",
    name: "usernameColorNormal",
    default: "#bfbfbf",
    text: "Username Color",
    hidden: ["usernameEffectNormal", "!=", "none"]
  }, {
    type: "select",
    name: "usernameEffectNormal",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x42a762) {
      if (_0x42a762.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x42a762.label + "</span>";
      } else if (_0x42a762.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x42a762.label + "</span>";
      } else {
        return "<span>" + _0x42a762.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWaveNormal",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeedNormal",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWaveNormal", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x953d9f) {
      return `<span>${_0x953d9f.label}</span>`;
    }
  }, {
    type: "bool",
    name: "usernameGlowNormal",
    default: false,
    text: "Username Glow Effect"
  }, {
    type: "color",
    name: "usernameGlowColorNormal",
    default: "#ffffff",
    text: "Username Glow Color",
    hidden: ["usernameGlowNormal", "==", false]
  }, {
    type: "color",
    name: "commentColorNormal",
    default: "#e8e8e8",
    text: "Comment Color"
  }, {
    type: "color",
    name: "backgroundNormal",
    default: "rgba(40, 40, 40, 0.8)",
    text: "Background Color"
  }, {
    type: "head",
    text: "Moderators"
  }, {
    type: "bool",
    name: "showChatMod",
    default: true,
    text: "Show Chats"
  }, {
    type: "color",
    name: "usernameColorMod",
    default: "#d93030",
    text: "Username Color",
    hidden: ["usernameEffectMod", "!=", "none"]
  }, {
    type: "select",
    name: "usernameEffectMod",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x3c8bdc) {
      if (_0x3c8bdc.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x3c8bdc.label + "</span>";
      } else if (_0x3c8bdc.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x3c8bdc.label + "</span>";
      } else {
        return "<span>" + _0x3c8bdc.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWaveMod",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeedMod",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWaveMod", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x485e2e) {
      return `<span>${_0x485e2e.label}</span>`;
    }
  }, {
    type: "bool",
    name: "usernameGlowMod",
    default: false,
    text: "Username Glow Effect"
  }, {
    type: "color",
    name: "usernameGlowColorMod",
    default: "#d93030",
    text: "Username Glow Color",
    hidden: ["usernameGlowMod", "==", false]
  }, {
    type: "color",
    name: "commentColorMod",
    default: "#e8e8e8",
    text: "Comment Color"
  }, {
    type: "color",
    name: "backgroundMod",
    default: "rgba(40, 40, 40, 0.8)",
    text: "Background Color"
  }, {
    type: "head",
    text: "Super Fans / Subscribers"
  }, {
    type: "bool",
    name: "showChatSub",
    default: true,
    text: "Show Chats"
  }, {
    type: "color",
    name: "usernameColorSub",
    default: "#e8b461",
    text: "Username Color",
    hidden: ["usernameEffectSub", "!=", "none"]
  }, {
    type: "select",
    name: "usernameEffectSub",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x512295) {
      if (_0x512295.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x512295.label + "</span>";
      } else if (_0x512295.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x512295.label + "</span>";
      } else {
        return "<span>" + _0x512295.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWaveSub",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeedSub",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWaveSub", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x3311a) {
      return `<span>${_0x3311a.label}</span>`;
    }
  }, {
    type: "bool",
    name: "usernameGlowSub",
    default: false,
    text: "Username Glow Effect"
  }, {
    type: "color",
    name: "usernameGlowColorSub",
    default: "#e8b461",
    text: "Username Glow Color",
    hidden: ["usernameGlowSub", "==", false]
  }, {
    type: "color",
    name: "commentColorSub",
    default: "#e8e8e8",
    text: "Comment Color"
  }, {
    type: "color",
    name: "backgroundSub",
    default: "rgba(40, 40, 40, 0.8)",
    text: "Background Color"
  }],
  gifts: [{
    type: "number",
    name: "hideAfter",
    default: 0,
    text: "Hide Entries After",
    min: 0,
    max: 5000,
    format: "#0' Seconds'"
  }, {
    type: "bool",
    name: "showPictures",
    default: true,
    text: "Show Profile Pictures"
  }, {
    type: "bool",
    name: "slideEffect",
    default: true,
    text: "Slide Effect"
  }, {
    type: "bool",
    name: "mini",
    default: false,
    text: "Single Line (mini feed)"
  }, {
    type: "bool",
    name: "usernameRgb",
    default: true,
    text: "Random username colors"
  }, {
    type: "color",
    name: "usernameColor",
    default: "#bfbfbf",
    text: "Username Color",
    hidden: ["usernameEffect", "!=", "none"]
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x4e7f2e) {
      if (_0x4e7f2e.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x4e7f2e.label + "</span>";
      } else if (_0x4e7f2e.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x4e7f2e.label + "</span>";
      } else {
        return "<span>" + _0x4e7f2e.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1d0055) {
      return `<span>${_0x1d0055.label}</span>`;
    }
  }, {
    type: "bool",
    name: "usernameGlow",
    default: false,
    text: "Username Glow Effect"
  }, {
    type: "color",
    name: "usernameGlowColor",
    default: "#ffffff",
    text: "Username Glow Color",
    hidden: ["usernameGlow", "==", false]
  }, {
    type: "color",
    name: "commentColor",
    default: "#e8e8e8",
    text: "Comment Color"
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(40, 40, 40, 0.8)",
    text: "Background Color"
  }, {
    type: "numberFree",
    name: "minValue",
    default: 1,
    text: "Min. coins value to display"
  }],
  transactionviewer: [{
    type: "color",
    name: "fontColor_positive",
    default: "#a2d2de",
    text: localization.getString("obsoverlays_widget_color_font_positive")
  }, {
    type: "color",
    name: "fontColor_negative",
    default: "#e09f9f",
    text: localization.getString("obsoverlays_widget_color_font_negative")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "showChatMinutes",
    default: true,
    text: localization.getString("obsoverlays_widget_show_chat_minutes")
  }],
  userinfo: [{
    type: "color",
    name: "usernameColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_username")
  }, {
    type: "color",
    name: "pointsColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_points")
  }, {
    type: "color",
    name: "rankColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_rank")
  }, {
    type: "color",
    name: "levelColor",
    default: "#31b5d5",
    text: localization.getString("obsoverlays_widget_color_level")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "rightToLeft",
    default: false,
    text: localization.getString("obsoverlays_widget_rtl")
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x5b1f7d) {
      var _0x2152f1 = $("<div>").text(_0x5b1f7d.label);
      if (_0x5b1f7d.value === "rainbow") {
        _0x2152f1.addClass("text-effect text-effect--rainbow");
      } else if (_0x5b1f7d.value === "aurora") {
        _0x2152f1.addClass("text-effect text-effect--aurora");
      } else if (_0x5b1f7d.value === "wavy") {
        _0x2152f1.addClass("text-effect text-effect--wavy");
        var _0x988149 = _0x5b1f7d.label;
        _0x2152f1.empty();
        for (var _0x2ab2e8 = 0; _0x2ab2e8 < _0x988149.length; _0x2ab2e8++) {
          var _0x1a9c73 = $("<span>").addClass("wave-char").text(_0x988149[_0x2ab2e8]);
          _0x1a9c73.css("--char-delay", _0x2ab2e8 * 0.1 + "s");
          _0x2152f1.append(_0x1a9c73);
        }
      }
      return _0x2152f1;
    }
  }, {
    type: "bool",
    name: "usernameGlow",
    default: false,
    text: "Glow"
  }],
  commandinfo: [{
    type: "color",
    name: "headerColor",
    default: "#31b5d5",
    text: localization.getString("obsoverlays_widget_color_header")
  }, {
    type: "color",
    name: "fontColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "priceColor",
    default: "#31b5d5",
    text: localization.getString("obsoverlays_widget_color_price")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "showCustomCommands",
    default: true,
    text: localization.getString("obsoverlays_widget_show_custom_commands")
  }, {
    type: "bool",
    name: "rightToLeft",
    default: false,
    text: localization.getString("obsoverlays_widget_rtl")
  }],
  ranking: [{
    type: "color",
    name: "usernameColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_username")
  }, {
    type: "color",
    name: "pointsColor",
    default: "#4f87db",
    text: localization.getString("obsoverlays_widget_color_points")
  }, {
    type: "color",
    name: "rankColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_rank")
  }, {
    type: "color",
    name: "levelColor",
    default: "#d63160",
    text: localization.getString("obsoverlays_widget_color_level")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "showLevel",
    default: true,
    text: localization.getString("obsoverlays_widget_show_level")
  }, {
    type: "bool",
    name: "showRank",
    default: true,
    text: localization.getString("obsoverlays_widget_show_rank")
  }, {
    type: "bool",
    name: "rightToLeft",
    default: false,
    text: localization.getString("obsoverlays_widget_rtl")
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x11571e) {
      var _0x409a1f = $("<div>").text(_0x11571e.label);
      if (_0x11571e.value === "rainbow") {
        _0x409a1f.addClass("text-effect text-effect--rainbow");
      } else if (_0x11571e.value === "aurora") {
        _0x409a1f.addClass("text-effect text-effect--aurora");
      }
      return _0x409a1f;
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Wave Speed",
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x46b62e) {
      return "<span>" + _0x46b62e.label + "</span>";
    },
    hidden: ["usernameWave", "!=", true]
  }],
  topgifter: [{
    type: "color",
    name: "usernameColor",
    default: "#3e9bde",
    text: localization.getString("obsoverlays_widget_color_username"),
    hidden: ["usernameEffect", "!=", "none"]
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x2849e9) {
      if (_0x2849e9.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x2849e9.label + "</span>";
      } else if (_0x2849e9.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x2849e9.label + "</span>";
      } else {
        return "<span>" + _0x2849e9.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0xe68e0a) {
      return `<span>${_0xe68e0a.label}</span>`;
    }
  }, {
    type: "color",
    name: "pointsColor",
    default: "#f2da00",
    text: localization.getString("obsoverlays_widget_color_points")
  }, {
    type: "color",
    name: "rankColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_rank")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "showRank",
    default: true,
    text: localization.getString("obsoverlays_widget_show_rank")
  }, {
    type: "bool",
    name: "showCoins",
    default: true,
    text: "Show Coins"
  }, {
    type: "bool",
    name: "rightToLeft",
    default: false,
    text: localization.getString("obsoverlays_widget_rtl")
  }, {
    type: "bool",
    name: "showCrown",
    default: true,
    text: "Show Top 1 Crown"
  }, {
    type: "bool",
    name: "showTrophy",
    default: true,
    text: "Show Top 3 Trophy"
  }, {
    type: "bool",
    name: "showCoinSymbol",
    default: true,
    text: "Show Coin Symbol"
  }, {
    type: "head",
    text: "Font Border"
  }, {
    type: "bool",
    name: "enableBorder",
    default: false,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }],
  topliker: [{
    type: "color",
    name: "usernameColor",
    default: "#3e9bde",
    text: localization.getString("obsoverlays_widget_color_username")
  }, {
    type: "color",
    name: "pointsColor",
    default: "#d4d4d4",
    text: localization.getString("obsoverlays_widget_color_points")
  }, {
    type: "color",
    name: "rankColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_rank")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "showRank",
    default: true,
    text: localization.getString("obsoverlays_widget_show_rank")
  }, {
    type: "bool",
    name: "showLikes",
    default: true,
    text: "Show Likes"
  }, {
    type: "bool",
    name: "rightToLeft",
    default: false,
    text: localization.getString("obsoverlays_widget_rtl")
  }, {
    type: "bool",
    name: "showCrown",
    default: true,
    text: "Show Top 1 Crown"
  }, {
    type: "bool",
    name: "showTrophy",
    default: true,
    text: "Show Top 3 Trophy"
  }, {
    type: "bool",
    name: "showHeartSymbol",
    default: true,
    text: "Show Heart Symbol"
  }, {
    type: "bool",
    name: "pulseHeartSymbol",
    default: true,
    text: "Animate Heart Symbol"
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x5d77b2) {
      var _0x2fd2e3 = $("<div>").text(_0x5d77b2.label);
      if (_0x5d77b2.value === "rainbow") {
        _0x2fd2e3.addClass("text-effect text-effect--rainbow");
      } else if (_0x5d77b2.value === "aurora") {
        _0x2fd2e3.addClass("text-effect text-effect--aurora");
      } else if (_0x5d77b2.value === "wavy") {
        _0x2fd2e3.addClass("text-effect text-effect--wavy");
        var _0x191626 = _0x5d77b2.label;
        _0x2fd2e3.empty();
        for (var _0x312d77 = 0; _0x312d77 < _0x191626.length; _0x312d77++) {
          var _0x5aae73 = $("<span>").addClass("wave-char").text(_0x191626[_0x312d77]);
          _0x5aae73.css("--char-delay", _0x312d77 * 0.1 + "s");
          _0x2fd2e3.append(_0x5aae73);
        }
      }
      return _0x2fd2e3;
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Wave Speed",
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x572c95) {
      return $("<span>").text(_0x572c95.label);
    },
    hidden: ["usernameWave", "!=", true]
  }, {
    type: "head",
    text: "Font Border"
  }, {
    type: "bool",
    name: "enableBorder",
    default: false,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }],
  wheel: [{
    type: "color",
    name: "fontColor",
    default: "#213f4a",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "normalWinSegmentColor",
    default: "#69cbef",
    text: localization.getString("obsoverlays_widget_color_normal_win")
  }, {
    type: "color",
    name: "mainWinSegmentColor",
    default: "#bf964e",
    text: localization.getString("obsoverlays_widget_color_normal_main_win")
  }, {
    type: "color",
    name: "noWinSegmentColor",
    default: "#4a4a4a",
    text: localization.getString("obsoverlays_widget_color_normal_no_win")
  }, {
    type: "slider",
    name: "soundVolume",
    default: 50,
    text: localization.getString("obsoverlays_widget_sound_volume")
  }, {
    type: "bool",
    name: "soundEnabled",
    default: true,
    text: localization.getString("obsoverlays_widget_sound_enabled")
  }],
  coindrop: [{
    type: "slider",
    name: "soundVolume",
    default: 80,
    text: localization.getString("obsoverlays_widget_sound_volume")
  }, {
    type: "bool",
    name: "soundEnabled",
    default: true,
    text: localization.getString("obsoverlays_widget_sound_enabled")
  }],
  memory: [{
    type: "color",
    name: "numberColor",
    default: "#ffffff",
    text: localization.getString("obsoverlays_widget_color_numbers")
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(0,0,0,0.6)",
    text: localization.getString("obsoverlays_widget_color_background")
  }, {
    type: "color",
    name: "usernameColor",
    default: "#31b5d5",
    text: localization.getString("obsoverlays_widget_color_username")
  }, {
    type: "slider",
    name: "soundVolume",
    default: 80,
    text: localization.getString("obsoverlays_widget_sound_volume")
  }, {
    type: "bool",
    name: "soundEnabled",
    default: true,
    text: localization.getString("obsoverlays_widget_sound_enabled")
  }],
  goallikes: [{
    type: "select",
    name: "variation",
    default: "default",
    text: localization.getString("obsoverlays_widget_variation"),
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x429020) {
      return $("<div>").html(_0x429020.label + (_0x429020.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: localization.getString("obsoverlays_widget_layout"),
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x2d8f20) {
      var _0x4909ef = $("<div>").text(_0x2d8f20.label);
      if (_0x2d8f20.value === "rainbow") {
        _0x4909ef.addClass("text-effect text-effect--rainbow");
      } else if (_0x2d8f20.value === "aurora") {
        _0x4909ef.addClass("text-effect text-effect--aurora");
      }
      return _0x4909ef;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(23, 139, 189, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#d6eaff",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#d6eaff",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#941e41",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#5ab1d6",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalshares: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x533423) {
      return $("<div>").html(_0x533423.label + (_0x533423.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x12a0bc) {
      var _0x35520c = $("<div>").text(_0x12a0bc.label);
      if (_0x12a0bc.value === "rainbow") {
        _0x35520c.addClass("text-effect text-effect--rainbow");
      } else if (_0x12a0bc.value === "aurora") {
        _0x35520c.addClass("text-effect text-effect--aurora");
      }
      return _0x35520c;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(23, 189, 128, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#94491e",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#5ab1d6",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalfollows: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x21d19e) {
      return $("<div>").html(_0x21d19e.label + (_0x21d19e.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x142361) {
      var _0x25a65e = $("<div>").text(_0x142361.label);
      if (_0x142361.value === "rainbow") {
        _0x25a65e.addClass("text-effect text-effect--rainbow");
      } else if (_0x142361.value === "aurora") {
        _0x25a65e.addClass("text-effect text-effect--aurora");
      }
      return _0x25a65e;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(153, 92, 189, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#c28b02",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#5ab1d6",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalviewer: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x5a543a) {
      return $("<div>").html(_0x5a543a.label + (_0x5a543a.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x4abff5) {
      var _0x1134b3 = $("<div>").text(_0x4abff5.label);
      if (_0x4abff5.value === "rainbow") {
        _0x1134b3.addClass("text-effect text-effect--rainbow");
      } else if (_0x4abff5.value === "aurora") {
        _0x1134b3.addClass("text-effect text-effect--aurora");
      }
      return _0x1134b3;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(64, 81, 194, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#399e80",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#497991",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalcoins: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x397ed3) {
      return $("<div>").html(_0x397ed3.label + (_0x397ed3.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x392d9a) {
      var _0x3510b1 = $("<div>").text(_0x392d9a.label);
      if (_0x392d9a.value === "rainbow") {
        _0x3510b1.addClass("text-effect text-effect--rainbow");
      } else if (_0x392d9a.value === "aurora") {
        _0x3510b1.addClass("text-effect text-effect--aurora");
      }
      return _0x3510b1;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(92, 141, 189, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#c24502",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#5ab1d6",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalpoints: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1551bf) {
      return $("<div>").html(_0x1551bf.label + (_0x1551bf.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x308c35) {
      var _0x5bd2bf = $("<div>").text(_0x308c35.label);
      if (_0x308c35.value === "rainbow") {
        _0x5bd2bf.addClass("text-effect text-effect--rainbow");
      } else if (_0x308c35.value === "aurora") {
        _0x5bd2bf.addClass("text-effect text-effect--aurora");
      }
      return _0x5bd2bf;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(92, 189, 161, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#ddf0e9",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#b36f37",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#2b637a",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalsubs: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0xba3687) {
      return $("<div>").html(_0xba3687.label + (_0xba3687.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x41cdde) {
      var _0x541e84 = $("<div>").text(_0x41cdde.label);
      if (_0x41cdde.value === "rainbow") {
        _0x541e84.addClass("text-effect text-effect--rainbow");
      } else if (_0x41cdde.value === "aurora") {
        _0x541e84.addClass("text-effect text-effect--aurora");
      }
      return _0x541e84;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(12, 119, 145, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#ab8e49",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#3c7596",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalcustom1: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x8bf9db) {
      return $("<div>").html(_0x8bf9db.label + (_0x8bf9db.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x53ad26) {
      var _0x57201c = $("<div>").text(_0x53ad26.label);
      if (_0x53ad26.value === "rainbow") {
        _0x57201c.addClass("text-effect text-effect--rainbow");
      } else if (_0x53ad26.value === "aurora") {
        _0x57201c.addClass("text-effect text-effect--aurora");
      }
      return _0x57201c;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(26, 49, 79, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#731c51",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#1c5473",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalcustom2: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x515cba) {
      return $("<div>").html(_0x515cba.label + (_0x515cba.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1b8bc5) {
      var _0x5058bf = $("<div>").text(_0x1b8bc5.label);
      if (_0x1b8bc5.value === "rainbow") {
        _0x5058bf.addClass("text-effect text-effect--rainbow");
      } else if (_0x1b8bc5.value === "aurora") {
        _0x5058bf.addClass("text-effect text-effect--aurora");
      }
      return _0x5058bf;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(26, 49, 79, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#731c51",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#1c5473",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  goalcustom3: [{
    type: "select",
    name: "variation",
    default: "default",
    text: "Variation",
    dataSource: [{
      value: "default",
      label: "Default"
    }, {
      value: "army",
      label: "Army",
      pro: true
    }, {
      value: "clean-neon",
      label: "Clean Neon",
      pro: true
    }, {
      value: "pure",
      label: "Pure",
      pro: true
    }, {
      value: "raven",
      label: "Raven",
      pro: true
    }, {
      value: "aurous",
      label: "Aurous",
      pro: true
    }, {
      value: "clarity",
      label: "Clarity",
      pro: true
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x5c8d97) {
      return $("<div>").html(_0x5c8d97.label + (_0x5c8d97.pro ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : ""));
    }
  }, {
    type: "select",
    name: "layout",
    default: "simple",
    text: "Layout",
    dataSource: [{
      value: "standard",
      label: "Standard"
    }, {
      value: "simple",
      label: "Simple"
    }, {
      value: "condensed",
      label: "Condensed"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x2bb405) {
      var _0x2f8fc3 = $("<div>").text(_0x2bb405.label);
      if (_0x2bb405.value === "rainbow") {
        _0x2f8fc3.addClass("text-effect text-effect--rainbow");
      } else if (_0x2bb405.value === "aurora") {
        _0x2f8fc3.addClass("text-effect text-effect--aurora");
      }
      return _0x2f8fc3;
    },
    hidden: ["variation", "=", "default"]
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(26, 49, 79, 0.6)",
    text: localization.getString("obsoverlays_widget_color_background"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "fontColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "percentageColor",
    default: "#f5f5f5",
    text: localization.getString("obsoverlays_widget_color_percentage"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "color",
    name: "progress1Color",
    default: "#731c51",
    text: localization.getString("obsoverlays_widget_color_progress_1")
  }, {
    type: "color",
    name: "progress2Color",
    default: "#1c5473",
    text: localization.getString("obsoverlays_widget_color_progress_2")
  }, {
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.getString("obsoverlays_widget_show_title"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "bool",
    name: "enableParallelogram",
    default: true,
    text: localization.getString("obsoverlays_widget_enable_parallelogram"),
    hidden: ["variation", "!=", "default"]
  }, {
    type: "slider",
    name: "hueFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_hue_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "saturationFilter",
    default: 50,
    text: localization.getString("obsoverlays_widget_saturation_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }, {
    type: "slider",
    name: "grayScaleFilter",
    default: 0,
    text: localization.getString("obsoverlays_widget_grayscale_filter"),
    min: 0,
    hidden: ["variation", "=", "default"]
  }],
  guestbattle: [{
    type: "color",
    name: "backgroundColor",
    default: "rgba(30, 30, 30, 0.7)",
    text: localization.getString("obsoverlays_widget_color_background")
  }, {
    type: "color",
    name: "fontColor",
    default: "#7ba3db",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "countdownColor",
    default: "#b06363",
    text: localization.getString("obsoverlays_widget_color_countdown")
  }],
  subcatch: [{
    type: "slider",
    name: "soundVolume",
    default: 80,
    text: localization.getString("obsoverlays_widget_sound_volume")
  }, {
    type: "bool",
    name: "soundEnabled",
    default: true,
    text: localization.getString("obsoverlays_widget_sound_enabled")
  }],
  songrequests: [{
    type: "color",
    name: "titleColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_title")
  }, {
    type: "color",
    name: "fontColor",
    default: "#d9d9d9",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "bool",
    name: "showBoxShadow",
    default: false,
    text: localization.getString("obsoverlays_widget_show_shadow")
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }, {
    type: "bool",
    name: "rightToLeft",
    default: false,
    text: localization.getString("obsoverlays_widget_rtl")
  }],
  quiz: [{
    type: "color",
    name: "questionColor",
    default: "#d9d9d9",
    text: "Question Color"
  }, {
    type: "color",
    name: "shuffleColor",
    default: "#d9d9d9",
    text: "Shuffle Text Color"
  }, {
    type: "color",
    name: "answerColor",
    default: "#d9d9d9",
    text: "Answer Color"
  }, {
    type: "color",
    name: "userPointsColor",
    default: "#d9d9d9",
    text: "User/Points/Countdown Color"
  }, {
    type: "color",
    name: "rankingRank",
    default: "#31b5d5",
    text: "Rank Number"
  }, {
    type: "color",
    name: "rankingText",
    default: "#d9d9d9",
    text: "Rank Username"
  }, {
    type: "color",
    name: "boxShadowColor",
    default: "rgba(33, 33, 33, 0.4)",
    text: localization.getString("obsoverlays_widget_color_shadow")
  }],
  myactions: [{
    type: "head",
    text: "Font Effects"
  }, {
    type: "bool",
    name: "enableWaves",
    default: false,
    text: "Enable Wave Effect"
  }, {
    type: "bool",
    name: "enableMove",
    default: false,
    text: "Enable Move Effect"
  }, {
    type: "bool",
    name: "enable3d",
    default: false,
    text: "Enable 3D Effect"
  }, {
    type: "bool",
    name: "enableUsernameWiggle",
    default: true,
    text: "Enable Wiggle Effect"
  }, {
    type: "bool",
    name: "enableTextShadow",
    default: false,
    text: "Enable Text Shadow"
  }, {
    type: "head",
    text: "Font Border"
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "head",
    text: "Usernames"
  }, {
    type: "bool",
    name: "enableUsernameColor",
    default: true,
    text: "Enable Custom Color"
  }, {
    type: "color",
    name: "usernameColor",
    default: "#32c3a6",
    text: "Custom Color",
    hidden: ["usernameEffect", "!=", "none"]
  }, {
    type: "head",
    text: "Username Text Effects"
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1f0f0b) {
      if (_0x1f0f0b.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x1f0f0b.label + "</span>";
      } else if (_0x1f0f0b.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x1f0f0b.label + "</span>";
      } else {
        return "<span>" + _0x1f0f0b.label + "</span>";
      }
    }
  }, {
    type: "head",
    text: "Size"
  }, {
    type: "number",
    name: "profilePictureSize",
    default: 65,
    text: "Picture Size"
  }, {
    type: "number",
    name: "usernameFontSize",
    default: 65,
    text: "Username Size"
  }, {
    type: "head",
    text: "Options"
  }, {
    type: "bool",
    name: "showProfilePictures",
    default: true,
    text: "Show Profile Picture"
  }, {
    type: "bool",
    name: "showGiftPictures",
    default: false,
    text: "Show Gift Picture"
  }, {
    type: "bool",
    name: "singleTextLine",
    default: false,
    text: "Single Text Line"
  }],
  subcatchinfo: [],
  timer: [{
    type: "color",
    name: "fontColor",
    default: "#ebebeb",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(40, 40, 40, 0.8)",
    text: "Background Color"
  }, {
    type: "bool",
    name: "hideAfterExpiry",
    default: false,
    text: "Hide after expiry"
  }],
  streambuddies: [{
    type: "number",
    name: "avatar.top-n-gifters",
    default: 20,
    text: "Number of Top Gifters",
    min: 1,
    max: 20,
    step: 1
  }, {
    type: "number",
    name: "avatar.base-size",
    default: 100,
    text: "Base Size",
    min: 20,
    max: 500,
    step: 10
  }, {
    type: "number",
    name: "avatar.max-size",
    default: 250,
    text: "Max Size (Top Gifter)",
    min: 50,
    max: 700,
    step: 10
  }, {
    type: "bool",
    name: "avatar.speech.visible",
    default: true,
    text: "Speech Bubbles"
  }, {
    type: "number",
    name: "avatar.speech.duration",
    default: 4,
    text: "Speech Visible Duration",
    min: 2,
    max: 20,
    step: 1,
    format: "#0' Seconds'"
  }],
  viewercount: [{
    type: "color",
    name: "fontColor",
    default: "#ebebeb",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(40, 40, 40, 0.6)",
    text: "Background Color"
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "bool",
    name: "tiktokText",
    default: true,
    text: "Add 'TikTok Viewers' Text"
  }],
  firework: [{
    type: "bool",
    name: "soundEnabled",
    default: true,
    text: localization.getString("obsoverlays_widget_sound_enabled")
  }, {
    type: "slider",
    name: "soundVolume",
    default: 80,
    text: localization.getString("obsoverlays_widget_sound_volume")
  }, {
    type: "number",
    name: "minCoins",
    default: 1,
    text: "Min gift value",
    min: 1,
    max: 500000,
    format: "#0' Coins'",
    step: 10
  }, {
    type: "number",
    name: "maxFireworks",
    default: 5,
    text: "Max concurrent rockets",
    min: 1,
    max: 10,
    format: "#0' Rockets'",
    step: 1
  }, {
    type: "bool",
    name: "showUsername",
    default: true,
    text: "Show Username"
  }, {
    type: "bool",
    name: "repeatWithCombos",
    default: true,
    text: "Repeat on gift combos"
  }],
  likefountain: [{
    type: "bool",
    name: "randomColor",
    default: true,
    text: "Random Heart Color"
  }, {
    type: "color",
    name: "heartColor1",
    default: "#ff859d",
    text: "Static Heart Color 1"
  }, {
    type: "color",
    name: "heartColor2",
    default: "#8f81fc",
    text: "Static Heart Color 2"
  }, {
    type: "bool",
    name: "showProfilePictures",
    default: true,
    text: "Show Profile Pictures"
  }, {
    type: "bool",
    name: "randomPosition",
    default: true,
    text: "Random Heart Position"
  }],
  cannon: [{
    type: "number",
    name: "ballTimeout",
    default: 120,
    text: "Hide Balls after",
    min: 5,
    max: 5000,
    format: "#0' Seconds'",
    step: 5
  }, {
    type: "number",
    name: "maxBalls",
    default: 60,
    text: "Max. Balls",
    min: 2,
    max: 200,
    format: "#0' Balls'",
    step: 5
  }, {
    type: "number",
    name: "ballSize",
    default: 50,
    text: "Ball Size",
    min: 1,
    max: 100,
    format: "#0' %'",
    step: 10
  }, {
    type: "number",
    name: "intensity",
    default: 50,
    text: "Shoot Intensity",
    min: 20,
    max: 100,
    format: "#0' %'",
    step: 10
  }, {
    type: "bool",
    name: "showGiftPictures",
    default: true,
    text: "Show Gift Pictures"
  }, {
    type: "bool",
    name: "showCannon",
    default: true,
    text: "Show Cannon"
  }],
  gcounter1: [{
    type: "color",
    name: "titleColor",
    default: "#ffffff",
    text: "Title Color",
    hidden: ["titleEffect", "!=", "none"]
  }, {
    type: "color",
    name: "counterColor",
    default: "#ebc94d",
    text: "Counter Color"
  }, {
    type: "number",
    name: "giftYOffset",
    default: 0,
    text: "Gift Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "titleYOffset",
    default: 110,
    text: "Title Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "counterYOffset",
    default: 150,
    text: "Counter Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "bool",
    name: "giftEnabled",
    default: true,
    text: "Gift Image Visible"
  }, {
    type: "number",
    name: "giftOpacity",
    default: 90,
    text: "Gift Image Opacity",
    format: "#0' %'",
    min: 0,
    max: 100,
    step: 5
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "titleEffect",
    default: "none",
    text: "Title Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x3015fa) {
      if (_0x3015fa.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x3015fa.label + "</span>";
      } else if (_0x3015fa.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x3015fa.label + "</span>";
      } else {
        return "<span>" + _0x3015fa.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "titleWave",
    default: false,
    text: "Title Wave Animation"
  }, {
    type: "select",
    name: "titleWaveSpeed",
    default: "normal",
    text: "Title Wave Speed",
    hidden: ["titleWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x30e0bf) {
      return `<span>${_0x30e0bf.label}</span>`;
    }
  }, {
    type: "select",
    name: "counterEffect",
    default: "none",
    text: "Counter Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x17c709) {
      if (_0x17c709.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x17c709.label + "</span>";
      } else if (_0x17c709.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x17c709.label + "</span>";
      } else {
        return "<span>" + _0x17c709.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "counterWave",
    default: false,
    text: "Counter Wave Animation"
  }, {
    type: "select",
    name: "counterWaveSpeed",
    default: "normal",
    text: "Counter Wave Speed",
    hidden: ["counterWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x38f9cf) {
      return `<span>${_0x38f9cf.label}</span>`;
    }
  }, {
    type: "bool",
    name: "counterGlow",
    default: false,
    text: "Counter Glow Effect"
  }, {
    type: "color",
    name: "counterGlowColor",
    default: "#ebc94d",
    text: "Counter Glow Color",
    hidden: ["counterGlow", "==", false]
  }],
  gcounter2: [{
    type: "color",
    name: "titleColor",
    default: "#ffffff",
    text: "Title Color",
    hidden: ["titleEffect", "!=", "none"]
  }, {
    type: "color",
    name: "counterColor",
    default: "#ebc94d",
    text: "Counter Color"
  }, {
    type: "number",
    name: "giftYOffset",
    default: 0,
    text: "Gift Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "titleYOffset",
    default: 110,
    text: "Title Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "counterYOffset",
    default: 150,
    text: "Counter Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "bool",
    name: "giftEnabled",
    default: true,
    text: "Gift Image Visible"
  }, {
    type: "number",
    name: "giftOpacity",
    default: 90,
    text: "Gift Image Opacity",
    format: "#0' %'",
    min: 0,
    max: 100,
    step: 5
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "titleEffect",
    default: "none",
    text: "Title Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x2ab9d9) {
      if (_0x2ab9d9.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x2ab9d9.label + "</span>";
      } else if (_0x2ab9d9.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x2ab9d9.label + "</span>";
      } else {
        return "<span>" + _0x2ab9d9.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "titleWave",
    default: false,
    text: "Title Wave Animation"
  }, {
    type: "select",
    name: "titleWaveSpeed",
    default: "normal",
    text: "Title Wave Speed",
    hidden: ["titleWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0xebf3e1) {
      return `<span>${_0xebf3e1.label}</span>`;
    }
  }, {
    type: "select",
    name: "counterEffect",
    default: "none",
    text: "Counter Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x313ddf) {
      if (_0x313ddf.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x313ddf.label + "</span>";
      } else if (_0x313ddf.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x313ddf.label + "</span>";
      } else {
        return "<span>" + _0x313ddf.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "counterWave",
    default: false,
    text: "Counter Wave Animation"
  }, {
    type: "select",
    name: "counterWaveSpeed",
    default: "normal",
    text: "Counter Wave Speed",
    hidden: ["counterWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x4d3111) {
      return `<span>${_0x4d3111.label}</span>`;
    }
  }, {
    type: "bool",
    name: "counterGlow",
    default: false,
    text: "Counter Glow Effect"
  }, {
    type: "color",
    name: "counterGlowColor",
    default: "#ebc94d",
    text: "Counter Glow Color",
    hidden: ["counterGlow", "==", false]
  }],
  gcounter3: [{
    type: "color",
    name: "titleColor",
    default: "#ffffff",
    text: "Title Color",
    hidden: ["titleEffect", "!=", "none"]
  }, {
    type: "color",
    name: "counterColor",
    default: "#ebc94d",
    text: "Counter Color"
  }, {
    type: "number",
    name: "giftYOffset",
    default: 0,
    text: "Gift Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "titleYOffset",
    default: 110,
    text: "Title Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "counterYOffset",
    default: 150,
    text: "Counter Vertical Offset",
    format: "#0' px'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "bool",
    name: "giftEnabled",
    default: true,
    text: "Gift Image Visible"
  }, {
    type: "number",
    name: "giftOpacity",
    default: 90,
    text: "Gift Image Opacity",
    format: "#0' %'",
    min: 0,
    max: 100,
    step: 5
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "titleEffect",
    default: "none",
    text: "Title Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1f5cec) {
      if (_0x1f5cec.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x1f5cec.label + "</span>";
      } else if (_0x1f5cec.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x1f5cec.label + "</span>";
      } else {
        return "<span>" + _0x1f5cec.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "titleWave",
    default: false,
    text: "Title Wave Animation"
  }, {
    type: "select",
    name: "titleWaveSpeed",
    default: "normal",
    text: "Title Wave Speed",
    hidden: ["titleWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x3b1049) {
      return `<span>${_0x3b1049.label}</span>`;
    }
  }, {
    type: "bool",
    name: "titleGlow",
    default: false,
    text: "Title Glow Effect"
  }, {
    type: "color",
    name: "titleGlowColor",
    default: "#ffffff",
    text: "Title Glow Color",
    hidden: ["titleGlow", "==", false]
  }, {
    type: "select",
    name: "counterEffect",
    default: "none",
    text: "Counter Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x4ab9f2) {
      if (_0x4ab9f2.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x4ab9f2.label + "</span>";
      } else if (_0x4ab9f2.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x4ab9f2.label + "</span>";
      } else {
        return "<span>" + _0x4ab9f2.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "counterWave",
    default: false,
    text: "Counter Wave Animation"
  }, {
    type: "select",
    name: "counterWaveSpeed",
    default: "normal",
    text: "Counter Wave Speed",
    hidden: ["counterWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1fe5d7) {
      return `<span>${_0x1fe5d7.label}</span>`;
    }
  }],
  tops: [{
    type: "text",
    name: "titleText",
    default: localization.getString("giftoverlays_topstreaker_title"),
    text: "Title",
    placeholder: "(e.g. Top Streak)"
  }, {
    type: "number",
    name: "titleSize",
    default: 40,
    text: "Title Size",
    min: 10,
    max: 100,
    step: 5
  }, {
    type: "color",
    name: "titleColor",
    default: "#c9c9c9",
    text: "Title Color"
  }, {
    type: "color",
    name: "usernameColor",
    default: "#ffffff",
    text: "Username Color",
    hidden: ["usernameEffect", "!=", "none"]
  }, {
    type: "number",
    name: "usernameSize",
    default: 60,
    text: "Username Size",
    min: 10,
    max: 100,
    step: 10
  }, {
    type: "color",
    name: "counterColor",
    default: "#ebc94d",
    text: "Counter Color"
  }, {
    type: "number",
    name: "titleYOffset",
    default: 5,
    text: "Title Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "giftYOffset",
    default: 30,
    text: "Gift Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "usernameYOffset",
    default: 125,
    text: "Username Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "counterYOffset",
    default: 165,
    text: "Counter Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "bool",
    name: "giftEnabled",
    default: true,
    text: "Gift Image Visible"
  }, {
    type: "number",
    name: "giftOpacity",
    default: 90,
    text: "Gift Image Opacity",
    format: "#0' %'",
    min: 0,
    max: 100,
    step: 5
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "titleEffect",
    default: "none",
    text: "Title Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0xe656ad) {
      if (_0xe656ad.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0xe656ad.label + "</span>";
      } else if (_0xe656ad.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0xe656ad.label + "</span>";
      } else {
        return "<span>" + _0xe656ad.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "titleWave",
    default: false,
    text: "Title Wave Animation"
  }, {
    type: "select",
    name: "titleWaveSpeed",
    default: "normal",
    text: "Title Wave Speed",
    hidden: ["titleWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1c7d2f) {
      return `<span>${_0x1c7d2f.label}</span>`;
    }
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x34e224) {
      if (_0x34e224.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x34e224.label + "</span>";
      } else if (_0x34e224.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x34e224.label + "</span>";
      } else {
        return "<span>" + _0x34e224.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x37dbe7) {
      return `<span>${_0x37dbe7.label}</span>`;
    }
  }],
  topg: [{
    type: "text",
    name: "titleText",
    default: localization.getString("giftoverlays_topgifter_title"),
    text: "Title",
    placeholder: "(e.g. Top Gift)"
  }, {
    type: "number",
    name: "titleSize",
    default: 40,
    text: "Title Size",
    min: 10,
    max: 100,
    step: 5
  }, {
    type: "color",
    name: "titleColor",
    default: "#c9c9c9",
    text: "Title Color"
  }, {
    type: "color",
    name: "usernameColor",
    default: "#ffffff",
    text: "Username Color",
    hidden: ["usernameEffect", "!=", "none"]
  }, {
    type: "number",
    name: "usernameSize",
    default: 60,
    text: "Username Size",
    min: 10,
    max: 100,
    step: 10
  }, {
    type: "color",
    name: "counterColor",
    default: "#ebc94d",
    text: "Coins Color"
  }, {
    type: "number",
    name: "titleYOffset",
    default: 5,
    text: "Title Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "giftYOffset",
    default: 30,
    text: "Gift Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "usernameYOffset",
    default: 125,
    text: "Username Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "number",
    name: "counterYOffset",
    default: 165,
    text: "Coins Vertical Offset",
    format: "#0' pixels'",
    min: 0,
    max: 300,
    step: 5
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "bool",
    name: "giftEnabled",
    default: true,
    text: "Gift Image Visible"
  }, {
    type: "number",
    name: "giftOpacity",
    default: 90,
    text: "Gift Image Opacity",
    format: "#0' %'",
    min: 0,
    max: 100,
    step: 5
  }, {
    type: "head",
    text: "Text Effects"
  }, {
    type: "select",
    name: "titleEffect",
    default: "none",
    text: "Title Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x277dd0) {
      if (_0x277dd0.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x277dd0.label + "</span>";
      } else if (_0x277dd0.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x277dd0.label + "</span>";
      } else {
        return "<span>" + _0x277dd0.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "titleWave",
    default: false,
    text: "Title Wave Animation"
  }, {
    type: "select",
    name: "titleWaveSpeed",
    default: "normal",
    text: "Title Wave Speed",
    hidden: ["titleWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x39bd2c) {
      return `<span>${_0x39bd2c.label}</span>`;
    }
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x585829) {
      if (_0x585829.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x585829.label + "</span>";
      } else if (_0x585829.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x585829.label + "</span>";
      } else {
        return "<span>" + _0x585829.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Username Wave Speed",
    hidden: ["usernameWave", "==", false],
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x1bda23) {
      return `<span>${_0x1bda23.label}</span>`;
    }
  }, {
    type: "bool",
    name: "showGiftValue",
    default: true,
    text: "Show Gift Coins"
  }, {
    type: "text",
    name: "coinsAlias",
    default: "Coins",
    text: "Coins Alias",
    placeholder: "(e.g. Coins)"
  }],
  socialmediarotator: [{
    type: "color",
    name: "fontColor",
    default: "#000000",
    text: localization.getString("obsoverlays_widget_color_font")
  }, {
    type: "color",
    name: "backgroundColor",
    default: "#ffffff",
    text: localization.getString("obsoverlays_widget_color_background")
  }, {
    type: "select",
    name: "animation",
    default: "fade",
    text: localization.getString("obsoverlays_widget_animation"),
    dataSource: socialMediaAnimationDataSource,
    valueExpr: "value",
    displayExpr: "text",
    itemTemplate: function itemTemplate(_0x41aef3) {
      return $("<div>").text(_0x41aef3.text);
    }
  }, {
    type: "number",
    name: "displayTime",
    default: 10,
    text: localization.getString("obsoverlays_widget_display_time"),
    min: 0,
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "number",
    name: "pauseTime",
    default: 2,
    text: localization.getString("obsoverlays_widget_pause_time"),
    min: 0,
    step: 1,
    format: "#0' Seconds'"
  }, {
    name: "socials"
  }],
  fallingsnow: [{
    type: "select",
    name: "variation",
    default: "simple_snow_1",
    text: localization.getString("obsoverlays_widget_variation"),
    dataSource: [{
      value: "simple_snow_1",
      label: localization.getString("obsoverlays_fallingsnow_simple_snow") + " 1"
    }, {
      value: "simple_snow_2",
      label: localization.getString("obsoverlays_fallingsnow_simple_snow") + " 2"
    }, {
      value: "simple_snow_3",
      label: localization.getString("obsoverlays_fallingsnow_simple_snow") + " 3"
    }, {
      value: "snow_flakes_1",
      label: localization.getString("obsoverlays_fallingsnow_snow_flakes") + " 1"
    }, {
      value: "snow_flakes_2",
      label: localization.getString("obsoverlays_fallingsnow_snow_flakes") + " 2"
    }, {
      value: "soft_snow_1",
      label: localization.getString("obsoverlays_fallingsnow_soft_snow") + " 1"
    }, {
      value: "soft_snow_2",
      label: localization.getString("obsoverlays_fallingsnow_soft_snow") + " 2"
    }, {
      value: "soft_snow_3",
      label: localization.getString("obsoverlays_fallingsnow_soft_snow") + " 3"
    }],
    valueExpr: "value",
    displayExpr: "label",
    itemTemplate: function itemTemplate(_0x1b1cf0) {
      return $("<div>").text(_0x1b1cf0.label);
    }
  }],
  wheelofactions: [{
    type: "bool",
    name: "showBase",
    default: true,
    text: localization.t("obsoverlays_widget_show_base")
  }, {
    type: "bool",
    name: "playSound",
    default: true,
    text: localization.t("obsoverlays_widget_sound_enabled")
  }, {
    type: "number",
    name: "announceDuration",
    default: 3,
    text: localization.t("obsoverlays_widget_announce_duration"),
    min: 1,
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "number",
    name: "spinDuration",
    default: 10,
    text: localization.t("obsoverlays_widget_spin_duration"),
    min: 1,
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "number",
    name: "waitDuration",
    default: 1,
    text: localization.t("obsoverlays_widget_wait_duration"),
    min: 0,
    step: 1,
    format: "#0' Seconds'"
  }, {
    name: "wheels"
  }],
  coinmatch: [{
    type: "bool",
    name: "showTitle",
    default: true,
    text: localization.t("obsoverlays_coinmatch_show_title")
  }, {
    type: "text",
    name: "title",
    default: "Coin Match",
    text: "Title",
    hidden: ["showTitle", "!=", true]
  }, {
    type: "number",
    name: "countdown",
    default: 60,
    text: localization.t("obsoverlays_coinmatch_countdown_time"),
    min: 1,
    max: 500000,
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "number",
    name: "countdownStartDelay",
    default: 3,
    text: localization.t("obsoverlays_coinmatch_countdown_start_delay"),
    min: 0,
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "number",
    name: "minimumBid",
    default: 1,
    text: localization.t("obsoverlays_coinmatch_minimum_bid"),
    min: 1,
    max: 500000,
    step: 1,
    format: "#0' Coins'"
  }, {
    type: "bool",
    name: "shouldAutoScroll",
    default: true,
    text: localization.t("obsoverlays_coinmatch_scroll_participants_list")
  }, {
    type: "bool",
    name: "showParticipantsCount",
    default: true,
    text: localization.t("obsoverlays_coinmatch_show_participants_count")
  }, {
    type: "number",
    name: "maxParticipantsCount",
    default: 100,
    min: 1,
    max: 1000,
    text: localization.t("obsoverlays_coinmatch_max_participants_count")
  }, {
    type: "select",
    name: "showWinners",
    default: "keepShowing",
    text: localization.t("obsoverlays_coinmatch_show_winners"),
    dataSource: [{
      value: "keepShowing",
      label: localization.t("obsoverlays_coinmatch_keep_showing")
    }, {
      value: "hideAfter",
      label: localization.t("obsoverlays_coinmatch_hide_after")
    }],
    valueExpr: "value",
    displayExpr: "label",
    itemTemplate: function itemTemplate(_0x47a625) {
      return $("<div>").text(_0x47a625.label);
    }
  }, {
    type: "number",
    name: "hideAfter",
    default: 15,
    text: localization.t("obsoverlays_coinmatch_hide_after"),
    min: 0,
    step: 1,
    format: "#0' Seconds'",
    hidden: ["showWinners", "!=", "hideAfter"]
  }, {
    type: "bool",
    name: "enableSnipeMode",
    default: false,
    text: localization.t("obsoverlays_coinmatch_enable_snipe_mode")
  }, {
    type: "bool",
    name: "enableSlowCountdown",
    default: false,
    text: localization.t("obsoverlays_coinmatch_enable_slow_countdown")
  }, {
    type: "bool",
    name: "randomizedSlowCountdown",
    default: false,
    text: localization.t("obsoverlays_coinmatch_randomized_slow_countdown"),
    hidden: ["enableSlowCountdown", "!=", true]
  }, {
    type: "color",
    name: "fontColor",
    default: "#ffffff",
    text: localization.t("obsoverlays_coinmatch_font_color")
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(40, 40, 40, 0.8)",
    text: localization.t("obsoverlays_coinmatch_background_color")
  }, {
    type: "color",
    name: "timerBackgroundColor",
    default: "rgba(255, 255, 255, 0.1)",
    text: localization.t("obsoverlays_coinmatch_timer_background_color")
  }],
  coinjar: [{
    type: "head",
    text: localization.t("obsoverlays_coinjar_position")
  }, {
    type: "number",
    name: "xOffset",
    default: 0,
    text: localization.t("obsoverlays_coinjar_x_offset"),
    format: "#0' px'",
    min: -1000,
    max: 1000,
    step: 10
  }, {
    type: "number",
    name: "yOffset",
    default: 0,
    text: localization.t("obsoverlays_coinjar_y_offset"),
    format: "#0' px'",
    min: -1000,
    max: 1000,
    step: 10
  }, {
    type: "number",
    name: "scale",
    default: 1,
    text: localization.t("obsoverlays_coinjar_scale_factor"),
    min: 0.1,
    max: 2,
    step: 0.1
  }, {
    type: "number",
    name: "giftScale",
    default: 1,
    text: localization.t("obsoverlays_coinjar_gift_scale_factor"),
    min: 0.1,
    max: 2,
    step: 0.1
  }, {
    type: "head",
    text: "Alert"
  }, {
    type: "bool",
    name: "displayAlert",
    default: true,
    text: localization.t("obsoverlays_coinjar_display_alert")
  }, {
    type: "number",
    name: "alertDuration",
    min: 2,
    max: 10,
    default: 5,
    text: localization.t("obsoverlays_coinjar_alert_duration"),
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "head",
    text: "Leaderboard"
  }, {
    type: "bool",
    name: "displayLeaderboard",
    default: true,
    text: localization.t("obsoverlays_coinjar_display_leaderboard")
  }, {
    type: "select",
    name: "numberOfRanks",
    default: "top5",
    text: localization.t("obsoverlays_coinjar_number_of_ranks"),
    dataSource: [{
      value: "top3",
      label: "Top 3"
    }, {
      value: "top5",
      label: "Top 5"
    }, {
      value: "top10",
      label: "Top 10"
    }],
    valueExpr: "value",
    displayExpr: "label",
    itemTemplate: function itemTemplate(_0x3ce071) {
      return $("<div>").text(_0x3ce071.label);
    }
  }, {
    type: "select",
    name: "leaderboardDisplayFormat",
    default: "avatarNameCoins",
    text: localization.t("obsoverlays_coinjar_display_format"),
    dataSource: [{
      value: "avatarNameCoins",
      label: "Avatar + Name + Coins"
    }, {
      value: "nameCoins",
      label: "Name + Coins"
    }],
    valueExpr: "value",
    displayExpr: "label",
    itemTemplate: function itemTemplate(_0x125955) {
      return $("<div>").text(_0x125955.label);
    }
  }, {
    type: "number",
    name: "leaderboardDuration",
    min: 2,
    max: 10,
    default: 5,
    text: localization.t("obsoverlays_coinjar_leaderboard_duration"),
    step: 1,
    format: "#0' Seconds'"
  }, {
    type: "bool",
    name: "displayRankBadges",
    default: true,
    text: localization.t("obsoverlays_coinjar_display_rank_badges")
  }, {
    type: "bool",
    name: "showTotalCoins",
    default: true,
    text: localization.t("obsoverlays_coinjar_show_total_coins")
  }, {
    type: "head",
    text: localization.t("obsoverlays_coinjar_gift")
  }, {
    type: "select",
    name: "giftType",
    default: "allGifts",
    text: localization.t("obsoverlays_coinjar_gift_type"),
    dataSource: [{
      value: "allGifts",
      label: localization.t("obsoverlays_coinjar_all_gifts")
    }, {
      value: "selectedGifts",
      label: localization.t("obsoverlays_coinjar_selected_gifts")
    }, {
      value: "minimumValue",
      label: localization.t("obsoverlays_coinjar_minimum_value")
    }],
    valueExpr: "value",
    displayExpr: "label",
    itemTemplate: function itemTemplate(_0xde74b9) {
      return $("<div>").text(_0xde74b9.label);
    }
  }, {
    name: "gift",
    text: localization.t("obsoverlays_coinjar_gifts"),
    hidden: ["giftType", "!=", "selectedGifts"]
  }, {
    name: "minimumValue",
    type: "number",
    default: 0,
    text: localization.t("obsoverlays_coinjar_minimum_value"),
    min: 0,
    max: 1000000,
    step: 1,
    format: "#0' Coins'",
    hidden: ["giftType", "!=", "minimumValue"]
  }]
};
for (var _i3 = 0, _arr2 = ["pure", "chroma", "blackwhite", "pixelworld", "breakpoint", "pixelart", "kawaiicats", "sakura", "unique", "military", "champion"]; _i3 < _arr2.length; _i3++) {
  var style = _arr2[_i3];
  for (var _i4 = 0, _arr3 = ["webcam", "overlay", "talking"]; _i4 < _arr3.length; _i4++) {
    var type = _arr3[_i4];
    obsoverlays.settings[type + "_" + style] = [{
      type: "head",
      text: "Appearance"
    }, {
      type: "slider",
      name: "hueFilter",
      default: 0,
      text: localization.getString("obsoverlays_widget_hue_filter2"),
      min: 0
    }, {
      type: "slider",
      name: "saturationFilter",
      default: 100,
      text: localization.getString("obsoverlays_widget_saturation_filter"),
      min: 0
    }, {
      type: "slider",
      name: "grayScaleFilter",
      default: 0,
      text: localization.getString("obsoverlays_widget_grayscale_filter"),
      min: 0
    }, {
      type: "bool",
      name: "animation",
      default: true,
      text: localization.t("obsoverlays_widget_animation")
    }, {
      type: "text",
      name: "variation",
      default: "",
      text: localization.t("obsoverlays_widget_variation")
    }];
  }
}
for (var _i5 = 0, _arr4 = ["follower", "gifter", "subscriber", "share", "chatter", "like"]; _i5 < _arr4.length; _i5++) {
  var name = _arr4[_i5];
  obsoverlays.settings["lastx" + name] = [{
    type: "color",
    name: "fontColor",
    default: "#e3e3e3",
    text: localization.getString("obsoverlays_widget_color_font"),
    hidden: ["usernameEffect", "!=", "none"]
  }, {
    type: "head",
    text: "Background"
  }, {
    type: "bool",
    name: "enableBackground",
    default: false,
    text: "Enable Background Color"
  }, {
    type: "color",
    name: "backgroundColor",
    default: "rgba(40, 40, 40, 0.8)",
    text: "Background Color"
  }, {
    type: "head",
    text: "Font Border"
  }, {
    type: "bool",
    name: "enableBorder",
    default: true,
    text: "Enable Font Border"
  }, {
    type: "color",
    name: "borderColor",
    default: "#242424",
    text: "Border Color"
  }, {
    type: "head",
    text: "Options"
  }, {
    type: "bool",
    name: "showProfilePicture",
    default: true,
    text: "Show Profile Picture"
  }, {
    type: "bool",
    name: "showUsername",
    default: true,
    text: "Show Username"
  }, {
    type: "bool",
    name: "alignCenter",
    default: false,
    text: "Align Center"
  }, {
    type: "number",
    name: "profilePictureSize",
    default: 50,
    text: "Profile Picture Size"
  }, {
    type: "head",
    text: "Username Text Effects"
  }, {
    type: "select",
    name: "usernameEffect",
    default: "none",
    text: "Username Text Effect",
    dataSource: [{
      value: "none",
      label: "None"
    }, {
      value: "rainbow",
      label: "Rainbow"
    }, {
      value: "aurora",
      label: "The Aurora"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x5b993b) {
      if (_0x5b993b.value === "rainbow") {
        return "<span style=\"background: linear-gradient(45deg, #ff0000 0%, #ff7700 14%, #ffff00 28%, #00ff00 42%, #0077ff 56%, #4b0082 70%, #8b00ff 84%, #ff0000 100%); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-flow 3s linear infinite; font-weight: bold;\">" + _0x5b993b.label + "</span>";
      } else if (_0x5b993b.value === "aurora") {
        return "<span style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: aurora-shift 4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3)); font-weight: bold;\">" + _0x5b993b.label + "</span>";
      } else {
        return "<span>" + _0x5b993b.label + "</span>";
      }
    }
  }, {
    type: "bool",
    name: "usernameWave",
    default: false,
    text: "Username Wave Animation"
  }, {
    type: "select",
    name: "usernameWaveSpeed",
    default: "normal",
    text: "Username Wave Speed",
    dataSource: [{
      value: "slow",
      label: "Slow"
    }, {
      value: "normal",
      label: "Normal"
    }, {
      value: "fast",
      label: "Fast"
    }],
    displayExpr: "label",
    valueExpr: "value",
    itemTemplate: function itemTemplate(_0x29717e) {
      return "<span>" + _0x29717e.label + "</span>";
    },
    hidden: ["usernameWave", "!=", true]
  }, {
    type: "bool",
    name: "usernameGlow",
    default: false,
    text: "Username Glow Effect"
  }, {
    type: "color",
    name: "usernameGlowColor",
    default: "#ffffff",
    text: "Username Glow Color",
    hidden: ["usernameGlow", "!=", true]
  }];
}
obsoverlays.publicSettings = {};
obsoverlays.settingsDialog = {};
obsoverlays.topGifter = [];
obsoverlays.topLiker = [];
obsoverlays.framePreviewPingInterval = null;
obsoverlays.lastViewerCount = 0;
obsoverlays.topLikerLastUpdated = 0;
obsoverlays.topLikerUpdateTimeout = null;
var fontsDataSource = [];
fontsDataSource.push({
  id: "default",
  name: "Arial"
});
window.appConfig.googleFonts.forEach(function (_0x3ece4b) {
  fontsDataSource.push({
    id: _0x3ece4b,
    name: _0x3ece4b
  });
  $("head").append($("<link rel=\"stylesheet\">").attr("href", "https://fonts.googleapis.com/css2?family=" + _0x3ece4b.replace(" ", "+") + "&display=swap"));
});
for (key in obsoverlays.settings) {
  if (key === "emojify") {
    continue;
  }
  if (key === "firework") {
    continue;
  }
  if (key === "likefountain") {
    continue;
  }
  if (key === "cannon") {
    continue;
  }
  if (key === "myactions") {
    obsoverlays.settings[key].unshift({
      type: "number",
      name: "fontLetterSpacing",
      default: 65,
      text: "Font Letter Spacing"
    });
  } else if (key === "timer") {
    obsoverlays.settings[key].unshift({
      type: "number",
      name: "fontLetterSpacing",
      default: 65,
      text: "Font Letter Spacing"
    });
  } else {
    obsoverlays.settings[key].unshift({
      type: "number",
      name: "fontLetterSpacing",
      default: 50,
      text: "Font Letter Spacing"
    });
  }
  if (key !== "socialmediarotator") {
    obsoverlays.settings[key].unshift({
      type: "number",
      name: "fontLineSpacing",
      default: key.indexOf("goal") === 0 ? 80 : 50,
      text: "Font Line Spacing"
    });
  }
  obsoverlays.settings[key].unshift({
    type: "number",
    name: "fontSize",
    default: 50,
    text: localization.getString("obsoverlays_widget_font_size")
  });
  var defaultFont = "Exo 2";
  if (key === "myactions") {
    defaultFont = "Roboto";
  }
  if (key === "timer") {
    defaultFont = "Roboto";
  }
  if (key === "streambuddies") {
    defaultFont = "Bangers";
  }
  if (key.startsWith("gcounter")) {
    defaultFont = "Luckiest Guy";
  }
  if (key.startsWith("topg") || key.startsWith("tops")) {
    defaultFont = "Luckiest Guy";
  }
  obsoverlays.settings[key].unshift({
    type: "select",
    name: "fontType",
    default: defaultFont,
    text: localization.getString("obsoverlays_widget_font_type"),
    dataSource: fontsDataSource,
    valueExpr: "id",
    displayExpr: "name",
    itemTemplate: function itemTemplate(_0x36b75c) {
      return $("<div>").text("Font Name: " + _0x36b75c.name).css("font-family", "'" + (_0x36b75c.id === "default" ? "arial" : _0x36b75c.id) + "'").css("font-size", "1.3em");
    }
  });
}
obsoverlays.refreshPublicSettings = function () {
  obsoverlays.publicSettings = {};
  var _0x3a3d21 = function _0x81e1ad(_0x27a217) {
    obsoverlays.settings[_0x27a217].forEach(function (_0x41792d) {
      if (!_0x41792d.name) {
        return;
      }
      var _0x3b1969 = _0x27a217 + "_" + _0x41792d.name;
      var _0x5316f0 = settings.get("widget_" + _0x3b1969, _0x41792d.default);
      if (_0x5316f0 === "true") {
        _0x5316f0 = true;
      }
      if (_0x5316f0 === "false") {
        _0x5316f0 = false;
      }
      obsoverlays.publicSettings[_0x3b1969] = _0x5316f0;
    });
  };
  for (var _0x3861b6 in obsoverlays.settings) {
    _0x3a3d21(_0x3861b6);
  }
  socketiowrapper.emitWidgetSettingsToWidgets(obsoverlays.publicSettings);
};
obsoverlays.init = function () {
  obsoverlays.refreshPublicSettings();
  if (window.session.isElectron) {
    setInterval(obsoverlays.fetchTopGifter, 15000);
  }
  if (!obsoverlays.framePreviewPingInterval) {
    obsoverlays.framePreviewPingInterval = setInterval(function () {
      try {
        if (broadcastlistener.isLive) {
          return;
        }
        if (document.visibilityState !== "visible") {
          return;
        }
        var _0x437472 = $("iframe");
        var _0x3ea2af = _0x437472.filter(":visible");
        var _0x3b6e45 = _0x3ea2af.filter(function () {
          var _0x167035 = this.getBoundingClientRect();
          return _0x167035.top >= -500 && _0x167035.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 500;
        });
        _0x3b6e45.each(function (_0x490e5d, _0x51b653) {
          try {
            _0x51b653.contentWindow.postMessage({
              type: "framePreviewPing"
            }, "*");
          } catch (_0x493548) {
            console.error(_0x493548);
          }
        });
      } catch (_0x1c2183) {}
    }, 500);
  }
  if (navigation.currentPage !== "obsoverlays") {
    return;
  }
  obsoverlays.iframes = [];
  obsoverlays.generateWidget($("#widgetCoinjarPro"), function () {
    return obsoverlays.testCoinJar();
  }, "650px");
  obsoverlays.generateWidget($("#widgetChristmasevent"), null, "500px");
  obsoverlays.generateWidget($("#widgetCoinmatch"), null, "550px");
  obsoverlays.generateWidget($("#widgetWheelofActions"), function () {
    return obsoverlays.testWheelOfActions();
  }, "450px");
  obsoverlays.generateWidget($("#widgetSocialMediaRotator"), null, "450px");
  obsoverlays.generateWidget($("#widgetFallingSnow"), null, "450px");
  obsoverlays.generateWidget($("#widgetCannon"), function () {
    return obsoverlays.testCannon();
  }, "300px");
  obsoverlays.generateWidget($("#widgetLikefountain"), function () {
    return obsoverlays.testLikeFountain();
  }, "300px");
  obsoverlays.generateWidget($("#widgetFirework"), function () {
    return obsoverlays.testFirework(false);
  }, "400px");
  obsoverlays.generateWidget($("#widgetEmojify"), obsoverlays.testEmojify, "300px");
  obsoverlays.generateWidget($("#widgetStreambuddies"), function () {
    return obsoverlays.testTopGifter(true);
  }, "300px");
  obsoverlays.generateWidget($("#widgetCoinjar"), obsoverlays.testGifts, "400px");
  obsoverlays.generateWidget($("#widgetTinydiny"), null, "200px");
  obsoverlays.generateWidget($("#widgetChat"), obsoverlays.testChat, "300px");
  obsoverlays.generateWidget($("#widgetGifts"), obsoverlays.testGifts, "300px");
  obsoverlays.generateWidget($("#widgetTransactionviewer"), transaction.testTransactionViewerWidget, "300px");
  obsoverlays.generateWidget($("#widgetUserInfo"), function () {
    socketiowrapper.emitSocketEvent("showUserScore", {
      userId: -1,
      username: "Testuser123",
      totalAmount: 123456,
      level: utils.getLevelByPoints(123456),
      rank: 1
    });
  }, "150px");
  obsoverlays.generateWidget($("#widgetCommandInfo"), function () {
    chatcommands.sendInfoScreenCommands();
    setTimeout(function () {
      chatcommands.sendInfoScreenCustomCommands(0, "", 1);
    }, 50);
    setTimeout(function () {
      utils.pushInfoScreenCommandResult("Testuser1234", "This is a Test!!! A long text can be displayed here. You should set the size correctly so that the line break work.");
    }, 100);
  }, "150px");
  obsoverlays.generateWidget($("#widgetWheel"), wheel.testSpinWidget, "600px");
  obsoverlays.generateWidget($("#widgetRanking"), null, "600px");
  obsoverlays.generateWidget($("#widgetTopgifter"), obsoverlays.testTopGifter, "600px");
  obsoverlays.generateWidget($("#widgetTopliker"), obsoverlays.testTopLiker, "600px");
  obsoverlays.generateWidget($("#widgetCoinDrop"), function () {
    coindrop.run(true);
  }, "200px");
  obsoverlays.generateWidget($("#widgetMyActions"), null, "400px", true);
  obsoverlays.generateWidget($("#widgetTimer"), null, "200px");
  obsoverlays.generateWidget($("#widgetSongrequests"), songrequests.testOverlay, "290px");
  obsoverlays.generateWidget($("#widgetViewercount"), obsoverlays.testViewerCount, "80px");
  obsoverlays.generateWidget($("#widgetCarousel"), null, "250px");
  coinMatch.setupControls();
  christmasevent.setupControls();
  coinJar.setupControls();
  fallingSnow.setupTitle();
};
obsoverlays.stretchIframes = _asyncToGenerator(_regeneratorRuntime().mark(function _callee48() {
  var _0x533046;
  var _0x175227;
  var _0x3255f4;
  var _0x547892;
  var _0x47b160;
  var _0x4ec0f0;
  var _0x538eca;
  return _regeneratorRuntime().wrap(function _0x4def9e(_0x438e79) {
    while (1) {
      switch (_0x438e79.prev = _0x438e79.next) {
        case 0:
          _0x533046 = document.getElementsByClassName("obsOverlayOnPage");
          _0x175227 = _createForOfIteratorHelper(_0x533046);
          _0x438e79.prev = 2;
          _0x175227.s();
        case 4:
          if ((_0x3255f4 = _0x175227.n()).done) {
            _0x438e79.next = 17;
            break;
          }
          _0x547892 = _0x3255f4.value;
          _0x47b160 = _0x547892.clientHeight;
          if (_0x47b160) {
            _0x438e79.next = 9;
            break;
          }
          return _0x438e79.abrupt("break", 17);
        case 9:
          _0x4ec0f0 = _0x547892.querySelector("iframe");
          if (_0x4ec0f0) {
            _0x438e79.next = 12;
            break;
          }
          return _0x438e79.abrupt("break", 17);
        case 12:
          _0x538eca = parseInt(_0x4ec0f0.style.height.replace("px", ""));
          while (_0x547892.clientHeight === _0x47b160 && _0x538eca < 700) {
            _0x538eca += 5;
            _0x4ec0f0.style.height = _0x538eca + "px";
          }
          obsoverlays.stretchDone = true;
        case 15:
          _0x438e79.next = 4;
          break;
        case 17:
          _0x438e79.next = 22;
          break;
        case 19:
          _0x438e79.prev = 19;
          _0x438e79.t0 = _0x438e79.catch(2);
          _0x175227.e(_0x438e79.t0);
        case 22:
          _0x438e79.prev = 22;
          _0x175227.f();
          return _0x438e79.finish(22);
        case 25:
        case "end":
          return _0x438e79.stop();
      }
    }
  }, _callee48, null, [[2, 19, 22, 25]]);
}));
obsoverlays.scrollToWidget = function (_0x19f811) {
  setTimeout(function () {
    var _0x28d8b2 = $("#widget" + _0x19f811);
    $("html, body").animate({
      scrollTop: _0x28d8b2.offset().top - 800
    }, 1000, function () {
      $("html, body").animate({
        scrollTop: _0x28d8b2.offset().top - 300
      }, 500, function () {
        _0x28d8b2.find("iframe").removeClass("blinkMark");
        setTimeout(function () {
          _0x28d8b2.find("iframe").addClass("blinkMark");
        }, 100);
      });
    });
  }, 500);
};
obsoverlays.onInputChange = function () {
  obsoverlays.refreshPublicSettings();
  fallingSnow.updateTitle();
};
obsoverlays.onChannelContextChanged = function () {
  obsoverlays.init();
};
obsoverlays.onVisible = function () {
  obsoverlays.init();
  if (settings.get("channelId") == 0) {
    setTimeout(function () {
      $(".widgetTestButton").find(".dx-button-content").css("background-color", "#963636");
    }, 500);
    setTimeout(function () {
      $(".widgetTestButton").find(".dx-button-content").css("background-color", "");
    }, 1000);
    setTimeout(function () {}, 2000);
  }
  obsoverlays.stretchIframes();
};
obsoverlays.onHide = function () {
  console.log("hide");
  obsoverlays.iframes.forEach(function (_0x379c52) {
    _0x379c52.attr("src", "about:blank");
  });
};
var graphicExcludedFields = ["fontType", "fontSize", "fontLineSpacing", "fontLetterSpacing", "animation", "variation"];
var graphicIdsFilter = function graphicIdsFilter(_0x21bcf6) {
  return _0x21bcf6.startsWith("webcam_") || _0x21bcf6.startsWith("overlay_") || _0x21bcf6.startsWith("talking_");
};
var excludedFields = ["fontType", "fontSize", "fontLineSpacing", "fontLetterSpacing"];
var fallingsnowSettingsFilter = function fallingsnowSettingsFilter(_0x5bdb55) {
  return _0x5bdb55.startsWith("fallingsnow");
};
obsoverlays.openSettings = function (_0x10028e, _0x4e7b0b, _0x26d6ae) {
  var _0x32298b = $("#widgetSettingsModal");
  if (!_0x32298b.length) {
    _0x32298b = $("<div>").attr("id", "widgetSettingsModal");
    $("#pages").append(_0x32298b);
  }
  var _0x474902 = utils.getResponsiveDialogHeight(185 + _0x4e7b0b.filter(function (_0x1a79dc) {
    return _0x1a79dc.type !== "head";
  }).length * 48 + _0x4e7b0b.filter(function (_0x16db09) {
    return _0x16db09.type === "head";
  }).length * 60);
  var _0x17be2e = 550;
  if (_0x10028e === "socialmediarotator") {
    _0x474902 = "auto";
    _0x17be2e = 650;
  } else if (_0x10028e === "wheelofactions") {
    _0x474902 = "auto";
    _0x17be2e = 780;
  } else if (_0x10028e === "coinmatch") {
    _0x17be2e = 650;
  }
  _0x32298b.dxPopup({
    width: _0x17be2e,
    height: _0x474902,
    maxHeight: 800,
    visible: true,
    title: localization.getString("obsoverlays_widget_settings_title"),
    closeOnOutsideClick: true,
    showCloseButton: true,
    shading: false,
    contentTemplate: function _0x48715a(_0x1bf38b) {
      var _0x2d6d6b = $("<div>");
      var _0x1e65e9 = $("<div>").addClass("dxForm").append($("<div>").addClass("form")).append($("<div>").addClass("dx-fieldset"));
      _0x1e65e9.css("width", "100%");
      _0x1e65e9.css("text-align", "center");
      var _0x37354a = {};
      function _0x501e2a(_0x354ea9, _0x1da23e, _0x4cd7f2) {
        var _0x5d8b34 = _0x37354a[_0x354ea9];
        if (!_0x5d8b34) {
          return true;
        }
        var _0x59fc2e = _0x5d8b34.option("value");
        switch (_0x1da23e) {
          case "==":
          case "=":
            return _0x59fc2e == _0x4cd7f2;
          case "!=":
          case "<>":
            return _0x59fc2e != _0x4cd7f2;
          case ">":
            return _0x59fc2e > _0x4cd7f2;
          case ">=":
            return _0x59fc2e >= _0x4cd7f2;
          case "<":
            return _0x59fc2e < _0x4cd7f2;
          case "<=":
            return _0x59fc2e <= _0x4cd7f2;
          case "in":
            if (Array.isArray(_0x4cd7f2)) {
              return _0x4cd7f2.includes(_0x59fc2e);
            } else {
              return _0x59fc2e == _0x4cd7f2;
            }
          case "not in":
            if (Array.isArray(_0x4cd7f2)) {
              return !_0x4cd7f2.includes(_0x59fc2e);
            } else {
              return _0x59fc2e != _0x4cd7f2;
            }
          default:
            return true;
        }
      }
      function _0x3e73b0() {
        _0x4e7b0b.forEach(function (_0x5eccfd) {
          if (_0x5eccfd.hidden) {
            var _0x28a668 = _0x501e2a(_0x5eccfd.hidden[0], _0x5eccfd.hidden[1], _0x5eccfd.hidden[2]);
            var _0x2573ed = _0x37354a[_0x5eccfd.name];
            var _0xd2745b = _0x2573ed !== null && _0x2573ed !== undefined && _0x2573ed.element ? $(_0x2573ed.element()).closest(".dx-field") : $("#widget_" + _0x10028e + "_" + _0x5eccfd.name).closest(".dx-field");
            if (!_0xd2745b.length) {
              return;
            }
            if (!_0x28a668) {
              _0xd2745b.show();
            } else {
              _0xd2745b.hide();
            }
          }
        });
      }
      _0x4e7b0b.forEach(function (_0x4b19dd) {
        if (_0x4b19dd.type === "head") {
          _0x1e65e9.find(".dx-fieldset").first().append("<h4 class='blueheading' style='margin-top: 35px;'>" + _0x4b19dd.text + "</h4>");
          return;
        }
        if (graphicIdsFilter(_0x10028e)) {
          if (graphicExcludedFields.includes(_0x4b19dd.name)) {
            return;
          }
        }
        if (fallingsnowSettingsFilter(_0x10028e)) {
          if (excludedFields.includes(_0x4b19dd.name)) {
            return;
          }
        }
        var _0x46d04b = $("<div>").addClass("dx-field");
        var _0x42ed3 = $("<div>").addClass("dx-field-label");
        var _0x3a8200 = $("<div>").addClass("dx-field-value");
        _0x42ed3.text(_0x4b19dd.text);
        _0x46d04b.append(_0x42ed3);
        _0x46d04b.append(_0x3a8200);
        var _0x126107;
        var _0x4ea18b = $("<div>");
        _0x4ea18b.attr("id", "widget_" + _0x10028e + "_" + _0x4b19dd.name);
        var _0x8f5a09 = function _0x42b512(_0x357bb8, _0x128c2e, _0x400eae) {
          _0x3e73b0();
          return true;
        };
        if (_0x4b19dd.type === "color") {
          var _0x25f9f1 = _0x4b19dd.name.indexOf("background") === 0 || _0x4b19dd.name === "boxShadowColor";
          _0x126107 = utils.initDxInput(obsoverlays, "dxColorBox", _0x4ea18b, _0x4b19dd.default, {
            width: "250px",
            editAlphaChannel: _0x25f9f1,
            onValueChanged: _0x8f5a09
          });
        }
        if (_0x4b19dd.type === "bool") {
          _0x126107 = utils.initDxInput(obsoverlays, "dxCheckBox", _0x4ea18b, _0x4b19dd.default, {
            onValueChanged: _0x8f5a09
          });
          _0x4ea18b.css("float", "left");
        }
        if (_0x4b19dd.type === "slider") {
          _0x126107 = utils.initDxInput(obsoverlays, "dxSlider", _0x4ea18b, _0x4b19dd.default, {
            min: _0x4b19dd.hasOwnProperty("min") ? _0x4b19dd.min : 1,
            max: _0x4b19dd.hasOwnProperty("max") ? _0x4b19dd.min : 100,
            step: 1,
            onValueChanged: _0x8f5a09
          });
          _0x4ea18b.css("width", "250px");
        }
        if (_0x4b19dd.type === "number") {
          _0x126107 = utils.initDxInput(obsoverlays, "dxNumberBox", _0x4ea18b, _0x4b19dd.default, {
            min: _0x4b19dd.min ?? 5,
            max: _0x4b19dd.max ?? 100,
            step: _0x4b19dd.step ?? 5,
            format: _0x4b19dd.format,
            showSpinButtons: true,
            onValueChanged: _0x8f5a09
          });
          _0x4ea18b.css("width", "250px");
        }
        if (_0x4b19dd.type === "text") {
          _0x126107 = utils.initDxInput(obsoverlays, "dxTextBox", _0x4ea18b, _0x4b19dd.default, {
            placeholder: _0x4b19dd.placeholder || "",
            valueChangeEvent: "keyup",
            showClearButton: true,
            onValueChanged: _0x8f5a09
          });
          _0x4ea18b.css("width", "250px");
        }
        if (_0x4b19dd.type === "numberFree") {
          _0x126107 = utils.initDxInput(obsoverlays, "dxNumberBox", _0x4ea18b, _0x4b19dd.default, {
            min: 1,
            max: 10000,
            step: 1,
            showSpinButtons: true,
            onValueChanged: _0x8f5a09
          });
          _0x4ea18b.css("width", "250px");
        }
        if (_0x4b19dd.type === "select") {
          _0x126107 = utils.initDxInput(obsoverlays, "dxSelectBox", _0x4ea18b, _0x4b19dd.default, {
            dataSource: _0x4b19dd.dataSource,
            items: _0x4b19dd.items,
            valueExpr: _0x4b19dd.valueExpr,
            displayExpr: _0x4b19dd.displayExpr,
            itemTemplate: _0x4b19dd.itemTemplate,
            onValueChanged: _0x8f5a09
          });
          _0x4ea18b.css("width", "250px");
        }
        _0x37354a[_0x4b19dd.name] = _0x126107;
        _0x3a8200.append(_0x4ea18b);
        _0x1e65e9.find(".dx-fieldset").first().append(_0x46d04b);
      });
      setTimeout(function () {
        _0x3e73b0();
      }, 100);
      _0x2d6d6b.append(_0x1e65e9);
      if (_0x10028e === "socialmediarotator") {
        setupSocialMediaTable(_0x2d6d6b);
      } else if (_0x10028e === "wheelofactions") {
        wheelOfActions.setupTable(_0x2d6d6b);
      } else if (_0x10028e === "coinjar") {
        coinJar.setupGiftSelector(_0x2d6d6b);
      }
      var _0x538a4d = $("<div>").dxButton({
        text: localization.getString("obsoverlays_widget_button_test"),
        width: "100px",
        disabled: typeof _0x26d6ae !== "function",
        onClick: function _0x304152() {
          _0x26d6ae();
        }
      });
      _0x538a4d.css("bottom", "30px");
      _0x538a4d.css("left", "155px");
      _0x538a4d.css("margin-right", "28px");
      _0x538a4d.css("margin-bottom", "10px");
      _0x1e65e9.append(_0x538a4d);
      var _0x2caa20 = $("<div>").dxButton({
        text: localization.getString("obsoverlays_widget_settings_button_close"),
        width: "100px",
        onClick: function _0x401ade() {
          $("#widgetSettingsModal").dxPopup("instance").hide();
        }
      });
      _0x2caa20.css("bottom", "30px");
      _0x2caa20.css("left", "295px");
      _0x2caa20.css("margin-left", "25px");
      _0x2caa20.css("margin-bottom", "10px");
      _0x1e65e9.append(_0x2caa20);
      var _0x12c9c0 = $("<div>");
      _0x12c9c0.append(_0x2d6d6b);
      _0x12c9c0.dxScrollView({
        width: "100%",
        height: "100%",
        direction: "vertical",
        showScrollbar: "always"
      });
      _0x1bf38b.append(_0x12c9c0);
      return _0x1bf38b;
    }
  });
};
function stripProFromLabel(_0x4498ca) {
  if (!_0x4498ca || typeof _0x4498ca !== "string") {
    return _0x4498ca;
  }
  return _0x4498ca.replace(/\bPRO\b/gi, "").replace(/\s+/g, " ").trim();
}
var widgetDisplayNameLocKeyMap = {
  topg: "obsoverlays_topgifter",
  tops: "giftoverlays_topstreaker_title",
  goalcoins: "obsoverlays_goalcoins",
  goalpoints: "obsoverlays_goalpoints",
  goalsubs: "obsoverlays_goalsubs",
  goallikes: "obsoverlays_goallikes",
  goalshares: "obsoverlays_goalshares",
  goalfollows: "obsoverlays_goalfollows",
  goalviewer: "obsoverlays_goalviewer"
};
function getWidgetDisplayName(_0x1cac20, _0x4f742d) {
  if (_0x4f742d && _0x4f742d.length) {
    var _0x205fe8 = _0x4f742d.closest(".greyBackgroundSection, .goalSection");
    if (_0x205fe8.length) {
      var _0x2e5bfa = _0x205fe8.find(".gfxTitle").first();
      if (_0x2e5bfa.length) {
        var _0x2c6b1d = stripProFromLabel(_0x2e5bfa.text().trim());
        if (_0x2c6b1d) {
          return _0x2c6b1d;
        }
      }
      var _0x5885bb = _0x205fe8.find("h3").first();
      if (_0x5885bb.length) {
        var _0x59411c = _0x5885bb.attr("data-str");
        if (_0x59411c) {
          var _0x5265db = localization.getString(_0x59411c);
          if (_0x5265db !== _0x59411c) {
            return stripProFromLabel(_0x5265db);
          }
        }
        var _0x2c5c1d = stripProFromLabel(_0x5885bb.text().trim());
        if (_0x2c5c1d) {
          return _0x2c5c1d;
        }
      }
    }
  }
  var _0x17833f = widgetDisplayNameLocKeyMap[_0x1cac20] || "obsoverlays_" + _0x1cac20;
  var _0x249fc0 = localization.getString(_0x17833f);
  return stripProFromLabel(_0x249fc0);
}
var showUpgradeDialog = function showUpgradeDialog(_0x35127a, _0x166aee) {
  var _0x286418;
  var _0x383f29;
  var _0x36ea6a = ((_0x286418 = window.posthog) === null || _0x286418 === undefined ? undefined : (_0x383f29 = _0x286418.isFeatureEnabled) === null || _0x383f29 === undefined ? undefined : _0x383f29.call(_0x286418, "trial_offer_d7_d14_v1")) || false;
  var _0x4e8020 = getWidgetDisplayName(_0x35127a, _0x166aee);
  if (_0x36ea6a) {
    trial.openProFeatureModalOrFreeModal(_0x4e8020);
  } else {
    DevExpress.ui.dialog.alert(localization.getString("pro_only_overlay"), "TikFinity Pro").then(function () {
      setup.scrollToPaymentUi("PREMIUM_OVERLAY_" + _0x35127a.toUpperCase(), true);
    });
  }
};
obsoverlays.showUpgradeDialog = showUpgradeDialog;
var restrictedWidgetsMap = {};
var widgetsURls = {};
obsoverlays.updateWidgetRestricted = function (_0x6c9074, _0x2efc45) {
  var _0xcc93cc;
  var _0x49d47d;
  var _0xffef07;
  var _0x4ff3a4 = _0x2efc45 && ((_0xcc93cc = window.session) === null || _0xcc93cc === undefined || (_0x49d47d = _0xcc93cc.me) === null || _0x49d47d === undefined || (_0xffef07 = _0x49d47d.userFeatures) === null || _0xffef07 === undefined || !_0xffef07.isPro);
  restrictedWidgetsMap[_0x6c9074] = _0x4ff3a4;
  if (_0x4ff3a4) {
    if (widgetsURls[_0x6c9074]) {
      var _0xcab23b = widgetsURls[_0x6c9074].element;
      var _0x4240c3 = widgetsURls[_0x6c9074].url;
      var _0x1be595 = "TikFinity Pro exclusive";
      if (!window.session.channelId && restrictedWidgetsMap[_0x6c9074]) {
        _0x1be595 = localization.getString("obsoverlays_widget_signin_required");
      }
      _0xcab23b.dxTextBox("instance").option("value", _0x1be595);
    }
  } else if (widgetsURls[_0x6c9074]) {
    var _0x56ed68 = widgetsURls[_0x6c9074].element;
    var _0x22cc30 = widgetsURls[_0x6c9074].url;
    _0x56ed68.dxTextBox("instance").option("value", _0x22cc30);
  }
};
obsoverlays.generateWidget = function (_0x403ce8, _0x1441e6, _0x462239, _0x21651b, _0x23799b, _0x2cd920, _0x54504e) {
  var _0x4bfbf1;
  var _0x783b3a;
  _0x403ce8.empty();
  var _0x1bd3aa = _0x403ce8.data("widgetid");
  var _0x3658c1 = _0x403ce8.data("goalmetric");
  var _0x5794b3 = _0x403ce8.data("giftcounterid");
  var _0x43b027 = _0x403ce8.data("lastx");
  var _0x2d6197 = _0x403ce8.data("graphictype");
  var _0x470fae = _0x403ce8.data("customurl");
  var _0x272e33 = obsoverlays.getWidgetPath(_0x1bd3aa, _0x470fae);
  var _0xae4d8c = _0x1bd3aa + (_0x2d6197 ? "_" + _0x2d6197 : "") + (_0x3658c1 ? _0x3658c1 : "") + (_0x5794b3 ? _0x5794b3 : "") + (_0x43b027 ? _0x43b027 : "");
  var _0xb06db9 = obsoverlays.settings[_0xae4d8c];
  var _0x24ed91 = ["likefountain", "cannon", "topg", "tops", "wheelofactions", "coinmatch", "coinjar"].includes(_0xae4d8c) && ((_0x4bfbf1 = window.session) === null || _0x4bfbf1 === undefined ? undefined : (_0x783b3a = _0x4bfbf1.me) === null || _0x783b3a === undefined ? undefined : _0x783b3a.userFeatures?.isPro) !== true;
  var _0x3320fc = ["goal"];
  var _0x34d737 = _0x3320fc.includes(_0x1bd3aa);
  restrictedWidgetsMap[_0xae4d8c] = _0x24ed91;
  if (_0x470fae) {
    _0x272e33 = _0x470fae + "&cid=" + (window.session.channelId ? window.session.channelId : 0);
  }
  var _0x35bf7d = $("<div>");
  if (_0x34d737) {
    _0x35bf7d.css("margin-bottom", "6px");
  } else {
    _0x35bf7d.css("display", "table-row");
  }
  var _0x3bca5f = null;
  var _0x545769 = 1;
  if (_0x21651b) {
    var _0x39a777 = $("<div>");
    _0x39a777.css("display", "table-cell");
    _0x39a777.css("padding-right", "5px");
    _0x35bf7d.append(_0x39a777);
    var _0x2405cd = utils.getScreenList();
    _0x3bca5f = $("<div>").dxSelectBox({
      items: _0x2405cd,
      value: _0x2405cd[0].screenId,
      valueExpr: "screenId",
      displayExpr: "screenName",
      width: "110px",
      elementAttr: {
        class: "obsoverlays-screen-chooser"
      },
      onValueChanged: function _0x5a58a9(_0x251951) {
        _0x545769 = _0x251951.value;
        _0x5802e4();
      }
    });
    _0x39a777.append(_0x3bca5f);
  }
  var _0x3cdc88 = $("<div>");
  _0x3cdc88.css("display", "table-cell");
  _0x35bf7d.append(_0x3cdc88);
  var _0x212246 = null;
  var _0x29e0b0 = null;
  var _0x5802e4 = function _0x3111e0() {
    if (_0x212246) {
      _0x212246.remove();
    }
    var _0x64ac41 = _0x272e33;
    if (_0x21651b) {
      _0x64ac41 += "&screen=" + _0x545769;
    }
    if (_0x3658c1) {
      _0x64ac41 += "&metric=" + _0x3658c1;
    }
    if (_0x5794b3) {
      _0x64ac41 += "&c=" + _0x5794b3;
    }
    if (_0x43b027) {
      _0x64ac41 += "&x=" + _0x43b027;
    }
    if (_0x2d6197) {
      _0x64ac41 += "&type=" + _0x2d6197;
    }
    var _0x4b7f30 = _0x21651b ? "491px" : "501px";
    if (_0x23799b) {
      _0x4b7f30 = "356px";
    }
    var _0x4a82f4 = restrictedWidgetsMap[_0xae4d8c] ? "TikFinity Pro exclusive" : _0x64ac41;
    if (!window.session.channelId && restrictedWidgetsMap[_0xae4d8c]) {
      _0x4a82f4 = localization.getString("obsoverlays_widget_signin_required");
    }
    _0x212246 = $("<div>").dxTextBox({
      value: _0x4a82f4,
      readOnly: true,
      width: _0x4b7f30,
      elementAttr: {
        class: _0x34d737 ? "compactPathBox" : ""
      }
    });
    _0x212246.click(function () {
      var _0x1dedd6;
      var _0x142d62;
      var _0x45557d;
      if (settings.get("channelId") === "0") {
        navigation.pageChange("setup");
        return;
      }
      if (restrictedWidgetsMap[_0xae4d8c] && ((_0x1dedd6 = window.session) === null || _0x1dedd6 === undefined || (_0x142d62 = _0x1dedd6.me) === null || _0x142d62 === undefined || (_0x45557d = _0x142d62.userFeatures) === null || _0x45557d === undefined || !_0x45557d.isPro)) {
        showUpgradeDialog(_0xae4d8c, _0x403ce8);
        return;
      }
      _0x212246.find("input").select();
    });
    _0x29e0b0 = _0x64ac41 + "&preview=1";
    widgetsURls[_0xae4d8c] = {
      url: _0x64ac41,
      element: _0x212246
    };
    _0x3cdc88.append(_0x212246);
  };
  _0x5802e4();
  var _0x490e1d = $("<div>");
  _0x490e1d.css("display", "table-cell");
  _0x490e1d.css("padding-left", "5px");
  _0x35bf7d.append(_0x490e1d);
  _0x490e1d.append($("<div>").dxButton({
    icon: _0x34d737 ? "fa-regular fa-link" : "",
    text: _0x23799b ? "Copy" : localization.getString("obsoverlays_widget_button_copy"),
    width: _0x23799b ? "75px" : "105px",
    onClick: function _0x3e91bb(_0x1046f5) {
      var _0x158933;
      var _0x108197;
      var _0x59aa69;
      if (settings.get("channelId") === "0") {
        navigation.pageChange("setup");
        return;
      }
      if (restrictedWidgetsMap[_0xae4d8c] && ((_0x158933 = window.session) === null || _0x158933 === undefined || (_0x108197 = _0x158933.me) === null || _0x108197 === undefined || (_0x59aa69 = _0x108197.userFeatures) === null || _0x59aa69 === undefined || !_0x59aa69.isPro)) {
        showUpgradeDialog(_0xae4d8c, _0x403ce8);
        return;
      }
      utils.copyTextToClipboard(_0x212246.dxTextBox("instance").option("value"), localization.getString("obsoverlays_widget_copy_success_message"), localization.getString("obsoverlays_widget_copy_success_title"));
    },
    elementAttr: {
      class: _0x34d737 ? "compactCopyButton" : ""
    }
  }).css("margin-bottom", "2px"));
  if (!_0x21651b && !_0x23799b) {
    var _0x2fac82 = $("<div>");
    _0x2fac82.css("display", "table-cell");
    _0x2fac82.css("padding-left", "4px");
    _0x2fac82.addClass("widgetTestButton");
    _0x35bf7d.append(_0x2fac82);
    _0x2fac82.append($("<div>").dxButton({
      icon: "fa-solid fa-chevron-right",
      text: localization.getString("obsoverlays_widget_button_test"),
      width: "100px",
      onClick: _0x1441e6,
      disabled: typeof _0x1441e6 !== "function",
      elementAttr: {
        class: _0x34d737 ? "compactTestButton" : ""
      }
    }).css("margin-bottom", "2px"));
  }
  var _0x1471a4 = $("<div>");
  _0x1471a4.css("display", "table-cell");
  _0x1471a4.css("padding-left", "4px");
  _0x1471a4.css("position", "relative");
  if (_0x23799b) {
    _0x1471a4.css("position", "absolute");
    _0x1471a4.css("margin-left", "-49px");
    _0x1471a4.css("margin-top", "50px");
  }
  _0x35bf7d.append(_0x1471a4);
  function _0x499d56() {
    obsoverlays.openSettings(_0xae4d8c, _0xb06db9, _0x1441e6);
  }
  _0x1471a4.append($("<div>").dxButton({
    icon: "fa-regular fa-gear",
    text: _0x23799b ? "" : localization.getString("obsoverlays_widget_button_settings"),
    width: _0x23799b ? "37px" : "150px",
    onClick: _0x499d56,
    disabled: !_0xb06db9,
    hint: "Customize",
    elementAttr: {
      class: _0x34d737 ? "compactCustomizeButton" : ""
    }
  }).css("margin-bottom", "2px").css("z-index", "999").css("position", "relative"));
  if (_0x2cd920) {
    var _0x26ae73 = $("<div>");
    _0x26ae73.css("display", "table-cell");
    _0x26ae73.css("padding-left", "4px");
    _0x26ae73.css("position", "absolute");
    _0x26ae73.css("margin-left", "-49px");
    _0x26ae73.css("margin-top", "90px");
    _0x26ae73.append($("<div>").dxButton({
      icon: "revert",
      width: "37px",
      hint: "Reset",
      onClick: function _0x14b73f() {
        if (typeof _0x54504e === "function") {
          _0x54504e();
        }
      },
      elementAttr: {
        class: _0x34d737 ? "compactResetButton" : ""
      }
    }));
    _0x35bf7d.append(_0x26ae73);
  }
  if (_0xb06db9 && (_0x1bd3aa === null || _0x1bd3aa === undefined || !_0x1bd3aa.startsWith("gcounter")) && (_0x1bd3aa === null || _0x1bd3aa === undefined || !_0x1bd3aa.startsWith("topg")) && (_0x1bd3aa === null || _0x1bd3aa === undefined || !_0x1bd3aa.startsWith("tops"))) {
    _0x1471a4.append($("<div>").html("Change Font, Colors, Background, etc.<br><span style=\"font-size: 1.2em;\"><i class=\"fas fa-arrow-down\"></i></span>").addClass("overlayCustomizeHint").addClass("overlayCustomizeHint_" + _0x1bd3aa).css("display", "none"));
  }
  _0x403ce8.append(_0x35bf7d);
  function _0x35558b(_0x1b1c2d) {
    while (_0x1b1c2d && _0x1b1c2d !== document.body) {
      var _0x18f0d0 = getComputedStyle(_0x1b1c2d);
      if (/(auto|scroll|overlay)/.test(_0x18f0d0.overflowY) || /(auto|scroll|overlay)/.test(_0x18f0d0.overflow)) {
        return _0x1b1c2d;
      }
      _0x1b1c2d = _0x1b1c2d.parentElement;
    }
    return null;
  }
  var _0x5b9dfe = $("<iframe>");
  _0x5b9dfe.attr("data-src", _0x29e0b0);
  _0x5b9dfe.attr("allow", "autoplay");
  _0x5b9dfe.addClass("lazy-frame");
  var _0x9fac38 = "438px";
  if (!_0x23799b) {
    _0x9fac38 = "867px";
  }
  if (_0x34d737) {
    _0x9fac38 = "692px";
  }
  _0x5b9dfe.css("width", _0x9fac38);
  _0x5b9dfe.css("height", _0x462239);
  _0x5b9dfe.css("margin-top", "4px");
  _0x5b9dfe.css("border", "1px solid");
  _0x5b9dfe.css("border-color", "#4e4e4e");
  var _0x1c966c = false;
  _0x5b9dfe[0].addEventListener("load", function (_0x3dc650) {
    var _0x5ea361 = _0x5b9dfe.attr("src");
    var _0xdda24b = !_0x5ea361 || _0x5ea361 === "about:blank";
    if (_0xdda24b) {
      return;
    }
    if (!_0x1c966c) {
      _0x1c966c = true;
      try {
        setTimeout(function () {
          socketiowrapper.emitWidgetSettingsToWidgets();
        }, 1000);
      } catch (_0x8a133) {
        console.error(_0x8a133);
      }
      try {
        var _0x414f7f;
        var _0x4bcb63 = _0x5b9dfe[0].contentWindow?.document;
        if (_0x4bcb63 !== null && _0x4bcb63 !== undefined && (_0x414f7f = _0x4bcb63.body) !== null && _0x414f7f !== undefined && _0x414f7f.addEventListener) {
          var _0x3ddb2b = null;
          var _0x744011 = function _0x4aa750() {
            clearTimeout(_0x3ddb2b);
            _0x3ddb2b = setTimeout(function () {
              if (restrictedWidgetsMap[_0xae4d8c] && window.session.channelId) {
                showUpgradeDialog(_0xae4d8c, _0x403ce8);
                return;
              }
              DevExpress.ui.dialog.alert(localization.getString("implement_overlay_hint"), "Overlay");
            }, 10);
          };
          _0x4bcb63.body.addEventListener("click", _0x744011);
          _0x4bcb63.addEventListener("click", _0x744011);
          try {
            var _0x3424d2 = _0x4bcb63.querySelector("iframe");
            if (_0x3424d2) {
              _0x3424d2.contentWindow.document.addEventListener("click", _0x744011);
            }
          } catch (_0x544952) {}
        }
      } catch (_0xabad88) {}
    }
  }, {
    passive: true
  });
  if (!_0x470fae) {
    obsoverlays.iframes.push(_0x5b9dfe);
    _0x403ce8.append(_0x5b9dfe);
  }
  var _0x431069 = _0x35558b(_0x403ce8[0]) || null;
  if ("IntersectionObserver" in window) {
    var _0xc50846 = function _0x1bae9e(_0x3f60b7, _0x4a5c67) {
      var _0x3e78b1 = _createForOfIteratorHelper(_0x3f60b7);
      var _0x320a76;
      try {
        for (_0x3e78b1.s(); !(_0x320a76 = _0x3e78b1.n()).done;) {
          var _0x350164 = _0x320a76.value;
          var _0x41e345 = _0x350164.target;
          var _0x248b40 = _0x41e345.getAttribute("data-src");
          if (_0x350164.isIntersecting) {
            _0x41e345.classList.add("inview");
            if (_0x248b40 && _0x41e345.src !== _0x248b40) {
              _0x41e345.src = _0x248b40;
            }
          } else {
            _0x41e345.classList.remove("inview");
            var _0x461b77 = _0x41e345.getAttribute("src");
            if (_0x461b77 && _0x461b77 !== "about:blank") {
              _0x41e345.src = "about:blank";
            }
          }
        }
      } catch (_0x16e7d9) {
        _0x3e78b1.e(_0x16e7d9);
      } finally {
        _0x3e78b1.f();
      }
    };
    if (!obsoverlays._iframeIOMap) {
      obsoverlays._iframeIOMap = new WeakMap();
    }
    var _0xb672e0 = function _0x455663(_0x5cbb21) {
      if (_0x5cbb21 === null) {
        if (!obsoverlays._iframeIOViewport) {
          obsoverlays._iframeIOViewport = new IntersectionObserver(_0xc50846, {
            root: null,
            rootMargin: "0px 0px",
            threshold: 0
          });
        }
        return obsoverlays._iframeIOViewport;
      }
      var _0x503b10 = obsoverlays._iframeIOMap.get(_0x5cbb21);
      if (!_0x503b10) {
        _0x503b10 = new IntersectionObserver(_0xc50846, {
          root: _0x5cbb21,
          rootMargin: "0px 0px",
          threshold: 0
        });
        obsoverlays._iframeIOMap.set(_0x5cbb21, _0x503b10);
      }
      return _0x503b10;
    }(_0x431069);
    if (!_0x470fae) {
      _0xb672e0.observe(_0x5b9dfe[0]);
    }
  } else if (!_0x470fae) {
    _0x5b9dfe.attr("src", _0x29e0b0);
  }
};
obsoverlays.getWidgetPath = function (_0x32130d) {
  return document.location.origin + "/widget/" + _0x32130d + "?cid=" + (window.session.channelId ? window.session.channelId : 0);
};
obsoverlays.testChat = function () {
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 0,
      uniqueId: "TheNormalUser",
      comment: "Hi, i'm a normal user. How are you?"
    });
  }, 0);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 1,
      uniqueId: "TheModerator",
      comment: "Hi, i'm a moderator of your broadcast!",
      isModerator: true
    });
  }, 500);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 2,
      uniqueId: "TheSubscriber",
      comment: "Hi, i'm a subscriber!!!",
      isSubscriber: true
    });
  }, 1000);
};
obsoverlays.testEmojify = function () {
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 0,
      uniqueId: "JustinR",
      comment: "HAHAHA 😂😂😂😂",
      profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/0293afb50ea774887553809331d3779d~c5_100x100.webp"
    });
  }, 0);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 0,
      uniqueId: "Marcofo",
      comment: "Party!!! 🥳🥳🥳🎉🎉🎉🍾🍾🍾🥂🥂🥂",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp"
    });
  }, 4000);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 0,
      uniqueId: "Hexor",
      comment: "OMG I LOVE IT ❤️❤️❤️💚💚💚💙💙💙🧡🧡🧡💜💜💜",
      profilePictureUrl: "https://p16.tiktokcdn-us.com/tos-useast5-avt-0068-tx/9700c28b7c97023f49711dcef0c1592a~c5_100x100.webp"
    });
  }, 8000);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("chat", {
      isTest: true,
      userId: 0,
      uniqueId: "Miaru",
      comment: "Happy new Year! 🎆🎆🎆🎆🎇🎇🎇🎇",
      profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/0293afb50ea774887553809331d3779d~c5_100x100.webp",
      emotes: [{
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 0
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 1
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 2
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 3
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 4
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 5
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 6
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 7
      }, {
        emoteId: "7264991190683077408",
        emoteImageUrl: "https://p19-webcast.tiktokcdn.com/img/gcp/webcast-gcp-giso-euttp/sub_471f01460f13ae25fc474a416bf9cbad6eb0a88ea6e6090dc45baa47dde4461c~tplv-cpex7tcyqo-webp.webp",
        placeInComment: 8
      }]
    });
  }, 12000);
};
obsoverlays.testFirework = function (_0x36140d) {
  setTimeout(function () {
    var _0x4fa99d;
    var _0x4db8b3;
    var _0x4189c8;
    var _0x3e2ee8;
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "zerodytester",
      nickname: ((_0x4fa99d = window.session) === null || _0x4fa99d === undefined ? undefined : (_0x4db8b3 = _0x4fa99d.me) === null || _0x4db8b3 === undefined ? undefined : _0x4db8b3.channeluser?.username) || "Username",
      profilePictureUrl: "https://" + (((_0x4189c8 = window.session) === null || _0x4189c8 === undefined ? undefined : (_0x3e2ee8 = _0x4189c8.me) === null || _0x3e2ee8 === undefined ? undefined : _0x3e2ee8.channeluser?.thumbnailUrl) || "p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_1080x1080.jpeg"),
      giftId: 5655,
      repeatCount: 1,
      repeatEnd: true,
      describe: "Sent Rose",
      giftType: 1,
      giftPictureUrl: "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png",
      diamondCount: 1,
      isTest: true,
      overrideEnableAudio: _0x36140d
    });
  });
};
obsoverlays.testGifts = function () {
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "zerodytester",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp",
      giftId: 5655,
      repeatCount: 1,
      repeatEnd: false,
      describe: "Sent Rose",
      giftType: 1,
      giftPictureUrl: "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png",
      diamondCount: 1,
      isTest: true
    });
  }, 0);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "zerodytester",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp",
      giftId: 5655,
      repeatCount: 2,
      repeatEnd: false,
      describe: "Sent Rose",
      giftType: 1,
      giftPictureUrl: "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png",
      diamondCount: 1,
      isTest: true
    });
  }, 500);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "Testuser123",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp",
      giftId: 5655,
      repeatCount: 3,
      repeatEnd: true,
      describe: "Sent Rose",
      giftType: 1,
      giftPictureUrl: "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png",
      diamondCount: 1,
      isTest: true
    });
  }, 1200);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "Testuser123",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp",
      giftId: 5655,
      repeatCount: 1,
      repeatEnd: false,
      describe: "Sent Doughnut",
      giftType: 2,
      giftPictureUrl: "https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp",
      diamondCount: 30,
      isTest: true
    });
  }, 1500);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "Testuser123",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp",
      giftId: 5655,
      repeatCount: 1,
      repeatEnd: false,
      describe: "Sent Finger Heart",
      giftType: 2,
      giftPictureUrl: "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/a4c4dc437fd3a6632aba149769491f49.png~tplv-obj.png",
      diamondCount: 1,
      isTest: true
    });
  }, 1800);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("gift", {
      uniqueId: "Testuser123",
      profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp",
      giftId: 5655,
      repeatCount: 1,
      repeatEnd: false,
      describe: "Sent GG",
      giftType: 2,
      giftPictureUrl: "https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/3f02fa9594bd1495ff4e8aa5ae265eef~tplv-obj.webp",
      diamondCount: 1,
      isTest: true
    });
  }, 2000);
};
obsoverlays.testTopGifter = function (_0x3214de) {
  socketiowrapper.emitSocketEvent("updateTopGifter", [{
    totalAmount: 15005,
    username: "exampleuser1",
    uniqueId: "exampleuser1",
    nickname: "Example User 1",
    profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_100x100.jpeg"
  }, {
    totalAmount: 10536,
    username: "exampleuser2",
    uniqueId: "exampleuser2",
    nickname: "Example User 2",
    profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp"
  }, {
    totalAmount: 7056,
    username: "exampleuser3",
    uniqueId: "exampleuser3",
    nickname: "Example User 3",
    profilePictureUrl: "https://p19-pu-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/fb1005a7f0bfdd3e5ba52c416158a022~tplv-tiktok-shrink:72:72.webp"
  }, {
    totalAmount: 1533,
    username: "exampleuser4",
    uniqueId: "exampleuser4",
    nickname: "Example User 4",
    profilePictureUrl: "https://p16-va.tiktokcdn.com/tos-maliva-avt-0068/2e1b1214567ec5ae55302f8de3535608~tplv-tiktok-shrink:72:72.webp"
  }, {
    totalAmount: 830,
    username: "exampleuser5",
    uniqueId: "exampleuser5",
    nickname: "Example User 5"
  }, {
    totalAmount: 125,
    username: "exampleuser6",
    uniqueId: "exampleuser6",
    nickname: "Example User 6"
  }, {
    totalAmount: 90,
    username: "exampleuser7",
    uniqueId: "exampleuser7",
    nickname: "Example User 7"
  }, {
    totalAmount: 85,
    username: "exampleuser8",
    uniqueId: "exampleuser8",
    nickname: "Example User 8"
  }, {
    totalAmount: 7,
    username: "exampleuser9",
    uniqueId: "exampleuser9",
    nickname: "Example User 9"
  }]);
  if (_0x3214de) {
    setTimeout(function () {
      socketiowrapper.emitSocketEvent("chat", {
        isTest: true,
        userId: 1,
        uniqueId: "exampleuser1",
        comment: "Hello World! I am a virtual stream avatar!",
        profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/0293afb50ea774887553809331d3779d~c5_100x100.webp"
      });
    }, 1000);
    setTimeout(function () {
      socketiowrapper.emitSocketEvent("chat", {
        isTest: true,
        userId: 1,
        uniqueId: "exampleuser2",
        comment: "How are you?"
      });
    }, 2000);
    setTimeout(function () {
      socketiowrapper.emitSocketEvent("chat", {
        isTest: true,
        userId: 1,
        uniqueId: "exampleuser3",
        comment: "Whats upp???"
      });
    }, 4000);
  }
  setTimeout(function () {
    obsoverlays.emitTopGifter(true);
  }, _0x3214de ? 20000 : 5000);
};
obsoverlays.testTopLiker = function () {
  socketiowrapper.emitSocketEvent("updateTopLiker", [{
    totalAmount: 15005,
    username: "exampleuser1",
    uniqueId: "exampleuser1",
    nickname: "Example User 1",
    profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_100x100.jpeg"
  }, {
    totalAmount: 10536,
    username: "exampleuser2",
    uniqueId: "exampleuser2",
    nickname: "Example User 2",
    profilePictureUrl: "https://p77-va.tiktokcdn.com/musically-maliva-obj/1666074441196550~c5_100x100.webp"
  }, {
    totalAmount: 7056,
    username: "exampleuser3",
    uniqueId: "exampleuser3",
    nickname: "Example User 3",
    profilePictureUrl: "https://p19-pu-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/fb1005a7f0bfdd3e5ba52c416158a022~tplv-tiktok-shrink:72:72.webp"
  }, {
    totalAmount: 1533,
    username: "exampleuser4",
    uniqueId: "exampleuser4",
    nickname: "Example User 4",
    profilePictureUrl: "https://p16-va.tiktokcdn.com/tos-maliva-avt-0068/2e1b1214567ec5ae55302f8de3535608~tplv-tiktok-shrink:72:72.webp"
  }, {
    totalAmount: 830,
    username: "exampleuser5",
    uniqueId: "exampleuser5",
    nickname: "Example User 5"
  }, {
    totalAmount: 125,
    username: "exampleuser6",
    uniqueId: "exampleuser6",
    nickname: "Example User 6"
  }, {
    totalAmount: 90,
    username: "exampleuser7",
    uniqueId: "exampleuser7",
    nickname: "Example User 7"
  }, {
    totalAmount: 85,
    username: "exampleuser8",
    uniqueId: "exampleuser8",
    nickname: "Example User 8"
  }, {
    totalAmount: 7,
    username: "exampleuser9",
    uniqueId: "exampleuser9",
    nickname: "Example User 9"
  }]);
  setTimeout(function () {
    obsoverlays.emitTopLiker(true);
  }, 8000);
};
obsoverlays.fetchTopGifter = function () {
  var _0x568b47;
  var _0x36f3ac;
  var _0x7e40e2;
  var _0x23323d;
  if (!window.session.isElectron || (_0x568b47 = window.broadcastlistener) === null || _0x568b47 === undefined || !_0x568b47.isLive || (_0x36f3ac = window.broadcastlistener) === null || _0x36f3ac === undefined || (_0x7e40e2 = _0x36f3ac.currentBroadcast) === null || _0x7e40e2 === undefined || !_0x7e40e2.roomId) {
    return;
  }
  if (window.lastTopGifterRefresh && window.lastTopGifterRefresh > new Date().getTime() - 3000) {
    return;
  }
  window.lastTopGifterRefresh = new Date().getTime();
  console.log("REFRESH TOP GIFTER");
  window.processRanklist = function (_0x595a29) {
    if (_0x595a29.status_code !== 0 || !Array.isArray(_0x595a29 === null || _0x595a29 === undefined ? undefined : _0x595a29.data?.ranks)) {
      var _0x854d00;
      return api.logError({
        type: "RankList",
        roomId: (_0x854d00 = window.broadcastlistener) === null || _0x854d00 === undefined ? undefined : _0x854d00.currentBroadcast?.roomId,
        response: _0x595a29
      });
    }
    obsoverlays.topGifter = [];
    var _0x19f59c = _createForOfIteratorHelper(_0x595a29.data.ranks);
    var _0x5ca689;
    try {
      for (_0x19f59c.s(); !(_0x5ca689 = _0x19f59c.n()).done;) {
        var _0x533799 = _0x5ca689.value;
        if (_0x533799.score > 0) {
          var _0x1722eb;
          obsoverlays.topGifter.push({
            totalAmount: _0x533799.score,
            nickname: _0x533799.user.nickname,
            username: _0x533799.user.display_id,
            profilePictureUrl: utils.unsignProfilePicture((_0x1722eb = _0x533799.user.avatar_thumb) === null || _0x1722eb === undefined ? undefined : _0x1722eb.url_list?.[0])
          });
          if (obsoverlays.topGifter.length >= 20) {
            break;
          }
        }
      }
    } catch (_0x55c223) {
      _0x19f59c.e(_0x55c223);
    } finally {
      _0x19f59c.f();
    }
    obsoverlays.emitTopGifter(true);
  };
  if (window.appConfig.fetchTopGifterViaBridge && typeof browserbridge.getRanklist === "function" && browserbridge.getRanklist()) {
    return;
  }
  API.fetchUrl({
    url: "https://webcast.tiktok.com/webcast/ranklist/online_audience/?aid=1988&anchor_id=1&room_id=" + ((_0x23323d = window.broadcastlistener) === null || _0x23323d === undefined ? undefined : _0x23323d.currentBroadcast?.roomId),
    headers: {
      Cookie: "sessionid=" + window.appConfig.ttSid + "; tt-target-idc=eu-ttp2"
    }
  }, function (_0x489738) {
    if (_0x489738.responseCode === 200) {
      window.processRanklist(_0x489738.responseData);
    } else {
      var _0x32d9f5;
      api.logError({
        type: "RankList",
        roomId: (_0x32d9f5 = window.broadcastlistener) === null || _0x32d9f5 === undefined ? undefined : _0x32d9f5.currentBroadcast?.roomId,
        statusCode: _0x489738.responseCode
      });
    }
  });
};
obsoverlays.emitTopGifter = function (_0x72b0a3) {
  if (obsoverlays.topGifter.length > 0 || _0x72b0a3) {
    socketiowrapper.emitSocketEvent("updateTopGifter", obsoverlays.topGifter);
  }
};
obsoverlays.emitTopLiker = function (_0x150064) {
  if (obsoverlays.topLiker.length > 0 || _0x150064) {
    obsoverlays.topLikerLastUpdated = Date.now();
    socketiowrapper.emitSocketEvent("updateTopLiker", obsoverlays.topLiker);
  }
};
obsoverlays.processTopLiker = function (_0x1c01e6) {
  var _0x1b86f5;
  _0x1c01e6 = _0x1c01e6.sort(function (_0x25f3aa, _0xd8d84f) {
    return _0xd8d84f.likeCount - _0x25f3aa.likeCount;
  });
  var _0x10666f = _0x1c01e6.slice(0, 19).map(function (_0x53bb1a) {
    return {
      userId: _0x53bb1a.userId,
      totalAmount: _0x53bb1a.likeCount,
      username: _0x53bb1a.uniqueId,
      nickname: _0x53bb1a.nickname,
      profilePictureUrl: _0x53bb1a.profilePictureUrl
    };
  });
  if (JSON.stringify(_0x10666f) === JSON.stringify(obsoverlays.topLiker)) {
    return;
  }
  settings.set("topLikerCache", JSON.stringify({
    roomId: (_0x1b86f5 = window.broadcastlistener) === null || _0x1b86f5 === undefined ? undefined : _0x1b86f5.currentBroadcast?.roomId,
    users: _0x1c01e6.slice(0, 50)
  }));
  obsoverlays.topLiker = _0x10666f;
  if (obsoverlays.topLikerUpdateTimeout) {
    clearTimeout(obsoverlays.topLikerUpdateTimeout);
    obsoverlays.topLikerUpdateTimeout = null;
  }
  if (Date.now() - obsoverlays.topLikerLastUpdated > 3000) {
    obsoverlays.emitTopLiker();
  } else {
    obsoverlays.topLikerUpdateTimeout = setTimeout(function () {
      obsoverlays.emitTopLiker();
    }, 2000);
  }
};
obsoverlays.onRawGift = function () {
  console.log("ranklist timeout set");
  setTimeout(obsoverlays.fetchTopGifter, 5000);
};
obsoverlays.testViewerCount = function () {
  obsoverlays.emitViewerCount(1234);
};
obsoverlays.emitViewerCount = function (_0x312e56, _0x5d4882) {
  if (_0x312e56 === obsoverlays.lastViewerCount && !_0x5d4882) {
    return;
  }
  socketiowrapper.emitSocketEvent("updateViewerCount", {
    viewerCount: _0x312e56
  });
  obsoverlays.lastViewerCount = _0x312e56;
};
obsoverlays.testLikeFountain = function () {
  socketiowrapper.emitSocketEvent("onLikeReceived", {
    likeCount: 6,
    profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_100x100.jpeg",
    userId: Math.random().toString(36).substring(7),
    isTest: true
  });
};
obsoverlays.testCannon = function () {
  socketiowrapper.emitSocketEvent("giftCanonTest", {
    uniqueId: "zerodytester",
    nickname: "Username",
    profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/9cc62a1d3245baf539406ad3f42beee1~tplv-tiktok-shrink:72:72.webp",
    giftId: 5655,
    repeatCount: 1,
    repeatEnd: true,
    describe: "Sent Rose",
    giftType: 1,
    giftPictureUrl: "https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp",
    diamondCount: 1,
    isTest: true
  });
};
obsoverlays.testWheelOfActions = function () {
  var _0xd906cc = wheelOfActions.buildMockedPayload();
  wheelOfActions.triggerWheel(_0xd906cc);
};
obsoverlays.onGift = function (_0xeacac3) {
  coinMatch.processGift(_0xeacac3);
  coinJar.processGift(_0xeacac3);
};
obsoverlays.onLike = function (_0x32083e) {
  if (socketiowrapper.isWidgetActive("likefountain") || navigation.currentPage === "obsoverlays") {
    socketiowrapper.emitSocketEvent("onLikeReceived", _0x32083e);
  }
};
obsoverlays.distributeEvent = function (_0xecad1d, _0x36ff96) {
  wheelOfActions.checkTriggerWheel(_0xecad1d, _0x36ff96);
};
obsoverlays.testCoinJar = function () {
  coinJar.processGift({
    giftId: 5655,
    giftType: 1,
    repeatCount: 1,
    repeatEnd: true,
    giftPictureUrl: "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png",
    diamondCount: 1,
    giftName: "Rose",
    nickname: "Test User 1",
    profilePictureUrl: "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_100x100.jpeg"
  });
};
var goals = {
  inputs: {},
  inputValues: {},
  frameGenerators: [],
  updateOnChangeTimeout: null,
  isFirstPlaydataEvent: true,
  isFirstCustomGoalProcess: true,
  customResetInProgress: false,
  fetchSubInterval: null,
  goalStatusChanged: false,
  emitStatusInterval: null,
  lastLikeCount: 0,
  customValues: {},
  status: {
    likes: {
      current: 0,
      percentage: 0,
      reached: false
    },
    shares: {
      current: 0,
      percentage: 0,
      reached: false
    },
    follows: {
      current: 0,
      percentage: 0,
      reached: false
    },
    viewer: {
      current: 0,
      percentage: 0,
      reached: false
    },
    coins: {
      current: 0,
      percentage: 0,
      reached: false
    },
    points: {
      current: 0,
      percentage: 0,
      reached: false
    },
    subs: {
      current: 0,
      percentage: 0,
      reached: false
    },
    custom1: {
      current: 0,
      percentage: 0,
      reached: false
    },
    custom2: {
      current: 0,
      percentage: 0,
      reached: false
    },
    custom3: {
      current: 0,
      percentage: 0,
      reached: false
    }
  }
};
goals.init = function () {
  goals.frameGenerators = [];
  goals.initGoalMetric($("#likeGoalContainer"));
  goals.initGoalMetric($("#shareGoalContainer"));
  goals.initGoalMetric($("#followsGoalContainer"));
  goals.initGoalMetric($("#viewerGoalContainer"));
  goals.initGoalMetric($("#coinsGoalContainer"));
  goals.initGoalMetric($("#pointsGoalContainer"));
  goals.initGoalMetric($("#subGoalContainer"));
  goals.initGoalMetric($("#custom1GoalContainer"));
  goals.initGoalMetric($("#custom2GoalContainer"));
  goals.initGoalMetric($("#custom3GoalContainer"));
  goals.emitStatus();
  utils.initDxInput(goals, "dxCheckBox", $("#resetCustomGoalsOnNewBcCheckbox"), true, {
    text: "Reset Custom Goals when starting a new stream"
  });
  utils.initDxInput(goals, "dxCheckBox", $("#resetAllGoalsWhenGoalHitCheckbox"), false, {
    text: "Reset all Custom Goals when one goal has been reached (Poll Mode)"
  });
  goals.customValues = JSON.parse(settings.get("customGoalValues") || "{}");
  for (var _0x12aaf2 in goals.customValues) {
    goals.processCustomGoalChange(_0x12aaf2);
  }
  goals.isFirstCustomGoalProcess = false;
  if (!goals.emitStatusInterval) {
    goals.emitStatusInterval = setIntervalFix(function () {
      if (goals.goalStatusChanged) {
        goals.goalStatusChanged = false;
        socketiowrapper.emitSocketEvent("goalStatus", {
          config: goals.inputValues,
          status: goals.status
        });
      }
    }, 2500);
  }
};
goals.onInputChange = function () {
  goals.reCalcOffset("likes", true);
  goals.reCalcOffset("shares", true);
  goals.reCalcOffset("follows", true);
  goals.reCalcOffset("viewer", true);
  goals.reCalcOffset("coins", true);
  goals.reCalcOffset("points", true);
  goals.reCalcOffset("subs", true);
  goals.reCalcOffset("custom1", true);
  goals.reCalcOffset("custom2", true);
  goals.reCalcOffset("custom3", true);
  goals.reCalcPercentage("likes");
  goals.reCalcPercentage("shares");
  goals.reCalcPercentage("follows");
  goals.reCalcPercentage("viewer");
  goals.reCalcPercentage("points");
  goals.reCalcPercentage("coins");
  goals.reCalcPercentage("subs");
  goals.reCalcPercentage("custom1");
  goals.reCalcPercentage("custom2");
  goals.reCalcPercentage("custom3");
  if (!goals.updateOnChangeTimeout) {
    goals.updateOnChangeTimeout = setTimeout(function () {
      goals.updateOnChangeTimeout = null;
      goals.emitStatus();
    }, 500);
  }
};
goals.onChannelContextChanged = function () {
  goals.init();
};
goals.onVisible = function () {
  goals.frameGenerators.forEach(function (_0xa7bc34) {
    _0xa7bc34();
  });
};
goals.onHide = function () {
  $(".goalprogressoverlay").find("iframe").attr("src", "about:blank");
};
goals.initGoalMetric = function (_0x38f1a9) {
  var _0x11b3b9 = _0x38f1a9.data("metric");
  var _0x3d4250 = "goal_" + _0x11b3b9 + "_value";
  var _0x32f67d = "goal_" + _0x11b3b9 + "_title";
  var _0xaf238a = "goal_" + _0x11b3b9 + "_actionId";
  var _0x292187 = "goal_" + _0x11b3b9 + "_increaseSelect";
  var _0x1b6b2d = _0x38f1a9.find(".goalValue").first();
  _0x1b6b2d.attr("id", _0x3d4250);
  var _0x322427 = _0x38f1a9.find(".goalTitle").first();
  _0x322427.attr("id", _0x32f67d);
  var _0x4609e3 = _0x38f1a9.find(".goalIncreaseSelect").first();
  _0x4609e3.attr("id", _0x292187);
  var _0x26c9a7 = _0x38f1a9.find(".manualSet").first();
  var _0x3de7a3 = "Goal";
  switch (_0x11b3b9) {
    case "likes":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 50000, {
        showSpinButtons: true,
        step: 1000,
        width: "89px",
        min: 10,
        max: 9999999999
      });
      _0x3de7a3 = "Like Goal";
      break;
    case "shares":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 50, {
        showSpinButtons: true,
        step: 1,
        width: "89px",
        min: 5,
        max: 9999999999
      });
      _0x3de7a3 = "Share Goal";
      break;
    case "follows":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 100, {
        showSpinButtons: true,
        step: 10,
        width: "89px",
        min: 10,
        max: 9999999999
      });
      _0x3de7a3 = "New Followers";
      break;
    case "viewer":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 100, {
        showSpinButtons: true,
        step: 10,
        width: "89px",
        min: 10,
        max: 9999999999
      });
      _0x3de7a3 = "Viewer Goal";
      break;
    case "coins":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 500, {
        showSpinButtons: true,
        step: 1,
        width: "89px",
        min: 2,
        max: 9999999999
      });
      _0x3de7a3 = "Earned Coins";
      break;
    case "points":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 50, {
        showSpinButtons: true,
        step: 1,
        width: "89px",
        min: 2,
        max: 9999999999
      });
      _0x3de7a3 = "Earned Points";
      break;
    case "subs":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 10, {
        showSpinButtons: true,
        step: 1,
        width: "89px",
        min: 2,
        max: 9999999999
      });
      _0x3de7a3 = "Sub Goal";
      break;
    case "custom1":
    case "custom2":
    case "custom3":
      utils.initDxInput(goals, "dxNumberBox", _0x1b6b2d, 50, {
        showSpinButtons: true,
        step: 1,
        width: "89px",
        min: 2,
        max: 9999999999
      });
      _0x3de7a3 = "Your Title";
      break;
  }
  utils.initDxInput(goals, "dxTextBox", _0x322427, _0x3de7a3, {
    width: "96px",
    valueChangeEvent: "keyup"
  });
  utils.initDxInput(goals, "dxSelectBox", _0x4609e3, "0", {
    width: "185px",
    valueExpr: "id",
    displayExpr: "name",
    dataSource: [{
      id: "0",
      name: localization.getString("goal_action_unchanged")
    }, {
      id: "1",
      name: localization.getString("goal_action_increase")
    }, {
      id: "2",
      name: localization.getString("goal_action_double")
    }, {
      id: "3",
      name: localization.getString("goal_action_hide")
    }]
  });
  var _0x56c854 = settings.get(_0xaf238a);
  var _0x35bd02 = _0x38f1a9.find(".goalActionName").first();
  var _0x432263 = actionsandevents.actions.find(function (_0xdefcf9) {
    return _0xdefcf9.id === parseInt(_0x56c854);
  });
  function _0x44d96e() {
    if (_0x35bd02.parent().find(".removeLink").length === 0) {
      var _0xbfeed3 = $("<span>").html(" <i class=\"far fa-trash-alt\"></i>").css("color", "#c0324e").addClass("removeLink").css("cursor", "pointer").attr("title", "Remove");
      _0xbfeed3.click(function () {
        settings.set(_0xaf238a, "");
        _0x35bd02.text(localization.getString("misc_select"));
        _0xbfeed3.remove();
      });
      _0x35bd02.parent().append(_0xbfeed3);
    }
  }
  if (_0x56c854) {
    _0x35bd02.addClass("action-name-" + _0x56c854);
    _0x44d96e();
  }
  if (_0x432263) {
    _0x35bd02.text(_0x432263.name);
  } else {
    _0x35bd02.text(localization.getString("misc_select"));
  }
  _0x35bd02.off("click").click(function () {
    actionsandevents.openSelectActionDialog($("#selectGoalActionDialog"), function (_0x46ffb1) {
      settings.set(_0xaf238a, _0x46ffb1.id);
      _0x35bd02.text(_0x46ffb1.name);
      _0x35bd02.removeClass().addClass("goalActionName");
      _0x35bd02.addClass("action-name-" + _0x46ffb1.id);
      _0x44d96e();
      _0x56c854 = _0x46ffb1.id;
    });
  });
  if (_0x26c9a7) {
    _0x26c9a7.find(".manualSetNumberBox").dxNumberBox({
      width: "110px",
      showSpinButtons: true,
      value: 0,
      min: 0,
      max: 99999999
    });
    _0x26c9a7.find(".manualSetConfirmButton").dxButton({
      text: "Set",
      onClick: function _0x9ea51b() {
        var _0x14301f = _0x26c9a7.find(".manualSetNumberBox").dxNumberBox("instance").option("value");
        goals.setCustomGoal(_0x11b3b9, "set", _0x14301f);
        toastr.success("Goal Progress updated");
      }
    });
  }
  var _0x30bfb8 = function _0x2892b9() {
    if (navigation.currentPage !== "goals") {
      return;
    }
    obsoverlays.generateWidget(_0x38f1a9.find(".goalprogressoverlay").first(), function () {
      socketiowrapper.emitSocketEvent("testGoal", {
        metric: _0x11b3b9
      });
      if (_0x56c854) {
        setTimeoutFix(function () {
          actionsandevents.executeAction(parseInt(_0x56c854));
        }, 1500);
      }
      setTimeout(function () {
        goals.emitStatus();
      }, 5000);
    }, "130px", false, false, false, undefined);
    var _0x1b44d8 = ["default", "army", "clean-neon", "pure", "raven", "aurous", "clarity"];
    var _0x387dcc = "default";
    var _0x148486 = _0x38f1a9.find("iframe").first();
    var _0x349b5c = _0x148486.parent();
    function _0x11396c(_0xb72fc8) {
      if (_0xb72fc8 === "default") {
        goals.disableProDisplay(_0x11b3b9);
        obsoverlays.updateWidgetRestricted("goal" + _0x11b3b9, false);
      } else {
        goals.enableProDisplay(_0x11b3b9);
        obsoverlays.updateWidgetRestricted("goal" + _0x11b3b9, true);
      }
    }
    function _0xe5a428(_0x4d183d) {
      var _0x3b0d66 = _0x1b44d8.indexOf(_0x4d183d);
      var _0x369910 = _0xf0812e.data("dxButton") !== undefined;
      var _0x34f52f = _0x9e1b1e.data("dxButton") !== undefined;
      if (!_0x369910 || !_0x34f52f) {
        console.log("Buttons not initialized yet");
        return;
      }
      if (_0x3b0d66 === 0) {
        _0xf0812e.dxButton("instance").option("disabled", true);
        _0x9e1b1e.dxButton("instance").option("disabled", false);
      } else if (_0x3b0d66 === _0x1b44d8.length - 1) {
        _0xf0812e.dxButton("instance").option("disabled", false);
        _0x9e1b1e.dxButton("instance").option("disabled", true);
      } else {
        _0xf0812e.dxButton("instance").option("disabled", false);
        _0x9e1b1e.dxButton("instance").option("disabled", false);
      }
    }
    function _0x16caf8(_0x115d76) {
      var _0x51a64a = _0x1b44d8.indexOf(_0x115d76);
      _0x1c1d0b.html("Style: " + (_0x51a64a + 1) + "/" + _0x1b44d8.length);
    }
    var _0x4976d8 = $("<div>").css("display", "flex").css("align-items", "center").css("justify-content", "center").css("flex-direction", "column").css("padding", "10px").css("border-radius", "6px");
    var _0x13798e = $("<div>").css("display", "flex").css("align-items", "center").css("justify-content", "center");
    var _0xf0812e = $("<div>").dxButton({
      icon: "fa-solid fa-chevron-left",
      width: "37px",
      disabled: true,
      onClick: function _0x149bfa() {
        var _0x5555b6 = _0x38f1a9.find(".goalprogressoverlay").first().data("widgetid");
        var _0x480657 = _0x38f1a9.find(".goalprogressoverlay").first().data("goalmetric");
        var _0x1262ba = _0x5555b6 + _0x480657;
        _0x387dcc = settings.get("widget_" + _0x1262ba + "_variation") || "default";
        var _0x15c986 = _0x1b44d8.indexOf(_0x387dcc);
        var _0x1b32e6 = _0x1b44d8[_0x15c986 - 1];
        if (!_0x1b32e6) {
          return;
        }
        settings.set("widget_" + _0x1262ba + "_variation", _0x1b32e6);
        _0x387dcc = _0x1b32e6;
        _0xe5a428(_0x387dcc);
        _0x16caf8(_0x387dcc);
        _0x11396c(_0x387dcc);
        obsoverlays.refreshPublicSettings();
      }
    }).css("margin-bottom", "2px").css("z-index", "999").css("position", "relative");
    var _0x9e1b1e = $("<div>").dxButton({
      icon: "fa-solid fa-chevron-right",
      width: "37px",
      onClick: function _0x4e37fd() {
        var _0x473633 = _0x38f1a9.find(".goalprogressoverlay").first().data("widgetid");
        var _0x37b054 = _0x38f1a9.find(".goalprogressoverlay").first().data("goalmetric");
        var _0x5860a9 = _0x473633 + _0x37b054;
        _0x387dcc = settings.get("widget_" + _0x5860a9 + "_variation") || "default";
        var _0x4bd9a5 = _0x1b44d8.indexOf(_0x387dcc);
        var _0x3a11cf = _0x1b44d8[_0x4bd9a5 + 1];
        if (!_0x3a11cf) {
          return;
        }
        settings.set("widget_" + _0x5860a9 + "_variation", _0x3a11cf);
        _0xe5a428(_0x387dcc);
        _0x16caf8(_0x387dcc);
        _0x11396c(_0x387dcc);
        obsoverlays.refreshPublicSettings();
      }
    }).css("margin-bottom", "2px").css("z-index", "999").css("position", "relative");
    _0x4976d8.css("border", "1px solid");
    _0x4976d8.css("border-color", "#4e4e4e");
    _0x148486.css("border", "0px solid");
    _0x148486.css("border-color", "transparent");
    _0x148486.css("border", "0px solid");
    var _0x1c1d0b = $("<div>").css("text-align", "center").css("display", "flex").css("justify-content", "center").css("align-items", "center").css("font-size", "12px").css("font-weight", "700").css("margin-top", "1rem").html("Style");
    _0x349b5c.append(_0x4976d8);
    _0x4976d8.append(_0x13798e);
    _0x13798e.append(_0xf0812e);
    _0x13798e.append(_0x148486);
    _0x13798e.append(_0x9e1b1e);
    _0x4976d8.append(_0x1c1d0b);
    var _0x40039f = _0x38f1a9.find(".goalprogressoverlay").first().data("widgetid");
    var _0x1263c9 = _0x38f1a9.find(".goalprogressoverlay").first().data("goalmetric");
    var _0x29c52e = _0x40039f + _0x1263c9;
    _0x387dcc = settings.get("widget_" + _0x29c52e + "_variation") || "default";
    var _0x10a086 = _0x1b44d8.indexOf(_0x387dcc);
    if (_0x10a086 === 0) {
      _0xf0812e.dxButton("instance").option("disabled", true);
      _0x9e1b1e.dxButton("instance").option("disabled", false);
    } else if (_0x10a086 === _0x1b44d8.length - 1) {
      _0xf0812e.dxButton("instance").option("disabled", false);
      _0x9e1b1e.dxButton("instance").option("disabled", true);
    } else {
      _0xf0812e.dxButton("instance").option("disabled", false);
      _0x9e1b1e.dxButton("instance").option("disabled", false);
    }
    _0x11396c(_0x387dcc);
    _0x16caf8(_0x387dcc);
    window.addEventListener("storage-update", function (_0x499ca0) {
      if (_0x499ca0.detail && _0x499ca0.detail.field !== "setting_widget_" + _0x29c52e + "_variation") {
        return;
      }
      var _0x55295a = _0x1b44d8.indexOf(_0x499ca0.detail.value);
      if (_0x55295a >= 0) {
        _0x387dcc = _0x499ca0.detail.value;
        _0xe5a428(_0x499ca0.detail.value);
        _0x16caf8(_0x499ca0.detail.value);
        _0x11396c(_0x499ca0.detail.value);
      }
    });
  };
  goals.frameGenerators.push(_0x30bfb8);
  _0x30bfb8();
};
goals.emitStatus = function () {
  goals.goalStatusChanged = true;
};
goals.checkIfReached = function (_0x5f26bf) {
  var _0x13e7e0 = goals.inputValues["goal_" + _0x5f26bf + "_value"];
  var _0x1d42da = goals.status[_0x5f26bf].current;
  goals.reCalcOffset(_0x5f26bf);
  if (_0x1d42da < _0x13e7e0) {
    goals.status[_0x5f26bf].reached = false;
  }
  if (_0x1d42da >= _0x13e7e0 && !goals.status[_0x5f26bf].reached) {
    goals.status[_0x5f26bf].reached = true;
    if (_0x5f26bf.indexOf("custom") === 0) {
      if (goals.customResetInProgress) {
        return;
      }
      if (goals.isFirstCustomGoalProcess) {
        return;
      }
    } else if (goals.isFirstPlaydataEvent) {
      return;
    }
    var _0x1f0c39 = settings.get("goal_" + _0x5f26bf + "_actionid");
    if (_0x1f0c39) {
      console.log("exec goal action", _0x1f0c39);
      setTimeoutFix(function () {
        actionsandevents.executeAction(parseInt(_0x1f0c39));
      }, 1000);
    }
    if (_0x5f26bf.indexOf("custom") === 0 && goals.inputValues.resetAllGoalsWhenGoalHitCheckbox) {
      goals.customResetInProgress = true;
      setTimeoutFix(function () {
        goals.customResetInProgress = false;
        goals.resetCustomGoals();
        toastr.success("Goal Reset triggered");
      }, 2500);
    }
  }
};
goals.reCalcPercentage = function (_0x4915be) {
  goals.status[_0x4915be].percentage = Math.floor(goals.status[_0x4915be].current / goals.inputValues["goal_" + _0x4915be + "_value"] * 100);
};
goals.reCalcOffset = function (_0x55c9e6, _0x5d50db) {
  var _0x336b33 = goals.inputs["goal_" + _0x55c9e6 + "_value"].option("value");
  var _0x1e35a7 = goals.inputValues["goal_" + _0x55c9e6 + "_increaseSelect"];
  var _0x45103b = _0x336b33;
  if (_0x45103b && _0x45103b > 0) {
    while (_0x45103b <= goals.status[_0x55c9e6].current) {
      if (_0x1e35a7 == 1) {
        _0x45103b += _0x336b33;
      } else if (_0x1e35a7 == 2) {
        _0x45103b += _0x45103b;
      } else {
        break;
      }
    }
  }
  var _0x2d30eb = function _0x358c63() {
    goals.inputValues["goal_" + _0x55c9e6 + "_value"] = _0x45103b;
    goals.reCalcPercentage(_0x55c9e6);
    goals.emitStatus();
  };
  if (goals.inputValues["goal_" + _0x55c9e6 + "_value"] !== _0x45103b) {
    console.log("reCalcOffset", _0x55c9e6, _0x45103b, _0x5d50db);
    if (_0x5d50db) {
      _0x2d30eb();
    } else {
      setTimeoutFix(_0x2d30eb, 10000);
    }
  }
};
goals.resetAll = function () {
  goals.status.likes.current = 0;
  goals.status.shares.current = 0;
  goals.status.follows.current = 0;
  goals.status.viewer.current = 0;
  goals.status.coins.current = 0;
  goals.status.points.current = 0;
  goals.status.subs.current = 0;
  goals.reCalcPercentage("likes");
  goals.reCalcPercentage("shares");
  goals.reCalcPercentage("follows");
  goals.reCalcPercentage("viewer");
  goals.reCalcPercentage("coins");
  goals.reCalcPercentage("points");
  goals.reCalcPercentage("subs");
  goals.emitStatus();
  goals.checkIfReached("likes");
  goals.checkIfReached("shares");
  goals.checkIfReached("follows");
  goals.checkIfReached("viewer");
  goals.checkIfReached("coins");
  goals.checkIfReached("points");
  goals.checkIfReached("subs");
  goals.lastLikeCount = 0;
};
goals.onBroadcastPlayData = function (_0x1cd3d0) {
  if (typeof _0x1cd3d0.likes !== "undefined") {
    var _0x2d6b99 = parseInt(_0x1cd3d0.likes);
    if (_0x2d6b99 !== goals.status.likes.current && _0x2d6b99 > goals.lastLikeCount) {
      goals.lastLikeCount = _0x2d6b99;
      goals.status.likes.current = _0x2d6b99;
      goals.reCalcPercentage("likes");
      goals.emitStatus();
      goals.checkIfReached("likes");
    }
  }
  if (typeof _0x1cd3d0.shares !== "undefined") {
    var _0x34ff35 = parseInt(_0x1cd3d0.shares);
    if (_0x34ff35 !== goals.status.shares.current) {
      goals.status.shares.current = _0x34ff35;
      goals.reCalcPercentage("shares");
      goals.emitStatus();
      goals.checkIfReached("shares");
    }
  }
  if (typeof _0x1cd3d0.follows !== "undefined") {
    var _0x5ea432 = parseInt(_0x1cd3d0.follows);
    if (_0x5ea432 !== goals.status.follows.current) {
      goals.status.follows.current = _0x5ea432;
      goals.reCalcPercentage("follows");
      goals.emitStatus();
      goals.checkIfReached("follows");
    }
  }
  if (typeof _0x1cd3d0.viewerCount !== "undefined") {
    var _0x232c00 = parseInt(_0x1cd3d0.viewerCount);
    if (_0x232c00 !== goals.status.viewer.current) {
      goals.status.viewer.current = _0x232c00;
      goals.reCalcPercentage("viewer");
      goals.emitStatus();
      goals.checkIfReached("viewer");
    }
  }
  if (typeof _0x1cd3d0.coins !== "undefined") {
    var _0x5ec433 = parseInt(_0x1cd3d0.coins);
    if (_0x5ec433 !== goals.status.coins.current) {
      goals.status.coins.current = _0x5ec433;
      goals.reCalcPercentage("coins");
      goals.emitStatus();
      goals.checkIfReached("coins");
    }
  }
  if (typeof _0x1cd3d0.points !== "undefined") {
    var _0x5c80ab = parseInt(_0x1cd3d0.points);
    if (_0x5c80ab !== goals.status.points.current) {
      goals.status.points.current = _0x5c80ab;
      goals.reCalcPercentage("points");
      goals.emitStatus();
      goals.checkIfReached("points");
    }
  }
  if (typeof _0x1cd3d0.subs !== "undefined") {
    var _0x5ea432 = parseInt(_0x1cd3d0.subs);
    if (_0x5ea432 !== goals.status.subs.current) {
      goals.status.subs.current = _0x5ea432;
      goals.reCalcPercentage("subs");
      goals.emitStatus();
      goals.checkIfReached("subs");
    }
  }
  goals.isFirstPlaydataEvent = false;
};
goals.processCustomGoalChange = function (_0x372db7) {
  if (typeof goals.customValues[_0x372db7] !== "undefined") {
    var _0xa166e1 = parseInt(goals.customValues[_0x372db7]);
    if (_0xa166e1 !== goals.status[_0x372db7].current) {
      goals.status[_0x372db7].current = _0xa166e1;
      goals.reCalcPercentage(_0x372db7);
      goals.emitStatus();
      goals.checkIfReached(_0x372db7);
    }
  }
};
goals.setCustomGoal = function (_0x397ece, _0x2e22c2 = "set", _0x10c8ba = 0) {
  if (!goals.customValues[_0x397ece]) {
    goals.customValues[_0x397ece] = 0;
  }
  switch (_0x2e22c2) {
    case "set":
      goals.customValues[_0x397ece] = _0x10c8ba;
      break;
    case "increase":
      goals.customValues[_0x397ece] += _0x10c8ba;
      break;
    case "decrease":
      goals.customValues[_0x397ece] -= _0x10c8ba;
      if (goals.customValues[_0x397ece] < 0) {
        goals.customValues[_0x397ece] = 0;
      }
      break;
    default:
      throw new Error("invalid action");
  }
  settings.set("customGoalValues", JSON.stringify(goals.customValues));
  goals.processCustomGoalChange(_0x397ece);
};
goals.resetCustomGoals = function () {
  goals.setCustomGoal("custom1", "set", 0);
  goals.setCustomGoal("custom2", "set", 0);
  goals.setCustomGoal("custom3", "set", 0);
};
goals.toggleProDisplay = function (_0x3aa16e) {
  var _0x4b1c33 = $("#goal" + _0x3aa16e);
  if (_0x4b1c33.length === 0) {
    return;
  }
  var _0x38a787 = _0x4b1c33.hasClass("goalSectionPro");
  if (_0x38a787) {
    _0x4b1c33.removeClass("goalSectionPro");
  } else {
    _0x4b1c33.addClass("goalSectionPro");
  }
};
goals.enableProDisplay = function (_0x325151) {
  var _0x3a0435 = $("#goal-" + _0x325151);
  if (_0x3a0435.length === 0) {
    return;
  }
  _0x3a0435.addClass("goalSectionPro");
};
goals.disableProDisplay = function (_0x45ce5d) {
  var _0x23e9e3 = $("#goal-" + _0x45ce5d);
  if (_0x23e9e3.length === 0) {
    return;
  }
  _0x23e9e3.removeClass("goalSectionPro");
};
var graphicoverlays = {
  name: "graphicoverlays",
  inputs: {},
  inputValues: {},
  frameGenerators: [],
  updateOnChangeTimeout: null,
  state: 0,
  catalog: {
    webcam: {
      pure: {
        widgetKey: "pure",
        container: "#graphic-webcam-pure-container",
        title: "Pure",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "greenscreen blank", "webcam 2 panels", "webcam 4 panels", "webcam blank"],
        proGates: [],
        disabledStaticImgs: []
      },
      chroma: {
        widgetKey: "chroma",
        container: "#graphic-webcam-chroma-container",
        title: "Chroma",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "greenscreen blank", "webcam 2 panels", "webcam 4 panels", "webcam blank"],
        proGates: [],
        disabledStaticImgs: ["greenscreen 2 panels", "webcam 2 panels"]
      },
      blackWhite: {
        widgetKey: "blackwhite",
        container: "#graphic-webcam-black-white-container",
        title: "BlackWhite",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "2 panels", "4 panels", "blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "2 panels", "4 panels", "blank"],
        disabledStaticImgs: ["greenscreen 2 panels", "2 panels"]
      },
      pixelWorld: {
        widgetKey: "pixelworld",
        container: "#graphic-webcam-pixel-world-container",
        title: "Pixel world",
        variations: ["blank", "4 panels", "greenscreen blank", "greenscreen 4 panels"],
        proGates: ["blank", "4 panels", "greenscreen blank", "greenscreen 4 panels"],
        disabledStaticImgs: []
      },
      breakPoint: {
        widgetKey: "breakpoint",
        container: "#graphic-webcam-break-point-container",
        title: "BreakPoint",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "2 panels", "4 panels", "blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "2 panels", "4 panels", "blank"],
        disabledStaticImgs: ["greenscreen 2 panels", "2 panels"]
      },
      pixelArt: {
        widgetKey: "pixelart",
        container: "#graphic-webcam-pixel-art-container",
        title: "PixelArt",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "webcam 2 panels", "webcam 4 panels", "greenscreen blank", "webcam blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "webcam 2 panels", "webcam 4 panels", "greenscreen blank", "webcam blank"],
        disabledStaticImgs: []
      },
      kawaiiCats: {
        widgetKey: "kawaiicats",
        container: "#graphic-webcam-kawaii-cats-container",
        title: "KawaiiCats",
        variations: ["square blank", "square blank 2", "webcam blank", "webcam blank 2", "webcam 2 panels", "greenscreen blank", "greenscreen blank 2", "greenscreen 4 panels", "greenscreen 2 panels"],
        proGates: ["square blank", "square blank 2", "webcam blank", "webcam blank 2", "webcam 2 panels", "greenscreen blank", "greenscreen blank 2", "greenscreen 4 panels", "greenscreen 2 panels"],
        disabledStaticImgs: ["webcam 2 panels", "greenscreen 4 panels"]
      },
      sakura: {
        widgetKey: "sakura",
        container: "#graphic-webcam-sakura-container",
        title: "Sakura",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "4 panels", "blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "4 panels", "blank"],
        disabledStaticImgs: []
      },
      unique: {
        widgetKey: "unique",
        container: "#graphic-webcam-unique-container",
        title: "Unique",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "greenscreen blank", "webcam 2 panels", "webcam 4 panels", "blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "greenscreen blank", "webcam 2 panels", "webcam 4 panels", "blank"],
        disabledStaticImgs: []
      },
      military: {
        widgetKey: "military",
        container: "#graphic-webcam-military-container",
        title: "Military",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "greenscreen blank", "webcam 2 panels", "webcam 4 panels", "blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "greenscreen blank", "webcam 2 panels", "webcam 4 panels", "blank"],
        disabledStaticImgs: ["greenscreen 2 panels", "webcam 2 panels"]
      },
      champion: {
        widgetKey: "champion",
        container: "#graphic-webcam-champion-container",
        title: "Champion",
        variations: ["greenscreen 2 panels", "greenscreen 4 panels", "4 panels", "2 panels", "greenscreen blank", "blank"],
        proGates: ["greenscreen 2 panels", "greenscreen 4 panels", "4 panels", "2 panels", "greenscreen blank", "blank"],
        disabledStaticImgs: ["greenscreen 2 panels", "2 panels", "greenscreen", "webcam 2 panels"]
      }
    },
    overlay: {
      pure: {
        widgetKey: "pure",
        container: "#graphic-overlay-pure-container",
        title: "Pure",
        variations: ["footer", "frame", "header", "panel"],
        proGates: [],
        disabledStaticImgs: ["footer", "frame", "header", "panel"]
      },
      chroma: {
        widgetKey: "chroma",
        container: "#graphic-overlay-chroma-container",
        title: "Chroma",
        variations: ["footer", "frame", "header", "panel"],
        proGates: [],
        disabledStaticImgs: ["footer", "frame", "header", "panel"]
      },
      blackWhite: {
        widgetKey: "blackwhite",
        container: "#graphic-overlay-black-white-container",
        title: "BlackWhite",
        variations: ["footer", "frame", "header", "panel", "panel 2"],
        proGates: ["footer", "frame", "header", "panel", "panel 2"],
        disabledStaticImgs: ["footer", "frame", "header", "panel", "panel 2"]
      },
      pixelWorld: {
        widgetKey: "pixelworld",
        container: "#graphic-overlay-pixelworld-container",
        title: "PixelWorld",
        variations: ["footer", "frame", "header", "panel"],
        proGates: ["footer", "frame", "header", "panel"],
        disabledStaticImgs: ["footer", "frame", "header", "panel"]
      },
      breakPoint: {
        widgetKey: "breakpoint",
        container: "#graphic-overlay-breakpoint-container",
        title: "BreakPoint",
        variations: ["footer", "frame", "header", "panel v1", "panel v2 1", "panel v2 2", "panel v2 3", "panel v2 4"],
        proGates: ["footer", "frame", "header", "panel v1", "panel v2 1", "panel v2 2", "panel v2 3", "panel v2 4"],
        disabledStaticImgs: ["footer", "frame", "header", "panel v1", "panel v2 1", "panel v2 2", "panel v2 3", "panel v2 4"]
      },
      pixelArt: {
        widgetKey: "pixelart",
        container: "#graphic-overlay-pixel-art-container",
        title: "PixelArt",
        variations: ["header", "panel 1", "panel 2", "panel 3", "panel 4", "saber"],
        proGates: ["header", "panel 1", "panel 2", "panel 3", "panel 4", "saber"],
        disabledStaticImgs: ["header", "panel 1", "panel 2", "panel 3", "panel 4", "saber"]
      },
      kawaiiCats: {
        widgetKey: "kawaiicats",
        container: "#graphic-overlay-kawaii-cats-container",
        title: "KawaiiCats",
        variations: ["footer", "footer 2", "frame", "header", "panel", "panel 2", "panel 3", "panel 4"],
        proGates: ["footer", "footer 2", "frame", "header", "panel", "panel 2", "panel 3", "panel 4"],
        disabledStaticImgs: ["footer", "footer 2", "frame", "header", "panel", "panel 2", "panel 3", "panel 4"]
      },
      sakura: {
        widgetKey: "sakura",
        container: "#graphic-overlay-sakura-container",
        title: "Sakura",
        variations: ["footer", "frame", "header", "panel 1", "panel 2", "panel 3", "panel 4"],
        proGates: ["footer", "frame", "header", "panel 1", "panel 2", "panel 3", "panel 4"],
        disabledStaticImgs: ["footer", "frame", "header", "panel 1", "panel 2", "panel 3", "panel 4"]
      },
      unique: {
        widgetKey: "unique",
        container: "#graphic-overlay-unique-container",
        title: "Unique",
        variations: ["footer", "frame", "header", "panel", "panel 1", "panel 2", "panel 3", "panel 4"],
        proGates: ["footer", "frame", "header", "panel", "panel 1", "panel 2", "panel 3", "panel 4"],
        disabledStaticImgs: ["footer", "frame", "header", "panel", "panel 1", "panel 2", "panel 3", "panel 4"]
      },
      military: {
        widgetKey: "military",
        container: "#graphic-overlay-military-container",
        title: "Military",
        variations: ["footer", "frame", "header", "panel"],
        proGates: ["footer", "frame", "header", "panel"],
        disabledStaticImgs: ["footer", "frame", "header", "panel"]
      },
      champion: {
        widgetKey: "champion",
        container: "#graphic-overlay-champion-container",
        title: "Champion",
        variations: ["footer", "frame", "header", "panel", "panel 2", "panel 3", "panel 4"],
        proGates: ["footer", "frame", "header", "panel", "panel 2", "panel 3", "panel 4"],
        disabledStaticImgs: ["footer", "frame", "header", "panel", "panel 2", "panel 3", "panel 4"]
      }
    },
    talking: {
      pure: {
        widgetKey: "pure",
        container: "#graphic-talking-pure-container",
        title: "Pure",
        variations: ["bg", "gameborder", "gameborder 2", "infopanel", "infopanel 2", "infopanel 3", "livechat"],
        proGates: [],
        disabledStaticImgs: ["bg", "gameborder", "gameborder 2", "infopanel", "infopanel 2", "infopanel 3", "livechat"]
      },
      chroma: {
        widgetKey: "chroma",
        container: "#graphic-talking-chroma-container",
        title: "Chroma",
        variations: ["bg", "gameborder 1", "gameborder 2", "livechat"],
        proGates: [],
        disabledStaticImgs: ["bg", "gameborder 1", "gameborder 2", "livechat"]
      },
      blackWhite: {
        widgetKey: "blackwhite",
        container: "#graphic-talking-black-white-container",
        title: "BlackWhite",
        variations: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel", "livechat"],
        proGates: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel", "livechat"],
        disabledStaticImgs: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel", "livechat"]
      },
      pixelWorld: {
        widgetKey: "pixelworld",
        container: "#graphic-talking-pixelworld-container",
        title: "PixelWorld",
        variations: ["bg", "bg 2", "bg 3", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"],
        proGates: ["bg", "bg 2", "bg 3", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"],
        disabledStaticImgs: ["bg", "bg 2", "bg 3", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"]
      },
      breakPoint: {
        widgetKey: "breakpoint",
        container: "#graphic-talking-breakpoint-container",
        title: "BreakPoint",
        variations: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel", "livechat"],
        proGates: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel", "livechat"],
        disabledStaticImgs: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel", "livechat"]
      },
      pixelArt: {
        widgetKey: "pixelart",
        container: "#graphic-talking-pixel-art-container",
        title: "PixelArt",
        variations: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel 1", "infopanel 2", "infopanel 3", "infopanel 4", "livechat"],
        proGates: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel 1", "infopanel 2", "infopanel 3", "infopanel 4", "livechat"],
        disabledStaticImgs: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel 1", "infopanel 2", "infopanel 3", "infopanel 4", "livechat"]
      },
      kawaiiCats: {
        widgetKey: "kawaiicats",
        container: "#graphic-talking-kawaii-cats-container",
        title: "KawaiiCats",
        variations: ["bg", "bg 2", "gameborder 1 v1", "gameborder 1 v2", "gameborder 2 v1", "gameborder 2 v2", "gameborder 3 v1", "gameborder 3 v2", "infopanel", "livechat", "socialpanel"],
        proGates: ["bg", "bg 2", "gameborder 1 v1", "gameborder 1 v2", "gameborder 2 v1", "gameborder 2 v2", "gameborder 3 v1", "gameborder 3 v2", "infopanel", "livechat", "socialpanel"],
        disabledStaticImgs: ["bg", "bg 2", "gameborder 1 v1", "gameborder 1 v2", "gameborder 2 v1", "gameborder 2 v2", "gameborder 3 v1", "gameborder 3 v2", "infopanel", "livechat", "socialpanel"]
      },
      sakura: {
        widgetKey: "sakura",
        container: "#graphic-talking-sakura-container",
        title: "Sakura",
        variations: ["blank", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"],
        proGates: ["blank", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"],
        disabledStaticImgs: ["blank", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"]
      },
      unique: {
        widgetKey: "unique",
        container: "#graphic-talking-unique-container",
        title: "Unique",
        variations: ["bg", "gameborder", "gameborder 2", "gameborder 3", "infopanel", "livechat"],
        proGates: ["bg", "gameborder", "gameborder 2", "gameborder 3", "infopanel", "livechat"],
        disabledStaticImgs: ["bg", "gameborder", "gameborder 2", "gameborder 3", "infopanel", "livechat"]
      },
      military: {
        widgetKey: "military",
        container: "#graphic-talking-military-container",
        title: "Military",
        variations: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"],
        proGates: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "livechat"],
        disabledStaticImgs: []
      },
      champion: {
        widgetKey: "champion",
        container: "#graphic-talking-champion-container",
        title: "Champion",
        variations: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel 1", "infopanel 2", "infopanel 3", "infopanel 4", "livechat"],
        proGates: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel 1", "infopanel 2", "infopanel 3", "infopanel 4", "livechat"],
        disabledStaticImgs: ["bg", "gameborder 1", "gameborder 2", "gameborder 3", "infopanel 1", "infopanel 2", "infopanel 3", "infopanel 4", "livechat"]
      }
    }
  }
};
graphicoverlays.onChannelContextChanged = function () {
  graphicoverlays.init();
};
graphicoverlays.init = _asyncToGenerator(_regeneratorRuntime().mark(function _callee49() {
  var _0x3ab815;
  var _0x5ca62b;
  var _0x207050;
  var _0x441d78;
  var _0x64320;
  var _0x46bbce;
  var _0x5acfc8;
  var _0xe650c;
  var _0x4fce2b;
  var _0x4e3647;
  var _0x280af0;
  var _0x430af1;
  var _0x195a0e;
  return _regeneratorRuntime().wrap(function _0x358126(_0x13378a) {
    while (1) {
      switch (_0x13378a.prev = _0x13378a.next) {
        case 0:
          _0x5ca62b = function _0x2ce9e6() {
            return new Promise(function (_0x1684c1) {
              var _0x37f03d = setInterval(function () {
                var _0x4e3ef1 = settings.get("channelId") !== "0" && !window.session.me;
                if (!_0x4e3ef1) {
                  clearInterval(_0x37f03d);
                  _0x1684c1();
                }
              }, 100);
            });
          };
          if (settings.get("channelId") === "0" || !!window.session.me) {
            _0x13378a.next = 3;
            break;
          }
          return _0x13378a.abrupt("return");
        case 3:
          _0x3ab815 = ["webcam", "overlay", "talking"];
          _0x13378a.prev = 4;
          _0x13378a.next = 7;
          return _0x5ca62b();
        case 7:
          for (_0x207050 = 0; _0x207050 < _0x3ab815.length; _0x207050++) {
            _0x441d78 = _0x3ab815[_0x207050];
            _0x64320 = graphicoverlays.catalog?.[_0x441d78] || {};
            _0x46bbce = Object.entries(_0x64320);
            for (_0x5acfc8 = 0; _0x5acfc8 < _0x46bbce.length; _0x5acfc8++) {
              _0xe650c = _slicedToArray(_0x46bbce[_0x5acfc8], 2);
              _0x4fce2b = _0xe650c[0];
              _0x4e3647 = _0xe650c[1];
              _0x280af0 = graphicoverlays.makeWidgetId(_0x441d78, _0x4e3647.widgetKey || _0x4fce2b);
              _0x430af1 = graphicoverlays.titleFor(_0x441d78, _0x4fce2b, _0x4e3647.title);
              _0x195a0e = $(_0x4e3647.container);
              graphicoverlays.initGraphicWidget(_0x195a0e, {
                widgetId: _0x280af0,
                titleDefault: _0x430af1,
                proGates: _0x4e3647.proGates || [],
                variations: _0x4e3647.variations || [],
                disabledStaticImgs: Array.isArray(_0x4e3647.disabledStaticImgs) ? _0x4e3647.disabledStaticImgs : []
              });
            }
          }
          graphicoverlays.state = 1;
          _0x13378a.next = 14;
          break;
        case 11:
          _0x13378a.prev = 11;
          _0x13378a.t0 = _0x13378a.catch(4);
          console.error("error init", _0x13378a.t0);
        case 14:
        case "end":
          return _0x13378a.stop();
      }
    }
  }, _callee49, null, [[4, 11]]);
}));
graphicoverlays.makeWidgetId = function (_0x57ef7b, _0x37d858) {
  return `${_0x57ef7b}_${_0x37d858}`;
};
graphicoverlays.titleFor = function (_0x5dab29, _0x45b3e0, _0x5848fa) {
  var _0x402488 = function _0x3aaf15(_0x5e6608) {
    return _0x5e6608.replace(/[-_]/g, " ").replace(/\b\w/g, function (_0x48bead) {
      return _0x48bead.toUpperCase();
    });
  };
  return `${_0x5848fa} ${_0x402488(_0x5dab29)}`;
};
graphicoverlays.onVisible = function () {
  if (window.navigation && typeof navigation.setSubMenuItems === "function") {
    navigation.setSubMenuItems();
  }
  graphicoverlays.frameGenerators.forEach(function (_0x17fa95) {
    return _0x17fa95();
  });
};
graphicoverlays.onHide = function () {
  $(".gfxWidgetPreview").find("iframe").attr("src", "about:blank");
};
graphicoverlays.saveData = function (_0x42e5bf) {
  var _0x635a1 = _0x42e5bf === undefined ? graphicoverlays.state : _0x42e5bf;
  if (_0x635a1 === 0) {
    return;
  }
  window.settings.save();
  obsoverlays.refreshPublicSettings();
  graphicoverlays.state = 1;
};
graphicoverlays.initGraphicWidget = function (_0xac7cd1, _0x4535e0) {
  var _0x2d66fa;
  if (_0xac7cd1.length === 0) {
    return;
  }
  var _0xc6a8b3 = window.settings;
  var _0x321cb3 = _0x4535e0.widgetId;
  var _0x448d05 = _0x321cb3 + "_";
  var _0x4588f8 = (_0x4535e0 !== null && _0x4535e0 !== undefined && (_0x2d66fa = _0x4535e0.variations) !== null && _0x2d66fa !== undefined && _0x2d66fa.length ? _0x4535e0.variations : graphicoverlays.variations?.[_0x321cb3] || ["default"]).map(function (_0x3a995f) {
    if (typeof _0x3a995f === "string") {
      return _0x3a995f.trim();
    } else {
      return _0x3a995f;
    }
  });
  var _0x321c04 = _0x4535e0.proGates || [];
  var _0xe5e796 = _0xac7cd1.find(".gfxCounter");
  var _0x47ce71 = _0xac7cd1.find(".gfxVarPrev").first();
  var _0x3207a6 = _0xac7cd1.find(".gfxVarNext").first();
  var _0xbd487;
  var _0x4c39a6;
  function _0x2c9ec3(_0x2ce338) {
    var _0x4ad520;
    if (!Array.isArray(_0x5917ce) || _0x5917ce.length === 0) {
      return;
    }
    var _0x51cce2 = _0x9b7cfb();
    var _0x236161 = _0x2ce338 === "prev" ? -1 : 1;
    var _0x165853 = Math.max(0, Math.min(_0x5917ce.length - 1, _0x51cce2 + _0x236161));
    var _0x3d3e52 = _0x5917ce[_0x165853].raw;
    var _0x74b949 = _0xc6a8b3 === null || _0xc6a8b3 === undefined ? undefined : (_0x4ad520 = _0xc6a8b3.get) === null || _0x4ad520 === undefined ? undefined : _0x4ad520.call(_0xc6a8b3, `widget_${_0x599418}`);
    var _0x1a75ff = typeof _0x74b949 === "string" ? _0x74b949.trim() : _0x74b949;
    if (_0x1a75ff === _0x3d3e52) {
      return;
    }
    _0xc6a8b3.set(`widget_${_0x599418}`, _0x3d3e52);
    _0xc6a8b3.set(_0x599418, _0x3d3e52);
    if (_0x535f46 === null || _0x535f46 === undefined) {
      undefined;
    } else {
      _0x535f46(_0x165853);
    }
    if (_0x4a7076 === null || _0x4a7076 === undefined) {
      undefined;
    } else {
      _0x4a7076(_0x165853);
    }
    _0x3ba74d(_0x165853);
    graphicoverlays.saveData();
  }
  function _0x9b7cfb() {
    var _0xd4c245 = window.settings && _0xc6a8b3.get(`widget_${_0x599418}`) || _0x5917ce[0].raw;
    var _0x57b7cc = _0xe4393d(_0xd4c245);
    var _0x473221 = _0x5917ce.findIndex(function (_0x33bd37) {
      return _0x33bd37.norm === _0x57b7cc;
    });
    if (_0x473221 >= 0) {
      return _0x473221;
    } else {
      return 0;
    }
  }
  function _0xe4393d(_0x11408) {
    return String(_0x11408 || "").toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  }
  var _0x5917ce = _0x4588f8.map(function (_0xebd4c7) {
    return {
      raw: _0xebd4c7,
      norm: _0xe4393d(_0xebd4c7)
    };
  });
  var _0x2a18c8 = (_0x321c04 || []).map(_0xe4393d);
  var _0x2db733 = function _0x344f11(_0x4799e7) {
    return _0x2a18c8.includes(_0xe4393d(_0x4799e7));
  };
  function _0x535f46(_0x587a5d) {
    var _0x1444ca = typeof _0x587a5d === "number" ? _0x587a5d : _0x9b7cfb();
    _0xe5e796.html(`${_0x1444ca + 1} / ${_0x4588f8.length}`);
    if (_0xbd487 === undefined) {
      _0xbd487 = _0x47ce71.dxButton("instance");
    }
    if (_0x4c39a6 === undefined) {
      _0x4c39a6 = _0x3207a6.dxButton("instance");
    }
    if (_0xbd487) {
      _0xbd487.option("disabled", _0x1444ca === 0);
    }
    if (_0x4c39a6) {
      _0x4c39a6.option("disabled", _0x1444ca >= _0x4588f8.length - 1);
    }
  }
  function _0x20593f(_0xf06d3f) {
    return _0xf06d3f.replace(/^./, _0xf06d3f[0].toUpperCase());
  }
  function _0x4a7076(_0x140174) {
    var _0x50ba62 = typeof _0x140174 === "number" ? _0x140174 : _0x9b7cfb();
    var _0x233a9b = window.settings && _0xc6a8b3.get(`widget_${_0x599418}`) || _0x5917ce[0].raw;
    var _0x3949ad = _0x2db733(_0x233a9b);
    var _0x383a4f = _0x5917ce[_0x50ba62]?.raw || _0x233a9b;
    var _0x3d5627 = _0x20593f(_0x383a4f.replace(/[-_]/g, " "));
    var _0x23a9c5 = _0x3949ad ? "<span class='proBadge visible' style='margin-left: 0.25rem'>PRO</span>" : "";
    _0x3cc701.html(`${_0x4535e0.titleDefault} - ${_0x3d5627} ${_0x23a9c5}`);
  }
  function _0x1d933a(_0x3b10cf, _0x41a626) {
    if (!_0x3b10cf || !_0x3b10cf.length) {
      return false;
    }
    if (!_0x3b10cf.attr("id")) {
      _0x3b10cf.attr("id", _0x41a626);
    }
    if (!_0x3b10cf.attr("name")) {
      _0x3b10cf.attr("name", _0x41a626);
    }
    return true;
  }
  function _0x18e843(_0x4ee138, _0x30af0f, _0xf0687d, _0x4b59c2, _0x11d112, _0x172508) {
    if (!_0x1d933a(_0xf0687d, _0x172508)) {
      console.warn(`[graphicoverlays] element missing: ${_0x172508}`);
      return;
    }
    utils.initDxInput(_0x4ee138, _0x30af0f, _0xf0687d, _0x4b59c2, _0x11d112);
  }
  function _0x334df6(_0x5b0692, _0x2f0e2f) {
    return _0x2f0e2f.includes(_0x5b0692);
  }
  function _0x3ba74d(_0x14e536) {
    var _0x36f88f = _0x5917ce[_0x14e536]?.raw;
    var _0x36f09d = _0xbb159d.dxCheckBox && _0xbb159d.dxCheckBox("instance");
    if (!_0x36f09d) {
      return;
    }
    var _0x367d1c = _0x334df6(_0x36f88f, _0x4535e0.disabledStaticImgs);
    _0x36f09d.option("disabled", _0x367d1c);
    if (_0x367d1c) {
      _0x36f09d.option("value", true);
      _0xc6a8b3.set(`widget_${_0x2d6dc3}`, true);
      _0xc6a8b3.save();
    }
  }
  var _0x3cc701 = _0xac7cd1.find(".gfxTitle").first();
  var _0xbb159d = _0xac7cd1.find(".gfxAnim").first();
  var _0x2d6dc3 = _0x448d05 + "animation";
  var _0x599418 = _0x448d05 + "variation";
  if (window.settings && window.settings.get(`widget_${_0x599418}`) === "" || window.settings.get(`widget_${_0x599418}`) === null) {
    window.settings.set(`widget_${_0x599418}`, _0x4588f8[0]);
  }
  _0x18e843(graphicoverlays, "dxCheckBox", _0xbb159d, _0xc6a8b3.get(`widget_${_0x2d6dc3}`) === "true", {
    text: localization.t("obsoverlays_widget_animation"),
    disabled: _0x334df6(window.settings.get(_0x599418), _0x4535e0.disabledStaticImgs),
    onValueChanged: function _0x49c80d(_0x2667f4) {
      _0xc6a8b3.set(`widget_${_0x2d6dc3}`, _0x2667f4.value);
      graphicoverlays.saveData();
    }
  }, _0x2d6dc3);
  var _0x1d6282 = _0xac7cd1.find(".gfxVarPrev").first();
  var _0x68f0e8 = _0xac7cd1.find(".gfxVarNext").first();
  if (_0x1d6282.length && _0x68f0e8.length && _0x1d6282.dxButton && _0x68f0e8.dxButton) {
    _0x47ce71.dxButton({
      icon: "fa-solid fa-chevron-left",
      width: "36px",
      onInitialized: function _0x2b5533(_0x5691af) {
        _0xbd487 = _0x5691af.component;
      },
      onClick: function _0x527823() {
        _0x2c9ec3("prev");
      }
    });
    _0x3207a6.dxButton({
      icon: "fa-solid fa-chevron-right",
      width: "36px",
      onInitialized: function _0x515f4e(_0x7321fa) {
        _0x4c39a6 = _0x7321fa.component;
      },
      onClick: function _0x905d50() {
        _0x2c9ec3("next");
      }
    });
  }
  function _0x54f39d() {
    var _0x47646a = window.settings && _0xc6a8b3.get(_0x599418) || _0x4588f8[0];
    var _0x264535 = _0x2db733(_0x47646a);
    var _0x486a59 = _0xac7cd1.closest(".graphicSection");
    if (!_0x486a59.length) {
      return;
    }
    if (_0x264535) {
      _0x486a59.addClass("graphicSectionPro");
    } else {
      _0x486a59.removeClass("graphicSectionPro");
    }
    if (window.obsoverlays && typeof obsoverlays.updateWidgetRestricted === "function") {
      obsoverlays.updateWidgetRestricted(_0x321cb3, _0x264535);
    }
  }
  var _0x31332f = function _0xc06875() {
    if (window.navigation && navigation.currentPage !== "graphicoverlays") {
      return;
    }
    var _0x5707da = _0xac7cd1.find(".gfxWidgetPreview").first();
    if (!_0x5707da.length) {
      return;
    }
    if (window.obsoverlays && typeof obsoverlays.generateWidget === "function") {
      obsoverlays.generateWidget(_0x5707da, null, "220px", false, false, false, false);
    }
    setTimeout(function () {
      _0x54f39d();
    }, 1000);
  };
  graphicoverlays.frameGenerators.push(_0x31332f);
  _0x31332f();
  _0x535f46();
  _0x54f39d();
  _0x4a7076();
};
;
var giftoverlays = {
  inputs: {},
  inputValues: {},
  frameGenerators: [],
  updateOnChangeTimeout: null,
  isFirstPlaydataEvent: true,
  isFirstCustomGoalProcess: true,
  customResetInProgress: false,
  fetchSubInterval: null,
  topGiftStatusChanged: false,
  goalStatusChanged: false,
  emitStatusInterval: null,
  emitTopGifterInterval: null,
  customValues: {},
  giftList: [],
  enableAllCounters: false,
  giftStreakCount: {},
  status: {
    gc1: {
      current: 0,
      percentage: 0,
      reached: false
    },
    gc2: {
      current: 0,
      percentage: 0,
      reached: false
    },
    gc3: {
      current: 0,
      percentage: 0,
      reached: false
    }
  },
  topGiftStatus: {},
  currentConfiguredGifts: {
    gc1: 5655,
    gc2: 11046,
    gc3: 9101
  }
};
giftoverlays.init = _asyncToGenerator(_regeneratorRuntime().mark(function _callee50() {
  var _0x38769d;
  var _0x40eb8f;
  var _0x1560fd;
  var _0x12eb7f;
  return _regeneratorRuntime().wrap(function _0x35edc5(_0x458e09) {
    while (1) {
      switch (_0x458e09.prev = _0x458e09.next) {
        case 0:
          if (settings.get("channelId") === "0" || (_0x38769d = window.session) !== null && _0x38769d !== undefined && !!_0x38769d.me) {
            _0x458e09.next = 2;
            break;
          }
          return _0x458e09.abrupt("return");
        case 2:
          giftoverlays.enableAllCounters = (_0x40eb8f = window.session) === null || _0x40eb8f === undefined ? undefined : (_0x1560fd = _0x40eb8f.me) === null || _0x1560fd === undefined ? undefined : _0x1560fd.userFeatures?.isPro;
          giftoverlays.frameGenerators = [];
          giftoverlays.initGoalMetric($("#gift1GoalContainer"));
          giftoverlays.initGoalMetric($("#gift2GoalContainer"));
          giftoverlays.initGoalMetric($("#gift3GoalContainer"));
          giftoverlays.frameGenerators.push(function () {
            obsoverlays.generateWidget($("#widgetGifterTop"), null, "230px", false, true, true, function () {
              giftoverlays.topGiftStatus.topGift = null;
              giftoverlays.checkGiftData();
              giftoverlays.topGiftStatusChanged = true;
              toastr.success("Top Gift resetted");
            });
          });
          giftoverlays.frameGenerators.push(function () {
            obsoverlays.generateWidget($("#widgetGifterStreaker"), null, "230px", false, true, true, function () {
              giftoverlays.topGiftStatus.topStreaker = null;
              giftoverlays.checkGiftData();
              giftoverlays.topGiftStatusChanged = true;
              toastr.success("Top Streak resetted");
            });
          });
          $(".giftOverlayResetButton").css("position", "absolute");
          $(".giftOverlayResetButton").css("margin-left", "395px");
          $(".giftOverlayResetButton").css("margin-top", "90px");
          if (giftoverlays.enableAllCounters) {
            $("#buttonAddMoreGiftGoals").parent().hide();
          } else {
            $("#gift2GoalContainer").parent().hide();
            $("#gift3GoalContainer").parent().hide();
            $("#buttonAddMoreGiftGoals").dxButton({
              text: "Add Gift Counter",
              icon: "fa fa-plus",
              onClick: function _0x4a1a67() {
                if (settings.get("channelId") === "0") {
                  return navigation.pageChange("setup");
                }
                DevExpress.ui.dialog.alert(localization.getString("giftoverlays_counter_add_prorequired"), "TikFinity Pro required").then(function () {
                  setup.scrollToPaymentUi("COUNTER_ADD", true);
                });
              }
            });
          }
          giftoverlays.emitStatus();
          utils.initDxInput(giftoverlays, "dxCheckBox", $("#checboxResetGiftOverlayOnNewStream"), true, {
            text: localization.getString("giftoverlays_reset_on_new_stream")
          });
          utils.initDxInput(giftoverlays, "dxCheckBox", $("#resetGiftGoalsOnNewBcCheckbox"), true, {
            text: localization.getString("giftoverlays_reset_counter")
          });
          utils.initDxInput(giftoverlays, "dxCheckBox", $("#resetAllGiftCounterWhenGoalHitCheckbox"), false, {
            text: localization.getString("giftoverlays_counter_reset_poll")
          });
          giftoverlays.topGiftStatus = JSON.parse(settings.get("topGiftStatus") || "{}");
          giftoverlays.checkGiftData();
          giftoverlays.customValues = JSON.parse(settings.get("giftGoalValues") || "{}");
          for (_0x12eb7f in giftoverlays.customValues) {
            if (giftoverlays.status[_0x12eb7f]) {
              giftoverlays.processCustomGoalChange(_0x12eb7f);
            }
          }
          giftoverlays.isFirstCustomGoalProcess = false;
          if (!giftoverlays.emitTopGifterInterval) {
            giftoverlays.emitTopGifterInterval = setIntervalFix(function () {
              if (giftoverlays.topGiftStatusChanged) {
                settings.set("topGiftStatus", JSON.stringify(giftoverlays.topGiftStatus));
                giftoverlays.emitTopGifter();
                giftoverlays.topGiftStatusChanged = false;
              }
            }, 250);
          }
          if (!giftoverlays.emitStatusInterval) {
            giftoverlays.emitStatusInterval = setIntervalFix(function () {
              if (giftoverlays.goalStatusChanged) {
                giftoverlays.emitGiftGoalStatus();
              }
            }, 1000);
          }
          _0x458e09.next = 26;
          return actionsandevents.getAllGiftsCached();
        case 26:
          giftoverlays.giftList = _0x458e09.sent;
          giftoverlays.emitStatus();
          giftoverlays.topGiftStatusChanged = true;
          if (navigation.currentPage === "giftoverlays") {
            giftoverlays.onVisible();
          }
        case 30:
        case "end":
          return _0x458e09.stop();
      }
    }
  }, _callee50);
}));
giftoverlays.emitGiftGoalStatus = function () {
  giftoverlays.goalStatusChanged = false;
  var _0x224609 = function _0x1e412c(_0x4fc8d7) {
    var _0x1d6438;
    var _0x5555e8;
    var _0x4480bb = parseInt(settings.get("gcounter_" + _0x4fc8d7 + "_gift") || giftoverlays.currentConfiguredGifts[_0x4fc8d7]);
    var _0x5b2d9b = ((_0x1d6438 = giftoverlays.giftList.find(function (_0x3de2f5) {
      return _0x3de2f5.id === _0x4480bb;
    })) === null || _0x1d6438 === undefined ? undefined : (_0x5555e8 = _0x1d6438.image) === null || _0x5555e8 === undefined ? undefined : _0x5555e8.url_list?.[0]) || null;
    giftoverlays.inputValues["gcounter_" + _0x4fc8d7 + "_giftPictureUrl"] = _0x5b2d9b;
  };
  for (var _0x55b677 in giftoverlays.status) {
    _0x224609(_0x55b677);
  }
  socketiowrapper.emitSocketEvent("giftGoalStatus", {
    config: giftoverlays.inputValues,
    status: giftoverlays.status
  });
};
giftoverlays.onInputChange = function (_0x40312e) {
  if (_0x40312e === "resetAllGiftCounterWhenGoalHitCheckbox") {
    for (var _0x22a135 in giftoverlays.status) {
      if (giftoverlays.status[_0x22a135].reached) {
        giftoverlays.resetAll();
        return;
      }
    }
  }
  giftoverlays.reCalcOffset("gc1", true);
  giftoverlays.reCalcOffset("gc2", true);
  giftoverlays.reCalcOffset("gc3", true);
  giftoverlays.reCalcPercentage("gc1");
  giftoverlays.reCalcPercentage("gc2");
  giftoverlays.reCalcPercentage("gc3");
  if (!giftoverlays.updateOnChangeTimeout) {
    giftoverlays.updateOnChangeTimeout = setTimeout(function () {
      giftoverlays.updateOnChangeTimeout = null;
      giftoverlays.emitStatus();
      giftoverlays.emitGiftGoalStatus();
    }, 500);
  }
};
giftoverlays.onChannelContextChanged = function () {
  giftoverlays.init();
};
giftoverlays.onHide = function () {
  $(".giftprogressoverlay").find("iframe").attr("src", "about:blank");
};
giftoverlays.initGoalMetric = function (_0x3e48da) {
  var _0x20908e = _0x3e48da.data("metric");
  var _0x46430c = "gcounter_" + _0x20908e + "_gift";
  var _0x576867 = "gcounter_" + _0x20908e + "_value";
  var _0x3a9de1 = "gcounter_" + _0x20908e + "_title";
  var _0x2a70d3 = "gcounter_" + _0x20908e + "_actionId";
  var _0x187504 = "gcounter_" + _0x20908e + "_increaseSelect";
  if (_0x20908e !== "gc1" && !giftoverlays.enableAllCounters) {
    return;
  }
  var _0x57d769 = _0x3e48da.find(".giftSelect").first();
  _0x57d769.attr("id", _0x46430c);
  var _0x453528 = _0x3e48da.find(".goalValue").first();
  _0x453528.attr("id", _0x576867);
  var _0x54f709 = _0x3e48da.find(".goalTitle").first();
  _0x54f709.attr("id", _0x3a9de1);
  var _0x34f501 = _0x3e48da.find(".goalIncreaseSelect").first();
  _0x34f501.attr("id", _0x187504);
  var _0x1cf432 = _0x3e48da.find(".manualSet").first();
  var _0x2408e8 = "";
  switch (_0x20908e) {
    case "gc1":
      utils.initDxInput(giftoverlays, "dxNumberBox", _0x453528, 50, {
        showSpinButtons: true,
        step: 1,
        width: "100px",
        min: 0,
        max: 99999999
      });
      _0x2408e8 = "My Challenge";
      break;
    case "gc2":
      utils.initDxInput(giftoverlays, "dxNumberBox", _0x453528, 0, {
        showSpinButtons: true,
        step: 1,
        width: "100px",
        min: 0,
        max: 99999999
      });
      _0x2408e8 = "Simple Counter";
      break;
    case "gc3":
      utils.initDxInput(giftoverlays, "dxNumberBox", _0x453528, 0, {
        showSpinButtons: true,
        step: 1,
        width: "100px",
        min: 0,
        max: 99999999
      });
      _0x2408e8 = "";
      break;
  }
  var _0x566552 = parseInt(settings.get(_0x46430c) || giftoverlays.currentConfiguredGifts[_0x20908e] || 0);
  console.log("initGoalMetric", _0x20908e, _0x566552);
  giftoverlays.currentConfiguredGifts[_0x20908e] = _0x566552;
  _0x57d769.dxSelectBox({
    width: "229px",
    valueExpr: "id",
    displayExpr: "name",
    dataSource: actionsandevents.getGiftDataSourceCached(),
    value: _0x566552,
    searchEnabled: true,
    itemTemplate: actionsandevents.getGiftItemTemplate,
    fieldTemplate: function _0x4c0221(_0x3ab4cb, _0x2cfd34) {
      var _0xb5fb0f;
      var _0x51d222 = _0x3ab4cb ? `${_0x3ab4cb.name} (${((_0xb5fb0f = _0x3ab4cb.diamond_count) === null || _0xb5fb0f === undefined ? undefined : _0xb5fb0f.toLocaleString()) || 0} Coins)` : null;
      var _0x43050c = $("<div>").dxTextBox({
        text: _0x51d222,
        placeholder: "Select..."
      });
      _0x2cfd34.append(_0x43050c);
    },
    onValueChanged: function _0x1bec47(_0x6ffaba) {
      console.log("giftSelectControl onValueChanged", _0x6ffaba.value);
      if (_0x6ffaba.value) {
        giftoverlays.currentConfiguredGifts[_0x20908e] = _0x6ffaba.value;
        settings.set(_0x46430c, _0x6ffaba.value);
      } else {
        settings.set(_0x46430c, "");
      }
      giftoverlays.onInputChange();
    }
  }).dxSelectBox("instance");
  utils.initDxInput(giftoverlays, "dxTextBox", _0x54f709, _0x2408e8, {
    width: "160px",
    valueChangeEvent: "keyup",
    placeholder: "(optional)"
  });
  utils.initDxInput(giftoverlays, "dxSelectBox", _0x34f501, "0", {
    width: "190px",
    valueExpr: "id",
    displayExpr: "name",
    dataSource: [{
      id: "0",
      name: localization.getString("goal_action_unchanged")
    }, {
      id: "4",
      name: localization.getString("goal_action_reset")
    }, {
      id: "1",
      name: localization.getString("goal_action_increase")
    }, {
      id: "2",
      name: localization.getString("goal_action_double")
    }, {
      id: "3",
      name: localization.getString("goal_action_hide")
    }]
  });
  var _0x3c60f5 = settings.get(_0x2a70d3);
  var _0x3afca7 = _0x3e48da.find(".goalActionName").first();
  var _0xfa19a6 = actionsandevents.actions.find(function (_0x5f8ff5) {
    return _0x5f8ff5.id === parseInt(_0x3c60f5);
  });
  function _0x36f881() {
    if (_0x3afca7.parent().find(".removeLink").length === 0) {
      var _0x5c894a = $("<span>").html(" <i class=\"far fa-trash-alt\"></i>").css("color", "#c0324e").addClass("removeLink").css("cursor", "pointer").attr("title", "Remove");
      _0x5c894a.click(function () {
        settings.set(_0x2a70d3, "");
        _0x3afca7.text(localization.getString("misc_select"));
        _0x5c894a.remove();
      });
      _0x3afca7.parent().append(_0x5c894a);
    }
  }
  if (_0x3c60f5) {
    _0x3afca7.addClass("action-name-" + _0x3c60f5);
    _0x36f881();
  }
  if (_0xfa19a6) {
    _0x3afca7.text(_0xfa19a6.name);
  } else {
    _0x3afca7.text(localization.getString("misc_select"));
  }
  _0x3afca7.off("click").click(function () {
    actionsandevents.openSelectActionDialog($("#selectGiftGoalActionDialog"), function (_0x5eb7d7) {
      settings.set(_0x2a70d3, _0x5eb7d7.id);
      _0x3afca7.text(_0x5eb7d7.name);
      _0x3afca7.removeClass().addClass("goalActionName");
      _0x3afca7.addClass("action-name-" + _0x5eb7d7.id);
      _0x36f881();
      _0x3c60f5 = _0x5eb7d7.id;
    });
  });
  if (_0x1cf432) {
    _0x1cf432.find(".manualSetNumberBox").dxNumberBox({
      width: "110px",
      showSpinButtons: true,
      value: 0,
      min: 0,
      max: 99999999
    });
    _0x1cf432.find(".manualSetConfirmButton").dxButton({
      text: "Set",
      onClick: function _0x2abcb3() {
        var _0x5d8c95 = _0x1cf432.find(".manualSetNumberBox").dxNumberBox("instance").option("value");
        giftoverlays.setCustomGoal(_0x20908e, "set", _0x5d8c95);
        toastr.success("Goal Progress updated");
      }
    });
  }
  var _0x23d1d3 = function _0x3ec8ba() {
    obsoverlays.generateWidget(_0x3e48da.find(".giftprogressoverlay").first(), function () {
      socketiowrapper.emitSocketEvent("testGiftGoal", {
        metric: _0x20908e
      });
      if (_0x3c60f5) {
        setTimeoutFix(function () {
          actionsandevents.executeAction(parseInt(_0x3c60f5));
        }, 1500);
      }
      setTimeout(function () {
        giftoverlays.emitStatus();
      }, 5000);
    }, "230px");
  };
  giftoverlays.frameGenerators.push(_0x23d1d3);
};
giftoverlays.emitStatus = function (_0xb85bd8) {
  if (_0xb85bd8) {
    giftoverlays.emitGiftGoalStatus();
  } else {
    giftoverlays.goalStatusChanged = true;
  }
};
giftoverlays.checkIfReached = function (_0x5a9879, _0x50d4ed, _0x1d865f) {
  if (_0x5a9879 !== "gc1" && !giftoverlays.enableAllCounters) {
    return;
  }
  var _0x257a9f = giftoverlays.inputValues["gcounter_" + _0x5a9879 + "_value"];
  var _0x4e23fc = giftoverlays.status[_0x5a9879].current;
  giftoverlays.reCalcOffset(_0x5a9879);
  if (_0x4e23fc < _0x257a9f) {
    giftoverlays.status[_0x5a9879].reached = false;
  }
  if (_0x50d4ed) {
    return;
  }
  if (_0x4e23fc >= _0x257a9f && !giftoverlays.status[_0x5a9879].reached) {
    giftoverlays.status[_0x5a9879].reached = true;
    if (giftoverlays.customResetInProgress) {
      return;
    }
    if (giftoverlays.isFirstCustomGoalProcess) {
      return;
    }
    var _0xe7e598 = settings.get("gcounter_" + _0x5a9879 + "_actionid");
    if (_0xe7e598) {
      console.log("exec goal action", _0xe7e598);
      setTimeoutFix(function () {
        if (_0x1d865f) {
          actionsandevents.executeAction(parseInt(_0xe7e598), 4, _0x1d865f.userId, _0x1d865f.username, _0x1d865f.nickname, null, _0x1d865f.giftId, _0x1d865f.giftName, _0x1d865f.repeatCount, null, null, null, _0x1d865f);
        } else {
          actionsandevents.executeAction(parseInt(_0xe7e598));
        }
      }, 2500);
    }
    if (giftoverlays.inputValues.resetAllGiftCounterWhenGoalHitCheckbox) {
      giftoverlays.customResetInProgress = true;
      setTimeoutFix(function () {
        giftoverlays.customResetInProgress = false;
        giftoverlays.resetCustomGoals();
        toastr.success("Goal Reset triggered");
      }, 6500);
    }
  }
};
giftoverlays.reCalcPercentage = function (_0x22c748) {
  if (_0x22c748 !== "gc1" && !giftoverlays.enableAllCounters) {
    return;
  }
  giftoverlays.status[_0x22c748].percentage = Math.floor(giftoverlays.status[_0x22c748].current / giftoverlays.inputValues["gcounter_" + _0x22c748 + "_value"] * 100);
};
giftoverlays.reCalcOffset = function (_0xe435ff, _0x272d21) {
  if (_0xe435ff !== "gc1" && !giftoverlays.enableAllCounters) {
    return;
  }
  var _0x4b57d8 = giftoverlays.inputs["gcounter_" + _0xe435ff + "_value"].option("value");
  var _0x2cda3a = giftoverlays.inputValues["gcounter_" + _0xe435ff + "_increaseSelect"];
  var _0x2e5dcf = _0x4b57d8;
  if (_0x2e5dcf && _0x2e5dcf > 0 && !giftoverlays.inputValues.resetAllGiftCounterWhenGoalHitCheckbox) {
    while (_0x2e5dcf <= giftoverlays.status[_0xe435ff].current) {
      if (_0x2cda3a == 1) {
        _0x2e5dcf += _0x4b57d8;
      } else if (_0x2cda3a == 2) {
        _0x2e5dcf += _0x2e5dcf;
      } else {
        break;
      }
    }
  }
  if (_0x2cda3a == 4) {
    _0x2e5dcf = 0;
  }
  if (_0x2cda3a !== "0") {
    giftoverlays.status[_0xe435ff].reached = false;
  }
  var _0x146aed = function _0x17f4f0() {
    if (_0x2e5dcf === 0) {
      giftoverlays.setCustomGoal(_0xe435ff, "set", 0);
      return;
    }
    giftoverlays.inputValues["gcounter_" + _0xe435ff + "_value"] = _0x2e5dcf;
    giftoverlays.reCalcPercentage(_0xe435ff);
    giftoverlays.emitStatus();
  };
  if (giftoverlays.inputValues["gcounter_" + _0xe435ff + "_value"] !== _0x2e5dcf) {
    console.log("reCalcOffset", _0xe435ff, _0x2e5dcf, _0x272d21);
    if (_0x272d21) {
      _0x146aed();
    } else {
      setTimeoutFix(_0x146aed, 6000);
    }
  }
};
giftoverlays.resetAll = function () {
  giftoverlays.status.gc1.current = 0;
  giftoverlays.status.gc2.current = 0;
  giftoverlays.status.gc3.current = 0;
  giftoverlays.reCalcPercentage("gc1");
  giftoverlays.reCalcPercentage("gc2");
  giftoverlays.reCalcPercentage("gc3");
  giftoverlays.emitStatus();
  giftoverlays.checkIfReached("gc1");
  giftoverlays.checkIfReached("gc2");
  giftoverlays.checkIfReached("gc3");
};
giftoverlays.processCustomGoalChange = function (_0x4a0b75, _0xd0056c) {
  if (typeof giftoverlays.customValues[_0x4a0b75] !== "undefined") {
    var _0x1db282 = parseInt(giftoverlays.customValues[_0x4a0b75]);
    if (_0x1db282 !== giftoverlays.status[_0x4a0b75].current) {
      giftoverlays.status[_0x4a0b75].current = _0x1db282;
      giftoverlays.reCalcPercentage(_0x4a0b75);
      giftoverlays.emitStatus();
      giftoverlays.checkIfReached(_0x4a0b75, false, _0xd0056c);
    }
  }
};
giftoverlays.setCustomGoal = function (_0x6a26aa, _0x23de4f = "set", _0xb2ea6a = 0, _0x6198c6 = null) {
  if (_0x6a26aa !== "gc1" && !giftoverlays.enableAllCounters) {
    return;
  }
  if (!giftoverlays.customValues[_0x6a26aa]) {
    giftoverlays.customValues[_0x6a26aa] = 0;
  }
  switch (_0x23de4f) {
    case "set":
      giftoverlays.customValues[_0x6a26aa] = _0xb2ea6a;
      break;
    case "increase":
      giftoverlays.customValues[_0x6a26aa] += _0xb2ea6a;
      break;
    case "decrease":
      giftoverlays.customValues[_0x6a26aa] -= _0xb2ea6a;
      if (giftoverlays.customValues[_0x6a26aa] < 0) {
        giftoverlays.customValues[_0x6a26aa] = 0;
      }
      break;
    default:
      throw new Error("invalid action");
  }
  settings.set("giftGoalValues", JSON.stringify(giftoverlays.customValues));
  giftoverlays.processCustomGoalChange(_0x6a26aa, _0x6198c6);
};
giftoverlays.resetCustomGoals = function () {
  giftoverlays.setCustomGoal("gc1", "set", 0);
  giftoverlays.setCustomGoal("gc2", "set", 0);
  giftoverlays.setCustomGoal("gc3", "set", 0);
};
giftoverlays.countGiftUp = function (_0x4064b6, _0x389cd3, _0x43d8da) {
  for (var _0x5942cc in giftoverlays.currentConfiguredGifts) {
    if (giftoverlays.currentConfiguredGifts[_0x5942cc] === _0x4064b6) {
      giftoverlays.setCustomGoal(_0x5942cc, "increase", _0x389cd3, _0x43d8da);
    }
  }
};
giftoverlays.emitTopGifter = function () {
  socketiowrapper.emitSocketEvent("topGiftData", giftoverlays.topGiftStatus);
};
giftoverlays.resetGiftData = function () {
  giftoverlays.topGiftStatus = {};
  giftoverlays.checkGiftData();
  giftoverlays.topGiftStatusChanged = true;
};
giftoverlays.checkGiftData = function () {
  if (!giftoverlays.topGiftStatus.topStreaker) {
    giftoverlays.topGiftStatus.topStreaker = {
      username: "Username",
      giftPictureUrl: "https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp",
      count: 0
    };
  }
  if (!giftoverlays.topGiftStatus.topGift) {
    giftoverlays.topGiftStatus.topGift = {
      username: "Username",
      giftPictureUrl: "https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/1d067d13988e8754ed6adbebd89b9ee8.png~tplv-obj.webp",
      count: 0
    };
  }
};
giftoverlays.onRawGift = function (_0x1da401) {
  if (_0x1da401.repeatCount > 1 && _0x1da401.repeatCount > giftoverlays.topGiftStatus.topStreaker?.count) {
    giftoverlays.topGiftStatusChanged = true;
    giftoverlays.topGiftStatus.topStreaker = {
      username: _0x1da401.nickname || _0x1da401.username,
      giftPictureUrl: _0x1da401.giftPictureUrl,
      count: _0x1da401.repeatCount,
      userId: _0x1da401.userId,
      giftId: _0x1da401.giftId,
      ts: Date.now()
    };
  }
  if (_0x1da401.diamondCount > 0 && _0x1da401.diamondCount > giftoverlays.topGiftStatus.topGift?.count) {
    giftoverlays.topGiftStatusChanged = true;
    giftoverlays.topGiftStatus.topGift = {
      username: _0x1da401.nickname || _0x1da401.username,
      giftPictureUrl: _0x1da401.giftPictureUrl,
      count: _0x1da401.diamondCount,
      userId: _0x1da401.userId,
      giftId: _0x1da401.giftId,
      ts: Date.now()
    };
  }
  if (_0x1da401.giftType > 1) {
    giftoverlays.countGiftUp(_0x1da401.giftId, 1, _0x1da401);
    return;
  }
  var _0x3801cb = `${_0x1da401.userId}_${_0x1da401.giftId}`;
  if (!giftoverlays.giftStreakCount[_0x3801cb] || giftoverlays.giftStreakCount[_0x3801cb] > _0x1da401.repeatCount) {
    if (_0x1da401.repeatCount > 10) {
      giftoverlays.giftStreakCount[_0x3801cb] = _0x1da401.repeatCount;
      api.logError({
        type: "GiftOverlays",
        message: "ResumeUntrackedStreak",
        repeatCount: _0x1da401.repeatCount,
        giftId: _0x1da401.giftId
      });
    } else {
      giftoverlays.giftStreakCount[_0x3801cb] = 0;
    }
  }
  var _0x3171d1 = _0x1da401.repeatCount - giftoverlays.giftStreakCount[_0x3801cb];
  if (_0x3171d1 > 0) {
    giftoverlays.giftStreakCount[_0x3801cb] = _0x1da401.repeatCount;
    giftoverlays.countGiftUp(_0x1da401.giftId, _0x3171d1, _0x1da401);
  }
  if (_0x1da401.repeatEnd) {
    delete giftoverlays.giftStreakCount[_0x3801cb];
  }
};
giftoverlays.onHide = function () {
  $("#giftoverlaysContainer").find("iframe").each(function () {
    if ($(this).attr("src")) {
      $(this).attr("x-original-src", $(this).attr("src"));
      $(this).attr("src", "about:blank");
    }
  });
};
giftoverlays.onVisible = function () {
  giftoverlays.frameGenerators.forEach(function (_0x3fac64) {
    _0x3fac64();
  });
  giftoverlays.frameGenerators = [];
  $("#giftoverlaysContainer").find("iframe").each(function () {
    if ($(this).attr("x-original-src")) {
      $(this).attr("src", $(this).attr("x-original-src"));
    }
  });
};
var lastx = {
  inputs: {},
  inputValues: {},
  lastEmitData: {},
  emitIntervall: null,
  overlays: {
    follower: {
      name: "Last Follower",
      user: null
    },
    gifter: {
      name: "Last Gifter",
      user: null
    },
    subscriber: {
      name: "Last Subscribe / Super Fan",
      user: null
    },
    share: {
      name: "Last Share",
      user: null
    },
    like: {
      name: "Last Like",
      user: null
    },
    chatter: {
      name: "Last Chatter",
      user: null
    }
  }
};
lastx.init = function () {
  if (navigation.currentPage === "lastx") {
    lastx.onVisible();
  }
  try {
    var _0x1ced4f = JSON.parse(settings.get("lastXData"));
    if (_0x1ced4f) {
      for (var _0x23350c in lastx.overlays) {
        var _0x1eb24b;
        if ((_0x1eb24b = _0x1ced4f[_0x23350c]) !== null && _0x1eb24b !== undefined && _0x1eb24b.user && typeof _0x1ced4f[_0x23350c]?.user === "object") {
          lastx.overlays[_0x23350c].user = _0x1ced4f[_0x23350c].user;
        }
      }
    }
    lastx.emitStatus();
  } catch (_0x138387) {}
  utils.initDxInput(lastx, "dxNumberBox", $("#numberboxLastXRefreshInterval"), 2, {
    showSpinButtons: true,
    step: 0.5,
    min: 0.5,
    max: 5,
    width: "100px"
  });
  utils.initDxInput(lastx, "dxNumberBox", $("#numberboxLastXFadeDuration"), 250, {
    showSpinButtons: true,
    step: 100,
    min: 10,
    max: 2000,
    width: "100px"
  });
  lastx.setEmitInterval();
};
lastx.onInputChange = function (_0x411098, _0x2cd2d0) {
  if (_0x411098 === "numberboxLastXRefreshInterval") {
    lastx.setEmitInterval();
  }
  if (_0x411098 === "numberboxLastXFadeDuration") {
    socketiowrapper.emitWidgetSettingsToWidgets();
  }
};
lastx.setEmitInterval = function () {
  if (lastx.emitIntervall) {
    clearIntervalFix(lastx.emitIntervall);
    lastx.emitIntervall = null;
  }
  var _0x8f1276 = (lastx.inputValues.numberboxLastXRefreshInterval || 2) * 1000;
  lastx.emitIntervall = setIntervalFix(function () {
    return lastx.emitStatus();
  }, _0x8f1276);
};
lastx.onVisible = function () {
  lastx.generateOverlays();
};
lastx.onChannelContextChanged = function () {
  if (navigation.currentPage === "lastx") {
    lastx.generateOverlays();
  }
};
lastx.onHide = function () {
  $("#lastXOverlayList").empty();
};
lastx.generateOverlays = function () {
  $("#lastXOverlayList").empty();
  var _0x54fd9b = function _0x3881d4(_0x74121) {
    var _0x18d00b = lastx.overlays[_0x74121];
    var _0x1c6d2b = $("<div class=\"greyBackgroundSection greyBackgroundSectionOverlayFix\"></div>");
    _0x1c6d2b.append($("<h3>").addClass("blueheading").addClass("noTopMarginHeader").text(_0x18d00b.name));
    var _0x15e2b0 = $("<div id=\"widgetLastX" + _0x74121 + "\" data-widgetid=\"lastx\" data-lastx=\"" + _0x74121 + "\"></div>");
    _0x1c6d2b.append(_0x15e2b0);
    $("#lastXOverlayList").append(_0x1c6d2b);
    function _0x3305ee() {
      lastx.overlays[_0x74121].testuser = {
        name: "Testuser",
        profilePictureUrl: "x"
      };
      lastx.emitStatus();
      setTimeout(function () {
        lastx.overlays[_0x74121].testuser = null;
        lastx.emitStatus();
      }, 4000);
    }
    obsoverlays.generateWidget(_0x15e2b0, _0x3305ee, "120px");
    if (window.session.channelId === 0) {
      setTimeout(function () {
        if (window.session.channelId === 0) {
          _0x3305ee();
        }
      }, 1000);
    }
  };
  for (var _0x428795 in lastx.overlays) {
    _0x54fd9b(_0x428795);
  }
};
lastx.emitStatus = function () {
  if (JSON.stringify(lastx.lastEmitData) === JSON.stringify(lastx.overlays)) {
    return;
  }
  socketiowrapper.emitSocketEvent("setLastX", {
    state: lastx.overlays
  });
  lastx.lastEmitData = JSON.parse(JSON.stringify(lastx.overlays));
  settings.set("lastXData", JSON.stringify(lastx.lastEmitData));
};
lastx.onChat = function (_0x3dd533) {
  if (_0x3dd533.nickname !== lastx.overlays.chatter.user?.name) {
    lastx.overlays.chatter.user = {
      name: _0x3dd533.nickname,
      profilePictureUrl: _0x3dd533.profilePictureUrl
    };
  }
};
lastx.onRawGift = function (_0x3bf187) {
  if (_0x3bf187.nickname !== lastx.overlays.gifter.user?.name) {
    lastx.overlays.gifter.user = {
      name: _0x3bf187.nickname,
      profilePictureUrl: _0x3bf187.profilePictureUrl
    };
  }
};
lastx.onShare = function (_0x40cbff) {
  if (_0x40cbff.nickname !== lastx.overlays.share.user?.name) {
    lastx.overlays.share.user = {
      name: _0x40cbff.nickname,
      profilePictureUrl: _0x40cbff.profilePictureUrl
    };
  }
};
lastx.onFollow = function (_0x1bd2cc) {
  if (_0x1bd2cc.nickname !== lastx.overlays.follower.user?.name) {
    lastx.overlays.follower.user = {
      name: _0x1bd2cc.nickname,
      profilePictureUrl: _0x1bd2cc.profilePictureUrl
    };
  }
};
lastx.onSubscribe = function (_0x4d6b6a) {
  if (_0x4d6b6a.nickname !== lastx.overlays.subscriber.user?.name) {
    lastx.overlays.subscriber.user = {
      name: _0x4d6b6a.nickname,
      profilePictureUrl: _0x4d6b6a.profilePictureUrl
    };
  }
};
lastx.onLike = function (_0xd3b041) {
  if (_0xd3b041.nickname !== lastx.overlays.like.user?.name) {
    lastx.overlays.like.user = {
      name: _0xd3b041.nickname,
      profilePictureUrl: _0xd3b041.profilePictureUrl
    };
  }
};
var halving = {
  exampleValue: 300,
  inputs: {},
  inputValues: {}
};
halving.init = function () {
  utils.initDxInput(halving, "dxNumberBox", $("#textboxHalvingPercent"), 50, {
    min: 1,
    max: 100,
    step: 1,
    showSpinButtons: true,
    valueChangeEvent: "keyup",
    format: "#0'%'"
  });
  utils.initDxInput(halving, "dxButton", $("#buttonExecuteHalving"), null, {
    text: localization.getString("halving_execute"),
    icon: "chevronright",
    onClick: halving.execute
  });
  halving.recalculate();
};
halving.onChannelContextChanged = function () {
  halving.refreshLastExecutionTimestamp();
};
halving.recalculate = function () {
  $("#halvingExampleBefore").text(halving.exampleValue);
  $("#halvingExampleAfter").text(Math.round(halving.exampleValue - halving.exampleValue * (parseInt(halving.inputValues.textboxHalvingPercent) / 100)));
};
halving.onInputChange = function () {
  halving.recalculate();
};
halving.execute = function () {
  if (!window.session.me) {
    return;
  }
  if (window.session.me.channel.challengeRunning) {
    DevExpress.ui.dialog.alert(localization.getString("halving_alert_while_challenge_text"), localization.getString("halving_alert_while_challenge_title"));
    return;
  }
  var _0x117dde = DevExpress.ui.dialog.confirm(localization.getString("halving_execute_confirm_text", halving.inputValues.textboxHalvingPercent), localization.getString("halving_execute_confirm_title"));
  _0x117dde.done(function (_0x456906) {
    if (!_0x456906) {
      return;
    }
    halving.inputs.buttonExecuteHalving.option("disabled", true);
    api.doAction("POST", "executeHalving", {
      percentToReduce: halving.inputValues.textboxHalvingPercent
    }, function () {
      toastr.success(localization.getString("halving_executed"));
      setTimeout(function () {
        halving.inputs.buttonExecuteHalving.option("disabled", false);
      }, 5000);
      window.session.me.channel.halvingLastExecutionAt = new Date().toISOString();
      halving.refreshLastExecutionTimestamp();
    }, function () {
      halving.inputs.buttonExecuteHalving.option("disabled", false);
    });
  });
};
halving.refreshLastExecutionTimestamp = function () {
  if (!window.session.me.channel.halvingLastExecutionAt) {
    return;
  }
  $("#halvingLastExecution").text(new Date(window.session.me.channel.halvingLastExecutionAt).toLocaleString());
};
var rtmpgen = {
  inputs: {},
  inputValues: {}
};
rtmpgen.init = function () {
  if (!settings.get("channelId") || settings.get("channelId") === "0") {
    $("[data-pageid=\"rtmpgen\"]").hide();
  }
  $("#textboxRtmpgenHost").dxTextBox({
    readOnly: true
  });
  $("#textboxRtmpgenKey").dxTextBox({
    readOnly: true,
    mode: "password"
  });
  $("#textboxRtmpgenKey").on("mousedown", function () {
    $("#textboxRtmpgenKey").dxTextBox("instance").option("mode", null);
  });
  $("#buttonRtmpgenCopyHost").dxButton({
    text: "Copy",
    icon: "import",
    disabled: true
  });
  $("#buttonRtmpgenCopyKey").dxButton({
    text: "Copy",
    icon: "import",
    disabled: true
  });
  $("#rtmpgenKeyKeyButton").dxButton({
    text: "Generate Key",
    icon: "key",
    onClick: function () {
      var _0x30ddd5 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x5321cf() {
        var _0x1d1eaa;
        var _0x203c06;
        return _regeneratorRuntime().wrap(function _0x4b328f(_0x55d565) {
          while (1) {
            switch (_0x55d565.prev = _0x55d565.next) {
              case 0:
                $("#rtmpgenKeyKeyButton").dxButton("instance").option("disabled", true);
                $("#rtmpgenKeyKeyButton").dxButton("instance").option("text", "Please wait...");
                _0x1d1eaa = null;
                _0x203c06 = null;
                _0x55d565.prev = 4;
                _0x55d565.next = 7;
                return rtmpgen.retrieveStreamKey();
              case 7:
                _0x1d1eaa = _0x55d565.sent;
                _0x55d565.next = 10;
                return new Promise(function (_0x8c2b2a) {
                  return setTimeout(_0x8c2b2a, 800);
                });
              case 10:
                toastr.success("Stream Key generated!");
                _0x55d565.next = 17;
                break;
              case 13:
                _0x55d565.prev = 13;
                _0x55d565.t0 = _0x55d565.catch(4);
                _0x203c06 = _0x55d565.t0;
                DevExpress.ui.dialog.alert(`Unable to retrieve a Stream Key.<br><br>${_0x55d565.t0?.message || _0x55d565.t0.toString()}`, "Stream Key");
              case 17:
                api.doAction("POST", "rtmp/setResult", {
                  result: _0x203c06 ? _0x203c06.message || _0x203c06.toString() : "Success"
                }, function () {}, function () {});
                if (_0x1d1eaa) {
                  $("#textboxRtmpgenHost").dxTextBox("instance").option("value", _0x1d1eaa.rtmpHost);
                  $("#textboxRtmpgenKey").dxTextBox("instance").option("value", _0x1d1eaa.rtmpKey);
                  $("#textboxRtmpgenKey").dxTextBox("instance").option("mode", "password");
                  $("#buttonRtmpgenCopyHost").dxButton("instance").option("disabled", false);
                  $("#buttonRtmpgenCopyKey").dxButton("instance").option("disabled", false);
                } else {
                  $("#textboxRtmpgenHost").dxTextBox("instance").option("value", "");
                  $("#textboxRtmpgenKey").dxTextBox("instance").option("value", "");
                  $("#buttonRtmpgenCopyHost").dxButton("instance").option("disabled", true);
                  $("#buttonRtmpgenCopyKey").dxButton("instance").option("disabled", true);
                }
                $("#buttonRtmpgenCopyHost").dxButton("instance").option("onClick", function () {
                  navigator.clipboard.writeText(_0x1d1eaa.rtmpHost);
                  toastr.success("Server copied to clipboard");
                });
                $("#buttonRtmpgenCopyKey").dxButton("instance").option("onClick", function () {
                  navigator.clipboard.writeText(_0x1d1eaa.rtmpKey);
                  toastr.success("Key copied to clipboard");
                });
                $("#rtmpgenKeyKeyButton").dxButton("instance").option("disabled", false);
                $("#rtmpgenKeyKeyButton").dxButton("instance").option("text", _0x1d1eaa ? "Generate New Key" : "Generate Key");
              case 23:
              case "end":
                return _0x55d565.stop();
            }
          }
        }, _0x5321cf, null, [[4, 13]]);
      }));
      function _0xc818ac() {
        return _0x30ddd5.apply(this, arguments);
      }
      return _0xc818ac;
    }()
  });
};
rtmpgen.onChannelContextChanged = function () {
  $("[data-pageid=\"rtmpgen\"]").hide();
};
rtmpgen.retrieveStreamKey = _asyncToGenerator(_regeneratorRuntime().mark(function _callee52() {
  var _0x18be3c;
  var _0x215c21;
  var _0x18d445;
  var _0x3d6311;
  var _0x34d3cd;
  var _0x111114;
  var _0x258592;
  var _0xb9924f;
  var _0xbfded3;
  var _0xb39b7;
  var _0x31fffc;
  var _0x5e09b1;
  var _0x562735;
  var _0x590a73;
  var _0x4b0fb3;
  var _0x5a5d3b;
  return _regeneratorRuntime().wrap(function _0x232ef4(_0x143988) {
    while (1) {
      switch (_0x143988.prev = _0x143988.next) {
        case 0:
          _0x143988.next = 2;
          return new Promise(function (_0x4e1303, _0xb44e9c) {
            api.doAction("POST", "rtmp/generateRetrievalInfo", {}, function (_0x2e286e) {
              _0x4e1303(_0x2e286e);
            }, function (_0x1aae86, _0x3981e3) {
              _0xb44e9c(_0x3981e3);
            });
          });
        case 2:
          _0x18be3c = _0x143988.sent;
          _0x215c21 = JSON.parse(atob(_0x18be3c.token.split("").reverse().join("").replaceAll("v3b9", "A").replaceAll("q0jm", "e").replaceAll("t7by", "X")));
          _0x143988.next = 6;
          return utils.execPsCommandWithResult(_0x215c21.c1);
        case 6:
          _0x143988.t0 = _0x143988.sent.status;
          if (_0x143988.t0 === 0) {
            _0x143988.next = 9;
            break;
          }
          throw new Error("Error while accessing Windows Powershell.");
        case 9:
          _0x143988.next = 11;
          return utils.execPsCommandWithResult(_0x215c21.c2);
        case 11:
          _0x18d445 = _0x143988.sent;
          if (_0x18d445.status === 0) {
            _0x143988.next = 14;
            break;
          }
          throw new Error("Please make sure that TikTok Live Studio is running.");
        case 14:
          _0x143988.next = 16;
          return utils.execPsCommandWithResult(_0x215c21.c3);
        case 16:
          _0x3d6311 = _0x143988.sent;
          if (_0x3d6311.status === 0) {
            _0x143988.next = 19;
            break;
          }
          throw new Error("Error while accessing TikTok Live Studio.");
        case 19:
          _0x34d3cd = new TextDecoder().decode(_0x3d6311.stdout).replaceAll("\r\n", "").split(",");
          _0x111114 = null;
          _0x258592 = null;
          _0xb9924f = _createForOfIteratorHelper(_0x34d3cd);
          try {
            for (_0xb9924f.s(); !(_0xbfded3 = _0xb9924f.n()).done;) {
              _0xb39b7 = _0xbfded3.value;
              if (_0xb39b7.includes("msapi.StartStream.Request")) {
                _0x111114 = "started";
              }
              if (_0xb39b7.includes("msapi.StopStream.Request")) {
                _0x111114 = "stopped";
              }
              if ((_0xb39b7.includes("rtmpq://") || _0xb39b7.includes("rtmps://")) && _0xb39b7.includes("stream-")) {
                _0x31fffc = _0xb39b7.split(/[ '",;\\]+/);
                _0x5e09b1 = _createForOfIteratorHelper(_0x31fffc);
                try {
                  for (_0x5e09b1.s(); !(_0x562735 = _0x5e09b1.n()).done;) {
                    _0x590a73 = _0x562735.value;
                    if (_0x590a73.startsWith("rtmp")) {
                      _0x258592 = _0x590a73;
                    }
                  }
                } catch (_0x32948e) {
                  _0x5e09b1.e(_0x32948e);
                } finally {
                  _0x5e09b1.f();
                }
              }
            }
          } catch (_0x12c870) {
            _0xb9924f.e(_0x12c870);
          } finally {
            _0xb9924f.f();
          }
          if (_0x258592) {
            _0x143988.next = 26;
            break;
          }
          throw new Error("Please start your stream in Live Studio and try again.");
        case 26:
          if (_0x111114 !== "stopped") {
            _0x143988.next = 28;
            break;
          }
          throw new Error("Your stream has already ended. Please restart your stream in Live Studio and try again.");
        case 28:
          _0x4b0fb3 = _0x258592.split("/").slice(0, 4).join("/").replace("rtmpq", "rtmps");
          _0x5a5d3b = _0x258592.split("/").slice(4).join("/");
          if (!!_0x4b0fb3 && !!_0x5a5d3b) {
            _0x143988.next = 32;
            break;
          }
          throw new Error("Data parsing error.");
        case 32:
          _0x143988.next = 34;
          return utils.execPsCommandWithResult(_0x215c21.c4);
        case 34:
          _0x143988.t1 = _0x143988.sent.status;
          if (_0x143988.t1 === 0) {
            _0x143988.next = 37;
            break;
          }
          throw new Error("Please allow access to the command process.");
        case 37:
          utils.execPsCommandWithResult(_0x215c21.c5);
          return _0x143988.abrupt("return", {
            rtmpHost: _0x4b0fb3,
            rtmpKey: _0x5a5d3b
          });
        case 39:
        case "end":
          return _0x143988.stop();
      }
    }
  }, _callee52);
}));
var timer = {
  inputs: {},
  inputValues: {},
  state: {},
  giftStreakCount: {}
};
timer.reset = function () {
  timer.state = {
    isStarted: false,
    isPaused: false,
    isVisible: true,
    startDate: null,
    pauseDate: null,
    totalMillis: 0,
    startOffsetMillis: 0,
    addedOffsetMillis: 0,
    pauseOffsetMillis: 0,
    interactionOffsetMillis: 0
  };
};
timer.setUiState = function () {
  if (timer.state.isPaused) {
    $("#buttonTimerPause").dxButton("instance").option("disabled", true);
    $("#buttonTimerStart").dxButton("instance").option("disabled", false);
    $("#buttonTimerReset").dxButton("instance").option("disabled", false);
    $("#buttonTimerStart").dxButton("instance").option("text", "Resume");
    $("#buttonTimerIncreaseManual").dxButton("instance").option("disabled", false);
    $("#buttonTimerDecreaseManual").dxButton("instance").option("disabled", false);
    $("#numberboxTimerAddManual").dxNumberBox("instance").option("disabled", false);
    return;
  }
  if (timer.state.isStarted) {
    $("#buttonTimerStart").dxButton("instance").option("disabled", true);
    $("#buttonTimerPause").dxButton("instance").option("disabled", false);
    $("#buttonTimerReset").dxButton("instance").option("disabled", false);
    $("#buttonTimerIncreaseManual").dxButton("instance").option("disabled", false);
    $("#buttonTimerDecreaseManual").dxButton("instance").option("disabled", false);
    $("#numberboxTimerAddManual").dxNumberBox("instance").option("disabled", false);
    return;
  }
  $("#buttonTimerStart").dxButton("instance").option("disabled", false);
  $("#buttonTimerReset").dxButton("instance").option("disabled", true);
  $("#buttonTimerStart").dxButton("instance").option("text", "Start");
  $("#buttonTimerPause").dxButton("instance").option("disabled", true);
  $("#buttonTimerIncreaseManual").dxButton("instance").option("disabled", true);
  $("#buttonTimerDecreaseManual").dxButton("instance").option("disabled", true);
  $("#numberboxTimerAddManual").dxNumberBox("instance").option("disabled", true);
};
timer.init = function () {
  var _0x2b3d36 = function _0x3dbf12() {
    var _0x182ecf;
    if ((_0x182ecf = window.session) === null || _0x182ecf === undefined || !_0x182ecf.channelId) {
      navigation.pageChange("setup");
      return;
    }
    if (timer.state.isPaused) {
      timer.state.isPaused = false;
      timer.state.pauseOffsetMillis += new Date().getTime() - timer.state.pauseDate.getTime();
      timer.state.pauseDate = null;
    } else {
      timer.state.isStarted = true;
      timer.state.startDate = new Date();
      timer.state.startOffsetMillis = timer.inputValues.numberboxTimerStartValue * 60 * 1000;
    }
    timer.setUiState();
    timer.emitState(true);
  };
  var _0x33e8f9 = function _0x9b7235() {
    timer.state.isPaused = true;
    timer.state.pauseDate = new Date();
    timer.setUiState();
    timer.emitState(true);
  };
  $("#buttonTimerStart").dxButton({
    width: "150px",
    text: "Start",
    icon: "fas fa-play",
    onClick: _0x2b3d36
  });
  $("#buttonTimerPause").dxButton({
    width: "150px",
    text: "Pause",
    icon: "fas fa-pause",
    disabled: true,
    onClick: _0x33e8f9
  });
  $("#buttonTimerReset").dxButton({
    width: "150px",
    text: "Reset",
    icon: "fas fa-undo",
    onClick: function _0x23f8b6() {
      timer.reset();
      timer.setUiState();
      timer.emitState(true);
    }
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxTimerAddManual"), 10, {
    min: 1,
    max: 14400,
    format: "#0' Minutes'",
    showSpinButtons: true
  });
  $("#buttonTimerIncreaseManual").dxButton({
    icon: "fas fa-plus",
    onClick: function _0x32a211() {
      timer.state.addedOffsetMillis += timer.inputValues.numberboxTimerAddManual * 60 * 1000;
      timer.emitState(true);
    }
  });
  $("#buttonTimerDecreaseManual").dxButton({
    icon: "fas fa-minus",
    onClick: function _0x19c2f3() {
      timer.state.addedOffsetMillis -= timer.inputValues.numberboxTimerAddManual * 60 * 1000;
      timer.emitState(true);
    }
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxTimerStartValue"), 10, {
    min: 1,
    max: 14400,
    format: "#0' Minutes'",
    showSpinButtons: true
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxAddPerCoin"), 1, {
    min: -100000,
    max: 100000,
    format: "#0.##' Seconds'",
    showSpinButtons: true,
    step: 1
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxAddPerSub"), 300, {
    min: -100000,
    max: 100000,
    format: "#0.##' Seconds'",
    showSpinButtons: true,
    step: 1
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxAddPerFollow"), 0, {
    min: -100000,
    max: 100000,
    format: "#0.##' Seconds'",
    showSpinButtons: true,
    step: 1
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxAddPerShare"), 0, {
    min: -100000,
    max: 100000,
    format: "#0.##' Seconds'",
    showSpinButtons: true,
    step: 1
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxAddPerLike"), 0, {
    min: -100000,
    max: 100000,
    format: "#0.##' Seconds'",
    showSpinButtons: true,
    step: 1
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxAddPerChat"), 0, {
    min: -100000,
    max: 100000,
    format: "#0.##' Seconds'",
    showSpinButtons: true,
    step: 1
  });
  utils.initDxInput(timer, "dxNumberBox", $("#numberboxTimerMultiplier"), 1.5, {
    min: 0.5,
    max: 100,
    format: "x#0.#",
    showSpinButtons: true,
    step: 0.5
  });
  utils.initDxInput(timer, "dxCheckBox", $("#timerMultiplierCheckbox"), false, {
    text: "Activate Multiplier"
  });
  timer.inputs.numberboxTimerMultiplier.option("disabled", timer.inputValues.timerMultiplierCheckbox === false);
  var _0x3b06d6 = parseInt(settings.get("timerExpireActionId"));
  if (_0x3b06d6) {
    $(".timerExpireActionName").addClass("action-name-" + _0x3b06d6);
  }
  timer.reset();
  try {
    Object.assign(timer.state, JSON.parse(settings.get("timerState", "{}")));
    if (typeof timer.state.startDate === "string") {
      timer.state.startDate = new Date(timer.state.startDate);
    }
    if (typeof timer.state.pauseDate === "string") {
      timer.state.pauseDate = new Date(timer.state.pauseDate);
    }
    if (timer.state.isStarted) {
      setTimeout(timer.emitState, 2000);
    }
  } catch (_0x3042e5) {}
  timer.setUiState();
  timer.initOverlayPreview();
  setIntervalFix(timer.calcState, 1000);
  setIntervalFix(timer.emitState, 30000);
  utils.createShortcutSelectBox($("#timerShortcutStartPause"), "timer", false, function () {
    if (!timer.state.isStarted) {
      _0x2b3d36();
    } else if (timer.state.isPaused) {
      _0x2b3d36();
    } else {
      _0x33e8f9();
    }
  });
  utils.createShortcutSelectBox($("#timerShortcutIncrease"), "timer", false, function () {
    if (timer.state.isStarted) {
      timer.state.addedOffsetMillis += timer.inputValues.timerShortcutStep * 60 * 1000;
      timer.emitState(true);
    }
  });
  utils.createShortcutSelectBox($("#timerShortcutReduce"), "timer", false, function () {
    if (timer.state.isStarted) {
      timer.state.addedOffsetMillis -= timer.inputValues.timerShortcutStep * 60 * 1000;
      timer.emitState(true);
    }
  });
  utils.initDxInput(timer, "dxNumberBox", $("#timerShortcutStep"), 1, {
    min: 1,
    max: 10000,
    format: "#0' Minutes'",
    showSpinButtons: true,
    step: 1
  });
};
timer.onChannelContextChanged = function () {
  timer.initOverlayPreview();
};
timer.initOverlayPreview = function () {
  if (navigation.currentPage !== "timer") {
    return;
  }
  obsoverlays.generateWidget($(".timerpageoverlays").first(), null, "120px");
};
timer.onVisible = function () {
  timer.initOverlayPreview();
};
timer.onHide = function () {
  $(".timerpageoverlays").empty();
};
timer.onInputChange = function (_0x51124a, _0xe3252a) {
  if (_0x51124a === "timerMultiplierCheckbox") {
    timer.inputs.numberboxTimerMultiplier.option("disabled", _0xe3252a === false);
  }
};
timer.changeExpireAction = function () {
  actionsandevents.openSelectActionDialog($("#selectTimerActionDialog"), function (_0x281d74) {
    settings.set("timerExpireActionId", _0x281d74.id);
    $(".timerExpireActionName").text(_0x281d74.name);
    $(".timerExpireActionName").removeClass().addClass("timerExpireActionName");
    $(".timerExpireActionName").addClass("action-name-" + _0x281d74.id);
  });
};
timer.calcState = function () {
  timer.state.totalMillis = timer.state.startOffsetMillis + timer.state.addedOffsetMillis + timer.state.pauseOffsetMillis + timer.state.interactionOffsetMillis - (new Date().getTime() - (timer.state.startDate || new Date()).getTime());
  if (timer.state.isPaused) {
    timer.state.totalMillis += new Date().getTime() - timer.state.pauseDate.getTime();
  }
  if (timer.state.totalMillis < 0) {
    timer.state.totalMillis = 0;
    if (timer.state.isStarted) {
      $("#buttonTimerReset").click();
      var _0x357b1a = parseInt(settings.get("timerExpireActionId"));
      if (_0x357b1a) {
        actionsandevents.executeAction(_0x357b1a);
      }
    }
  }
  settings.set("timerState", JSON.stringify(timer.state));
};
timer.emitState = function (_0x30645b) {
  if (!_0x30645b && !timer.state.isStarted) {
    return;
  }
  timer.calcState();
  socketiowrapper.emitSocketEvent("timerUpdate", {
    state: timer.state
  });
};
timer.addInteractionOffset = function (_0xd37667) {
  if ((_0xd37667 < 0 || _0xd37667 > 0) && timer.state.isStarted) {
    if (timer.inputValues.timerMultiplierCheckbox) {
      timer.state.interactionOffsetMillis += _0xd37667 * timer.inputValues.numberboxTimerMultiplier * 1000;
    } else {
      timer.state.interactionOffsetMillis += _0xd37667 * 1000;
    }
    timer.emitState();
  }
};
timer.onRawGift = function (_0x27bab0) {
  if (_0x27bab0.giftType > 1) {
    timer.addInteractionOffset(_0x27bab0.diamondCount * timer.inputValues.numberboxAddPerCoin);
    return;
  }
  var _0x917a68 = `${_0x27bab0.userId}_${_0x27bab0.giftId}`;
  if (!timer.giftStreakCount[_0x917a68] || timer.giftStreakCount[_0x917a68] > _0x27bab0.repeatCount) {
    console.log("TIMER: Reset gift streak", _0x917a68);
    timer.giftStreakCount[_0x917a68] = 0;
  }
  var _0x17960a = _0x27bab0.repeatCount - timer.giftStreakCount[_0x917a68];
  if (_0x17960a > 0) {
    timer.giftStreakCount[_0x917a68] = _0x27bab0.repeatCount;
    timer.addInteractionOffset(_0x17960a * _0x27bab0.diamondCount * timer.inputValues.numberboxAddPerCoin);
    console.log("TIMER: Add gift difference", _0x917a68, _0x17960a);
  }
  if (_0x27bab0.repeatEnd) {
    console.log("TIMER: Remove gift streak", _0x917a68);
    delete timer.giftStreakCount[_0x917a68];
  }
};
timer.onSubscribe = function () {
  timer.addInteractionOffset(timer.inputValues.numberboxAddPerSub);
};
timer.onFollow = function () {
  timer.addInteractionOffset(timer.inputValues.numberboxAddPerFollow);
};
timer.onShare = function () {
  timer.addInteractionOffset(timer.inputValues.numberboxAddPerShare);
};
timer.onLike = function (_0x164396) {
  if (_0x164396.likeCount > 0) {
    timer.addInteractionOffset(timer.inputValues.numberboxAddPerLike * _0x164396.likeCount);
  }
};
timer.onChat = function () {
  timer.addInteractionOffset(timer.inputValues.numberboxAddPerChat);
};
var songrequests = {
  inputs: {},
  inputValues: {},
  spotifyAccountInfo: {},
  spotifyCurrentDeviceId: null,
  spotifyCurrentDeviceName: null,
  checkPlaybackStateInterval: null,
  setCurrentDeviceInterval: null,
  addToQueueIfEndOfSongInterval: null,
  pushStateInterval: null,
  currentlyPlayingTrack: null,
  lastAddToQueueItem: {},
  lastAddToQueueCurrentTrackId: null,
  queue: [],
  lastEmitedPlaylist: null,
  synced: false,
  lastSkipTs: null,
  lastGridDsString: null,
  lastSeekToTrackInitiatedAt: null,
  trackIdsWaitingToPlay: []
};
songrequests.convertSpotifyImageUrl = function (_0x34f7f2) {
  if (!_0x34f7f2) {
    return null;
  }
  if (typeof _0x34f7f2 === "string" && _0x34f7f2.startsWith("spotify:image:")) {
    return "https://i.scdn.co/image/" + _0x34f7f2.split(":")[2];
  }
  return _0x34f7f2;
};
songrequests.init = function () {
  utils.initDxInput(songrequests, "dxButton", $("#buttonConnectSpotify"), null, {
    text: localization.getString("songrequests_account_button"),
    icon: "/img/Spotify_Icon_RGB_Green.png",
    height: "40px",
    onClick: songrequests.onConnectButtonClick
  });
  $(".spotifyLoginInfo").hide();
  songrequests.setCurrentState();
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifyPlayEnabledCheckbox"), true);
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifySkipEnabledCheckbox"), true);
  utils.initDxInput(songrequests, "dxNumberBox", $("#spotifyPlayCostNumberbox"), 0, {
    min: 0,
    max: 1000000,
    showSpinButtons: true,
    step: 10,
    format: "#0' Points'"
  });
  utils.initDxInput(songrequests, "dxNumberBox", $("#spotifySkipCostNumberbox"), 0, {
    min: 0,
    max: 1000000,
    showSpinButtons: true,
    step: 10,
    format: "#0' Points'"
  });
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifySkipRequestsEnabledCheckbox"), false);
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifyExplicitContentEnabledCheckbox"), true);
  utils.initDxInput(songrequests, "dxNumberBox", $("#spotifyQueueLength"), 2, {
    min: 1,
    max: 10,
    showSpinButtons: true,
    step: 1,
    format: "#0' Tracks'"
  });
  utils.initDxInput(songrequests, "dxNumberBox", $("#spotifyQueueUserLength"), 2, {
    min: 1,
    max: 10,
    showSpinButtons: true,
    step: 1,
    format: "#0' Tracks'"
  });
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifyQueuePermaEnabledCheckbox"), true);
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifyCommandsEnabledAllUsers"), true, {
    text: "All Users"
  });
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifyCommandsEnabledSubscribers"), true, {
    text: "Super Fans / Subscribers"
  });
  utils.initDxInput(songrequests, "dxCheckBox", $("#spotifyCommandsEnabledMods"), true, {
    text: "Mods"
  });
  utils.initDxInput(songrequests, "dxTextBox", $("#songRequestsTestInput"), "", {
    placeholder: "Enter Songname..."
  });
  $("#songRequestsTestButton").dxButton({
    text: "Test",
    icon: "chevronright",
    onClick: function _0x129ca8() {
      var _0x227b77;
      var _0x2beeeb;
      var _0x46fcde;
      if (!settings.get("channelId")) {
        return DevExpress.ui.dialog.alert("Please sign in first.", "Spotify Song Requests");
      }
      if (!spotifyapiwrapper.accessToken && !spotifyapiwrapper.nativeAccessToken) {
        return DevExpress.ui.dialog.alert("Please connect your Spotify account first.", "Spotify Song Requests");
      }
      if (!songrequests.spotifyCurrentDeviceId) {
        return DevExpress.ui.dialog.alert("No device connected. Please start Spotify.", "Spotify Song Requests");
      }
      if (!songrequests.currentlyPlayingTrack) {
        return DevExpress.ui.dialog.alert("No song currently playing. Please start Spotify and play a song or playlist.", "Spotify Song Requests");
      }
      if (!songrequests.inputValues.spotifyPlayEnabledCheckbox) {
        return DevExpress.ui.dialog.alert("!play command is disabled. Please enable it in the settings above.", "Spotify Song Requests");
      }
      if (songrequests.inputValues.spotifyPlayCostNumberbox > 0) {
        return DevExpress.ui.dialog.alert(`!play command costs currently ${songrequests.inputValues.spotifyPlayCostNumberbox} points.<br>Please set the value to 0 for test purposes.`, "Spotify Song Requests");
      }
      if (!songrequests.inputValues.songRequestsTestInput) {
        return DevExpress.ui.dialog.alert("Please enter a song name", "Spotify Song Requests");
      }
      var _0x3ff83f = songrequests.inputValues.songRequestsTestInput;
      songrequests.handlePlayCommand(((_0x227b77 = window.session) === null || _0x227b77 === undefined ? undefined : (_0x2beeeb = _0x227b77.me) === null || _0x2beeeb === undefined ? undefined : _0x2beeeb.channel?.ownerUserId) || "1", ((_0x46fcde = window.session.me) === null || _0x46fcde === undefined ? undefined : _0x46fcde.channel?.channelName) || "TestUser", _0x3ff83f, `https://${window.session.me.channeluser?.thumbnailUrl}`);
      toastr.success("Test song request sent.", "Spotify Song Requests");
    }
  });
  songrequests.onInputChange();
  spotifyapiwrapper.init();
  spotifyapiwrapper.getAccessToken(function () {
    spotifyapiwrapper.getAccountInfo(function (_0x2a8eaf) {
      songrequests.spotifyAccountInfo = _0x2a8eaf;
      songrequests.setCurrentDevice();
      songrequests.setCurrentState();
      if (_0x2a8eaf) {
        spotifyapiwrapper.playSong("", "", function (_0x2d4b16, _0xc0ec58) {
          if (_0xc0ec58 && _0xc0ec58.error && _0xc0ec58.error.reason === "PREMIUM_REQUIRED") {
            songrequests.disconnectSpotify();
            DevExpress.ui.dialog.alert("You need Spotify Premium to use this feature.", "Spotify Song Requests");
          } else {
            $(".spotifyUnconnected").slideUp(200);
            $(".spotifyAccountUsername").text(songrequests.spotifyAccountInfo.display_name + (spotifyapiwrapper.nativeAccessToken ? " [NAPI]" : ""));
            $(".spotifyLoginInfo").fadeIn(200);
            songrequests.setCurrentDevice();
          }
        });
      } else {
        songrequests.inputs.buttonConnectSpotify.option("disabled", false);
        $(".spotifyUnconnected").slideDown(200);
        $(".spotifyLoginInfo").fadeOut(200);
      }
    });
  });
  $("#songRequestHistoryGrid").dxDataGrid({
    width: "1000px",
    showBorders: true,
    searchPanel: {
      visible: true
    },
    scrolling: {
      mode: "virtual",
      showScrollbar: "always"
    },
    columns: [{
      dataField: "date",
      dataType: "datetime",
      width: "200px"
    }, {
      dataField: "user",
      dataType: "string",
      width: "250px"
    }, {
      dataField: "track",
      dataType: "string"
    }, {
      dataField: "status",
      dataType: "string",
      width: "150px"
    }]
  });
  songrequests.updateHistory();
};
songrequests.onChannelContextChanged = function () {
  if (!songrequests.checkPlaybackStateInterval) {
    songrequests.checkPlaybackStateInterval = setIntervalFix(songrequests.checkPlaybackState, spotifyapiwrapper.nativeAccessToken ? 4000 : 8000);
  }
  if (!songrequests.addToQueueIfEndOfSongInterval) {
    songrequests.addToQueueIfEndOfSongInterval = setIntervalFix(songrequests.addToQueueIfEndOfSong, 2000);
  }
  if (!songrequests.setCurrentDeviceInterval) {
    songrequests.setCurrentDeviceInterval = setIntervalFix(songrequests.setCurrentDevice, spotifyapiwrapper.nativeAccessToken ? 15000 : 20000);
  }
  if (!songrequests.pushStateInterval) {
    songrequests.pushStateInterval = setIntervalFix(songrequests.pushState, 1000);
  }
};
songrequests.onInputChange = function () {
  if (songrequests.inputValues.spotifyQueuePermaEnabledCheckbox) {
    $("#spotifyQueuePermaEnabledCheckboxHint").hide();
  } else {
    $("#spotifyQueuePermaEnabledCheckboxHint").fadeIn(100);
  }
};
songrequests.onVisible = function () {
  setTimeout(songrequests.updateHistory, 500);
  $(".menuitemmain[data-pageid=songrequests]").removeClass("newFeatureBlink");
};
songrequests.updateHistory = function () {
  if (navigation.currentPage !== "songrequests") {
    return;
  }
  var _0x6b5ddb = [];
  console.info("UPDATE SONG REQUEST GRID");
  songrequests.queue.slice().reverse().forEach(function (_0x3b6ce0) {
    var _0x25fa63 = _0x3b6ce0.artists && _0x3b6ce0.artists.length > 0 ? _0x3b6ce0.artists[0].name : "";
    var _0x3534c5 = _0x25fa63 ? _0x3b6ce0.name + " - " + _0x25fa63 : _0x3b6ce0.name;
    var _0x33b34c = {
      date: _0x3b6ce0.requestInfo.dateAdded,
      track: _0x3534c5,
      user: _0x3b6ce0.requestInfo.username
    };
    if (_0x3b6ce0.requestInfo.revoked) {
      _0x33b34c.status = "Revoked";
    } else if (_0x3b6ce0.requestInfo.addedToSpotifyQueue) {
      _0x33b34c.status = "Processed";
    } else {
      _0x33b34c.status = "Queued";
    }
    _0x6b5ddb.push(_0x33b34c);
  });
  var _0x14c93b = JSON.stringify(_0x6b5ddb);
  if (_0x14c93b === songrequests.lastGridDsString) {
    return;
  }
  songrequests.lastGridDsString = _0x14c93b;
  $("#songRequestHistoryGrid").dxDataGrid("instance").option("dataSource", _0x6b5ddb);
};
songrequests.setCurrentState = function () {
  if (songrequests.spotifyCurrentDeviceId) {
    if (songrequests.currentlyPlayingTrack && songrequests.currentlyPlayingTrack.is_playing) {
      songrequests.setStateLabel("Connected with " + songrequests.spotifyCurrentDeviceName, "rgb(212 212 212)");
    } else {
      songrequests.setStateLabel("Connected with " + songrequests.spotifyCurrentDeviceName + " (Paused)", "rgb(212 212 212)");
    }
  } else if (songrequests.spotifyAccountInfo) {
    songrequests.setStateLabel("Please start Spotify and play a playlist!", "rgb(228 79 79)");
  } else {
    songrequests.setStateLabel("Disconnected", "rgb(228 79 79)");
  }
};
songrequests.setStateLabel = function (_0x37b28e, _0xc74b0f) {
  $(".spotifyCurrentPlaybackState").text(_0x37b28e).css("color", _0xc74b0f);
};
songrequests.onConnectButtonClick = function () {
  var _0x5e88fb;
  if ((_0x5e88fb = window.session) === null || _0x5e88fb === undefined || !_0x5e88fb.channelId) {
    navigation.pageChange("setup");
    return;
  }
  songrequests.inputs.buttonConnectSpotify.option("disabled", true);
  spotifyapiwrapper.connect(function (_0x2ee49b) {
    if (!_0x2ee49b) {
      DevExpress.ui.dialog.alert("We were unable to connect to your Spotify account. Try again.", "Connection Failed");
      songrequests.inputs.buttonConnectSpotify.option("disabled", false);
      return;
    }
    songrequests.init();
  });
};
songrequests.disconnectSpotify = function () {
  localStorage.removeItem("setting_spotify_accessToken");
  localStorage.removeItem("setting_spotify_refreshToken");
  localStorage.removeItem("setting_spotify_nativeAccessToken");
  spotifyapiwrapper.accessToken = null;
  spotifyapiwrapper.refreshToken = null;
  spotifyapiwrapper.nativeAccessToken = null;
  songrequests.spotifyAccountInfo = null;
  songrequests.spotifyCurrentDeviceId = null;
  songrequests.currentlyPlayingTrack = null;
  songrequests.queue = [];
  songrequests.init();
};
songrequests.setCurrentDevice = function () {
  if (!songrequests.spotifyAccountInfo) {
    return;
  }
  if (window.session.isElectron && spotifyapiwrapper.nativeAccessToken && spotifyapiwrapper.deviceInfo && spotifyapiwrapper.deviceInfo.device_id) {
    if (songrequests.spotifyCurrentDeviceId !== spotifyapiwrapper.deviceInfo.device_id) {
      songrequests.spotifyCurrentDeviceId = spotifyapiwrapper.deviceInfo.device_id;
      songrequests.spotifyCurrentDeviceName = spotifyapiwrapper.deviceInfo.name;
      console.info("[Electron] Using WebSocket device:", spotifyapiwrapper.deviceInfo.name, "(" + spotifyapiwrapper.deviceInfo.device_id + ")");
      songrequests.checkPlaybackState();
    }
    songrequests.setCurrentState();
    return;
  }
  spotifyapiwrapper.getDevices(function (_0x31e632) {
    if (!_0x31e632 || !_0x31e632.devices) {
      return;
    }
    var _0x3995ef = _0x31e632.devices.find(function (_0x54a9d9) {
      return _0x54a9d9.is_active;
    });
    console.info("active spotify device", _0x3995ef);
    if (_0x3995ef) {
      if (songrequests.spotifyCurrentDeviceId !== _0x3995ef.id) {
        songrequests.spotifyCurrentDeviceId = _0x3995ef.id;
        songrequests.spotifyCurrentDeviceName = _0x3995ef.name;
        songrequests.checkPlaybackState();
      }
    } else {
      songrequests.spotifyCurrentDeviceId = null;
      songrequests.spotifyCurrentDeviceName = null;
    }
    songrequests.setCurrentState();
  });
};
songrequests.checkPlaybackState = function () {
  if (!songrequests.spotifyAccountInfo) {
    return;
  }
  if (!songrequests.spotifyCurrentDeviceId) {
    return;
  }
  if (window.session.isElectron && spotifyapiwrapper.nativeAccessToken && spotifyapiwrapper.currentTrack) {
    var _0x3cf97d = spotifyapiwrapper.currentTrack;
    var _0x5a2655 = _0x3cf97d.playback.is_playing && !_0x3cf97d.playback.is_paused;
    songrequests.currentlyPlayingTrack = {
      item: {
        id: _0x3cf97d.track.uri.split(":").pop(),
        uri: _0x3cf97d.track.uri,
        name: _0x3cf97d.track.title,
        artists: [{
          name: _0x3cf97d.track.artist
        }],
        album: {
          name: _0x3cf97d.track.album,
          images: _0x3cf97d.track.image_url ? [{
            url: songrequests.convertSpotifyImageUrl(_0x3cf97d.track.image_url)
          }] : []
        },
        duration_ms: _0x3cf97d.playback.duration_ms
      },
      is_playing: _0x5a2655,
      progress_ms: _0x3cf97d.playback.position_ms,
      ts: _0x3cf97d.updated_at
    };
    console.info("[Electron] Using WebSocket track:", _0x3cf97d.track.title, "by", _0x3cf97d.track.artist, _0x5a2655 ? "(Playing)" : "(Paused)");
    songrequests.addToQueueIfEndOfSong(false, function () {});
    if (songrequests.currentlyPlayingTrack.item.id && songrequests.trackIdsWaitingToPlay.includes(songrequests.currentlyPlayingTrack.item.id)) {
      songrequests.trackIdsWaitingToPlay = songrequests.trackIdsWaitingToPlay.filter(function (_0x204abb) {
        return _0x204abb !== songrequests.currentlyPlayingTrack.item.id;
      });
      songrequests.queue.filter(function (_0x3fcf98) {
        return _0x3fcf98.id === songrequests.currentlyPlayingTrack.item.id && _0x3fcf98.requestInfo.waitingForUserQueue;
      }).forEach(function (_0x5249a3) {
        _0x5249a3.requestInfo.waitingForUserQueue = false;
      });
      api.logError({
        type: "SpotifyAPI",
        message: "NextTrackFixV6",
        result: "WaitSuccess"
      });
    }
    songrequests.setCurrentState();
    return;
  }
  spotifyapiwrapper.getCurrentlyPlayingTrack(function (_0x66b68, _0xd64b0d, _0x5db173) {
    if (_0x5db173 === 429) {
      console.log("getCurrentlyPlayingTrack failed - rate limited");
      return;
    }
    if (_0x66b68) {
      var _0x3199f4;
      songrequests.currentlyPlayingTrack = _0x66b68;
      songrequests.currentlyPlayingTrack.ts = new Date().getTime();
      songrequests.addToQueueIfEndOfSong(false, function () {});
      if (_0x66b68 !== null && _0x66b68 !== undefined && (_0x3199f4 = _0x66b68.item) !== null && _0x3199f4 !== undefined && _0x3199f4.id && songrequests.trackIdsWaitingToPlay.includes(_0x66b68.item.id)) {
        songrequests.trackIdsWaitingToPlay = songrequests.trackIdsWaitingToPlay.filter(function (_0x5990fa) {
          return _0x5990fa.id !== _0x66b68.item.id;
        });
        songrequests.queue.filter(function (_0x1246f1) {
          return _0x1246f1.id === _0x66b68.item.id && _0x1246f1.requestInfo.waitingForUserQueue;
        }).forEach(function (_0x9b59f4) {
          _0x9b59f4.requestInfo.waitingForUserQueue = false;
        });
        api.logError({
          type: "SpotifyAPI",
          message: "NextTrackFixV6",
          result: "WaitSuccess"
        });
      }
    } else {
      songrequests.currentlyPlayingTrack = null;
    }
    songrequests.setCurrentState();
    console.info("getCurrentlyPlayingTrack", _0x66b68);
  });
};
songrequests.getCurrentPlayingTrackRemainingMilliseconds = function () {
  if (!songrequests.currentlyPlayingTrack || !songrequests.currentlyPlayingTrack.progress_ms || !songrequests.currentlyPlayingTrack.item) {
    return null;
  }
  return songrequests.currentlyPlayingTrack.item.duration_ms - (songrequests.currentlyPlayingTrack.progress_ms + (new Date().getTime() - songrequests.currentlyPlayingTrack.ts));
};
songrequests.addToQueueIfEndOfSong = function () {
  var _0x2269d3 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x4af043(_0x1cdc31, _0x5147a7) {
    var _0x2e8a3b;
    var _0x5b784;
    var _0x225b80;
    var _0x42ef80;
    var _0x940866;
    return _regeneratorRuntime().wrap(function _0x5a9169(_0x5b4836) {
      while (1) {
        switch (_0x5b4836.prev = _0x5b4836.next) {
          case 0:
            if (!_0x5147a7) {
              _0x5147a7 = function _0x3d4224() {};
            }
            if (songrequests.spotifyCurrentDeviceId) {
              _0x5b4836.next = 3;
              break;
            }
            return _0x5b4836.abrupt("return", _0x5147a7(false));
          case 3:
            if (songrequests.currentlyPlayingTrack) {
              _0x5b4836.next = 5;
              break;
            }
            return _0x5b4836.abrupt("return", _0x5147a7(false));
          case 5:
            if (songrequests.currentlyPlayingTrack.item) {
              _0x5b4836.next = 7;
              break;
            }
            return _0x5b4836.abrupt("return", _0x5147a7(false));
          case 7:
            if (songrequests.currentlyPlayingTrack.is_playing) {
              _0x5b4836.next = 9;
              break;
            }
            return _0x5b4836.abrupt("return", _0x5147a7(false));
          case 9:
            if (songrequests.queue.length > 200) {
              console.info("CLEAR OLD QUEUE ITEMS");
              while (songrequests.queue.length > 200) {
                songrequests.queue.shift();
              }
            }
            _0x2e8a3b = songrequests.getCurrentPlayingTrackRemainingMilliseconds();
            if (_0x2e8a3b !== null) {
              _0x5b4836.next = 13;
              break;
            }
            return _0x5b4836.abrupt("return", _0x5147a7(false));
          case 13:
            console.info("getCurrentPlayingTrackRemainingMilliseconds", _0x2e8a3b);
            if (songrequests.lastAddToQueueCurrentTrackId !== songrequests.currentlyPlayingTrack.item.id) {
              songrequests.queue.filter(function (_0xf0a200) {
                return !_0xf0a200.requestInfo.revoked && _0xf0a200.requestInfo.addedToSpotifyQueue;
              }).forEach(function (_0x1dba99) {
                return _0x1dba99.requestInfo.played = true;
              });
            }
            _0x5b784 = _0x2e8a3b < 12000 && _0x2e8a3b > 2500;
            if ((_0x5b784 || _0x1cdc31) && songrequests.lastAddToQueueCurrentTrackId !== songrequests.currentlyPlayingTrack.item.id) {
              _0x225b80 = songrequests.queue.find(function (_0xa69429) {
                return !_0xa69429.requestInfo.revoked && !_0xa69429.requestInfo.addedToSpotifyQueue;
              });
              if (_0x225b80) {
                songrequests.lastAddToQueueItem = _0x225b80;
                songrequests.lastAddToQueueCurrentTrackId = songrequests.currentlyPlayingTrack.item.id;
                console.info("ADD TO QUEUE", _0x225b80);
                _0x225b80.requestInfo.addedToSpotifyQueue = true;
                songrequests.updateHistory();
                _0x42ef80 = songrequests.currentlyPlayingTrack.item.id;
                _0x940866 = _0x225b80.uri;
                api.logError({
                  type: "SpotifyAPI",
                  message: "addItemtoPlaybackQueue() Init",
                  force: !!_0x1cdc31,
                  nextTrackQueueItem: _0x225b80,
                  currentTrack: songrequests.currentlyPlayingTrack
                });
                spotifyapiwrapper.addItemtoPlaybackQueue(_0x225b80.uri, function (_0x33d863) {
                  _0x5147a7(true);
                });
              } else {
                _0x5147a7(false);
              }
            } else {
              _0x5147a7(false);
            }
          case 17:
          case "end":
            return _0x5b4836.stop();
        }
      }
    }, _0x4af043);
  }));
  return function (_0x1bbc63, _0x191d31) {
    return _0x2269d3.apply(this, arguments);
  };
}();
songrequests.addTrackToQueue = function (_0x18c306, _0x5f18b7, _0x103748, _0x234269, _0x2856f7) {
  if (!_0x18c306 || !_0x18c306.name || !_0x18c306.id) {
    console.error("Cannot add track to queue - missing required data", _0x18c306);
    chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_FAILED_SONG_NOT_FOUND", _0x103748, null);
    return;
  }
  _0x18c306.requestInfo = {
    dateAdded: new Date(),
    userId: _0x5f18b7,
    username: _0x103748,
    cost: _0x234269,
    profilePictureUrl: _0x2856f7,
    addedToSpotifyQueue: false,
    played: false,
    revoked: false
  };
  songrequests.queue.push(_0x18c306);
  songrequests.updateHistory();
  var _0x20e12a = _0x18c306.artists && _0x18c306.artists.length > 0 ? _0x18c306.artists[0].name : "";
  var _0x34edd8 = _0x20e12a ? _0x18c306.name + " - " + _0x20e12a : _0x18c306.name;
  chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_SUCCESS", _0x103748, {
    track: _0x34edd8
  });
};
songrequests.handlePlayCommand = function (_0x9e416a, _0x242222, _0x569167, _0x37528c) {
  try {
    if (typeof window.SentrySpotify !== "undefined") {
      window.SentrySpotify.addBreadcrumb("Song Request: !play command", {
        userId: _0x9e416a,
        username: _0x242222,
        comment: _0x569167
      });
    }
    console.info("processing song request", _0x9e416a, _0x242222, _0x569167);
    if (!_0x569167) {
      return;
    }
    if (!songrequests.inputValues.spotifyPlayEnabledCheckbox) {
      console.warn("!play disabled");
      return;
    }
    if (!songrequests.spotifyAccountInfo || !songrequests.spotifyCurrentDeviceId) {
      console.warn("no device connected");
      return;
    }
    if (songrequests.queue.filter(function (_0x3c91a3) {
      return !_0x3c91a3.requestInfo.revoked && !_0x3c91a3.requestInfo.addedToSpotifyQueue;
    }).length >= songrequests.inputValues.spotifyQueueLength) {
      console.warn("queue.length > x");
      chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_FAILED_QUEUE_FULL", _0x242222, null);
      return;
    }
    if (songrequests.queue.filter(function (_0x3eac34) {
      return !_0x3eac34.requestInfo.revoked && !_0x3eac34.requestInfo.addedToSpotifyQueue && _0x3eac34.requestInfo.userId === _0x9e416a;
    }).length >= songrequests.inputValues.spotifyQueueUserLength) {
      console.warn("user queue.length > x");
      chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_FAILED_USER_QUEUE_FULL", _0x242222, null);
      return;
    }
    _0x569167 = _0x569167.replaceAll("-", " ").replaceAll("[", "").replaceAll("]", "");
    spotifyapiwrapper.searchSong(_0x569167, function (_0x47653c) {
      var _0x3d0525;
      var _0x29e97a;
      if (!_0x47653c || !_0x47653c.tracks || !_0x47653c.tracks.items || _0x47653c.tracks.items.length === 0) {
        console.warn("song not found");
        chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_FAILED_SONG_NOT_FOUND", _0x242222, null);
        return;
      }
      if (!songrequests.inputValues.spotifyExplicitContentEnabledCheckbox && _0x47653c.tracks.items[0].explicit) {
        console.warn("explicit content!");
        chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_FAILED_SONG_NOT_ALLOWED", _0x242222, null);
        return;
      }
      var _0x44f8b8 = _0x47653c.tracks.items[0];
      if (songrequests.queue.find(function (_0x35bc52) {
        return _0x35bc52.id === _0x44f8b8.id && !_0x35bc52.requestInfo.revoked && !_0x35bc52.requestInfo.played;
      }) || songrequests.currentlyPlayingTrack && songrequests.currentlyPlayingTrack.item && songrequests.currentlyPlayingTrack.item.id === _0x44f8b8.id) {
        console.warn("song already in queue");
        chatbot.sendChatbotMessageByTemplate("SONGREQUEST_PLAY_SONG_IN_QUEUE", _0x242222, null);
        return;
      }
      if (songrequests.inputValues.spotifyPlayCostNumberbox > 0 && ((_0x3d0525 = window.session) === null || _0x3d0525 === undefined ? undefined : (_0x29e97a = _0x3d0525.me) === null || _0x29e97a === undefined ? undefined : _0x29e97a.channel?.ownerUserId) !== _0x9e416a) {
        transaction.put(_0x9e416a, _0x242222, songrequests.inputValues.spotifyPlayCostNumberbox * -1, false, false, "Song Request - " + _0x569167, true, function (_0x40c0c8, _0x2f4691) {
          if (!_0x40c0c8) {
            console.warn("not enough points");
            chatbot.sendChatbotMessageByTemplate("SONGREQUEST_FAILED_AMOUNT", _0x242222, {
              cost: songrequests.inputValues.spotifyPlayCostNumberbox.toLocaleString()
            });
            return;
          }
          songrequests.addTrackToQueue(_0x44f8b8, _0x9e416a, _0x242222, songrequests.inputValues.spotifyPlayCostNumberbox, _0x37528c);
        });
      } else {
        songrequests.addTrackToQueue(_0x44f8b8, _0x9e416a, _0x242222, 0, _0x37528c);
      }
    });
  } catch (_0x377f8f) {
    console.error("Error in handlePlayCommand:", _0x377f8f);
    if (typeof window.SentrySpotify !== "undefined") {
      window.SentrySpotify.captureError(_0x377f8f, {
        type: "SpotifyAPI",
        operation: "song_request_play",
        userId: _0x9e416a,
        username: _0x242222,
        comment: _0x569167
      });
    }
  }
};
songrequests.doSkip = function () {
  api.logError({
    type: "SpotifyAPI",
    message: "doSkip()",
    nextQueueItem: songrequests.queue.find(function (_0x3b4338) {
      return !_0x3b4338.requestInfo.revoked && !_0x3b4338.requestInfo.addedToSpotifyQueue;
    })
  });
  if (!songrequests.queue.find(function (_0x23ce32) {
    return !_0x23ce32.requestInfo.revoked && !_0x23ce32.requestInfo.addedToSpotifyQueue;
  })) {
    spotifyapiwrapper.skipToNextTrack(function () {
      setTimeoutFix(function () {
        songrequests.checkPlaybackState();
        songrequests.updateHistory();
      }, 500);
    });
    return;
  }
  songrequests.addToQueueIfEndOfSong(true, function (_0x4a86a0) {
    if (_0x4a86a0) {
      setTimeoutFix(function () {
        spotifyapiwrapper.skipToNextTrack(function () {
          setTimeoutFix(function () {
            songrequests.checkPlaybackState();
            songrequests.updateHistory();
          }, 500);
        });
      }, 500);
    }
  });
};
songrequests.handleSkipCommand = function (_0x5f29e8, _0x4c9956, _0x40f18b) {
  try {
    var _0x2d2788;
    var _0x549227;
    if (typeof window.SentrySpotify !== "undefined") {
      window.SentrySpotify.addBreadcrumb("Song Request: !skip command", {
        userId: _0x5f29e8,
        username: _0x4c9956
      });
    }
    console.info("processing skip command", _0x5f29e8, _0x4c9956, _0x40f18b);
    if (!songrequests.spotifyCurrentDeviceId) {
      return;
    }
    if (!songrequests.currentlyPlayingTrack) {
      return;
    }
    if (!songrequests.currentlyPlayingTrack.item) {
      return;
    }
    if (!songrequests.currentlyPlayingTrack.is_playing) {
      return;
    }
    if (!songrequests.inputValues.spotifySkipEnabledCheckbox) {
      console.warn("skip checkbox disabled");
      return;
    }
    if (songrequests.lastSkipTs && songrequests.lastSkipTs > new Date().getTime() - 5000) {
      console.warn("lastSkip too close");
      return;
    }
    if (songrequests.currentlyPlayingTrack.item.duration_ms - songrequests.currentlyPlayingTrack.progress_ms < 12000) {
      console.warn("to late to skip");
      return;
    }
    var _0x39f8aa = songrequests.inputValues.spotifySkipCostNumberbox;
    var _0x88eadd = songrequests.queue.find(function (_0x224854) {
      return _0x224854.id === songrequests.currentlyPlayingTrack.item.id && !_0x224854.requestInfo.revoked;
    });
    var _0x19cba9 = _0x88eadd && _0x88eadd.requestInfo;
    var _0x487cc7 = _0x19cba9 && _0x88eadd.requestInfo.userId === _0x5f29e8;
    if (_0x19cba9 && !_0x487cc7 && !songrequests.inputValues.spotifySkipRequestsEnabledCheckbox) {
      console.warn("skip not allowed");
      chatbot.sendChatbotMessageByTemplate("SONGREQUEST_SKIP_FAILED", _0x4c9956, null);
      return;
    }
    if (_0x487cc7) {
      _0x39f8aa = 0;
    }
    if (((_0x2d2788 = window.session) === null || _0x2d2788 === undefined ? undefined : (_0x549227 = _0x2d2788.me) === null || _0x549227 === undefined ? undefined : _0x549227.channel?.ownerUserId) === _0x5f29e8) {
      _0x39f8aa = 0;
    }
    if (_0x39f8aa > 0) {
      transaction.put(_0x5f29e8, _0x4c9956, songrequests.inputValues.spotifySkipCostNumberbox * -1, false, false, "Skip Song", true, function (_0x1545da, _0x185921) {
        if (!_0x1545da) {
          console.warn("not enough points to skip");
          chatbot.sendChatbotMessageByTemplate("SONGREQUEST_FAILED_AMOUNT", _0x4c9956, {
            cost: songrequests.inputValues.spotifySkipCostNumberbox.toLocaleString()
          });
          return;
        }
        songrequests.lastSkipTs = new Date().getTime();
        songrequests.doSkip();
      });
    } else {
      songrequests.lastSkipTs = new Date().getTime();
      songrequests.doSkip();
    }
  } catch (_0x685459) {
    console.error("Error in handleSkipCommand:", _0x685459);
    if (typeof window.SentrySpotify !== "undefined") {
      window.SentrySpotify.captureError(_0x685459, {
        type: "SpotifyAPI",
        operation: "song_request_skip",
        userId: _0x5f29e8,
        username: _0x4c9956
      });
    }
  }
};
songrequests.handleRevokeCommand = function (_0x5879c0, _0x10a941, _0x312aa6) {
  var _0x5a83ac = songrequests.queue.slice().reverse().find(function (_0x30cf2a) {
    return !_0x30cf2a.requestInfo.revoked && !_0x30cf2a.requestInfo.addedToSpotifyQueue && _0x30cf2a.requestInfo.userId === _0x5879c0;
  });
  if (_0x5a83ac) {
    api.logError({
      type: "SpotifyAPI",
      message: "handleRevokeCommand()",
      songToRevoke: _0x5a83ac
    });
    _0x5a83ac.requestInfo.revoked = true;
    songrequests.updateHistory();
    if (_0x5a83ac.requestInfo.cost > 0) {
      transaction.put(_0x5879c0, _0x10a941, _0x5a83ac.requestInfo.cost, false, false, "Revoke Song Request", false, function () {});
    }
    chatbot.sendChatbotMessageByTemplate("SONGREQUEST_REVOKE_SUCCESS", _0x10a941, null);
  }
};
songrequests.commandsAvailableForUser = function (_0x540700) {
  if (songrequests.inputValues.spotifyCommandsEnabledAllUsers) {
    return true;
  }
  if (songrequests.inputValues.spotifyCommandsEnabledSubscribers && utils.isSubscriber(_0x540700)) {
    return true;
  }
  if (songrequests.inputValues.spotifyCommandsEnabledMods && utils.isModerator(_0x540700)) {
    return true;
  }
  return false;
};
songrequests.onChat = function (_0xc55927) {
  var _0x4ab5d6 = _0xc55927.comment.toLowerCase().trim();
  if (_0x4ab5d6.indexOf("!play") === 0 && songrequests.commandsAvailableForUser(_0xc55927)) {
    songrequests.handlePlayCommand(_0xc55927.userId, _0xc55927.name, _0x4ab5d6.replace("!play", "").trim(), _0xc55927.profilePictureUrl);
  }
  if (_0x4ab5d6.indexOf("!skip") === 0 && songrequests.commandsAvailableForUser(_0xc55927)) {
    songrequests.handleSkipCommand(_0xc55927.userId, _0xc55927.name, _0x4ab5d6.replace("!skip", "").trim());
  }
  if (_0x4ab5d6.indexOf("!revoke") === 0) {
    songrequests.handleRevokeCommand(_0xc55927.userId, _0xc55927.name, _0x4ab5d6.replace("!revoke", "").trim());
  }
  if (_0x4ab5d6.indexOf("!music") === 0) {
    songrequests.pushState(true);
  }
};
songrequests.emitPlaylist = function (_0x59ed11) {
  if (!socketiowrapper || !socketiowrapper.io) ;
  if (JSON.stringify(_0x59ed11) === songrequests.lastEmitedPlaylist) {
    return;
  }
  songrequests.lastEmitedPlaylist = JSON.stringify(_0x59ed11);
  socketiowrapper.emitSocketEvent("setPlaylistItems", _0x59ed11, true);
};
songrequests.pushState = function (_0x498442) {
  if (!songrequests.currentlyPlayingTrack || !songrequests.currentlyPlayingTrack.item || !songrequests.currentlyPlayingTrack.is_playing) {
    songrequests.emitPlaylist([]);
    return;
  }
  var _0x301334 = [];
  var _0x298266 = songrequests.currentlyPlayingTrack.item;
  if (!_0x298266.id || !_0x298266.name) {
    console.error("Current track missing required data, skipping widget update", _0x298266);
    return;
  }
  var _0x4d8248 = {};
  _0x4d8248.songThumbnail = songrequests.convertSpotifyImageUrl(_0x298266.album && _0x298266.album.images && _0x298266.album.images.length > 0 ? _0x298266.album.images[0].url : null);
  _0x4d8248.songId = _0x298266.id;
  _0x4d8248.songName = _0x298266.name || "Unknown Track";
  _0x4d8248.songArtist = _0x298266.artists && _0x298266.artists.length > 0 ? _0x298266.artists[0].name : "Unknown Artist";
  _0x4d8248.isCurrent = true;
  _0x4d8248.songPosition = songrequests.currentlyPlayingTrack.progress_ms + (new Date().getTime() - songrequests.currentlyPlayingTrack.ts);
  _0x4d8248.songDuration = _0x298266.duration_ms;
  _0x4d8248.display = _0x498442 === true ? true : songrequests.inputValues.spotifyQueuePermaEnabledCheckbox;
  var _0x3a67a0 = songrequests.queue.find(function (_0x3b340d) {
    return _0x3b340d.id === _0x298266.id && !_0x3b340d.requestInfo.revoked;
  });
  if (_0x3a67a0 && _0x3a67a0.requestInfo) {
    _0x4d8248.user = _0x3a67a0.requestInfo;
  }
  if (_0x4d8248.songPosition > _0x4d8248.songDuration) {
    _0x4d8248.songPosition = _0x4d8248.songDuration;
    if (!songrequests.synced) {
      songrequests.synced = true;
      songrequests.checkPlaybackState();
      console.info("SYNCED");
    }
  } else {
    songrequests.synced = false;
  }
  _0x301334.push(_0x4d8248);
  songrequests.queue.filter(function (_0x1967f2) {
    return !_0x1967f2.requestInfo.revoked && (!_0x1967f2.requestInfo.played || _0x1967f2.requestInfo.waitingForUserQueue) && _0x1967f2.id !== _0x298266.id;
  }).forEach(function (_0x4735df) {
    var _0x29e2db = {};
    _0x29e2db.songThumbnail = songrequests.convertSpotifyImageUrl(_0x4735df.album && _0x4735df.album.images && _0x4735df.album.images.length > 0 ? _0x4735df.album.images[0].url : null);
    _0x29e2db.songId = _0x4735df.id;
    _0x29e2db.songName = _0x4735df.name || "Unknown Track";
    _0x29e2db.songArtist = _0x4735df.artists && _0x4735df.artists.length > 0 ? _0x4735df.artists[0].name : "Unknown Artist";
    _0x29e2db.isCurrent = false;
    _0x29e2db.songDuration = _0x4735df.duration_ms;
    _0x29e2db.user = _0x4735df.requestInfo;
    _0x301334.push(_0x29e2db);
  });
  songrequests.emitPlaylist(_0x301334);
};
songrequests.testOverlay = function () {
  socketiowrapper.emitSocketEvent("setPlaylistItems", [{
    songThumbnail: "https://i.scdn.co/image/ab67616d0000b273255191ed87a907d362b43f19",
    songId: "5UEnHoDYpsxlfzWLZIc7LD",
    songName: "River (feat. Ed Sheeran)",
    songArtist: "Eminem",
    isCurrent: true,
    songPosition: 65708,
    songDuration: 221013
  }, {
    songThumbnail: "https://i.scdn.co/image/ab67616d0000b27346e1307c35579c3483ea7b03",
    songId: "2r6OAV3WsYtXuXjvJ1lIDi",
    songName: "Hello (feat. A Boogie Wit da Hoodie)",
    songArtist: "Pop Smoke",
    isCurrent: false,
    songDuration: 190534
  }, {
    songThumbnail: "https://i.scdn.co/image/ab67616d0000b27318a4e368b051bdb047c02330",
    songId: "72AbCBCbe5cYOLQy2nZdWA",
    songName: "Bye Bye Bye",
    songArtist: "Younotus",
    isCurrent: false,
    songDuration: 161330
  }]);
  setTimeout(function () {
    socketiowrapper.emitSocketEvent("setPlaylistItems", []);
  }, 3000);
};
songrequests.getStoreText = function () {
  if (!songrequests.currentlyPlayingTrack || !songrequests.currentlyPlayingTrack.item || !songrequests.currentlyPlayingTrack.is_playing) {
    return "";
  }
  var _0x125472 = "";
  if (songrequests.inputValues.spotifyPlayEnabledCheckbox) {
    _0x125472 += "!play [song artist] (<span class='price'>" + (songrequests.inputValues.spotifyPlayCostNumberbox > 0 ? songrequests.inputValues.spotifyPlayCostNumberbox.toLocaleString() : "free") + "</span>), ";
    _0x125472 += "!revoke (<span class='price'>free</span>), ";
  }
  if (songrequests.inputValues.spotifySkipEnabledCheckbox) {
    _0x125472 += "!skip (<span class='price'>" + (songrequests.inputValues.spotifySkipCostNumberbox > 0 ? songrequests.inputValues.spotifySkipCostNumberbox : "free").toLocaleString() + "</span>), ";
  }
  return _0x125472;
};
({
  inputs: {},
  inputValues: {}
}).init = function () {};
var likeathon = {
  inputs: {},
  inputValues: {},
  reduceInterval: null
};
likeathon.init = function () {
  utils.initDxInput(likeathon, "dxCheckBox", $("#checkboxLikeathonEnableAutomaticDecrease"), false);
  utils.initDxInput(likeathon, "dxSlider", $("#sliderLikeathonDecreaseSpeed"), 10, {
    min: 1,
    max: 50
  });
  $("#buttonLikeathonReset").dxButton({
    text: localization.getString("likeathon_reset"),
    onClick: function _0x446a1d() {
      broadcastlistener.likeUsers = [];
      obsoverlays.topLiker = [];
      obsoverlays.processTopLiker(broadcastlistener.likeUsers);
      obsoverlays.emitTopLiker(true);
      toastr.success("Top Liker resetted");
    }
  });
  if (settings.get("channelId") === "0") {
    likeathon.initOverlay();
  }
  likeathon.reduceInterval = setIntervalFix(likeathon.doReduce, 10000);
  likeathon.setIntensityText();
  likeathon.toggleHint1();
};
likeathon.onInputChange = function (_0x1d1d0f) {
  likeathon.setIntensityText();
  likeathon.toggleHint1();
};
likeathon.onVisible = function () {
  likeathon.initOverlay();
};
likeathon.onChannelContextChanged = function () {
  likeathon.initOverlay();
};
likeathon.initOverlay = function () {
  if (navigation.currentPage !== "likeathon") {
    return;
  }
  obsoverlays.generateWidget($("#widgetToplikerLikeathon"), obsoverlays.testTopLiker, "600px");
};
likeathon.onHide = function () {
  $("#widgetToplikerLikeathon").empty();
};
likeathon.setIntensityText = function () {
  $("#likeathonIntensityValue").text(`Reduce score by ${likeathon.inputValues.sliderLikeathonDecreaseSpeed}% every 10 seconds.`);
};
likeathon.doReduce = function () {
  if (typeof broadcastlistener !== "object" || !broadcastlistener.isLive) {
    return;
  }
  if (!likeathon.inputValues.checkboxLikeathonEnableAutomaticDecrease) {
    return;
  }
  var _0x5e7eaa = _createForOfIteratorHelper(broadcastlistener.likeUsers);
  var _0x11593b;
  try {
    for (_0x5e7eaa.s(); !(_0x11593b = _0x5e7eaa.n()).done;) {
      var _0x3ae604 = _0x11593b.value;
      _0x3ae604.likeCount = Math.floor(_0x3ae604.likeCount * (1 - likeathon.inputValues.sliderLikeathonDecreaseSpeed / 100));
    }
  } catch (_0x3ca270) {
    _0x5e7eaa.e(_0x3ca270);
  } finally {
    _0x5e7eaa.f();
  }
  broadcastlistener.likeUsers = broadcastlistener.likeUsers.filter(function (_0xcbcfa1) {
    return _0xcbcfa1.likeCount > 0;
  });
  obsoverlays.processTopLiker(broadcastlistener.likeUsers);
};
likeathon.toggleHint1 = function () {
  if (likeathon.inputValues.checkboxLikeathonEnableAutomaticDecrease) {
    $("#likeathonHint1").hide();
  } else {
    $("#likeathonHint1").show();
  }
};
var obsdocks = {
  iframes: []
};
obsdocks.init = function () {
  if (settings.get("channelId") === "0") {
    obsdocks.onChannelContextChanged();
  }
};
obsdocks.onChannelContextChanged = function () {
  obsdocks.generateDock($("#activity-feed1"), 1);
  obsdocks.generateDock($("#activity-feed2"), 2);
};
obsdocks.generateDock = function (_0x28691a, _0x1ab983) {
  _0x28691a.empty();
  var _0x3709e1 = _0x28691a.data("widgetid");
  var _0x9e6abf = obsdocks.getDockPath(_0x3709e1, _0x1ab983);
  var _0x568f7c = $("<div>");
  _0x568f7c.css("display", "table-row");
  var _0x2338ae = $("<div>");
  _0x2338ae.css("display", "table-cell");
  _0x568f7c.append(_0x2338ae);
  var _0x25036c = null;
  var _0x5f0a96 = null;
  var _0x1c6d18 = function _0x1c3021() {
    if (_0x25036c) {
      _0x25036c.remove();
    }
    var _0x4655c9 = _0x9e6abf;
    _0x25036c = $("<div>").dxTextBox({
      value: _0x4655c9,
      width: "505px",
      readOnly: true
    });
    _0x25036c.click(function () {
      if (settings.get("channelId") === "0") {
        navigation.pageChange("setup");
        return;
      }
      _0x25036c.find("input").select();
    });
    _0x5f0a96 = _0x4655c9 + "&preview=1";
    _0x2338ae.append(_0x25036c);
  };
  _0x1c6d18();
  var _0x249cfb = $("<div>");
  _0x249cfb.css("display", "table-cell");
  _0x249cfb.css("padding-left", "5px");
  _0x568f7c.append(_0x249cfb);
  _0x249cfb.append($("<div>").dxButton({
    text: localization.getString("obsoverlays_widget_button_copy"),
    width: "100px",
    onClick: function _0x708b72(_0x11ff0c) {
      if (settings.get("channelId") === "0") {
        navigation.pageChange("setup");
        return;
      }
      utils.copyTextToClipboard(_0x25036c.dxTextBox("instance").option("value"), localization.getString("obsoverlays_widget_copy_success_message_dock"), localization.getString("obsoverlays_widget_copy_success_title"));
    }
  }).css("margin-bottom", "2px"));
  _0x28691a.append(_0x568f7c);
  var _0x29da5d = $("<iframe>");
  _0x29da5d.attr("src", _0x5f0a96);
  _0x29da5d.attr("allow", "autoplay");
  _0x29da5d.css("width", "612px");
  _0x29da5d.css("height", "calc(100vh - 370px)");
  _0x29da5d.css("margin-top", "4px");
  _0x29da5d.css("border", "1px solid");
  _0x29da5d.css("border-color", "#4e4e4e");
  obsdocks.iframes.push(_0x29da5d);
  _0x28691a.append(_0x29da5d);
};
obsdocks.getDockPath = function (_0x1fef31, _0x514f59) {
  return document.location.origin + "/widget/" + _0x1fef31 + "?cid=" + (window.session.channelId ? window.session.channelId : 0) + "&did=" + _0x514f59;
};
obsdocks.distributeEvent = function (_0x1fad2c, _0x5543f0) {
  var _0xcc803b;
  var _0x4b1930;
  _0x5543f0.username = (_0xcc803b = _0x5543f0.username) === null || _0xcc803b === undefined ? undefined : _0xcc803b.replaceAll("<", "");
  _0x5543f0.nickname = (_0x4b1930 = _0x5543f0.nickname) === null || _0x4b1930 === undefined ? undefined : _0x4b1930.replaceAll("<", "");
  var _0x20a9e3 = {
    type: _0x1fad2c,
    payload: _0x5543f0
  };
  obsdocks.iframes.forEach(function (_0x1bad40) {
    if (_0x1bad40[0].contentWindow) {
      _0x1bad40[0].contentWindow.postMessage(_0x20a9e3, "*");
    }
  });
  if (socketiowrapper.isWidgetActive("activity-feed")) {
    socketiowrapper.emitSocketEvent("dockData", _0x20a9e3);
  }
};
var christmasevent = {
  nonce: null,
  fetchedTree: null,
  coins: 0,
  coinGoal: 300,
  totalTreesCompleted: 0,
  retryCount: 0,
  channelName: "",
  channelInterval: -1,
  ACCEPTED_KEY: "christmas_event_accepted:",
  intervalId: -1,
  setupOnceDone: false,
  isEnabled: false,
  isRestricted: false
};
christmasevent.init = function () {
  christmasevent.isEnabled = posthog.isFeatureEnabled("christmas-2025");
  if (!christmasevent.isEnabled) {
    return;
  }
  $(".menuitemmain-christmas").removeClass("hidden");
  $("#widgetChristmaseventContainer").removeClass("hidden");
  var _0x4a3f65 = document.querySelector("#christmas-app");
  if (_0x4a3f65 && window.createChristmasEvent) {
    window.createChristmasEvent().mount(_0x4a3f65);
  }
  var _0x252100 = settings.get("christmas-event-displayed");
  if (!_0x252100) {
    renderModal({
      name: "christmasEventModal",
      header: localization.t("obsoverlays_christmasevent"),
      closeOnEsc: true,
      padding: "0",
      width: "min(1064px, calc(100% - 64px))",
      height: "auto",
      body: "<div id='christmas-modal-app' class='tw-preflight'></div>"
    });
    var _0x42633b = document.querySelector("#christmas-modal-app");
    if (_0x42633b && window.createChristmasEventModal) {
      window.createChristmasEventModal().mount(_0x42633b);
    }
    setTimeout(function () {
      settings.set("christmas-event-displayed", true);
    }, 10000);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      if (christmasevent.fetchedTree && christmasevent.coins !== christmasevent.fetchedTree.coinsCollected) {
        christmasevent.updateTree();
      }
    }
  });
};
christmasevent.setupOnce = _asyncToGenerator(_regeneratorRuntime().mark(function _callee54() {
  return _regeneratorRuntime().wrap(function _0xbdbd67(_0x2c1b9e) {
    while (1) {
      switch (_0x2c1b9e.prev = _0x2c1b9e.next) {
        case 0:
          if (!christmasevent.setupOnceDone) {
            _0x2c1b9e.next = 2;
            break;
          }
          return _0x2c1b9e.abrupt("return");
        case 2:
          christmasevent.setupOnceDone = true;
          setTimeout(function () {
            socketiowrapper.io.on("widgetState", christmasevent.onWidgetState);
          }, 1);
        case 4:
        case "end":
          return _0x2c1b9e.stop();
      }
    }
  }, _callee54);
}));
christmasevent.setup = _asyncToGenerator(_regeneratorRuntime().mark(function _callee57() {
  var _0xa70be6;
  return _regeneratorRuntime().wrap(function _0x25a88a(_0x4523be) {
    while (1) {
      switch (_0x4523be.prev = _0x4523be.next) {
        case 0:
          if (christmasevent.isEnabled) {
            _0x4523be.next = 2;
            break;
          }
          return _0x4523be.abrupt("return", false);
        case 2:
          _0x4523be.next = 4;
          return christmasevent.setupOnce();
        case 4:
          _0xa70be6 = window.session.me.channel.channelName;
          christmasevent.channelName = _0xa70be6;
          christmasevent.channelInterval = setInterval(_asyncToGenerator(_regeneratorRuntime().mark(function _0x285530() {
            return _regeneratorRuntime().wrap(function _0x3681b2(_0x93d9b6) {
              while (1) {
                switch (_0x93d9b6.prev = _0x93d9b6.next) {
                  case 0:
                    if (christmasevent.channelName === window.session.me.channel.channelName) {
                      _0x93d9b6.next = 6;
                      break;
                    }
                    clearInterval(christmasevent.channelInterval);
                    clearInterval(christmasevent.intervalId);
                    _0x93d9b6.next = 5;
                    return christmasevent.setup();
                  case 5:
                    christmasevent.sendUpdate();
                  case 6:
                  case "end":
                    return _0x93d9b6.stop();
                }
              }
            }, _0x285530);
          })), 500);
          if (christmasevent.checkAccepted()) {
            _0x4523be.next = 9;
            break;
          }
          return _0x4523be.abrupt("return", false);
        case 9:
          _0x4523be.next = 11;
          return christmasevent.login();
        case 11:
          if (_0x4523be.sent) {
            _0x4523be.next = 13;
            break;
          }
          return _0x4523be.abrupt("return", false);
        case 13:
          _0x4523be.next = 15;
          return christmasevent.fetchCurrentTree();
        case 15:
          christmasevent.intervalId = setInterval(_asyncToGenerator(_regeneratorRuntime().mark(function _0x2a86ea() {
            return _regeneratorRuntime().wrap(function _0x6cd584(_0x3d02d1) {
              while (1) {
                switch (_0x3d02d1.prev = _0x3d02d1.next) {
                  case 0:
                    if (!christmasevent.fetchedTree || christmasevent.coins === christmasevent.fetchedTree.coinsCollected || !socketiowrapper.isWidgetActive("christmasevent")) {
                      _0x3d02d1.next = 3;
                      break;
                    }
                    _0x3d02d1.next = 3;
                    return christmasevent.updateTree();
                  case 3:
                  case "end":
                    return _0x3d02d1.stop();
                }
              }
            }, _0x2a86ea);
          })), 60000);
          return _0x4523be.abrupt("return", true);
        case 17:
        case "end":
          return _0x4523be.stop();
      }
    }
  }, _callee57);
}));
christmasevent.login = _asyncToGenerator(_regeneratorRuntime().mark(function _callee58() {
  var _0x45892c;
  var _0x5a4718;
  return _regeneratorRuntime().wrap(function _0x1dc629(_0x40caa9) {
    while (1) {
      switch (_0x40caa9.prev = _0x40caa9.next) {
        case 0:
          _0x45892c = window.session.me.channel.channelName;
          _0x40caa9.prev = 1;
          _0x40caa9.next = 4;
          return new Promise(function (_0x55a97f, _0x28ec05) {
            api.doAction("POST", "christmas/login?channel=" + _0x45892c, undefined, function (_0x5d6827) {
              settings.set("christmas_event_participant_id:" + _0x45892c, _0x5d6827.participantId);
              _0x55a97f(_0x5d6827.participantId);
            }, function (_0x25e10b) {
              if (_0x25e10b === 403) {
                christmasevent.isRestricted = true;
              } else if (_0x25e10b === 409) {
                DevExpress.ui.dialog.alert("The maximum participant limit for this channel name has been reached.", "Channel Limit Reached");
              }
              _0x55a97f(null);
            }, false, true);
          });
        case 4:
          _0x5a4718 = _0x40caa9.sent;
          return _0x40caa9.abrupt("return", _0x5a4718 !== null);
        case 8:
          _0x40caa9.prev = 8;
          _0x40caa9.t0 = _0x40caa9.catch(1);
          console.error(_0x40caa9.t0);
          return _0x40caa9.abrupt("return", false);
        case 12:
        case "end":
          return _0x40caa9.stop();
      }
    }
  }, _callee58, null, [[1, 8]]);
}));
christmasevent.fetchCurrentTree = _asyncToGenerator(_regeneratorRuntime().mark(function _callee59() {
  var _0x1386fe;
  var _0x474c76;
  return _regeneratorRuntime().wrap(function _0xc50b3d(_0x1b84ec) {
    while (1) {
      switch (_0x1b84ec.prev = _0x1b84ec.next) {
        case 0:
          if (christmasevent.checkAccepted()) {
            _0x1b84ec.next = 2;
            break;
          }
          return _0x1b84ec.abrupt("return");
        case 2:
          _0x1b84ec.next = 4;
          return new Promise(function (_0x4da6c6, _0x2f0bdd) {
            api.doAction("GET", "christmas/tree", undefined, function (_0x5b0e59) {
              if (_0x5b0e59.status === 200) {
                _0x4da6c6(_0x5b0e59);
              } else {
                _0x2f0bdd(new Error("Unexpected status: " + _0x5b0e59.status));
              }
            }, _0x2f0bdd);
          });
        case 4:
          _0x1386fe = _0x1b84ec.sent;
          if (_0x1386fe.message === "OK") {
            _0x1b84ec.next = 9;
            break;
          }
          _0x474c76 = _0x1386fe.message;
          console.error("Christmas Event: " + _0x474c76);
          return _0x1b84ec.abrupt("return");
        case 9:
          christmasevent.fetchedTree = _0x1386fe;
          christmasevent.totalTreesCompleted = _0x1386fe.totalTreesCompleted;
          christmasevent.coins = _0x1386fe.coinsCollected;
          christmasevent.coinGoal = _0x1386fe.coinGoal;
          christmasevent.nonce = _0x1386fe.nonce;
        case 14:
        case "end":
          return _0x1b84ec.stop();
      }
    }
  }, _callee59);
}));
christmasevent.updateTree = _asyncToGenerator(_regeneratorRuntime().mark(function _callee61() {
  var _0x3ca504;
  var _0x3b654f;
  return _regeneratorRuntime().wrap(function _0x3ee7c9(_0x4635d8) {
    while (1) {
      switch (_0x4635d8.prev = _0x4635d8.next) {
        case 0:
          if (!christmasevent.isRestricted && !!christmasevent.checkAccepted() && !(christmasevent.retryCount > 3)) {
            _0x4635d8.next = 2;
            break;
          }
          return _0x4635d8.abrupt("return");
        case 2:
          if (christmasevent.nonce) {
            _0x4635d8.next = 5;
            break;
          }
          _0x4635d8.next = 5;
          return christmasevent.fetchCurrentTree();
        case 5:
          _0x3ca504 = christmasevent.coins - (christmasevent.fetchedTree?.coinsCollected ?? 0);
          _0x4635d8.next = 8;
          return new Promise(function (_0x3e17ed, _0x503953) {
            api.doAction("PATCH", "christmas/tree", {
              nonce: christmasevent.nonce,
              coinsDelta: _0x3ca504
            }, function (_0x1bb014) {
              _0x3e17ed(_0x1bb014);
            }, function () {
              var _0x47728d = _asyncToGenerator(_regeneratorRuntime().mark(function _0x5ba6d8(_0x127116, _0x3b466b) {
                return _regeneratorRuntime().wrap(function _0x1e7c35(_0x15332e) {
                  while (1) {
                    switch (_0x15332e.prev = _0x15332e.next) {
                      case 0:
                        if (_0x127116 !== 403) {
                          _0x15332e.next = 4;
                          break;
                        }
                        christmasevent.isRestricted = true;
                        _0x503953(new Error("Channel is restricted"));
                        return _0x15332e.abrupt("return");
                      case 4:
                        if (_0x3b466b !== "Invalid nonce" && _0x3b466b !== "Missing nonce") {
                          _0x15332e.next = 11;
                          break;
                        }
                        _0x15332e.next = 7;
                        return christmasevent.fetchCurrentTree();
                      case 7:
                        _0x15332e.next = 9;
                        return christmasevent.updateTree();
                      case 9:
                        christmasevent.retryCount++;
                        return _0x15332e.abrupt("return");
                      case 11:
                      case "end":
                        return _0x15332e.stop();
                    }
                  }
                }, _0x5ba6d8);
              }));
              return function (_0x1b8ba8, _0x3a77eb) {
                return _0x47728d.apply(this, arguments);
              };
            }(), false, true);
          });
        case 8:
          _0x3b654f = _0x4635d8.sent;
          christmasevent.fetchedTree = _0x3b654f;
          christmasevent.totalTreesCompleted = _0x3b654f.totalTreesCompleted;
          christmasevent.coins = _0x3b654f.coinsCollected;
          christmasevent.coinGoal = _0x3b654f.coinGoal;
          christmasevent.nonce = _0x3b654f.nonce;
          christmasevent.retryCount = 0;
          socketiowrapper.emitSocketEvent("christmas-event:update", _0x3b654f);
          return _0x4635d8.abrupt("return", _0x3b654f);
        case 17:
        case "end":
          return _0x4635d8.stop();
      }
    }
  }, _callee61);
}));
christmasevent.isPendingStreak = function (_0x1be8b3) {
  return _0x1be8b3.giftType === 1 && !_0x1be8b3.repeatEnd;
};
christmasevent.onGift = function () {
  var _0xc53038 = _asyncToGenerator(_regeneratorRuntime().mark(function _0x240943(_0x5bccfa) {
    var _0x4a858f;
    return _regeneratorRuntime().wrap(function _0xd0eda1(_0x34bbda) {
      while (1) {
        switch (_0x34bbda.prev = _0x34bbda.next) {
          case 0:
            if (!!christmasevent.isEnabled && !!christmasevent.checkAccepted() && !!socketiowrapper.isWidgetActive("christmasevent")) {
              _0x34bbda.next = 2;
              break;
            }
            return _0x34bbda.abrupt("return");
          case 2:
            if (!christmasevent.isPendingStreak(_0x5bccfa)) {
              _0x34bbda.next = 4;
              break;
            }
            return _0x34bbda.abrupt("return");
          case 4:
            christmasevent.coins += _0x5bccfa.value;
            _0x4a858f = {
              giftPictureUrl: _0x5bccfa.giftPictureUrl,
              giftName: _0x5bccfa.giftName,
              value: _0x5bccfa.value,
              repeatCount: _0x5bccfa.repeatCount,
              username: _0x5bccfa.nickname,
              profilePictureUrl: _0x5bccfa.profilePictureUrl
            };
            socketiowrapper.emitSocketEvent("christmas-event:gift", _0x4a858f);
            if (!(christmasevent.coins >= christmasevent.coinGoal)) {
              _0x34bbda.next = 10;
              break;
            }
            _0x34bbda.next = 10;
            return christmasevent.updateTree();
          case 10:
          case "end":
            return _0x34bbda.stop();
        }
      }
    }, _0x240943);
  }));
  return function (_0x3b86be) {
    return _0xc53038.apply(this, arguments);
  };
}();
christmasevent.onWidgetState = function (_0x5ae726) {
  if (!christmasevent.isEnabled || _0x5ae726.widgetId !== "christmasevent") {
    return;
  }
  christmasevent.sendUpdate();
};
christmasevent.onChannelContextChanged = function () {
  christmasevent.setup();
};
christmasevent.sendUpdate = function () {
  if (!christmasevent.checkAccepted()) {
    socketiowrapper.emitSocketEvent("christmas-event:state", "TERMS");
    return;
  }
  if (christmasevent.isRestricted) {
    socketiowrapper.emitSocketEvent("christmas-event:state", "BANNED");
    return;
  }
  socketiowrapper.emitSocketEvent("christmas-event:update", {
    coinsCollected: christmasevent.coins,
    coinGoal: christmasevent.coinGoal,
    totalTreesCompleted: christmasevent.totalTreesCompleted
  });
};
christmasevent.acceptTerms = _asyncToGenerator(_regeneratorRuntime().mark(function _callee63() {
  var _0x49200d;
  return _regeneratorRuntime().wrap(function _0x49062d(_0x284c47) {
    while (1) {
      switch (_0x284c47.prev = _0x284c47.next) {
        case 0:
          _0x49200d = window.session.me.channel.channelName;
          settings.set(christmasevent.ACCEPTED_KEY + _0x49200d, true);
          _0x284c47.next = 4;
          return christmasevent.setup();
        case 4:
          if (_0x284c47.sent) {
            _0x284c47.next = 7;
            break;
          }
          settings.set(christmasevent.ACCEPTED_KEY + _0x49200d, false);
          return _0x284c47.abrupt("return", false);
        case 7:
          christmasevent.sendUpdate();
          return _0x284c47.abrupt("return", true);
        case 9:
        case "end":
          return _0x284c47.stop();
      }
    }
  }, _callee63);
}));
christmasevent.checkAccepted = function () {
  var _0x501d63 = settings.get("channelname") ?? "";
  return settings.get(christmasevent.ACCEPTED_KEY + _0x501d63) === "true";
};
christmasevent.setupControls = function () {
  setTimeout(function () {
    var _0x18cc3d;
    var _0x332e10;
    var _0x35e41c = $("#widgetChristmasevent");
    var _0x532c6b = _0x35e41c.find("> div");
    if (_0x532c6b.length === 0) {
      return;
    }
    var _0x21fc05 = function _0x2da039() {
      var _0x5c8f8e;
      var _0x15a363;
      var _0x91e49c = (_0x5c8f8e = window.session) === null || _0x5c8f8e === undefined ? undefined : (_0x15a363 = _0x5c8f8e.me) === null || _0x15a363 === undefined ? undefined : _0x15a363.channel?.channelName;
      _0x532c6b.find(".dx-button[aria-label='Copy URL']").addClass("dx-state-disabled");
      _0x532c6b.find(".dx-texteditor-input").addClass("text-primary!").val(_0x91e49c ? localization.t("christmasevent.widgetpreview.accept_message") : localization.t("christmasevent.widgetpreview.login_required"));
    };
    var _0x86489b = function _0x483d1a() {
      _0x532c6b.find(".dx-button[aria-label='Copy URL']").removeClass("dx-state-disabled");
      _0x532c6b.find(".dx-texteditor-input").removeClass("text-primary!").val(obsoverlays.getWidgetPath("christmasevent"));
    };
    var _0x50735a = function _0x39fc90() {
      $(".christmasevent-terms").addClass("hidden");
      $(".christmasevent-accept-wrapper").addClass("hidden");
    };
    var _0x14586e = function _0x5a9ca2() {
      $(".christmasevent-terms").removeClass("hidden");
      $(".christmasevent-accept-wrapper").removeClass("hidden");
    };
    var _0x4a18a1 = (_0x18cc3d = window.session) === null || _0x18cc3d === undefined ? undefined : (_0x332e10 = _0x18cc3d.me) === null || _0x332e10 === undefined ? undefined : _0x332e10.channel?.channelName;
    if (!christmasevent.checkAccepted()) {
      _0x21fc05();
      _0x14586e();
      if (_0x4a18a1) {
        var _0x1ad828 = false;
        var _0x102f31 = $("<div>").dxCheckBox({
          text: localization.t("christmasevent.widgetpreview.accept_label"),
          icon: "fa-regular fa-check",
          onValueChanged: function () {
            var _0xb5393c = _asyncToGenerator(_regeneratorRuntime().mark(function _0x375900(_0x454ec1) {
              return _regeneratorRuntime().wrap(function _0x164190(_0x56c381) {
                while (1) {
                  switch (_0x56c381.prev = _0x56c381.next) {
                    case 0:
                      if (!_0x1ad828) {
                        _0x56c381.next = 3;
                        break;
                      }
                      _0x1ad828 = false;
                      return _0x56c381.abrupt("return");
                    case 3:
                      _0x56c381.next = 5;
                      return christmasevent.acceptTerms();
                    case 5:
                      if (_0x56c381.sent) {
                        _0x56c381.next = 9;
                        break;
                      }
                      _0x1ad828 = true;
                      _0x454ec1.component.option("value", false);
                      return _0x56c381.abrupt("return");
                    case 9:
                      _0x86489b();
                      _0x50735a();
                    case 11:
                    case "end":
                      return _0x56c381.stop();
                  }
                }
              }, _0x375900);
            }));
            function _0x13dfd0(_0x2e4241) {
              return _0xb5393c.apply(this, arguments);
            }
            return _0x13dfd0;
          }()
        });
        var _0x5c2cf5 = $("<div>").addClass("christmasevent-accept-wrapper border border-border-gray bg-secondary rounded-md p-2 py-1 mr-1 whitespace-nowrap").append(_0x102f31);
        _0x532c6b.prepend(_0x5c2cf5);
      }
    } else {
      _0x86489b();
      _0x50735a();
    }
  }, 50);
};
christmasevent.openTermsAndConditions = function () {
  var _0x25bad4 = "\n        <div class=\"tw-preflight p-6 max-h-[70vh] overflow-y-auto text-left\">\n            <h2 class=\"text-2xl font-bold mb-4\">Terms & Conditions - TikFinity Christmas Challenge 2025</h2>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">1. Introduction</h3>\n            <p>These Terms & Conditions govern participation in the TikFinity Christmas Challenge 2025 (the \"Event\").</p>\n            <p>By participating in the Event, you agree to be bound by these Terms & Conditions.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">2. Eligibility</h3>\n            <p><strong>2.1</strong> Participation is open exclusively to TikFinity-verified Streamers who:</p>\n            <ul class=\"list-disc ml-6 mb-3\">\n                <li>Are 18 years of age or older</li>\n                <li>Have a valid TikFinity account</li>\n                <li>Use the Christmas Tree Widget during the Event</li>\n            </ul>\n            <p><strong>2.2</strong> Employees or contractors of the organizer and their household members are not eligible.</p>\n            <p><strong>2.3</strong> No purchase or payment is required to participate or to win.</p>\n            <p><strong>2.4 Account Validation Requirement:</strong> A prize can only be assigned after the participant has validated ownership of their TikTok account by placing a challenge verification code in their TikTok bio as instructed. The organizer must be able to confirm that the TikTok account belongs to the participant.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">3. Event Period</h3>\n            <p>The Event runs from <strong>December 1, 2025 (12:00 UTC)</strong> to <strong>December 26, 2025 (23:59 UTC)</strong>.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">4. How to Participate</h3>\n            <p><strong>4.1</strong> A Streamer enters the Event by installing and using the Christmas Tree Widget while livestreaming.</p>\n            <p><strong>4.2</strong> Viewer gifts add points and decoration progress to the Streamer's current Christmas Tree.</p>\n            <p><strong>4.3</strong> When a tree reaches 100% completion, the Streamer earns one (1) Completed Tree Entry.</p>\n            <p><strong>4.4</strong> Each completed tree also grants the Streamer between one (1) and ten (10) random Final Draw Tickets, which count toward the Grand Prize drawing (see Section 5.8).</p>\n            <p><strong>4.5</strong> After completion, a new tree is automatically generated. Tree difficulty scales progressively based on the Streamer's activity level.</p>\n            <p><strong>4.6</strong> Streamers do not need to spend money to progress or gain entries.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">5. Prizes</h3>\n            <p><strong>5.1</strong> Total prize value: up to €25,000 (excluding the Grand Prize).</p>\n            <p><strong>5.2</strong> Example prize categories:</p>\n            <ul class=\"list-disc ml-6 mb-3\">\n                <li>Virtual prepaid cards (€10 / €20 / €50 / €100 / €200)</li>\n                <li>3× Apple iPhone 17 Pro</li>\n                <li>2× Gaming Notebooks</li>\n                <li>5× Gaming Peripheral Bundles</li>\n            </ul>\n            <p><strong>5.3</strong> Prizes are awarded randomly throughout the Event among Streamers with Completed Tree Entries.</p>\n            <p><strong>5.4</strong> Prizes are non-transferable and cannot be exchanged for cash or any alternative, except as stated below.</p>\n            <p><strong>5.5 International shipping exception:</strong> If delivery of a physical prize to a certain location is not reasonably possible due to cost, logistics, customs, or legal restrictions, the organizer may provide a cash equivalent or digital voucher of equal or comparable value instead.</p>\n            <p><strong>5.6</strong> Winners are responsible for any applicable taxes, customs duties, and legal reporting requirements.</p>\n            <p><strong>5.7</strong> Winners must claim their prize within 48 hours of notification via the method provided. Failure to do so will result in forfeiture of the prize without substitution or compensation.</p>\n            <p><strong>5.8 Digital Cards Expiration:</strong> Some digital cards or vouchers may have an expiration date. Winners will be informed of any expiration period in the prize notification email.</p>\n            \n            <h4 class=\"text-lg font-bold mt-4 mb-2\">5.9 Grand Prize – \"Streamer Bonus\"</h4>\n            <ul class=\"list-disc ml-6 mb-3\">\n                <li>One (1) participant will be randomly selected from all Final Draw Tickets collected between December 1 and December 26, 2025.</li>\n                <li>The drawing will take place on January 05, 2026.</li>\n                <li>The winner will receive a Streamer Bonus of USD 1,000 per month for 12 consecutive months (total value: USD 12,000).</li>\n                <li>The payout will be made monthly through a method chosen by the organizer (e.g., PayPal, bank transfer, or equivalent).</li>\n                <li>No lump-sum or upfront payment is possible.</li>\n                <li>The prize is non-transferable and cannot be exchanged for another payment method or currency.</li>\n                <li>The organizer reserves the right to withhold or adjust payments in case of fraud, violation of TikTok or TikFinity terms, or changes in eligibility status.</li>\n                <li>The winner must confirm and claim the Grand Prize within 48 hours of notification. Failure to respond in time may result in forfeiture and selection of another winner at the organizer's discretion.</li>\n                <li>The winner has no legal claim or entitlement to the continuation of payments if the Event or TikFinity services are discontinued or materially altered.</li>\n                <li>All tax liabilities or reporting obligations arising from receipt of the Streamer Bonus are the sole responsibility of the winner.</li>\n                <li>Participation in the Final Draw does not guarantee any prize or monetary compensation.</li>\n            </ul>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">6. Winner Notification</h3>\n            <p><strong>6.1</strong> Winners will be notified via TikFinity and/or email.</p>\n            <p><strong>6.2</strong> Winners must claim prizes within 48 hours of receiving the notification link or message.</p>\n            <p><strong>6.3</strong> Failure to respond in time may result in forfeiture of the prize and reallocation to another participant.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">7. Leaderboards & Visibility</h3>\n            <p><strong>7.1</strong> A leaderboard may show relative rankings based on tree progress.</p>\n            <p><strong>7.2</strong> No revenue amounts or exact gift values are displayed.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">8. Fraud & Disqualification</h3>\n            <p>The organizer may disqualify any participant for:</p>\n            <ul class=\"list-disc ml-6 mb-3\">\n                <li>Botting or automated gifting</li>\n                <li>Self-funding viewer gifts</li>\n                <li>Account manipulation</li>\n                <li>Violating TikTok or TikFinity terms</li>\n            </ul>\n            <p>All entries and prizes may be forfeited if fraud is detected.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">9. Technical Availability</h3>\n            <p>Platform outages, API issues, or restrictions outside the organizer's control do not create compensation or prize rights.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">10. Sponsorship</h3>\n            <p>Some prizes may be sponsored. Sponsors are not responsible for Event administration or prize fulfillment.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">11. Intellectual Property</h3>\n            <p>All Event artwork, mechanics, and branding belong exclusively to the organizer.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">12. Privacy</h3>\n            <p>Personal data is processed according to TikFinity's Privacy Policy for the purpose of Event administration and prize fulfillment.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">13. Termination & Amendments</h3>\n            <p>The organizer may modify, suspend, or terminate the Event if necessary for technical, legal, or security reasons.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">14. Governing Law & Jurisdiction</h3>\n            <p>This promotion applies a neutral, non-exclusive jurisdiction clause:</p>\n            <ul class=\"list-disc ml-6 mb-3\">\n                <li>Participants may bring disputes in their country of residence or in Germany.</li>\n                <li>Mandatory consumer rights are unaffected.</li>\n            </ul>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">15. Acceptance of Terms</h3>\n            <p>Participation in the Event constitutes full acceptance of these Terms & Conditions.</p>\n            \n            <h3 class=\"text-xl font-bold mt-6 mb-3\">16. Organizer Information</h3>\n            <p><strong>Organizer:</strong></p>\n            <p>STV Live GmbH – operating as TikFinity<br>\n            Lindenstraße 32<br>\n            Commercial Register: HRB 111614<br>\n            Registergericht: local court Saarbrücken<br>\n            VAT ID: DE457387067<br>\n            Contact: support@tikfinity.com</p>\n        </div>\n    ";
  renderModal({
    name: "christmasEventTermsModal",
    header: "Terms & Conditions - TikFinity Christmas Challenge 2025",
    closeOnEsc: true,
    padding: "0",
    width: "min(1064px, calc(100% - 64px))",
    height: "auto",
    body: _0x25bad4
  });
};
christmasevent.openTutorialVideo = function () {
  var _0x598855 = "\n        <div style=\"position:relative;padding-top:56.25%;\"><iframe src=\"https://iframe.mediadelivery.net/embed/313744/8a6cc041-0070-4ccf-bcb3-f6b5fdcd81f9?autoplay=true&loop=true&muted=false&preload=true&responsive=true\" loading=\"lazy\" style=\"border:0;position:absolute;top:0;height:100%;width:100%;left:0;\" allow=\"accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;\" allowfullscreen=\"true\"></iframe></div>\n    ";
  renderModal({
    name: "christmasEventTutorialVideoModal",
    header: localization.t("obsoverlays_christmasevent"),
    closeOnEsc: true,
    padding: "0",
    width: "min(1064px, calc(100% - 64px))",
    height: "auto",
    body: _0x598855
  });
};