interface IGitService {
    getPackageJsonFromSource(templateName: string): Promise<any>;
    getAssetsContent(templateName: string): Promise<any>;
}
