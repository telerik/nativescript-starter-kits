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
            this.downloadPage(pageName)
            .then((result: any) => {
                resolve("success");
            })
            .catch((promiseError) => {
                reject(promiseError);
            });
        });
    }

    private getAppPath(appPath: string) {
        return new Promise((resolve, reject) => {
            if (!util.path.isAbsolute(appPath)) {
                reject("Path must be absolute");
            }

            appPath = util.path.normalize(appPath);

            util.fs.lstat(appPath, (statErr, stats) => {
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
            util.fs.readdir(appPath, (readErr, files) => {
                if (readErr) {
                    reject(readErr);
                }

                if (files.indexOf("package.json") > -1) {
                   const packageJsonPath = util.path.join(appPath, "package.json");

                   util.fs.readFile(packageJsonPath, "utf8", (fileErr, data) => {
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

    private downloadPage(pageName: string) {
        const command = "npm install " + pageName;
        const templatesDir = "../../templates";

        return new Promise((resolve, reject) => {
            util.childProcess.exec(command, { cwd: templatesDir }, (error, stdout, stderr) => {
                if (error) {
                    reject(error.message);
                }
                else if (stderr) {
                    reject(error.message);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
}

$injector.register("pageService", PageService);
