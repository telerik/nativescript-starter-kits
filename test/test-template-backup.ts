import * as chai from "chai";
import { Config } from "../lib/shared/config";
const expect = chai.expect;
const templateBackup = require("../consts/templates-backup-data").fallback;

chai.use(require("chai-things"));

describe("Template backup data", () => {

    describe("Check template backup data integrity", () => {
        it("Should be an Array of Objects", () => {
            expect(templateBackup).to.be.an("array");
            expect(templateBackup).to.have.length(Config.availableTemplateRepos.length);
            templateBackup.should.all.have.property("name");
            templateBackup.should.all.have.property("description");
            templateBackup.should.all.have.property("displayName");
            templateBackup.should.all.have.property("gitUrl");
            templateBackup.should.all.have.property("version");
            templateBackup.should.all.have.property("templateFlavor");
            templateBackup.should.all.have.property("type");
            templateBackup.should.all.have.property("resources");
        });

        it("Should have platform specific, base64 encoded resource images", () => {
           for (const template of templateBackup) {
               expect(template.resources).to.have.property("android");
               expect(template.resources).to.have.property("ios");
               expect(template.resources).to.have.property("thumbnail");

               expect(template.resources.android).to.match(/data:image\/png;base64/);
               expect(template.resources.ios).to.match(/data:image\/png;base64/);
               expect(template.resources.thumbnail).to.match(/data:image\/png;base64/);
           }
        });
    });

    describe("Check template backup data name property", () => {
        it("names should start with tns-", () => {
            for (const template of templateBackup) {
                template.name.should.be.a("string");
                expect(template.name).to.match(/tns-/);
            }
        });
    });
});
