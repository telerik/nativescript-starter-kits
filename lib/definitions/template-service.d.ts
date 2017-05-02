interface ITemplateService {
    /**
     * @description The method returns details about a template in JSON Format
     */
    getTemplateDetails(): any;

    /**
     * @description Download a template in your local project folder
     * @param templateName <String>
     */
    downloadTemplate(templateName: string): void;
}
