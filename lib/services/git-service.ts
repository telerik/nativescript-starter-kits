import { Config } from "../shared/config";
import util from "../shared/util";

export class GitService implements IGitService {
    getPackageJsonFromSource(templateName: string): Promise<any> {
        let content: any;

        return this.getNpmPackageVersion(templateName).then((packageVersion: string) => {
            return util.request({
                method: "GET",
                uri: util.format(
                    "https://raw.githubusercontent.com/NativeScript/%s/%s/package.json",
                    templateName,
                    packageVersion
                ),
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
        });
    }

    getAssetsContent(templateName: string, versionTag: string): Promise<any> {
        const assets: any = {
            ios: "appTemplate-ios.png",
            android: "appTemplate-android.png",
            thumbnail: "thumbnail.png"
        };
        const version = versionTag ? versionTag : "master";

        return this.getResourcesFromSource(templateName, assets, version);
    }

    clonePageTemplate(pageName: string, flavor: string, templatesDirectory: string): Promise<string> {
        const command = "git";
        const commandArguments: Array<any> = ["clone"];

        return new Promise((resolve, reject) => {
            this.getPageTemplatesBaseUrl(flavor)
                .then((baseUrl: string) => {
                    baseUrl = baseUrl + ".git";
                    commandArguments.push(baseUrl);
                    commandArguments.push(templatesDirectory);

                    const process = util.childProcess.spawn(command, commandArguments);
                    process.on("close", (code) => {
                        if (code !== 0) {
                            return Promise.reject(new Error(`child process exited with code ${code}`));
                        }

                        const pagePath = util.path.join(templatesDirectory, pageName);
                        resolve(pagePath);
                    });
                })
                .catch((downloadPageError: any) => {
                    reject(downloadPageError);
                });
        });
    }

    private getPageTemplatesBaseUrl(flavor: string) {
        let baseUrl: string;

        return new Promise((resolve, reject) => {
            switch (flavor) {
                case "JavaScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates");
                    resolve(baseUrl);
                    break;

                case "TypeScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates-ts");
                    resolve(baseUrl);
                    break;
                case "Angular & TypeScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates-ng");
                    resolve(baseUrl);
                    break;
                default:
                    reject(new Error("Bad Flavor"));
            }
        });
    }

    private getResourcesFromSource(templateName: string, assetDictionary: any, versionTag: string) {
        const content: any = {};
        const promises: Array<any> = [];

        return new Promise((resolve, reject) => {
            for (const key in assetDictionary) {
                if (assetDictionary.hasOwnProperty(key)) {
                    promises.push(
                        util.request({
                            method: "GET",
                            // tslint:disable-next-line:max-line-length
                            uri: util.format("https://raw.githubusercontent.com/NativeScript/%s/%s/tools/assets/%s", templateName, versionTag, assetDictionary[key]),
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

    private getNpmPackageVersion(templateName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (templateName.indexOf("tns-") !== 0) {
                templateName = "tns-" + templateName;
            }

            util.request({
                method: "GET",
                uri: util.format("https://registry.npmjs.org/%s/", templateName),
                json: true,
                resolveWithFullResponse: true,
                headers: util.defaultHeaders
            })
                .then((response: any) => {
                    let version = "master";
                    if (response.body && response.body["dist-tags"] && response.body["dist-tags"].latest) {
                        version = "v" + response.body["dist-tags"].latest;
                    }

                    resolve(version);
                })
                .catch((error: any) => {
                    // fallback to using the master (latest version)
                    resolve("master");
                });
        });
    }
}

$injector.register("gitService", GitService);
