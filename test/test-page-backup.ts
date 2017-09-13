import * as chai from "chai";
const expect = chai.expect;
const templateBackup = require("../consts/pages-backup-data").fallback;

chai.use(require("chai-things"));

describe("Page backup data", () => {

    describe("Check page backup data integrity", () => {
        it("Should be an Array of Objects", () => {
            expect(templateBackup).to.be.an("array");
            templateBackup.should.all.have.property("name");
            templateBackup.should.all.have.property("description");
            templateBackup.should.all.have.property("displayName");
            templateBackup.should.all.have.property("gitUrl");
            templateBackup.should.all.have.property("version");
            templateBackup.should.all.have.property("templateFlavor");
            templateBackup.should.all.have.property("type");
        });
    });

    describe("Check page backup data name property", () => {
        it("names should start with tns-", () => {
            for (const template of templateBackup) {
                template.name.should.be.a("string");
                expect(template.name).to.match(/tns-/);
            }
        });
    });
});
