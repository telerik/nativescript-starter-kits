# UiKitsCliExtension
A NativeScript CLI extension for managing templates

## Installation and Development

Download the GIT repository in you favorite projects directory

```bash
$ git clone git@github.com:borisKarastanev/UiKitsCliExtension.git

```

Run the following commands to install all dependencies, transpile all Ts files and to pack the extension.

```bash
$ npm i --ignore-scripts
$ npm i -g grunt-cli (only in case you do not have it installed globally)

$ grunt
$ grunt pack
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
     * @description List all downloaded templates
     * @return Promise - On Success: Details about each installed template; On Error Promise is rejected
*/
tns.templateService.getAvailableTemplates().then((templates) => {
    console.log(templates);
}).catch((error) => {
    console.error(error);
});
```

##### Get details for a single App template

```typescript
/**
     * @description The method returns details about an app template.
     * @param templateName <String>
     * @returns Promise 
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
     * @description The method returns details about a page template in JSON Format
     * @param templateName <String>
     */
    getPageTemplateDetails(templateName: string): any;
    
tns.templateService.getPageTemplateDetails("templateName").then((details) => {
    console.log(details);
}).catch((error) => {
    console.error(error);
});
```

##### Create App
```typescript
/**
     * @description Create App method
     * @param appName
     * @param location
     * @returns Promise
     */
    createApp(appName: string, location: string): any;

tns.templateService.createApp("appName", process.cwd()).then((success) => {
    console.log(success);
}).catch((error) => {
    console.error(error);
});
```

##### Add Page
```typescript
 /**
     * @description Add page
     * @param pageName
     * @returns Promise
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
     * @description Check templates flavors E.g [@angularTs, vanillaJs, Ts ]
     * @param templateName
     * @returns String
     */
    checkTemplateFlavor(templateName: string): string;
    
let flavor = tns.templateService.checkTemplateFlavor("templateName");
```

##### Get Template Version

```typescript
 /**
     * @description Get template current version
     * @param templateName
     * @returns String
     */
    getTemplateVersion(templateName: string): string;
    
let version = tns.templateService.getTemplateVersion("templateName");
```

##### Get Template Description

```typescript
/**
     * @description Get template description
     * @param templateName
     * @returns String
     */
    getTemplateDescription(templateName: string): string;
    
let description = tns.templateService.getTemplateDescription("templateName");
```








