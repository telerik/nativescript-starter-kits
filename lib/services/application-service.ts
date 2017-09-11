import util from "../shared/util";

export class ApplicationService implements IApplicationService {
    constructor(private $pageService: IPageService) { }

    getPages(): Promise<Array<any>> {
        return this.$pageService.getPages();
    }

    getFlavor(appPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getNormalizedAppPath(appPath)
                .then((validPath: string) => {
                    return this.readAppPackageJson(validPath);
                })
                .then((packageJson: string) => {
                    const isAngular: boolean = packageJson.indexOf("nativescript-angular") > -1;
                    const isTypeScript: boolean = packageJson.indexOf("nativescript-dev-typescript") > -1;
                    let flavor = "JavaScript";

                    if (isAngular) {
                        flavor = "Angular & TypeScript";
                    } else if (isTypeScript) {
                        flavor = "TypeScript";
                    }

                    resolve(flavor);
                })
                .catch((promiseError: any) => {
                    reject(promiseError);
                });
        });
    }

    addPage(pageName: string, pageTemplate: any, appPath: string): Promise<string> {
        return this.$pageService.addPage(pageName, pageTemplate, appPath);
    }

    private getNormalizedAppPath(appPath: string) {
        return new Promise((resolve, reject) => {
            if (!util.path.isAbsolute(appPath)) {
                reject(new Error("Path must be absolute"));

                return;
            }

            const normalizedAppPath = util.path.normalize(appPath);

            util.fs.lstat(normalizedAppPath, (statErr: any, stats: any) => {
                if (statErr) {
                    reject(statErr);

                    return;
                }

                if (!stats.isDirectory()) {
                    reject(new Error("Not a valid app folder!"));
                } else {
                    resolve(normalizedAppPath);
                }
            });
        });
    }

    private readAppPackageJson(appPath: string) {
        const packageJsonFile = "package.json";

        return new Promise((resolve, reject) => {
            util.fs.readdir(appPath, (readErr: any, files: any) => {
                if (readErr) {
                    reject(readErr);

                    return;
                }

                if (files.indexOf(packageJsonFile) > -1) {
                    const packageJsonPath = util.path.join(appPath, packageJsonFile);

                    util.fs.readFile(packageJsonPath, "utf8", (fileErr: any, data: any) => {
                        if (fileErr) {
                            reject(fileErr);

                            return;
                        }
                        resolve(data);
                    });
                } else {
                    reject(new Error("Missing package.json file in path " + appPath));
                }
            });
        });
    }
}

$injector.register("applicationService", ApplicationService);
