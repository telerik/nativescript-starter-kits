interface INsStarterKitsNpmService {
    getNpmPackageVersion(templateName: string): Promise<any>;
    installPageTemplateFromNpm(pageName: string, flavor: string, templatesDirectory: string): Promise<any>;
}
