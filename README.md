# nativescript-starter-kits
A NativeScript CLI extension for managing templates

## Automatic Installation

You can install this extension using the Nativescript CLI

```bash
$ tns extension install nativescript-starter-kits
```

## Manual Installation and Development

Download the GIT repository in you favorite projects directory

```bash
$ git clone git@github.com:NativeScript/nativescript-starter-kits.git

```

Run the following commands to install all dependencies, transpile all Ts files and to pack the extension.

```bash
$ npm i --ignore-scripts
$ npm i -g grunt-cli (only in case you do not have it installed globally)

$ grunt
$ grunt pack
```
These commands will create a .tgz file in the extension folder

Install the npm package 

```bash
$ tns extension install <path to nativescript-starter-kits>.tgz
```
## Public API
Get proper `nativescript` reference
```JavaScript
const pathToPackage = require("global-modules-path").getPath("nativescript", "tns");
const tns = require(pathToPackage);

```

Load all available extensions
```JavaScript
/**
     * @name loadExtensions
     * @description Loads all currently installed extensions
     * @return {Promise<any>[]} - On Success: Array of Promises, one for each installed extension
*/
Promise.all(tns.extensibilityService.loadExtensions()).then((loadedExtensions) => {
    console.log("All extensions loaded successfully!");
}).catch((error) => {
    console.error(error);
});
```

##### Get details for all installed templates

```TypeScript
/**
     * @name getTemplates
     * @description List all available templates
     * @return {Promise<Array<any>>} - On Success: Array of Objects with Details about each template
*/
tns.templateService.getTemplates().then((templates) => {
    console.log(templates);
}).catch((error) => {
    console.error(error);
});
```

##### Get details for a single App template

```typescript
/**
     * @name getAppTemplateDetails
     * @description The method returns details about a single app template.
     * @param {string} templateName - The name of the template
     * @returns {Promise<any>} - Object with details about the app template
     */
    getAppTemplateDetails(templateName: string): any;
    
tns.templateService.getAppTemplateDetails("templateName").then((details) => {
    console.log(details);
}).catch((error) => {
    console.error(error);
});
```

## Run tests 
Before running the test you need to transpile all files and dependencies.

```bash
$ grunt pack
$ npm run test
```
## Issues
If you have found an issue with this extension, please report the problem in the   [Issues](https://github.com/NativeScript/nativescript-starter-kits/issues) section.








