import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";


export class TemplateService implements ITemplateService {
    constructor() {

    }

    public _checkTemplateFlavor(templateName: string) {
        let tempPath = path.join(__dirname.replace("services", "templates"), templateName);

        return new Promise(function (resolve, reject) {
            fs.readdir(tempPath, function (err, files) {
                if (err) {
                    reject(err)
                }
                else {
                    if (files.indexOf("package.json") > -1) {
                        fs.readFile(path.join(tempPath, "package.json"), "utf8", function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                let content = JSON.parse(data),
                                    dependencies = Object.keys(content.dependencies),
                                    devDependencies = Object.keys(content.devDependencies);

                                //console.log('dev ', devDependencies);

                                if (dependencies.indexOf("nativescript-angular") > -1 || dependencies.indexOf("@angular") > -1) {
                                    resolve("Angular 2 & TypeScript");
                                }
                                else if (devDependencies.indexOf("typescript") > -1 || devDependencies.indexOf("nativescript-dev-typescript") > -1) {
                                    resolve("Vanilla TypeScript");
                                }
                                else {
                                    resolve("Vanilla JavaScript");
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    public getAppTemplateDetails() {
        this._checkTemplateFlavor("template-hello-world-ng").then(function (flavor) {
            console.log("flavor ", flavor);
        }, function (err) {
            console.error(err)
        });
        fs.readFile(path.join(__dirname, 'template-details.json'), 'utf8', function (err, data) {
            if (err) {
                console.error(new Error(err.message));
            }
            else {
                console.log(data);
            }
        });
    }

    public downloadAppTemplate(templateName: string) {
        let command = "git clone git@github.com:NativeScript/" + templateName + ".git",
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


