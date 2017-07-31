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
```JavaScript
const tns = require("nativescript");

```

Load all available extensions
```JavaScript
tns.extensibilityService.loadExtensions();
```

##### Get details for all installed templates

```TypeScript
/**
     * @name getTemplates
     * @description List all downloaded templates
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
     * @description The method returns details about an app template.
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

##### Get details for a single Page template
```typescript
/**
     * @name getPageTemplateDetails
     * @description The method returns details about a page template in JSON Format
     * @param {string} templateName The name of the template
     * @returns {Promise<any>} - Object with details about the page template
     */
    getPageTemplateDetails(templateName: string): any;
    
tns.templateService.getPageTemplateDetails("templateName").then((details) => {
    console.log(details);
}).catch((error) => {
    console.error(error);
});
```

##### Add Page
```typescript
 /**
     * @name addPage
     * @description Add page
     * @param {String} pageName - Name of the page you want to add
     * @param {String} location - The template location
     * @returns {Promise<any>} - Object with operation details
     */
    addPage(pageName: string, location: string): any;
    
tns.templateService.addPage("pageName", process.cwd()).then((success) => {
    console.log(success);
}).catch((error) => {
    console.error(error);
});
    
```

##### Check Template Flavor

```typescript
/**
     * @name checkTemplateFlavor
     * @description Check templates flavors E.g [@angularTs, vanillaJs, Ts ]
     * @param {string} templateName - The name of the template 
     * @returns {string} - Template flavor 
     */
    checkTemplateFlavor(templateName: string): string;
    
let flavor = tns.templateService.checkTemplateFlavor("templateName");
```

##### Get Template Version

```typescript
 /**
     * @name getTemplateVersion
     * @description Get the template current version
     * @param {string} templateName - The name of the template 
     * @returns {string} - Template version 
     */
    getTemplateVersion(templateName: string): string;
    
let version = tns.templateService.getTemplateVersion("templateName");
```

##### Get Template Description

```typescript
/**
     * @name getTemplateDescription
     * @description Get template description
     * @param {string} templateName The name of the template 
     * @returns {String} - Description about the template 
     */
    getTemplateDescription(templateName: string): string;
    
let description = tns.templateService.getTemplateDescription("templateName");
```








