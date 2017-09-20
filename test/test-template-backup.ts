import * as chai from "chai";
import { Config } from "../lib/shared/config";

const expect = chai.expect;
const templateBackup = require("../consts/templates-backup-data").fallback;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("Template backup data", () => {

    describe("Check template backup data integrity", () => {
        it("Should be an Array of Objects", () => {
            return expect(Promise.resolve(templateBackup))
                .to.eventually.be.an("array")
                .to.have.length(Config.availableTemplateRepos.length).then((array) => {
                    array.forEach((item: any) => {
                        expect(item).to.have.property("name");
                        expect(item).to.have.property("description");
                        expect(item).to.have.property("displayName");
                        expect(item).to.have.property("gitUrl");
                        expect(item).to.have.property("version");
                        expect(item).to.have.property("templateFlavor");
                        expect(item).to.have.property("type");
                        expect(item).to.have.property("resources");
                    });
                });
        });

        it("Should have platform specific, base64 encoded resource images", () => {
            return expect(Promise.resolve(templateBackup))
                .to.eventually.be.an("array").then((array) => {
                    array.forEach((item: any) => {
                        expect(item.resources).to.have.property("android");
                        expect(item.resources).to.have.property("ios");
                        expect(item.resources).to.have.property("thumbnail");
                        expect(item.resources.android).to.match(/data:image\/png;base64/);
                        expect(item.resources.ios).to.match(/data:image\/png;base64/);
                        expect(item.resources.thumbnail).to.match(/data:image\/png;base64/);
                    });
                });
        });

        it("Should have proper name string", () => {
            return expect(Promise.resolve(templateBackup))
                .to.eventually.be.an("array").then((array) => {
                    array.forEach((item: any) => {
                        expect(item.name).to.match(/tns-/);
                        expect(item.name).to.be.a("string");
                    });
                });
        });
    });
});
