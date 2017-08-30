interface IPageService {
    getPages(flavor: string): Promise<any>;
    getFlavor(appPath: string): Promise<string>;
}
