import util from "../shared/util";

export class GitService implements IGitService {
    getPackageJsonFromSource(templateName: string): Promise<any> {
        let content: any;

        return util.request({
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

    getAssetsContent(templateName: string): Promise<any> {
        const platforms: any = {};

        return util.request({
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

                return this.getResourcesFromSource(templateName, platforms);
            })
            .catch((error: any) => {
                return { message: "Error retrieving assets from repository", error };
            });
    }

    clonePageTemplate(pageName: string, flavor: string, templatesDirectory: string): Promise<string> {
        const command = "git";
        const commandArguments: Array<any> = ["clone"];

        return new Promise((resolve, reject) => {
            util.getPageTemplatesBaseUrl(flavor)
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

    private getResourcesFromSource(templateName: string, assetDictionary: any) {
        const content: any = {};
        const promises: Array<any> = [];

        return new Promise((resolve, reject) => {
            for (const key in assetDictionary) {
                if (assetDictionary.hasOwnProperty(key)) {
                    promises.push(
                        util.request({
                            method: "GET",
                            // tslint:disable-next-line:max-line-length
                            uri: util.format("https://raw.githubusercontent.com/NativeScript/%s/master/tools/assets/%s", templateName, assetDictionary[key]),
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
}

$injector.register("gitService", GitService);
