
/** The exports of the current module */
declare const exports: typeof import("./index");
exports.getProxyData = exports.getPromiseData = exports.getOwnPrivateSymbols = undefined!; // If I don't do this, the result of `import()` won't contain these functions
Object.assign(exports, require("./internal.node"));

/** Possible states of a {@link Promise} */
export enum State { pending, fulfilled, rejected }

/** Possible content of a promise */
export type PromiseResult<T> = { state: State.pending, result: null } | { state: State.fulfilled, result: T } | { state: State.rejected, result: any };

/**
 * Gets the target and the handler of a {@link Proxy}
 * If {@link obj} is not a {@link Proxy} it returns `null`
 * @param obj The {@link Proxy} from which to get the data
 */
export declare function getProxyData(obj: object): { target: object, handler: ProxyHandler<object> };

/**
 * Gets the state and the result of a {@link Promise} synchronously
 * @param obj The {@link Promise} from which to get the data
 */
export declare function getPromiseData<T>(obj: Promise<T>): PromiseResult<T>;

/**
 * Gets the keys of the private properties of {@link obj}.
 * There is a special type of private symbol that, if used as a key, can crash the application, it doesn't start with "#"
 * @param obj The object from which to take the private symbols
 */
export declare function getOwnPrivateSymbols(obj: object): symbol[];

/**
 * It returns an object through which you can access the private properties of {@link obj}
 * @param obj The object to access
 * @param useProto If `true` searches for private symbols on the prototype
 * @param out The object in which to define the accessors to the private fields
 * @returns The same thing passed to {@link out}
 */
export function getPrivateSymbolsProxy(obj: object, useProto = false, out = {}): object {
    var temp: string | undefined;
    for (const k of exports.getOwnPrivateSymbols(obj))
        if ((temp = k.description) && temp.startsWith("#")) // Excludes the special dangerous private symbols
            Object.defineProperty(out, temp.substring(1), { enumerable: true, get: () => (<any>obj)[k], set: v => (<any>obj)[k] = v });
    
    if (!useProto) return out;
    const proto = Object.getPrototypeOf(obj);
    return proto ? getPrivateSymbolsProxy(proto, true, out) : out;
}