
try 
{
    const lib = module.exports = require(`../build/Release/internal.node`);

    /**
     * Returns an object through which you can access the private properties of "obj"
     * @param {Object} obj The object of which you want to access the private properties
     * @returns The inspector object
     */
    function privateAccess(obj)
    {
        if (typeof obj === "object" || typeof obj === "function")
        {
            const out = {};
            for (const sym of lib.getOwnPrivateSymbols(obj))
            {
                if (sym.description[0] === "#")
                {
                    const key = sym.description.substr(1);
                    out.__defineGetter__(key, () => obj[sym]);
                    out.__defineSetter__(key, v => obj[sym] = v);
                }
            }
            return out;
        }
        else return null;
    }

    Object.assign(lib, { privateAccess });
}
catch { module.exports = undefined; }