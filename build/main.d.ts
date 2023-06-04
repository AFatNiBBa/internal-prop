/** Contains `true` if the loading was successful */
export declare var ok: boolean;
/** Possible states of a {@link Promise} */
export declare enum State {
    pending = 0,
    fulfilled = 1,
    rejected = 2
}
/**
 * Gets the [[Target]] and [[Handler]] of {@link obj}.
 * If {@link obj} is not a {@link Proxy} it returns `null`
 * @param obj The {@link Proxy}
 */
export declare function fromProxy(obj: any): [object, ProxyHandler<object>];
/**
 * Gets the value and status of {@link obj} synchronously.
 * If {@link obj} is not a {@link Promise} it returns `null`.
 * If the state is {@link State.pending} the value will be `null`
 * @param obj The {@link Promise}
 */
export declare function fromPromise<T>(obj: Promise<T>): [State, T];
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
export declare function accessPrivate(obj: object, proto?: boolean, out?: object): object;
