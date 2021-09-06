
# internal-prop
Gives access to native objects internal properties, such as a proxy's `[[Target]]` or `[[Handler]]`

## Warning
This module is native, it means that it contains c++ code that gets compiled every time the module is installed to ensure that the binaries can be read by your machine, the problem is that node apparently uses external tools that may be not present in your machine. <br>
If the compiled code can't be found, `undefined` will be returned. <br>
If when installing you get an error like `"npm ERR! Exit handler never called!"` you can fix it in two ways:
- Downgrade `npm` and reinstall
    ```bash
    npm i -g npm@6
    npm i internal-prop
    ```
- Without deleting anything, go to your package folder and run:
    ```bash
    cd node_modules/internal-prop
    npm i
    ```
If you don't have the necessary to compile the binaries `npm` should tell you what you need too do to achieve that

## Usage
The module gives you indipendent functions that you can use to extract internal properties of objects
```js
const { fromProxy, fromPromise } = require("internal-prop");
```
Each function accept an object and returns an array of its internal properties <br>
If the object is not of the correct type (e.g. `fromProxy(obj)` wants `obj` to be a proxy) the function will return `null`

## Supported
- **`Proxy`** 
    - `fromProxy()` function
    - The array contains the `[[Target]]` and then the `[[Handler]]`
- **`Promise`** 
    - `fromPromise()` function
    - The array contains the `[[PromiseState]]` and then the `[[PromiseResult]]`
    - The values can be:
        - `"fulfilled"` and the result of the promise
        - `"pending"` and `null`
        - `"rejected"` and the error