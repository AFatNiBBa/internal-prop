
declare const exports: typeof import("./main");
exports.fromProxy = exports.fromPromise = exports.getOwnPrivateSymbols = void 0;

/** Contains `true` if the loading was successful */
export var ok = true;
try { Object.assign(module.exports, require("../build/internal.node")); }
catch { ok = false; }

/** Possible states of a {@link Promise} */
export enum State { pending, fulfilled, rejected }

/**
 * Gets the [[Target]] and [[Handler]] of {@link obj}.
 * If {@link obj} is not a {@link Proxy} it returns `null`
 * @param obj The {@link Proxy}
 */
export declare function fromProxy(obj: any): [ object, ProxyHandler<object> ];

/**
 * Gets the value and status of {@link obj} synchronously.
 * If {@link obj} is not a {@link Promise} it returns `null`.
 * If the state is {@link State.pending} the value will be `null`
 * @param obj The {@link Promise}
 */
export declare function fromPromise<T>(obj: Promise<T>): [ State, T ];

/**
 * Gets the keys of the private properties of {@link obj}.
 * If {@link obj} is not an object it returns `null`
 * @param obj The object from which to take the private symbols
 */
export declare function getOwnPrivateSymbols(obj: object): symbol[];

/**
 * It returns an object through which you can access the private properties of {@link obj}.
 * @param obj The object to access
 * @param proto If `true` searches for private symbols on the prototype
 * @param out The inspector object
 * @returns The same thing passed to {@link out}
 */
export function accessPrivate(obj: object, proto = false, out?: object): object {
    if (!obj || typeof obj !== "object") return null;

    out ??= {};
    for (const k of exports.getOwnPrivateSymbols(obj))
        if (k.description.startsWith("#"))
            Object.defineProperty(out, k.description.substr(1), { enumerable: true, get: () => obj[k], set: v => obj[k] = v });
    if (proto)
        accessPrivate(Object.getPrototypeOf(obj), true, out);
    return out;
}