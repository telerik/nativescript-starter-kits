import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";


export class TemplateService implements ITemplateService {
    constructor() {

    }

    private _readTemplatePackageJson(tempPath: string) {
        let isDir = fs.statSync(tempPath).isDirectory(),
            tempContent;

        if (isDir) {
            tempContent = fs.readdirSync(tempPath);

            if (tempContent.indexOf("package.json") > -1) {
                return fs.readFileSync(path.join(tempPath, "package.json"), "utf8");
            }
        }
    }

    public getTemplateVersion(templateName: string) {
        let tempPath = path.join(__dirname.replace("services", "templates"), templateName),
            packageJsonContent: any,
            version: any;

        try {
            packageJsonContent = JSON.parse(this._readTemplatePackageJson(tempPath));
        }
        catch (err) {
            return (err);
        }

        version = packageJsonContent.version;

        return version;
    }

    public getTemplateDescription(templateName: string) {
        let tempPath = path.join(__dirname.replace("services", "templates"), templateName),
            packageJsonContent: any,
            description: any;

        try {
            packageJsonContent = JSON.parse(this._readTemplatePackageJson(tempPath));
        }
        catch (err) {
            return (err);
        }

        description = packageJsonContent.description;

        return description;
    }

    public checkTemplateFlavor(templateName: string) {
        let tempPath = path.join(__dirname.replace("services", "templates"), templateName),
            packageJsonContent: any,
            dependencies: any,
            devDependencies: any;


        try {
            packageJsonContent = this._readTemplatePackageJson(tempPath);
            packageJsonContent = JSON.parse(packageJsonContent);
        }
        catch (err) {
            return (err);
        }

        dependencies = Object.keys(packageJsonContent.dependencies);
        devDependencies = Object.keys(packageJsonContent.devDependencies);

        if (dependencies.indexOf("nativescript-angular") > -1 || dependencies.indexOf("@angular") > -1) {
            return ("Angular 2 & TypeScript");
        }
        else if (devDependencies.indexOf("typescript") > -1 || devDependencies.indexOf("nativescript-dev-typescript") > -1) {
            return ("Vanilla TypeScript");
        }
        else {
            return ("Vanilla JavaScript");
        }

    }

    public getAppTemplateDetails(templateName: string) {
        let that = this,
            version: string,
            flavor: string,
            description: string,
            templateDetails: any;

        return new Promise(function (resolve, reject) {
            try {
                version = that.getTemplateVersion(templateName);
                flavor = that.checkTemplateFlavor(templateName);
                description = that.getTemplateDescription(templateName);
            }
            catch (err) {
                reject(err);
            }

            templateDetails = {
                name: templateName,
                description: description,
                version: version,
                templateFlavor: flavor
            };

            resolve(templateDetails);

        });
    }

    public getAvailableTemplates() {
        let that = this,
            tempPath = path.join(__dirname.replace("services", "templates")),
            tempDetails: any = [];

        return new Promise(function (resolve, reject) {
            fs.readdir(tempPath, function (err, content) {
                if (err) {
                    reject(err);
                }
                else {
                    for (let i = 0; i < content.length; i++) {
                        let isDir = fs.statSync(path.join(tempPath, content[i])).isDirectory();

                        if (isDir) {
                            that.getAppTemplateDetails(content[i]).then(function (data) {
                                tempDetails.push(data);
                            }).catch(function (err) {
                                reject(err);
                            });
                        }
                    }
                    resolve(tempDetails);
                }
            });
        });
    }

    public downloadAppTemplate(url: string) {
        let command = "git clone " + url,
            templatesDir = __dirname.replace("services", "templates"), // Temp hack
            exists;

        try {
            exists = fs.statSync(templatesDir)
        }
        catch (err) {
            console.error(err);
        }

        if (exists) {
            childProcess.exec(command, {cwd: templatesDir}, function (error, stdout, stderr) {
                if (error) {
                    console.error(error);
                }
                else if (stderr) {
                    console.error(error);
                }
                else {
                    console.log(stdout);
                }
            });
        }
        else {
            console.error("Missing templates directory");
        }
    }

    public getPageTemplateDetails() {
        throw new Error("Not implemented yet");
    }

    public downloadPageTemplate(templateName: string) {
        throw new Error("Not implemented yet");
    }
}

$injector.register("templateService", TemplateService);


