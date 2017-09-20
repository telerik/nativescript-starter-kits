import * as chai from "chai";
const expect = chai.expect;
const templateBackup = require("../consts/pages-backup-data").fallback;
const chaiAsPromised = require("chai-as-promised");
const chaiThings = require("chai-things");

chai.use(chaiAsPromised);
chai.use(chaiThings);

describe("Page backup data", () => {

    describe("Check page backup data integrity", () => {
        it("Should be an Array of Objects", () => {
            return expect(Promise.resolve(templateBackup))
                .to.eventually.be.an("array").then((array) => {
                    array.forEach((item: any) => {
                        expect(item).to.have.property("name");
                        expect(item).to.have.property("description");
                        expect(item).to.have.property("displayName");
                        expect(item).to.have.property("gitUrl");
                        expect(item).to.have.property("version");
                        expect(item).to.have.property("templateFlavor");
                        expect(item).to.have.property("type");
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
