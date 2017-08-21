interface ITemplateService {
    /**
     * @description The method returns details about a single app template.
     * @param templateName <String>
     * @returns Promise
     */
    getAppTemplateDetails(templateName: string): any;

    /**
     * @description The method returns details about all app templates.
     * @return Promise
     */
    getTemplates(): any;
}
