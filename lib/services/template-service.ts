import { Config } from "../shared/config";

const _ = require("lodash");
const BACKUP = require("../../consts/templates-backup-data");
const nodeCache = require("node-cache");

export class TemplateService implements ITemplateService {
    templateCache: any;

    constructor(private $gitService: IGitService) {
        this.templateCache = new nodeCache();
    }

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
            if (_.isEmpty(packageJson)) {
                reject(new Error("Missing or invalid package.json provided"));
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
                            templateDetails.tag = "v" + data.version;
                            templateDetails.gitUrl = data.gitUrl;
                            templateDetails.type = data.type;

                            return this.checkTemplateFlavor(packageJson);
                        })
                        .then((flavor) => {
                            templateDetails.templateFlavor = flavor;

                            return this.$gitService.getAssetsContent(templateName, templateDetails.tag);
                        })
                        .then((resources) => {
                            templateDetails.resources = resources;
                            resolve(templateDetails);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    getTemplates(): Promise<Array<any>> {
        const promises: Array<any> = [];

        return new Promise((resolve, reject) => {
            this.templateCache.get("templateDetails", (error: any, value: any) => {
                if (!error) {
                    if (value === undefined) {
                        Config.availableTemplateRepos.forEach((name: string) => {
                            promises.push(this.getAppTemplateDetails(name));
                        });

                        Promise.all(promises)
                            .then((resultTemplateDetails: Array<any>) => {
                                resultTemplateDetails = this.sortTemplateData(resultTemplateDetails);
                                this.templateCache.set("templateDetails", resultTemplateDetails, Config.cacheTime);
                                resolve(resultTemplateDetails);
                            })
                            .catch((errorPromises: any) => {
                                // TODO Implement error logger
                                resolve(BACKUP.fallback);
                            });
                    } else {
                        // Load data from cache
                        resolve(value);
                    }
                } else {
                    resolve(BACKUP.fallback);
                }
            });
        });
    }

    private sortTemplateData(templates: Array<any>) {
        const flavorOrder: Array<string> = ["JavaScript", "TypeScript", "Angular & TypeScript"];

        // tslint:disable-next-line:max-line-length
        const typeOrder: Array<string> = [
            "Blank",
            "Navigation Drawer",
            "Tabs",
            "Master-Detail with Firebase",
            "Master-Detail with Kinvey"
        ];
        let sortedByType: Array<any>;
        let sortByFlavor: Array<any>;

        sortedByType = _.sortBy(templates, (template: any) => {
            return _.indexOf(typeOrder, template.displayName);
        });

        sortByFlavor = _.sortBy(sortedByType, (temp: any) => {
            return _.indexOf(flavorOrder, temp.templateFlavor);
        });

        return sortByFlavor;
    }
}

$injector.register("templateService", TemplateService);
