interface ITemplateService {
    /**
     * @description The method returns details about a single app template.
     * @param templateName <String>
     * @returns {Promise<any>}
     */
    getAppTemplateDetails(templateName: string): Promise<any>;

    /**
     * @description The method returns details about all app templates.
     * @return {Promise<Array<any>>}
     */
    getTemplates(): Promise<Array<any>>;
}
