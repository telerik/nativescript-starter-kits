import * as nodeUtil from "util";

const indexOf = require("lodash.indexof");
const sortBy = require("lodash.sortby");

export default class Util {
    static defaultHeaders = {
        "user-agent": "nativescript-starter-kits"
    };

    static indexOf = indexOf;
    static sortBy = sortBy;
    static format = nodeUtil.format;
}
