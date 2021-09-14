
/*
    [WIP]: Don't return the special private symbol
    [WIP]: Return the method symbols
*/

try
{
    const lib = module.exports = require(`../build/Release/internal.node`);

    /**
     * If only an object gets supplied it returns an object through which you can access the private properties of "obj".
     * If you supply 4 arguments, a getter and a setter will be created on "bind" and they will be named "name", they will point to the "key" property of "obj".
     * @param {Object} obj The object of which you want to access the private properties
     * @param {Symbol} key The private symbol to access
     * @param {Object} bind The object on which you want to mount the getters and setters
     * @param {String | Symbol} name The name that will be given to the getter and setter
     * @returns The inspector object
     */
    function privateAccess(obj, key, bind, name)
    {
        if (!(obj instanceof Object))
            return null;
        else if (arguments.length > 1)
        {
            if (!obj.hasOwnProperty?.(key))
                return privateAccess(Object.getPrototypeOf(obj), key, bind, name);
            bind.__defineGetter__(name, () => obj[key]);
            bind.__defineSetter__(name, v => obj[key] = v);
        }
        else
        {
            const out = {};
            for (const sym of lib.getOwnPrivateSymbols(obj))
                if (sym.description[0] === "#")
                    privateAccess(obj, sym, out, sym.description.substr(1));
            return out;
        }
    }

    Object.assign(lib, { privateAccess });
}
catch { module.exports = undefined; }