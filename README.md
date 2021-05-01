To reset permisisons, use

```bash
adb shell pm reset-permissions
```

Run on device/emulator.

Upon accepting permissions, all test should appear successful.

## Adding tests

There are two parts to adding tests

First, the `index.html` file contains a table e.g:

```html
<table>
    <tbody>
        <tr>
            <td>Test</td>
            <td>Result</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Directories</strong></td>
        </tr>
        <tr>
            <td>List Files</td>
            <td><span id="listDirectoriesTest"></span></td>
        </tr>
        ...
    </tbody>
</table>
```

The results are tied by an ID. The content of the result `td` tag should be of either `span` or `img`.

If `span`, the resolution result will be attached to it's `innerHTML`.
If `img`, the resolution will be set to it's `src` attribute.

Inside the `index.js` file there is a global `testMethods` array:

```javascript
let testMethods = [
    async function listDirectoriesTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalRootDirectory + 'Download',
                function(dirEntry) {
                    let reader = dirEntry.createReader();
                    reader.readEntries(function(results) {
                        if (results.length > 0) {
                            resolve('Success');
                        }
                    }, reject);
                },
                reject
            );
        });
    },
    ...
];
```
Each test function should return a promise. You may have notice that the function name matches the id of our `span` tag in the HTML. These are how results are tied. `listDirectoriesTest` resolution result will appear in the `innerHTML` of `listDirectoriesTest` span tag.
