interface ITemplateService {

    /**
     * @description Check templates flavors E.g [@angularTs, vanillaJs, Ts ]
     * @param templateName
     * @returns String
     */
    checkTemplateFlavor(templateName: string): string;

    /**
     * @description Get template current version
     * @param templateName
     * @returns String
     */
    getTemplateVersion(templateName: string): string;

    /**
     * @description Get template description
     * @param templateName
     * @returns String
     */
    getTemplateDescription(templateName: string): string;

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
    getAvailableTemplates(): any;

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
