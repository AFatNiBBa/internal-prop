
# internal-prop
Gives access to native objects internal properties, such as a proxy's `[[Target]]` or `[[Handler]]` or the private fields of an object

## Warning
This module is native, it means that it contains c++ code that gets compiled every time the module is installed to ensure that the binaries can be read by your machine, the problem is that node apparently uses external tools that may be not present in your machine. <br>
If you don't have the necessary to compile the binaries `npm` should tell you what you need too do to achieve that. <br>
If the compilation fails regardless try deleting the `node-gyp` cache folder (Located at `%LocalAppData%\node-gyp` on windows)

## Usage
The module gives you indipendent functions that you can use to extract internal properties of objects
```js
import { getProxyData, getPromiseData, getOwnPrivateSymbols, getPrivateSymbolsProxy } from "internal-prop";
```

## Supported

### `getProxyData()`
If the provided value is a `Proxy`, it returns an object containing the target and the handler, otherwise it returns `null`

### `getPromiseData()`
If the provided value is a `Promise`, it returns an object (`PromiseResult`) containing the state and the eventual result, otherwise it returns `null`.
The returned state can be:
- `pending` (`0`): The result will be `null`
- `fulfilled` (`1`): The result of the `Promise`
- `rejected` (`2`): The result will be the error that occurred

### `getOwnPrivateSymbols()`
If the provided value is an `Object`, it returns an array containing the private keys in the object (They are a special kind of symbols)

### `getPrivateSymbolsProxy()`
Creates an object containing a property for each private symbol of the passed object.
You can use the function like this:
```ts
import { getPrivateSymbolsProxy } from "internal-prop";

class Class { #field = 1; get() { return this.#field; } }

const inst = new Class();
const priv = getPrivateSymbolsProxy(inst);
console.log(priv.field, inst.get()); // → 1 1
priv.field = 3;
console.log(priv.field, inst.get()); // → 3 3
```

## But doesn't it break encapsulation?
<img src="https://i.imgur.com/7LrSrmZ.jpg" width=100 />