import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";


export class TemplateService implements ITemplateService{
    constructor() {

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
        templatesDir = "../templates";

        if (fs.statSync(templatesDir)) {
            childProcess.exec(command, {cwd: templatesDir}, function (error, stdout, stderr) {
                if (error) {
                    console.error(new Error(error.message));
                }
                else if (stderr) {
                    console.error(new Error(error.message));
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


