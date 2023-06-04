
# internal-prop
Gives access to native objects internal properties, such as a proxy's `[[Target]]` or `[[Handler]]` or objects' private fields

## Warning
This module is native, it means that it contains c++ code that gets compiled every time the module is installed to ensure that the binaries can be read by your machine, the problem is that node apparently uses external tools that may be not present in your machine. <br>
If you don't have the necessary to compile the binaries `npm` should tell you what you need too do to achieve that. <br>

## Usage
The module gives you indipendent functions that you can use to extract internal properties of objects
```js
import { ok, fromProxy, fromPromise, getOwnPrivateSymbols } from "internal-prop";
```
If you've gotten to this point there should be no issue but you can still check `ok` to see if the loading went well. <br>
Each function accept an object and returns an array of its internal properties. <br>
If the object is not of the correct type (e.g. `fromProxy(obj)` wants `obj` to be a proxy) the function will return `null`

## Supported
- **`Proxy`** 
    - `fromProxy()` function
    - The array contains the `[[Target]]` and then the `[[Handler]]`
- **`Promise`** 
    - `fromPromise()` function
    - The array contains the `[[PromiseState]]` and then the `[[PromiseResult]]`
    - The state can be:
        - `pending` (`0`) and `null`
        - `fulfilled` (`1`) and the result of the promise
        - `rejected` (`2`) and the error
- **`Private Fields`** 
    - `getOwnPrivateSymbols()` function
    - The array contains a list of the private keys in the object (They are a special kind of symbols)
    - You can use the `accessPrivate()` function to obtain an object containing a getter and a setter for each private symbol of the passed object (Except for one strange symbol that makes node crash if you try to read its value). <br> You can use the function like this:
        ```js
        const { accessPrivate } = require("internal-prop");
        
        class Class { #field = 1; get() { return this.#field; } }

        const inst = new Class();
        const priv = accessPrivate(inst);
        console.log(priv.field, inst.get()); // 1 1
        priv.field = 3;
        console.log(priv.field, inst.get()); // 3 3
        ```
        ### But doesn't it break encapsulation?
        <img src="https://i.imgur.com/7LrSrmZ.jpg" width=100 />