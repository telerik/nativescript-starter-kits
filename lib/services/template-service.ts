import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";

export class TemplateService implements ITemplateService {
    constructor() {
    }

    /*private _readTemplatePackageJson(tempPath: string) {
        let isDir = fs.statSync(tempPath).isDirectory(),
            tempContent;

        if (isDir) {
            tempContent = fs.readdirSync(tempPath);

            if (tempContent.indexOf("package.json") > -1) {
                return fs.readFileSync(path.join(tempPath, "package.json"), "utf8");
            } else {
                return new Error("Missing package.json file!");
            }
        }
    }*/

    public getTemplateVersion(templateName: string) {
        /*let tempPath = path.join(__dirname.replace("services", "templates"), templateName),
            packageJsonContent: any,
            version: any;

        try {
            packageJsonContent = this._readTemplatePackageJson(tempPath);
            packageJsonContent = JSON.parse(packageJsonContent);
            version = packageJsonContent.version;
        } catch (err) {
            version = packageJsonContent;
        }

        return version;*/

        return "2.0.1";
    }

    public getTemplateDescription(templateName: string) {
        /*let tempPath = path.join(__dirname.replace("services", "templates"), templateName),
            packageJsonContent: any,
            description: any;

        try {
            packageJsonContent = this._readTemplatePackageJson(tempPath);
            packageJsonContent = JSON.parse(packageJsonContent);
            description = packageJsonContent.description;
        } catch (err) {
            description = packageJsonContent;
        }

        return description;*/

        return "The coolest template ever";
    }

    public checkTemplateFlavor(templateName: string) {
        /*let tempPath = path.join(__dirname.replace("services", "templates"), templateName),
            packageJsonContent: any,
            dependencies: any,
            devDependencies: any;

        try {
            packageJsonContent = this._readTemplatePackageJson(tempPath);
            packageJsonContent = JSON.parse(packageJsonContent);
        } catch (err) {
            return packageJsonContent;
        }

        dependencies = Object.keys(packageJsonContent.dependencies);
        devDependencies = Object.keys(packageJsonContent.devDependencies);

        if (dependencies.indexOf("nativescript-angular") > -1 || dependencies.indexOf("@angular") > -1) {
            return ("Angular 2 & TypeScript");
        } else if (devDependencies.indexOf("typescript") > -1 || devDependencies.indexOf("nativescript-dev-typescript") > -1) {
            return ("Vanilla TypeScript");
        } else {
            return ("Vanilla JavaScript");
        }*/

        return "@angular + TypeScript";

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
            } catch (err) {
                reject(err);
            }

            templateDetails = {
                name: templateName,
                description: description,
                version: version,
                templateFlavor: flavor,
                gitUrl: 'https://github.com/NativeScript/template-drawer-navigation-ts.git',
                type: "App template",
                resources: []
            };

