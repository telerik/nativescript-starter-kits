interface ITemplateService {

    /**
     * @description Check templates flavors E.g [@angularTs, vanillaJs, Ts ]
     * @param templateName
     * @private
     */
    _checkTemplateFlavor(templateName: string): any;
    /**
     * @description The method returns details about an app template in JSON Format
     */
    getAppTemplateDetails(): any;

    /**
     * @description Download an app template in your local project folder
     * @param templateName <String>
     */
    downloadAppTemplate(templateName: string): void;

    /**
     * @description The method returns details about a page template in JSON Format
     */
    getPageTemplateDetails(): any;

    /**
     * @description Download a page template in your local project folder
     * @param templateName <String>
     */
    downloadPageTemplate(templateName: string): void;


}
