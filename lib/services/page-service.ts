import { Config } from "../shared/config";
import util from "../shared/util";

// Pages backup data
const BACKUP = require("../../consts/pages-backup-data");

export class PageService implements IPageService {
    getPages(flavor: string) {
        let baseUrl: string;

        return new Promise((resolve, reject) => {
            switch (flavor) {
                case "JavaScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates");
                    resolve(BACKUP.fallbackJs);
                    break;

                case "TypeScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates-ts");
                    resolve(BACKUP.fallbackTs);
                    break;
                case "Angular & TypeScript":
                    baseUrl = util.format(Config.orgBaseUrl, "nativescript-page-templates-ng");
                    resolve(BACKUP.fallbackNg);
                    break;
                default:
                    reject("Bad Flavor");
            }
        });
    }

}

$injector.register("pageService", PageService);
