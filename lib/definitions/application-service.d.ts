interface IApplicationService {
    /**
     * @description The method returns details about all pages.
     * @returns {Promise<Array<any>>}
     */
    getPages(): Promise<Array<any>>;

    /**
     * @description The method returns the flavor of an application.
     * @param appPath <String> Absolute path to application root directory.
     * @returns {Promise<string>}
     */
    getFlavor(appPath: string): Promise<string>;

    /**
     * @description The method adds new page to application.
     * @param pageName <String> Name of the page
     * @param appPath <String> Absolute path to application root directory.
     * @param pageTemplate <Object> Page template details .
     * @returns {Promise<string>}
     */
    addPage(pageName: string, pageTemplate: any, appPath: string): Promise<string>;
}
