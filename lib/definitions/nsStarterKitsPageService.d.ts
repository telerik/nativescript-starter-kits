interface INsStarterKitsPageService {
    getPages(): Promise<any>;
    addPage(pageName: string, pageTemplate: any, appPath: string, version?: string): Promise<string>;
}
