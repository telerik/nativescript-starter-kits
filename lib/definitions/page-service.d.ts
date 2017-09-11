interface IPageService {
    getPages(): Promise<any>;
    addPage(pageName: string, appPath: string, pageTemplate: any): Promise<any>;
}
