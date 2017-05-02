import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";


export class TemplateService implements ITemplateService{
    constructor() {

    }

    public getTemplateDetails() {
        fs.readFile(path.join(__dirname, 'template-details.json'), 'utf8', function (err, data) {
            if (err) {
                console.error(new Error(err.message));
            }
            else {
                console.log(data);
            }
        });
    }

    public downloadTemplate(templateName: string) {
        let command = "git clone git@github.com:NativeScript/" + templateName + ".git";

        childProcess.exec(command, function (error, stdout, stderr) {
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
}

$injector.register("templateService", TemplateService);


