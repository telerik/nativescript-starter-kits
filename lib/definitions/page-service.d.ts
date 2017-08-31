interface IPageService {
    getPages(): Promise<any>;
    getFlavor(appPath: string): Promise<any>;
    addPage(pageName: string, appPath: string, pageTemplate: any): Promise<any>;
}
