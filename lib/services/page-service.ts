import { Config } from "../shared/config";
import util from "../shared/util";

// Pages backup data
const BACKUP = require("../../consts/pages-backup-data");

export class PageService implements IPageService {
    getPages(flavor: string) {
        let baseUrl: string;

        return new Promise((resolve, reject) => {
            switch (flavor) {
                case "JavaScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates");
                    resolve(BACKUP.fallbackJs);
                    break;

                case "TypeScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates-ts");
                    resolve(BACKUP.fallbackTs);
                    break;
                case "Angular & TypeScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates-ng");
                    resolve(BACKUP.fallbackNg);
                    break;
                default:
                    reject("Bad Flavor");
            }
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
                   const packageJsonpath = util.path.join(appPath, "package.json");

                   util.fs.readFile(packageJsonpath, "utf8", (fileErr, data) => {
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

}

$injector.register("pageService", PageService);