            resolve(templateDetails);

        });
    }

    public getAvailableTemplates() {
        /*let that = this,
            tempPath = path.join(__dirname.replace("services", "templates")),
            tempDetails: any = [];

        return new Promise(function (resolve, reject) {
            fs.readdir(tempPath, function (err, content) {
                if (err) {
                    reject(err);
                } else {
                    for (let i = 0; i < content.length; i++) {
                        let isDir = fs.statSync(path.join(tempPath, content[i])).isDirectory();

                        if (isDir) {
                            that.getAppTemplateDetails(content[i]).then(function (data) {
                                tempDetails.push(data);
                            }).catch(function (error: any) {
                                reject(error);
                            });
                        }
                    }
                    resolve(tempDetails);
                }
            });
        });*/

        return new Promise(function (resolve, reject) {
            let tempDetails: any = [
                {   name: 'nativescript-ng-ui-kit-drawer',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-drawer-navigation-ng.git',
                    templateFlavor: 'Angular 2 & TypeScript',
                    type: "App template",
                    resources: []
                },
                {   name: 'nativescript-ts-ui-kit-drawer',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-drawer-navigation-ts.git',
                    templateFlavor: 'TypeScript',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-js-ui-kit-drawer',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-drawer-navigation.git',
                    templateFlavor: 'Vanilla JS',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-js-ui-kit-tab',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-tab-navigation.git',
                    templateFlavor: 'Vanilla JS',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-ts-ui-kit-tab',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-tab-navigation-ts.git',
                    templateFlavor: 'TypeScript',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-ng-ui-kit-tab',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-tab-navigation-ng.git',
                    templateFlavor: 'Angular 2 & TypeScript',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-js-ui-kit-master-detail',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-master-detail.git',
                    templateFlavor: 'Vanilla JS',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-ts-ui-kit-master-detail',
                    description: 'NativeScript Application',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/template-master-detail-ts.git',
                    templateFlavor: 'TypeScript',
                    type: "App template",
                    resources: []
                },
                {
                    name: 'nativescript-js-login-page',
                    description: 'NativeScript Login Page Template',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/nativescript-page-templates.git',
                    templateFlavor: 'Vanilla JS',
                    type: "Page template",
                    resources: []
                },
                {
                    name: 'nativescript-ts-login-page',
                    description: 'NativeScript Login Page Template',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/nativescript-page-templates-ts.git',
                    templateFlavor: 'TypeScript',
                    type: "Page template",
                    resources: []
                },
                {
                    name: 'nativescript-ng-login-page',
                    description: 'NativeScript Login Page Template',
                    version: '0.1.0',
                    gitUrl: 'https://github.com/NativeScript/nativescript-page-templates-ng.git',
                    templateFlavor: 'Angular 2 & TypeScript',
                    type: "Page template",
                    resources: []
                }
            ];

            resolve(tempDetails);
        });
    }

    public downloadAppTemplate(url: string) {
        let command = "git clone " + url,
            templatesDir = __dirname.replace("services", "templates"), // Temp hack
            exists;

        try {
            exists = fs.statSync(templatesDir);
        } catch (err) {
            console.error(err);
        }

        if (exists) {
            childProcess.exec(command, {cwd: templatesDir}, function (error, stdout, stderr) {
                if (error) {
                    console.error(error);
                } else if (stderr) {
                    console.error(error);
                } else {
                    console.log(stdout);
                }
            });
        } else {
            console.error("Missing templates directory");
        }
    }

    public getPageTemplateDetails(templateName: string) {
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
            } catch (err) {
                reject(err);
            }

            templateDetails = {
                name: templateName,
                description: description,
                version: version,
                templateFlavor: flavor,
                gitUrl: 'https://github.com/NativeScript/template-drawer-navigation-ts.git',
                type: "Page template",
                resources: []
            };

            resolve(templateDetails);

        });
    }

    public createApp(appName: string, location: string) {
        let appPath: string = path.join(location, appName);

        //TODO: Check if path is a valid system path!!!
        return new Promise(function (resolve, reject) {
            fs.mkdir(appPath, '0744', function (err) {
                if (err && err.code === 'EEXIST') {
                    reject({
                        message: appName + " App already exists",
                        error: err
                    });
                } else {
                    resolve({
                        message: "Successfully created " + appName + " App",
                        appPath: appPath
                    });
                }
            });
        });
    }

    public addPage(pageName: string, location: string) {
        let pagePath: string = path.join(location, pageName),
            exists: any;

        return new Promise(function (resolve, reject) {
            try {
                exists = fs.statSync(location);
            } catch (err) {
                reject(err);
            }

            if (!exists.isDirectory()) {
                reject({message: "Invalid Path"});
            } else {
                // TODO: add Page logic here
                resolve({
                    message: "Page" + pageName + " added successfully!",
                    pagePath: pagePath
                });
            }
        });
    }
}

$injector.register("templateService", TemplateService);
