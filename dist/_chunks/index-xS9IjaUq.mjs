import * as React from "react";
import React__default, { useRef, useEffect, useContext, useState, forwardRef } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { arrayMoveImmutable } from "array-move";
import "react-dom";
import { useFetchClient, useNotification, useAPIErrorHandler } from "@strapi/strapi/admin";
import { Box, Flex, Typography, Divider, Button, Popover, IconButton } from "@strapi/design-system";
import { Drag } from "@strapi/icons";
import { useIntl } from "react-intl";
import { useSensors, useSensor, PointerSensor, TouchSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, SortableContext, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const PLUGIN_ID = "drag-drop-content-types";
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
var shim = { exports: {} };
var useSyncExternalStoreShim_production_min = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_production_min;
function requireUseSyncExternalStoreShim_production_min() {
  if (hasRequiredUseSyncExternalStoreShim_production_min)
    return useSyncExternalStoreShim_production_min;
  hasRequiredUseSyncExternalStoreShim_production_min = 1;
  var e = React__default;
  function h(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  var k = "function" === typeof Object.is ? Object.is : h, l = e.useState, m = e.useEffect, n = e.useLayoutEffect, p = e.useDebugValue;
  function q(a, b) {
    var d = b(), f = l({ inst: { value: d, getSnapshot: b } }), c = f[0].inst, g = f[1];
    n(function() {
      c.value = d;
      c.getSnapshot = b;
      r(c) && g({ inst: c });
    }, [a, d, b]);
    m(function() {
      r(c) && g({ inst: c });
      return a(function() {
        r(c) && g({ inst: c });
      });
    }, [a]);
    p(d);
    return d;
  }
  function r(a) {
    var b = a.getSnapshot;
    a = a.value;
    try {
      var d = b();
      return !k(a, d);
    } catch (f) {
      return true;
    }
  }
  function t(a, b) {
    return b();
  }
  var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
  useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
  return useSyncExternalStoreShim_production_min;
}
var useSyncExternalStoreShim_development = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_development;
function requireUseSyncExternalStoreShim_development() {
  if (hasRequiredUseSyncExternalStoreShim_development)
    return useSyncExternalStoreShim_development;
  hasRequiredUseSyncExternalStoreShim_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var React2 = React__default;
      var ReactSharedInternals = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      function is(x, y) {
        return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
      }
      var objectIs = typeof Object.is === "function" ? Object.is : is;
      var useState2 = React2.useState, useEffect2 = React2.useEffect, useLayoutEffect = React2.useLayoutEffect, useDebugValue = React2.useDebugValue;
      var didWarnOld18Alpha = false;
      var didWarnUncachedGetSnapshot = false;
      function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
        {
          if (!didWarnOld18Alpha) {
            if (React2.startTransition !== void 0) {
              didWarnOld18Alpha = true;
              error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
            }
          }
        }
        var value = getSnapshot();
        {
          if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            if (!objectIs(value, cachedValue)) {
              error("The result of getSnapshot should be cached to avoid an infinite loop");
              didWarnUncachedGetSnapshot = true;
            }
          }
        }
        var _useState = useState2({
          inst: {
            value,
            getSnapshot
          }
        }), inst = _useState[0].inst, forceUpdate = _useState[1];
        useLayoutEffect(function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          if (checkIfSnapshotChanged(inst)) {
            forceUpdate({
              inst
            });
          }
        }, [subscribe, value, getSnapshot]);
        useEffect2(function() {
          if (checkIfSnapshotChanged(inst)) {
            forceUpdate({
              inst
            });
          }
          var handleStoreChange = function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          };
          return subscribe(handleStoreChange);
        }, [subscribe]);
        useDebugValue(value);
        return value;
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        var prevValue = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(prevValue, nextValue);
        } catch (error2) {
          return true;
        }
      }
      function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
        return getSnapshot();
      }
      var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
      var isServerEnvironment = !canUseDOM;
      var shim2 = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
      var useSyncExternalStore$2 = React2.useSyncExternalStore !== void 0 ? React2.useSyncExternalStore : shim2;
      useSyncExternalStoreShim_development.useSyncExternalStore = useSyncExternalStore$2;
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
  return useSyncExternalStoreShim_development;
}
if (process.env.NODE_ENV === "production") {
  shim.exports = requireUseSyncExternalStoreShim_production_min();
} else {
  shim.exports = requireUseSyncExternalStoreShim_development();
}
var shimExports = shim.exports;
var withSelector_production_min = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredWithSelector_production_min;
function requireWithSelector_production_min() {
  if (hasRequiredWithSelector_production_min)
    return withSelector_production_min;
  hasRequiredWithSelector_production_min = 1;
  var h = React__default, n = shimExports;
  function p(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  var q = "function" === typeof Object.is ? Object.is : p, r = n.useSyncExternalStore, t = h.useRef, u = h.useEffect, v = h.useMemo, w = h.useDebugValue;
  withSelector_production_min.useSyncExternalStoreWithSelector = function(a, b, e, l, g) {
    var c = t(null);
    if (null === c.current) {
      var f = { hasValue: false, value: null };
      c.current = f;
    } else
      f = c.current;
    c = v(function() {
      function a2(a3) {
        if (!c2) {
          c2 = true;
          d2 = a3;
          a3 = l(a3);
          if (void 0 !== g && f.hasValue) {
            var b2 = f.value;
            if (g(b2, a3))
              return k = b2;
          }
          return k = a3;
        }
        b2 = k;
        if (q(d2, a3))
          return b2;
        var e2 = l(a3);
        if (void 0 !== g && g(b2, e2))
          return b2;
        d2 = a3;
        return k = e2;
      }
      var c2 = false, d2, k, m = void 0 === e ? null : e;
      return [function() {
        return a2(b());
      }, null === m ? void 0 : function() {
        return a2(m());
      }];
    }, [b, e, l, g]);
    var d = r(a, c[0], c[1]);
    u(function() {
      f.hasValue = true;
      f.value = d;
    }, [d]);
    w(d);
    return d;
  };
  return withSelector_production_min;
}
var withSelector_development = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredWithSelector_development;
function requireWithSelector_development() {
  if (hasRequiredWithSelector_development)
    return withSelector_development;
  hasRequiredWithSelector_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var React2 = React__default;
      var shim2 = shimExports;
      function is(x, y) {
        return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
      }
      var objectIs = typeof Object.is === "function" ? Object.is : is;
      var useSyncExternalStore = shim2.useSyncExternalStore;
      var useRef2 = React2.useRef, useEffect2 = React2.useEffect, useMemo = React2.useMemo, useDebugValue = React2.useDebugValue;
      function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
        var instRef = useRef2(null);
        var inst;
        if (instRef.current === null) {
          inst = {
            hasValue: false,
            value: null
          };
          instRef.current = inst;
        } else {
          inst = instRef.current;
        }
        var _useMemo = useMemo(function() {
          var hasMemo = false;
          var memoizedSnapshot;
          var memoizedSelection;
          var memoizedSelector = function(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = true;
              memoizedSnapshot = nextSnapshot;
              var _nextSelection = selector(nextSnapshot);
              if (isEqual !== void 0) {
                if (inst.hasValue) {
                  var currentSelection = inst.value;
                  if (isEqual(currentSelection, _nextSelection)) {
                    memoizedSelection = currentSelection;
                    return currentSelection;
                  }
                }
              }
              memoizedSelection = _nextSelection;
              return _nextSelection;
            }
            var prevSnapshot = memoizedSnapshot;
            var prevSelection = memoizedSelection;
            if (objectIs(prevSnapshot, nextSnapshot)) {
              return prevSelection;
            }
            var nextSelection = selector(nextSnapshot);
            if (isEqual !== void 0 && isEqual(prevSelection, nextSelection)) {
              return prevSelection;
            }
            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;
            return nextSelection;
          };
          var maybeGetServerSnapshot = getServerSnapshot === void 0 ? null : getServerSnapshot;
          var getSnapshotWithSelector = function() {
            return memoizedSelector(getSnapshot());
          };
          var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? void 0 : function() {
            return memoizedSelector(maybeGetServerSnapshot());
          };
          return [getSnapshotWithSelector, getServerSnapshotWithSelector];
        }, [getSnapshot, getServerSnapshot, selector, isEqual]), getSelection = _useMemo[0], getServerSelection = _useMemo[1];
        var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
        useEffect2(function() {
          inst.hasValue = true;
          inst.value = value;
        }, [value]);
        useDebugValue(value);
        return value;
      }
      withSelector_development.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector;
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
  return withSelector_development;
}
if (process.env.NODE_ENV === "production") {
  requireWithSelector_production_min();
} else {
  requireWithSelector_development();
}
const ContextKey = Symbol.for(`react-redux-context`);
const gT = typeof globalThis !== "undefined" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function getContext() {
  var _gT$ContextKey;
  if (!React.createContext)
    return {};
  const contextMap = (_gT$ContextKey = gT[ContextKey]) != null ? _gT$ContextKey : gT[ContextKey] = /* @__PURE__ */ new Map();
  let realContext = contextMap.get(React.createContext);
  if (!realContext) {
    realContext = React.createContext(null);
    if (process.env.NODE_ENV !== "production") {
      realContext.displayName = "ReactRedux";
    }
    contextMap.set(React.createContext, realContext);
  }
  return realContext;
}
const ReactReduxContext = /* @__PURE__ */ getContext();
function createReduxContextHook(context = ReactReduxContext) {
  return function useReduxContext2() {
    const contextValue = useContext(context);
    if (process.env.NODE_ENV !== "production" && !contextValue) {
      throw new Error("could not find react-redux context value; please ensure the component is wrapped in a <Provider>");
    }
    return contextValue;
  };
}
const useReduxContext = /* @__PURE__ */ createReduxContextHook();
var reactIs$1 = { exports: {} };
var reactIs_production_min$1 = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_production_min$1;
function requireReactIs_production_min$1() {
  if (hasRequiredReactIs_production_min$1)
    return reactIs_production_min$1;
  hasRequiredReactIs_production_min$1 = 1;
  var b = "function" === typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ? Symbol.for("react.suspense_list") : 60120, r = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.block") : 60121, w = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y = b ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u = a.$$typeof;
      switch (u) {
        case c:
          switch (a = a.type, a) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case n:
                case t:
                case r:
                case h:
                  return a;
                default:
                  return u;
              }
          }
        case d:
          return u;
      }
    }
  }
  function A(a) {
    return z(a) === m;
  }
  reactIs_production_min$1.AsyncMode = l;
  reactIs_production_min$1.ConcurrentMode = m;
  reactIs_production_min$1.ContextConsumer = k;
  reactIs_production_min$1.ContextProvider = h;
  reactIs_production_min$1.Element = c;
  reactIs_production_min$1.ForwardRef = n;
  reactIs_production_min$1.Fragment = e;
  reactIs_production_min$1.Lazy = t;
  reactIs_production_min$1.Memo = r;
  reactIs_production_min$1.Portal = d;
  reactIs_production_min$1.Profiler = g;
  reactIs_production_min$1.StrictMode = f;
  reactIs_production_min$1.Suspense = p;
  reactIs_production_min$1.isAsyncMode = function(a) {
    return A(a) || z(a) === l;
  };
  reactIs_production_min$1.isConcurrentMode = A;
  reactIs_production_min$1.isContextConsumer = function(a) {
    return z(a) === k;
  };
  reactIs_production_min$1.isContextProvider = function(a) {
    return z(a) === h;
  };
  reactIs_production_min$1.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
  };
  reactIs_production_min$1.isForwardRef = function(a) {
    return z(a) === n;
  };
  reactIs_production_min$1.isFragment = function(a) {
    return z(a) === e;
  };
  reactIs_production_min$1.isLazy = function(a) {
    return z(a) === t;
  };
  reactIs_production_min$1.isMemo = function(a) {
    return z(a) === r;
  };
  reactIs_production_min$1.isPortal = function(a) {
    return z(a) === d;
  };
  reactIs_production_min$1.isProfiler = function(a) {
    return z(a) === g;
  };
  reactIs_production_min$1.isStrictMode = function(a) {
    return z(a) === f;
  };
  reactIs_production_min$1.isSuspense = function(a) {
    return z(a) === p;
  };
  reactIs_production_min$1.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
  };
  reactIs_production_min$1.typeOf = z;
  return reactIs_production_min$1;
}
var reactIs_development$1 = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_development$1;
function requireReactIs_development$1() {
  if (hasRequiredReactIs_development$1)
    return reactIs_development$1;
  hasRequiredReactIs_development$1 = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var hasSymbol = typeof Symbol === "function" && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
      function isValidElementType(type) {
        return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
      }
      function typeOf(object) {
        if (typeof object === "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return void 0;
      }
      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment2 = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }
      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      reactIs_development$1.AsyncMode = AsyncMode;
      reactIs_development$1.ConcurrentMode = ConcurrentMode;
      reactIs_development$1.ContextConsumer = ContextConsumer;
      reactIs_development$1.ContextProvider = ContextProvider;
      reactIs_development$1.Element = Element;
      reactIs_development$1.ForwardRef = ForwardRef;
      reactIs_development$1.Fragment = Fragment2;
      reactIs_development$1.Lazy = Lazy;
      reactIs_development$1.Memo = Memo;
      reactIs_development$1.Portal = Portal;
      reactIs_development$1.Profiler = Profiler;
      reactIs_development$1.StrictMode = StrictMode;
      reactIs_development$1.Suspense = Suspense;
      reactIs_development$1.isAsyncMode = isAsyncMode;
      reactIs_development$1.isConcurrentMode = isConcurrentMode;
      reactIs_development$1.isContextConsumer = isContextConsumer;
      reactIs_development$1.isContextProvider = isContextProvider;
      reactIs_development$1.isElement = isElement;
      reactIs_development$1.isForwardRef = isForwardRef;
      reactIs_development$1.isFragment = isFragment;
      reactIs_development$1.isLazy = isLazy;
      reactIs_development$1.isMemo = isMemo;
      reactIs_development$1.isPortal = isPortal;
      reactIs_development$1.isProfiler = isProfiler;
      reactIs_development$1.isStrictMode = isStrictMode;
      reactIs_development$1.isSuspense = isSuspense;
      reactIs_development$1.isValidElementType = isValidElementType;
      reactIs_development$1.typeOf = typeOf;
    })();
  }
  return reactIs_development$1;
}
if (process.env.NODE_ENV === "production") {
  reactIs$1.exports = requireReactIs_production_min$1();
} else {
  reactIs$1.exports = requireReactIs_development$1();
}
var reactIsExports = reactIs$1.exports;
var reactIs = reactIsExports;
var FORWARD_REF_STATICS = {
  "$$typeof": true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  "$$typeof": true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
var reactIs_production_min = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_production_min;
function requireReactIs_production_min() {
  if (hasRequiredReactIs_production_min)
    return reactIs_production_min;
  hasRequiredReactIs_production_min = 1;
  var b = Symbol.for("react.element"), c = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), e = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), h = Symbol.for("react.context"), k = Symbol.for("react.server_context"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), n = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), t = Symbol.for("react.offscreen"), u;
  u = Symbol.for("react.module.reference");
  function v(a) {
    if ("object" === typeof a && null !== a) {
      var r = a.$$typeof;
      switch (r) {
        case b:
          switch (a = a.type, a) {
            case d:
            case f:
            case e:
            case m:
            case n:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case h:
                case l:
                case q:
                case p:
                case g:
                  return a;
                default:
                  return r;
              }
          }
        case c:
          return r;
      }
    }
  }
  reactIs_production_min.ContextConsumer = h;
  reactIs_production_min.ContextProvider = g;
  reactIs_production_min.Element = b;
  reactIs_production_min.ForwardRef = l;
  reactIs_production_min.Fragment = d;
  reactIs_production_min.Lazy = q;
  reactIs_production_min.Memo = p;
  reactIs_production_min.Portal = c;
  reactIs_production_min.Profiler = f;
  reactIs_production_min.StrictMode = e;
  reactIs_production_min.Suspense = m;
  reactIs_production_min.SuspenseList = n;
  reactIs_production_min.isAsyncMode = function() {
    return false;
  };
  reactIs_production_min.isConcurrentMode = function() {
    return false;
  };
  reactIs_production_min.isContextConsumer = function(a) {
    return v(a) === h;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return v(a) === g;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === b;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return v(a) === l;
  };
  reactIs_production_min.isFragment = function(a) {
    return v(a) === d;
  };
  reactIs_production_min.isLazy = function(a) {
    return v(a) === q;
  };
  reactIs_production_min.isMemo = function(a) {
    return v(a) === p;
  };
  reactIs_production_min.isPortal = function(a) {
    return v(a) === c;
  };
  reactIs_production_min.isProfiler = function(a) {
    return v(a) === f;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return v(a) === e;
  };
  reactIs_production_min.isSuspense = function(a) {
    return v(a) === m;
  };
  reactIs_production_min.isSuspenseList = function(a) {
    return v(a) === n;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === d || a === f || a === e || a === m || a === n || a === t || "object" === typeof a && null !== a && (a.$$typeof === q || a.$$typeof === p || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l || a.$$typeof === u || void 0 !== a.getModuleId) ? true : false;
  };
  reactIs_production_min.typeOf = v;
  return reactIs_production_min;
}
var reactIs_development = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_development;
function requireReactIs_development() {
  if (hasRequiredReactIs_development)
    return reactIs_development;
  hasRequiredReactIs_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
            return true;
          }
        }
        return false;
      }
      function typeOf(object) {
        if (typeof object === "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_SERVER_CONTEXT_TYPE:
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return void 0;
      }
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment2 = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var SuspenseList = REACT_SUSPENSE_LIST_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      var hasWarnedAboutDeprecatedIsConcurrentMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.");
          }
        }
        return false;
      }
      function isConcurrentMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
            hasWarnedAboutDeprecatedIsConcurrentMode = true;
            console["warn"]("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.");
          }
        }
        return false;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      function isSuspenseList(object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
      }
      reactIs_development.ContextConsumer = ContextConsumer;
      reactIs_development.ContextProvider = ContextProvider;
      reactIs_development.Element = Element;
      reactIs_development.ForwardRef = ForwardRef;
      reactIs_development.Fragment = Fragment2;
      reactIs_development.Lazy = Lazy;
      reactIs_development.Memo = Memo;
      reactIs_development.Portal = Portal;
      reactIs_development.Profiler = Profiler;
      reactIs_development.StrictMode = StrictMode;
      reactIs_development.Suspense = Suspense;
      reactIs_development.SuspenseList = SuspenseList;
      reactIs_development.isAsyncMode = isAsyncMode;
      reactIs_development.isConcurrentMode = isConcurrentMode;
      reactIs_development.isContextConsumer = isContextConsumer;
      reactIs_development.isContextProvider = isContextProvider;
      reactIs_development.isElement = isElement;
      reactIs_development.isForwardRef = isForwardRef;
      reactIs_development.isFragment = isFragment;
      reactIs_development.isLazy = isLazy;
      reactIs_development.isMemo = isMemo;
      reactIs_development.isPortal = isPortal;
      reactIs_development.isProfiler = isProfiler;
      reactIs_development.isStrictMode = isStrictMode;
      reactIs_development.isSuspense = isSuspense;
      reactIs_development.isSuspenseList = isSuspenseList;
      reactIs_development.isValidElementType = isValidElementType;
      reactIs_development.typeOf = typeOf;
    })();
  }
  return reactIs_development;
}
if (process.env.NODE_ENV === "production") {
  requireReactIs_production_min();
} else {
  requireReactIs_development();
}
function createStoreHook(context = ReactReduxContext) {
  const useReduxContext$1 = (
    // @ts-ignore
    context === ReactReduxContext ? useReduxContext : (
      // @ts-ignore
      createReduxContextHook(context)
    )
  );
  return function useStore2() {
    const {
      store
    } = useReduxContext$1();
    return store;
  };
}
const useStore = /* @__PURE__ */ createStoreHook();
function createDispatchHook(context = ReactReduxContext) {
  const useStore$1 = (
    // @ts-ignore
    context === ReactReduxContext ? useStore : createStoreHook(context)
  );
  return function useDispatch2() {
    const store = useStore$1();
    return store.dispatch;
  };
}
const useDispatch = /* @__PURE__ */ createDispatchHook();
const GET_DATA = "ContentManager/ListView/GET_DATA";
const GET_DATA_SUCCEEDED = "ContentManager/ListView/GET_DATA_SUCCEEDED";
function getData(uid, params) {
  return {
    type: GET_DATA,
    uid,
    params
  };
}
function getDataSucceeded(pagination, data) {
  return {
    type: GET_DATA_SUCCEEDED,
    pagination,
    data
  };
}
function useQueryParams() {
  const [params, setParams] = useState(null);
  useEffect(() => {
    const q = new Proxy(new URLSearchParams(window.location.search), {
      get: (queryParams, prop) => queryParams.get(prop.toString())
    });
    setParams(q);
  }, [window.location.search]);
  return { queryParams: params };
}
const getTranslation = (id) => `${PLUGIN_ID}.${id}`;
const CustomItem = forwardRef(
  ({ item, isOpacityEnabled, isDragging, style, ...props }, ref) => {
    const styles = {
      opacity: isOpacityEnabled ? "0.4" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      lineHeight: "0.5",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style
    };
    const ellipsis = (str, num = str.length, ellipsisStr = "...") => str.length >= num ? str.slice(0, num >= ellipsisStr.length ? num - ellipsisStr.length : num) + ellipsisStr : str;
    item.title = ellipsis(item.title ?? "", 100);
    item.subtitle = ellipsis(item.subtitle ?? "", 30);
    return /* @__PURE__ */ jsx("div", { ref, style: styles, ...props, children: /* @__PURE__ */ jsx(
      Box,
      {
        style: { zIndex: 10, cursor: "all-scroll", userSelect: "none" },
        background: "neutral0",
        hasRadius: true,
        shadow: "filterShadow",
        padding: 2,
        margin: 1,
        children: /* @__PURE__ */ jsxs(Flex, { flexDirection: "row", alignItems: "center", gap: 4, children: [
          /* @__PURE__ */ jsx(Drag, {}),
          /* @__PURE__ */ jsx(Typography, { children: item.title })
        ] })
      }
    ) });
  }
);
const SortableListItem = ({ item, ...props }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id
  });
  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition || void 0
  };
  return /* @__PURE__ */ jsx(
    CustomItem,
    {
      item,
      ref: setNodeRef,
      style: styles,
      isOpacityEnabled: isDragging,
      ...props,
      ...attributes,
      ...listeners
    }
  );
};
function getSubtitle(entry, subTitleField, titleField) {
  try {
    if (subTitleField && entry[subTitleField]) {
      if (entry[subTitleField].constructor.name == "Array") {
        if (entry[subTitleField].length > 0)
          return ` - ${entry[subTitleField][0][titleField]}`;
      } else if (typeof entry[subTitleField] === "object") {
        return ` - ${entry[subTitleField][titleField]}`;
      } else {
        return ` - ${entry[subTitleField]}`;
      }
    }
    return "";
  } catch (e) {
    console.log("Unsupported subtitle field value.", e);
    return "";
  }
}
function getTitle(entry, titleField, mainField) {
  const title = entry[titleField] ? entry[titleField] : entry[mainField];
  return title?.toString();
}
const SortableList = ({ data, onShowMore, hasMore, settings, onSortEnd }) => {
  const { formatMessage } = useIntl();
  let { title, subtitle, mainField } = settings;
  subtitle = subtitle ?? "";
  mainField = mainField ?? "";
  const convertDataItem = (pageEntry) => {
    return {
      ...pageEntry,
      title: getTitle(pageEntry, title, mainField),
      subtitle: getSubtitle(pageEntry, subtitle, title)
    };
  };
  const defaultItems = data.map((x) => convertDataItem(x));
  const [items, setItems] = useState(defaultItems);
  if (items.length !== defaultItems.length)
    setItems(defaultItems);
  const [activeItem, setActiveItem] = useState();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveItem(items.find((item) => item.id === active.id));
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over)
      return;
    const activeItem2 = items.find((item) => item.id === active.id);
    const overItem = items.find((item) => item.id === over.id);
    if (!activeItem2 || !overItem) {
      return;
    }
    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);
    if (activeIndex !== overIndex) {
      setItems((prev) => arrayMove(prev, activeIndex, overIndex));
    }
    setActiveItem(void 0);
    onSortEnd({ oldIndex: activeIndex, newIndex: overIndex });
  };
  const handleDragCancel = () => {
    setActiveItem(void 0);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DndContext,
      {
        sensors,
        collisionDetection: closestCenter,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDragCancel: handleDragCancel,
        children: /* @__PURE__ */ jsx(SortableContext, { items, children: items.map((item) => /* @__PURE__ */ jsx(SortableListItem, { item }, item.id)) })
      }
    ),
    /* @__PURE__ */ jsx(Divider, { marginTop: 1, marginBottom: 0 }),
    /* @__PURE__ */ jsx(Box, { padding: 1, children: /* @__PURE__ */ jsx(Button, { size: "S", disabled: hasMore ? true : false, onClick: onShowMore, children: formatMessage({ id: getTranslation("plugin.settings.sortableList.showMore") }) }) })
  ] });
};
const SortMenu = ({ status, data, onSortEnd, onShowMore, hasMore, settings }) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = React__default.useRef(null);
  const togglePortal = React__default.useCallback(() => {
    setVisible((prev) => !prev);
  }, []);
  const handleClose = React__default.useCallback((event) => {
    if (event?.target?.id !== "drag-drop-content-type-plugin--sort-menu-button") {
      setVisible(false);
    }
  }, []);
  return /* @__PURE__ */ jsx(React__default.Fragment, { children: /* @__PURE__ */ jsxs(Popover.Root, { children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { children: /* @__PURE__ */ jsx(
      IconButton,
      {
        id: "drag-drop-content-type-plugin--sort-menu-button",
        ref: buttonRef,
        variant: "secondary",
        disabled: status === "success" ? false : true,
        withTooltip: true,
        onClick: togglePortal,
        label: "Open Sort Menu",
        children: /* @__PURE__ */ jsx(Drag, {})
      }
    ) }),
    /* @__PURE__ */ jsx(
      Popover.Content,
      {
        onEscapeKeyDown: handleClose,
        onPointerDownOutside: handleClose,
        style: { minWidth: "800px", marginRight: "16px", marginTop: "6px" },
        children: /* @__PURE__ */ jsx(
          SortableList,
          {
            data,
            onShowMore,
            onSortEnd,
            hasMore,
            settings
          }
        )
      }
    )
  ] }) });
};
const SortModal = () => {
  const { get, post, put } = useFetchClient();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState();
  const [status, setStatus] = useState("loading");
  const [mainField, setMainField] = useState("id");
  const [uid, setUid] = useState(null);
  const [settings, setSettings] = useState({
    rank: "",
    title: "",
    subtitle: "",
    mainField: null
  });
  const [noEntriesFromNextPage, setNoEntriesFromNextPage] = useState(0);
  const { queryParams } = useQueryParams();
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const paths = window.location.pathname.split("/");
  const contentTypePath = paths[paths.length - 1];
  const params = queryParams;
  const pageSize = parseInt(params?.pageSize) ?? 0;
  const currentPage = parseInt(params?.page) ?? 0;
  const locale = params?.["plugins[i18n][locale]"];
  const listIncrementSize = pageSize ? pageSize / 2 : 1;
  const hasMore = noEntriesFromNextPage ? noEntriesFromNextPage + listIncrementSize >= data?.length - 1 : false;
  const refetchEntries = React__default.useCallback(
    () => dispatch(getData(uid, void 0)),
    [dispatch]
  );
  const refetchEntriesSucceeded = React__default.useCallback(
    (pagination2, newData) => {
      dispatch(getDataSucceeded(pagination2, newData));
    },
    [dispatch, pagination, data]
  );
  const fetchContentTypeConfig = async () => {
    try {
      const { data: data2 } = await get(
        `/content-manager/content-types/${contentTypePath}/configuration`
      );
      const settings2 = data2.data.contentType?.settings;
      setMainField(settings2.mainField);
      setUid(data2.data.contentType?.uid);
      setNoEntriesFromNextPage(settings2.pageSize / 2);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchSettings = async () => {
    try {
      const { data: data2 } = await get(`/drag-drop-content-types/settings`);
      let fetchedSettings = {
        rank: data2.body.rank,
        title: data2.body.title?.length > 0 ? data2.body.title : mainField,
        subtitle: data2.body.subtitle?.length > 0 ? data2.body.subtitle : null,
        mainField
      };
      setSettings(fetchedSettings);
    } catch (e) {
      console.log(e);
    }
  };
  const getPageEntries = async () => {
    if (pageSize) {
      const sortIndexParam = {
        contentType: contentTypePath,
        rankFieldName: settings.rank,
        start: Math.max(
          0,
          (currentPage - 1) * pageSize - noEntriesFromNextPage
        ),
        limit: currentPage === 1 ? pageSize + noEntriesFromNextPage : pageSize + 2 * noEntriesFromNextPage,
        locale
      };
      const results = await post(`/drag-drop-content-types/sort-index`, sortIndexParam);
      return results;
    }
  };
  const initializeContentType = async () => {
    try {
      if (settings?.rank) {
        const entries = await getPageEntries();
        if (entries?.data?.length) {
          const firstEntry = entries.data[0];
          const firstEntryRank = firstEntry[settings.rank];
          if (entries.data?.length > 0 && firstEntryRank && !!firstEntryRank.toString()) {
            setStatus("success");
          }
        }
      }
    } catch (e) {
      console.log("Could not initialize content type", e);
      setStatus("error");
    }
  };
  const fetchContentType = async () => {
    try {
      const entries = await getPageEntries();
      if (entries?.data?.length) {
        setStatus("success");
        setData(entries.data);
        const { data: data2 } = await get(
          `/content-manager/collection-types/${contentTypePath}?sort=${settings.rank}:asc&page=${currentPage}&pageSize=${pageSize}&locale=${locale}`
        );
        setPagination(data2.pagination);
      }
    } catch (e) {
      console.log("Could not fetch content type", e);
      setStatus("error");
    }
  };
  const updateContentType = async (item) => {
    const { oldIndex, newIndex } = item;
    try {
      const sortedList = arrayMoveImmutable(data, oldIndex, newIndex);
      const rankUpdates = [];
      let rankHasChanged = false;
      for (let i = 0; i < sortedList.length; i++) {
        if (sortedList[i].id != data[i].id) {
          const newRank = pageSize * (currentPage - 1) + i || 0;
          const update = {
            id: sortedList[i].id,
            rank: newRank
          };
          rankUpdates.push(update);
          rankHasChanged = true;
        } else if (rankHasChanged) {
          break;
        }
      }
      await put("/drag-drop-content-types/batch-update", {
        contentType: contentTypePath,
        updates: rankUpdates
      });
      let sortedListViewEntries = currentPage == 1 ? sortedList.slice(0, pageSize) : sortedList.length < pageSize ? sortedList.slice(noEntriesFromNextPage, sortedList.length) : sortedList.slice(
        noEntriesFromNextPage,
        pageSize + noEntriesFromNextPage
      );
      setData(sortedList);
      setStatus("success");
      afterUpdate(sortedListViewEntries, pagination);
    } catch (e) {
      console.log("Could not update content type:", e);
      toggleNotification({
        type: "warning",
        message: formatAPIError(e)
      });
      setStatus("error");
    }
  };
  const afterUpdate = (newData, pagination2) => {
    refetchEntries();
    if (pagination2)
      refetchEntriesSucceeded(pagination2, newData);
  };
  const showMoreHandler = () => {
    setNoEntriesFromNextPage(noEntriesFromNextPage + listIncrementSize);
  };
  useEffect(() => {
    fetchContentTypeConfig();
  }, []);
  useEffect(() => {
    fetchSettings();
  }, [mainField]);
  useEffect(() => {
    if (settings?.rank) {
      initializeContentType();
    }
  }, [settings]);
  useEffect(() => {
    if (settings?.rank && pageSize && currentPage) {
      fetchContentType();
    }
  }, [noEntriesFromNextPage, locale, pageSize, currentPage, settings]);
  return (
    // <CheckPermissions permissions={pluginPermissions.main}>
    /* @__PURE__ */ jsx(
      SortMenu,
      {
        data,
        status,
        onOpen: fetchContentType,
        onSortEnd: updateContentType,
        onShowMore: showMoreHandler,
        hasMore,
        settings
      }
    )
  );
};
const pluginPermissions = {
  main: [{ action: "plugin::drag-drop-content-types.read", subject: null }]
};
const prefixPluginTranslations = (trad, pluginId) => {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {});
};
const index = {
  register(app) {
    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.plugin.name`,
          defaultMessage: "Drag Drop Content Types"
        },
        permissions: pluginPermissions.main
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.plugin.configuration`,
            defaultMessage: "Configuration"
          },
          id: "settings",
          to: `${PLUGIN_ID}`,
          Component: () => import("./Settings-gWqOcSLt.mjs")
        }
      ]
    );
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  bootstrap(app) {
    app.getPlugin("content-manager").injectComponent("listView", "actions", {
      name: "sort-component",
      Component: SortModal
    });
  },
  async registerTrads(app) {
    const { locales } = app;
    const importedTranslations = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-bxpER_P-.mjs"), "./translations/fr.json": () => import("./fr-hkSxFuzl.mjs") }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return importedTranslations;
  }
};
export {
  getTranslation as g,
  index as i
};
//# sourceMappingURL=index-xS9IjaUq.mjs.map
