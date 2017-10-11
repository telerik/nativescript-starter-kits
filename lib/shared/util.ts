import * as childProcess from "child_process";
import * as path from "path";
import * as nodeUtil from "util";

const request = require("request-promise-native");
const fs = require("fs-extra");

export default class Util {
    static format = nodeUtil.format;
    static request = request;
    static path = path;
    static fs = fs;
    static childProcess = childProcess;

    static pageExists(location: string, pageName: string) {
        return new Promise((resolve, reject) => {
            this.fs.readdir(location, (readError: any, content: any) => {
                if (readError) {
                    reject(readError);

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

    static promiseAllMap(map: Map<string, Promise<any>>) {
        return Promise.all(Array.from(map, ([key, promise]) => Promise.resolve(promise).then((value) => [key, value])))
            .then((results: Array<Array<string>>) => {
                const resultsAsObj: any = {};
                results.forEach((result) => {
                    resultsAsObj[result[0]] = result[1];
                });

                return resultsAsObj;
            });
    }
}
