
declare module "internal-prop" {
    /**
     * Promise possible statuses.
     */
    export type Status = "fulfilled" | "pending" | "rejected";

    /**
     * Gets the [[Target]] and [[Handler]] of "obj".
     * If "obj" is not a `Proxy` returns `null`.
     * @param obj A `Proxy`
     */
    export function fromProxy(obj: Proxy): [ object, object ];

    /**
     * Gets the value and status of "obj".
     * If "obj" is not a `Promise` returns `null`.
     * @param obj A `Proxy`
     */
    export function fromPromise(obj: Promise): [ Status, any ];

    /**
     * Gets the keys of the private properties of "obj".
     * If "obj" is not an `Object` returns `null`.
     * @param obj A `Proxy`
     */
    export function getOwnPrivateSymbols(obj: object): symbol[];

    /**
     * It returns an object through which you can access the private properties of "obj".
     * @param obj The object of which you want to access the private properties
     * @returns The inspector object
     */
    export function privateAccess(obj: object): object;

    /**
     * A getter and a setter will be created on "bind" and they will be named "name", they will point to the "key" property of "obj".
     * @param obj The object of which you want to access the private properties
     * @param key The private symbol to access
     * @param bind The object on which you want to mount the getters and setters
     * @param name The name that will be given to the getter and setter
     * @returns The inspector object
     */
    export function privateAccess(obj: object, key: symbol, bind: object, name?: string | symbol): object;
}