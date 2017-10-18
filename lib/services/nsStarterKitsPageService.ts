import util from "../shared/util";

const _ = require("lodash");

// Pages backup data
const BACKUP = require("../../consts/pages-backup-data");
const ejs = require("ejs");

export class NsStarterKitsPageService implements INsStarterKitsPageService {

    constructor(private $nsStarterKitsNpmService: INsStarterKitsNpmService) {
    }

    getPages() {
        return new Promise((resolve, reject) => {
            resolve(BACKUP.fallback);
        });
    }

    addPage(pageName: string, pageTemplate: any, appPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const displayName = pageTemplate.displayName.toLowerCase();
            const newPageDirectory = util.path.join(appPath, "app");
            const pagesDirectory = util.path.join(__dirname, "../pages");
            const emptyPackageJson: any = {name: "pageTemplate"};

            util.fs.emptyDir(pagesDirectory)
                .then(() => {
                    return util.fs.outputJson(util.path.join(pagesDirectory, "package.json"), emptyPackageJson);
                })
                .then(() => {
                    return util.pageExists(newPageDirectory, pageName);
                })
                .then((pageExists: boolean) => {
                    if (pageExists) {
                        return Promise.reject(new Error(`Page with the name "${pageName}" already exists`));
                    }

                    return this.$nsStarterKitsNpmService.installPageTemplateFromNpm(displayName, pageTemplate.templateFlavor, pagesDirectory);
                })
                .then((downloadPath: any) => {
                    return this.createPage(downloadPath, newPageDirectory, pageName);
                })
                .then(() => {
                    resolve(newPageDirectory);
                })
                .catch((promiseError: any) => {
                    reject(promiseError);
                });
        });
    }

    private createPage(sourceDirectory: string, destinationDirectory: string, pageName: string): Promise<string> {
        const camelCaseNameString = _.camelCase(pageName);
        const pageDirectoryPath = util.path.join(destinationDirectory, pageName);

        const newPageName = {
            originalName: pageName,
            pascalCaseName: _.upperFirst(camelCaseNameString),
            camelCaseName: camelCaseNameString
        };

        return new Promise((resolve, reject) => {
            this.prepareRenderedFiles(sourceDirectory, newPageName)
                .then((renderedPageFiles) => {
                    util.fs.ensureDir(pageDirectoryPath, (error: any) => {
                        if (error) {
                            reject(error);

                            return;
                        }

                        renderedPageFiles.forEach((page: any) => {
                            const filePath = util.path.join(pageDirectoryPath, page.filename);

                            try {
                                util.fs.writeFileSync(filePath, page.content, "utf8");
                            } catch (error) {
                                return Promise.reject(error);
                            }
                        });

                        return resolve();
                    });
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    private renderFile(filePath: string, pageName: any): Promise<any> {
        const directoryName = util.path.basename(util.path.dirname(filePath));
        const filename = util.path.basename(filePath);
        const newFileName = filename.replace(directoryName, pageName.originalName);

        const data = {
            OriginalName: pageName.originalName,
            PascalCaseName: pageName.pascalCaseName,
            CamelCaseName: pageName.camelCaseName
        };

        return new Promise((resolve, reject) => {
            ejs.renderFile(filePath, data, (error: any, renderedContent: any) => {
                if (error) {
                    return Promise.reject(new Error("Fail to render file with: " + error));
                }

                resolve({
                    filename: newFileName,
                    content: renderedContent
                });
            });
        });
    }

    private prepareRenderedFiles(sourceDirectory: string, pageName: any): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            util.fs.readdir(sourceDirectory, (error: any, files: any) => {
                if (error) {
                    reject(error);

                    return;
                }

                const promises: Array<any> = [];

                files.forEach((file: any) => {
                    const filePath = util.path.join(sourceDirectory, file);
                    const stat = util.fs.statSync(filePath);

                    if (stat.isFile()) {
                        promises.push(this.renderFile(filePath, pageName));
                    }
                });

                Promise.all(promises)
                    .then((newPageFiles) => {
                        resolve(newPageFiles);
                    })
                    .catch((errorPromises) => {
                        reject(errorPromises);
                    });
            });
        });
    }
}

$injector.register("nsStarterKitsPageService", NsStarterKitsPageService);
