import util from "../shared/util";

// Pages backup data
const BACKUP = require("../../consts/pages-backup-data");

export class PageService implements IPageService {
    getPages() {
        return new Promise((resolve, reject) => {
            resolve(BACKUP.fallback);
        });
    }

    addPage(pageName: string, appPath: string, pageTemplate: any) {
        return new Promise((resolve, reject) => {
            const displayName = pageTemplate.displayName.toLowerCase();

            util.pageExists(appPath, pageName)
                .then((pageExists: boolean) => {
                    if (!pageExists) {
                        return this.downloadPage(displayName, pageTemplate.flavor);
                    } else {
                        resolve(`Page with the name: ${pageName} already exists`);
                    }
                })
                .then((downloadPath: any) => {
                // TODO Add ejs template rendering here
                resolve("success");
                })
                .catch((promiseError) => {
                    reject(promiseError);
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
                            reject(new Error(`child process exited with code ${code}`));
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
