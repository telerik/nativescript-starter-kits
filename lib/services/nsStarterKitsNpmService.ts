import util from "../shared/util";

const defaultHeaders = {
    "user-agent": "nativescript-starter-kits"
};

export class NsStarterKitsNpmService implements INsStarterKitsNpmService {
    installPageTemplate(pageName: string, flavor: string, templatesDirectory: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const command: string = (process.platform === "win32") ? "npm.cmd" : "npm";
            const commandArguments: Array<any> = ["install"];
            const options = { cwd: templatesDirectory };
            let packageName: string;

            try {
                packageName = this.getPageTemplateNpmName(flavor);
            } catch (error) {
                Promise.reject(error);
            }

            commandArguments.push(packageName);

            const childProcess = util.childProcess.spawn(command, commandArguments, options);
            childProcess.on("close", (code) => {
                if (code !== 0) {
                    return reject(new Error(`child process exited with code ${code}`));
                }

                const pagePath = util.path.join(templatesDirectory, "node_modules", packageName, pageName);
                resolve(pagePath);
            });
        });
    }

    getNpmPackageVersion(templateName: string): Promise<any> {
        if (templateName.indexOf("tns-") !== 0) {
            templateName = "tns-" + templateName;
        }

        return util.request({
            method: "GET",
            uri: util.format("https://registry.npmjs.org/%s/", templateName),
            json: true,
            resolveWithFullResponse: true,
            headers: defaultHeaders
        })
            .then((response: any) => {
                let version = "master";
                if (response.body && response.body["dist-tags"] && response.body["dist-tags"].latest) {
                    version = "v" + response.body["dist-tags"].latest;
                }

                return version;
            })
            .catch((error: any) => {
                // fallback to using the master (latest version)
                return "master";
            });
    }

    private getPageTemplateNpmName(flavor: string): string {
        let packageName: string;

        switch (flavor) {
            case "JavaScript":
                packageName = "tns-page-templates";
                break;
            case "TypeScript":
                packageName = "tns-page-templates-ts";
                break;
            case "Angular & TypeScript":
                packageName = "tns-page-templates-ng";
                break;
            default:
                throw new Error("Bad Flavor");
        }

        return packageName;
    }
}

$injector.register("nsStarterKitsNpmService", NsStarterKitsNpmService);
