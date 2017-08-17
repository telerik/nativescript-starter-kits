import { Yok } from "mobile-cli-lib/yok";
import { TemplateService } from "../lib/services/template-service";

const chai = require("chai");
const should = require("chai").should();

chai.use(require("chai-things"));

let testInjector: any;

describe("TemplateService Api", () => {
    beforeEach(() => {
        testInjector = new Yok();
        testInjector.register("templateService", TemplateService);
    });

    describe("Check template flavor", () => {
        const templateService = new TemplateService();
        it("Returns a template flavor", () => {
            const flavor = templateService.checkTemplateFlavor({});

            flavor.should.be.a("string");
            flavor.should.not.be.an("object");
            flavor.should.not.be.a("number");
            flavor.should.not.be.instanceOf(Error);
        });

        it("handles errors gracefully ", () => {
            const flavor = templateService.checkTemplateFlavor({});

            flavor.should.be.instanceOf(Error);
            flavor.should.not.be.a("string");
            flavor.should.not.be.an("object");
            flavor.should.not.be.a("number");
        });

    });

    describe("Get App template Details", () => {
        const templateService = new TemplateService();
        it("Returns a Template Details object via a Promise", () => {
            templateService.getAppTemplateDetails("template-hello-world-ng").then((details) => {
                should.exist(details);
                details.should.be.an("object");
                details.should.have.property("name");
                details.should.have.property("description");
                details.should.have.property("version");
                details.should.have.property("templateFlavor");
                details.should.not.be.instanceOf(Error);

            }).catch((err) => {
                should.not.exist(err);
            });
        });

        it("It handles error trough Promise Reject", () => {
            templateService.getAppTemplateDetails("template-hello-world-ng").then((details) => {
                should.not.exist(details);
            }).catch((err) => {
                should.exist(err);
                err.should.be.instanceOf(Error);
            });
        });
    });

    describe("Get Available templates", () => {
        const templateService = new TemplateService();
        it("Returns a Template Details array for all available templates", () => {
            templateService.getTemplates().then((templates) => {
                should.exist(templates);
                templates.should.be.an("array");

                /*templates.should.contain.a.thing.with.property("name");
                templates.should.contain.a.thing.with.property("version");
                templates.should.contain.a.thing.with.property("description");
                templates.should.contain.a.thing.with.property("templateFlavor");*/

            }).catch((err) => {
                should.not.exist(err);
            });
        });
    });
});
