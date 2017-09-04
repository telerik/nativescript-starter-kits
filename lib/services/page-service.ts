import util from "../shared/util";

// Pages backup data
const BACKUP = require("../../consts/pages-backup-data");

export class PageService implements IPageService {
    getPages() {
        return new Promise((resolve, reject) => {
            resolve(BACKUP.fallback);
        });
    }

    getFlavor(appPath: string) {
        return new Promise((resolve, reject) => {
            this.getAppPath(appPath)
                .then((validPath: string) => {
                    return this.readAppsPackageJson(validPath);
                })
                .then((packageJson: string) => {
                    const ng = packageJson.indexOf("nativescript-angular") > -1;
                    const ts = packageJson.indexOf("nativescript-dev-typescript") > -1;

                    switch (true) {
                        case ng :
                            resolve("Angular & TypeScript");
                            break;
                        case ts :
                            resolve("TypeScript");
                            break;
                        default:
                            resolve("JavaScript");

                    }
                })
                .catch((promiseError: any) => {
                   reject(promiseError);
                });
        });
    }

    addPage(pageName: string, appPath: string, pageTemplate: any) {
        return new Promise((resolve, reject) => {
            const displayName = pageTemplate.displayName.toLowerCase();

            util.pageExists(appPath, pageName)
                .then((pageExists: boolean) => {
                    if (!pageExists) {
                        this.downloadPage(displayName, pageTemplate.flavor)
                            .then((downloadPath: any) => {
                                // TODO Add ejs template rendering here
                                resolve("success");
                            })
                            .catch((promiseError: any) => {
                                reject(promiseError);
                            });
                    } else {
                        resolve(`Page with the name: ${pageName} already exists`);
                    }
                });
        });
    }

    private getAppPath(appPath: string) {
        return new Promise((resolve, reject) => {
            if (!util.path.isAbsolute(appPath)) {
                reject("Path must be absolute");
            }

            appPath = util.path.normalize(appPath);

            util.fs.lstat(appPath, (statErr: any, stats: any) => {
                if (statErr) {
                    reject(statErr);
                }

                if (!stats.isDirectory()) {
                    reject("Not a valid app folder!");
                } else {
                    resolve(appPath);
                }
            });

        });
    }

    private readAppsPackageJson(appPath: string) {
        return new Promise((resolve, reject) => {
            util.fs.readdir(appPath, (readErr: any, files: any) => {
                if (readErr) {
                    reject(readErr);
                }

                if (files.indexOf("package.json") > -1) {
                   const packageJsonPath = util.path.join(appPath, "package.json");

                   util.fs.readFile(packageJsonPath, "utf8", (fileErr: any, data: any) => {
                       if (fileErr) {
                           reject(readErr);
                       }
                       resolve(data);
                   })
                } else {
                    reject("Missing package.json file in path " + appPath);
                }

            });
        });

    }

    private downloadPage(pageName: string, flavor: string) {
        const templatesDir = util.path.join(__dirname, "../templates");
        const command = "git";
        const commandArgs: Array<any> = ["clone"];

        return new Promise((resolve, reject) => {
            util.fs.ensureDir(templatesDir)
                .then(() => {
                    return util.pageExists(templatesDir, pageName);
                })
                .then((pageExists: boolean) => {
                    if (!pageExists) {
                        return util.getPageTemplatesBaseUrl(flavor);
                    } else {
                        // TODO If the page template indeed still exists in the tmp folder
                        // just copy the content to the app dir
                        resolve("Page Already exists");
                    }
                })
                .then((baseUrl: string) => {
                    baseUrl = baseUrl + ".git";
                    commandArgs.push(baseUrl);
                    commandArgs.push(templatesDir);

                    const process = util.childProcess.spawn(command, commandArgs);
                    process.on("close", (code) => {
                        if (code !== 0) {
                            reject(`child process exited with code ${code}`);
                        } else {
                            const pagePath = util.path.join(templatesDir, pageName);
                            resolve(pagePath);
                        }
                    });
                })
                .catch((downloadPageError: any) => {
                    reject(downloadPageError);
                });
        });
    }
}

$injector.register("pageService", PageService);
