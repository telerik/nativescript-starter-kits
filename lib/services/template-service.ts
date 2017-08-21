import { Config } from "../shared/config";
import util from "../shared/util";

const request = require("request-promise");
// tslint:disable-next-line:variable-name
const NodeCache = require("node-cache");

// tslint:disable-next-line:variable-name
const Backup = require("../../consts/backup-data");

const tmpCache = new NodeCache();

export class TemplateService implements ITemplateService {
    tmpPackageJsonFromSrc(templateName: string) {
        let content: any;

        return request({
            method: "GET",
            uri: util.format("https://raw.githubusercontent.com/NativeScript/%s/master/package.json", templateName),
            json: true,
            resolveWithFullResponse: true,
            headers: util.defaultHeaders
        })
            .then((response: any) => {
                content = response.body;
                if (content.hasOwnProperty("templateType")) {
                    return content;
                }
            })
            .catch((error: any) => {
                return {
                    message: "Error retrieving " + templateName + " package.json from src",
                    err: error
                };
            });
    }

    tmpResourcesFromSrc(templateName: string, asset: any) {
        const content: any = {};
        const promises: Array<any> = [];

        return new Promise((resolve, reject) => {
            for (const key in asset) {
                if (asset.hasOwnProperty(key)) {
                    promises.push(
                        request({
                            method: "GET",
                            // tslint:disable-next-line:max-line-length
                            uri: util.format("https://raw.githubusercontent.com/NativeScript/%s/master/tools/assets/%s", templateName, asset[key]),
                            resolveWithFullResponse: true,
                            encoding: "binary",
                            headers: util.defaultHeaders
                        })
                            .then((response: any) => {
                                // tslint:disable-next-line:max-line-length
                                content[key] = "data:image/png;base64," + new Buffer(response.body.toString(), "binary").toString("base64");
                            })
                            .catch((error: any) => {
                                return {
                                    message: "Error retrieving " + templateName + " assets from source",
                                    err: error
                                };
                            }));

                }
            }
            Promise.all(promises)
                .then(() => {
                    resolve(content);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    checkTemplateFlavor(packageJson: any) {
        return new Promise((resolve) => {
            if (packageJson.name.indexOf("-ng") > -1) {
                resolve("Angular & TypeScript");
            } else if (packageJson.name.indexOf("-ts") > -1) {
                resolve("TypeScript");
            } else {
                resolve("JavaScript");
            }
        });
    }

    getTemplateMetaData(packageJson: any) {
        const meta: any = {};

        return new Promise((resolve, reject) => {
            if (typeof packageJson === "undefined") {
                reject({ message: "Missing package.json" });
            } else {
                meta.name = packageJson.name;
                meta.displayName = packageJson.displayName;
                meta.version = packageJson.version;
                meta.description = packageJson.description;
                meta.gitUrl = packageJson.repository.url;
                meta.type = packageJson.templateType;

                resolve(meta);
            }
        });
    }

    getAppTemplateDetails(templateName: string) {
        const templateDetails: any = {};

        return new Promise((resolve, reject) => {
            this.tmpPackageJsonFromSrc(templateName)
                .then((packageJsonData: any) => {
                    const packageJson = packageJsonData;
                    this.getTemplateMetaData(packageJson)
                        .then((data: any) => {
                            templateDetails.name = data.name;
                            templateDetails.displayName = data.displayName;
                            templateDetails.description = data.description;
                            templateDetails.version = data.version;
                            templateDetails.gitUrl = data.gitUrl;
                            templateDetails.type = data.type;

                            return this.checkTemplateFlavor(packageJson);
                        })
                        .then((flavor) => {
                            templateDetails.templateFlavor = flavor;

                            return this.getTmpAssetsContent(templateName);
                        })
                        .then((resources) => {
                            templateDetails.resources = resources;
                            resolve(templateDetails);
                        })
                        .catch((error) => {
                            reject({
                                message: "Error retrieving data for " + templateName,
                                error
                            });
                        });
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    getTemplates() {
        let tempDetails: Array<any> = [];
        const promises: Array<any> = [];

        return new Promise((resolve, reject) => {
            tmpCache.get("tempDetails", (error: any, value: any) => {
                if (!error) {
                    if (value === undefined) {
                        this.getTemplatesNames()
                            .then((templateNames: any) => {
                                return templateNames;
                            })
                            .then((names: any) => {
                                names.forEach((name: string) => {
                                    promises.push(
                                        this.getAppTemplateDetails(name)
                                            .then((details) => {
                                                tempDetails.push(details);
                                            })
                                            .catch((errorDetails) => {
                                                reject(errorDetails);
                                            })
                                    );
                                });

                                Promise.all(promises)
                                    .then(() => {
                                        tempDetails = this.sortTmpData(tempDetails);
                                        tmpCache.set("tempDetails", tempDetails, Config.cacheTime);
                                        resolve(tempDetails);

                                    })
                                    .catch((errorPromises: any) => {
                                        // TODO Implement error logger
                                        resolve(Backup.fallback);
                                    });
                            })
                            .catch((errorTemplates: any) => {
                                console.error(errorTemplates);
                            });
                    } else {
                        // Load data from cache
                        resolve(value);
                    }
                }
            });
        });
    }

    private sortTmpData(templates: Array<any>) {
        const flavOrder: Array<string> = ["JavaScript", "TypeScript", "Angular & TypeScript"];

        // tslint:disable-next-line:max-line-length
        const typeOrder: Array<string> = ["Blank", "Navigation Drawer", "Tabs", "Master-Detail with Firebase", "Master-Detail with Kinvey"];
        let sortedByType: Array<any>;
        let sortByFlav: Array<any>;

        sortedByType = util.sortBy(templates, (temp: any) => {
            return util.indexOf(typeOrder, temp.displayName);
        });

        sortByFlav = util.sortBy(sortedByType, (temp: any) => {
            return util.indexOf(flavOrder, temp.templateFlavor);
        });

        return sortByFlav;
    }

    private getTemplatesNames() {

        return new Promise((resolve, reject) => {
            if (!Config.availableTemplateRepos || !Config.availableTemplateRepos.length) {
                reject("No available repositories found");
            } else {
                resolve(Config.availableTemplateRepos);
            }
        });
    }

    private getTmpAssetsContent(templateName: string) {
        const platforms: any = {};

        return request({
            method: "GET",
            uri: util.format("https://api.github.com/repos/NativeScript/%s/contents/tools/assets", templateName),
            json: true,
            resolveWithFullResponse: true,
            headers: util.defaultHeaders
        })
            .then((response: any) => {
                response.body.forEach((element: any) => {
                    if (element.name.indexOf("phone") === -1) {
                        let platform = element.name.split("-").pop().split(".").shift();
                        if (platform !== "android" || platform !== "ios") {
                            const rep = platform.match(/^(?!android|ios).*$/g);
                            platform = platform.replace(rep, "thumbnail");
                        }

                        platforms[platform] = element.name;
                    }
                });

                return this.tmpResourcesFromSrc(templateName, platforms);
            })
            .catch((error: any) => {
                return { message: "Error retrieving assets from repository", error };
            });
    }

    // Temporary unused method
    // private imageEncode(filePath: string) {
    //     let bitmap = fs.readFileSync(filePath);

    //     return new Buffer(bitmap).toString('base64');
    // }
}

$injector.register("templateService", TemplateService);
