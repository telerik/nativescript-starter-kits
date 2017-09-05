import * as childProcess from "child_process";
import * as path from "path";
import * as nodeUtil from "util";
import { Config } from "./config";

const indexOf = require("lodash.indexof");
const sortBy = require("lodash.sortby");
const request = require("request-promise");
const fs = require("fs-extra");

export default class Util {
    static defaultHeaders = {
        "user-agent": "nativescript-starter-kits"
    };

    static indexOf = indexOf;
    static sortBy = sortBy;
    static format = nodeUtil.format;
    static request = request;
    static path = path;
    static fs = fs;
    static childProcess = childProcess;

    static pageExists(location: string, pageName: string) {
        return new Promise((resolve, reject) => {
            this.fs.readdir(location, (err: any, content: any) => {
                if (err) {
                    reject(err);

                    return;
                }

                if (content.indexOf(pageName) > -1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    static getPageTemplatesBaseUrl(flavor: string) {
        let baseUrl: string;

        return new Promise((resolve, reject) => {
            switch (flavor) {
                case "JavaScript":
                    baseUrl = this.format(Config.orgBaseUrl, "nativescript-page-templates");
                    resolve(baseUrl);
                    break;

                case "TypeScript":
                    baseUrl = this.format(Config.orgBaseUrl, "nativescript-page-templates-ts");
                    resolve(baseUrl);
                    break;
                case "Angular & TypeScript":
                    baseUrl = this.format(Config.orgBaseUrl, "nativescript-page-templates-ng");
                    resolve(baseUrl);
                    break;
                default:
                    reject(new Error("Bad Flavor"));
            }
        });
    }
}
