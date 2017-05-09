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

    public getAppTemplateDetails() {
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

let test = new TemplateService();

let flavor = test.getTemplateVersion("template-hello-world-ng");

console.log(typeof flavor);

//$injector.register("templateService", TemplateService);


