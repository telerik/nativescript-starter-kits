import * as path from "path";
import * as fs from "fs";


export class TemplateService {
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
}

$injector.register("templateService", TemplateService);


