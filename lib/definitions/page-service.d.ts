interface IPageService {
    getPages(flavor: string): Promise<any>;
    checkFlavor(appPath: string): Promise<string>;
}
