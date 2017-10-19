interface INsStarterKitsNpmService {
    getNpmPackageVersion(templateName: string): Promise<any>;
    installPageTemplate(pageName: string, flavor: string, templatesDirectory: string): Promise<any>;
}
