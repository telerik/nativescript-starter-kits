import { Config } from "../shared/config";
import util from "../shared/util";

const BACKUP = require("../../consts/templates-backup-data");
const nodeCache = require("node-cache");
const tmpCache = new nodeCache();

export class TemplateService implements ITemplateService {
    constructor(private $gitService: IGitService) { }

    checkTemplateFlavor(packageJson: any) {
        return new Promise((resolve, reject) => {
            if (typeof packageJson === "undefined" || typeof packageJson.name !== "string") {
                reject(new Error("Cannot read template details!"));
            } else if (packageJson.name.indexOf("-ng") > -1) {
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

    getAppTemplateDetails(templateName: string): Promise<any> {
        const templateDetails: any = {};

        return new Promise((resolve, reject) => {
            this.$gitService.getPackageJsonFromSource(templateName)
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

                            return this.$gitService.getAssetsContent(templateName);
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

    getTemplates(): Promise<Array<any>> {
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
                                        resolve(BACKUP.fallback);
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
        const typeOrder: Array<string> = [
            "Blank",
            "Navigation Drawer",
            "Tabs",
            "Master-Detail with Firebase",
            "Master-Detail with Kinvey"
        ];
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
}

$injector.register("templateService", TemplateService);
