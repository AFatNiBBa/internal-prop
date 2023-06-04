(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.accessPrivate = exports.State = exports.ok = void 0;
    exports.fromProxy = exports.fromPromise = exports.getOwnPrivateSymbols = void 0;
    /** Contains `true` if the loading was successful */
    exports.ok = true;
    try {
        Object.assign(module.exports, require("../build/internal.node"));
    }
    catch {
        exports.ok = false;
    }
    /** Possible states of a {@link Promise} */
    var State;
    (function (State) {
        State[State["pending"] = 0] = "pending";
        State[State["fulfilled"] = 1] = "fulfilled";
        State[State["rejected"] = 2] = "rejected";
    })(State = exports.State || (exports.State = {}));
    /**
     * It returns an object through which you can access the private properties of {@link obj}.
     * @param obj The object to access
     * @param proto If `true` searches for private symbols on the prototype
     * @param out The inspector object
     * @returns The same thing passed to {@link out}
     */
    function accessPrivate(obj, proto = false, out) {
        if (!obj || typeof obj !== "object")
            return null;
        out ??= {};
        for (const k of exports.getOwnPrivateSymbols(obj))
            if (k.description.startsWith("#"))
                Object.defineProperty(out, k.description.substr(1), { enumerable: true, get: () => obj[k], set: v => obj[k] = v });
        if (proto)
            accessPrivate(Object.getPrototypeOf(obj), true, out);
        return out;
    }
    exports.accessPrivate = accessPrivate;
});
