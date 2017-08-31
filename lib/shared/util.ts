import * as nodeUtil from "util";
import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";

const indexOf = require("lodash.indexof");
const sortBy = require("lodash.sortby");
const request = require("request-promise");

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

    static getPackageJsonFromSource(url: string) {
        let content: any;

        return this.request({
            method: "GET",
            uri: url,
            json: true,
            resolveWithFullResponse: true,
            headers: this.defaultHeaders
        })
            .then((response: any) => {
                content = response.body;
                if (content.hasOwnProperty("templateType")) {
                    return content;
                }
            })
            .catch((error: any) => {
                return {
                    message: "Error retrieving package.json from src " + url,
                    err: error
                };
            });
    }
}
