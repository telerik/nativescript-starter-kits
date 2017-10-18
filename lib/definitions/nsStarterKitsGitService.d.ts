interface INsStarterKitsGitService {
    getPackageJsonFromSource(templateName: string): Promise<any>;
    getAssetsContent(templateName: string, versionTag: string): Promise<any>;
}
