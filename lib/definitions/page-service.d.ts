interface IPageService {
    getPages(): Promise<any>;
    getFlavor(appPath: string): Promise<string>;
}
