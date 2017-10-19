import util from "../shared/util";

const defaultHeaders = {
    "user-agent": "nativescript-starter-kits"
};

export class NsStarterKitsGitService implements INsStarterKitsGitService {
    constructor(private $nsStarterKitsNpmService: INsStarterKitsNpmService) {
    }

    getPackageJsonFromSource(templateName: string): Promise<any> {
        return this.$nsStarterKitsNpmService.getNpmPackageVersion(templateName)
            .then((packageVersion: string) => {
                return util.request({
                    method: "GET",
                    uri: util.format(
                        "https://raw.githubusercontent.com/NativeScript/%s/%s/package.json",
                        templateName,
                        packageVersion
                    ),
                    json: true,
                    resolveWithFullResponse: true,
                    headers: defaultHeaders
                });
            })
            .then((response: any) => {
                return response.body;
            })
            .catch((error: any) => {
                return Promise.reject({
                    message: "Error retrieving " + templateName + " package.json from src",
                    err: error
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

    private getResourcesFromSource(templateName: string, assetDictionary: any, versionTag: string): Promise<any> {
        const promisesMap: Map<string, Promise<any>> = new Map();

        for (const key in assetDictionary) {
            if (assetDictionary.hasOwnProperty(key)) {
                promisesMap.set(key, this.getResource(templateName, versionTag, assetDictionary[key]));
            }
        }

        return util.promiseAllMap(promisesMap);
    }

    private getResource(templateName: string, versionTag: string, asset: string): Promise<any> {
        return util.request({
            method: "GET",
            // tslint:disable-next-line:max-line-length
            uri: util.format("https://raw.githubusercontent.com/NativeScript/%s/%s/tools/assets/%s", templateName, versionTag, asset),
            resolveWithFullResponse: true,
            encoding: "binary",
            headers: defaultHeaders
        })
            .then((response: any) => {
                // tslint:disable-next-line:max-line-length
                return "data:image/png;base64," + new Buffer(response.body.toString(), "binary").toString("base64");
            })
            .catch((error: any) => {
                return Promise.reject({
                    message: "Error retrieving " + templateName + " assets from source",
                    err: error
                });
            });
    }
}

$injector.register("nsStarterKitsGitService", NsStarterKitsGitService);
