interface ITemplateService {

    /**
     * @description The method returns various meta data from template package.json
     * @param packageJson - Valid package.json
     * @returns {Promise<any>} - Template description, version, displayName, gitUrl
     */
    getTemplateMetaData(packageJson: any): any;

    /**
     * @description Check templates flavors E.g [@angularTs, vanillaJs, Ts ]
     * @param templateName
     * @returns {Promise<string>}
     */
    checkTemplateFlavor(packageJson: any): any;

    /**
     * @description The method returns details about an app template.
     * @param templateName <String>
     * @returns Promise
     */
    getAppTemplateDetails(templateName: string): any;

    /**
     * @description Search for all downloaded templates
     * @return Promise
     */
    getTemplates(): any;

    /**
     * @description Download an app template in your local project folder
     * @param templateName <String>
     */
    downloadAppTemplate(templateName: string): void;

    /**
     * @description The method returns details about a page template in JSON Format
     * @param templateName <String>
     * @returns Promise
     */
    getPageTemplateDetails(templateName: string): any;

    /**
     * @description Create App method
     * @param appName
     * @param location
     * @returns Promise
     */
    createApp(appName: string, location: string): any;

    /**
     * @description Add page
     * @param pageName
     * @returns Promise
     */
    addPage(pageName: string, location: string): any;

}
