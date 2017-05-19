import {TemplateService} from "../lib/services/template-service";
import {Yok} from "mobile-cli-lib/yok";

const chai = require("chai");
const should = require("chai").should();

chai.use(require("chai-things"));

let testInjector: any;

describe("TemplateService Api", () => {
    beforeEach(function () {
        testInjector = new Yok();
        testInjector.register("templateService", TemplateService);
    });

    describe("Get template Version", function () {
        let templateService = new TemplateService();
        it("returns a template's version from package.json", function () {
            let version = templateService.getTemplateVersion("template-hello-world-ng");

            version.should.be.a("string");
            version.should.not.be.an("object");
            version.should.not.be.a("number");
            version.should.not.be.instanceOf(Error);
        });

        it("should handle errors gracefully", function () {
            let version = templateService.getTemplateVersion("templateее-hello-world-ng");

            version.should.be.instanceOf(Error);
            version.should.not.be.a("string");
            version.should.not.be.an("object");
            version.should.not.be.a("number");
        });
    });

    describe("Get template description", function () {
        let templateService = new TemplateService();
        it("returns a template description from package.json", function () {
            let description = templateService.getTemplateDescription("template-hello-world-ng");

            description.should.be.a("string");
            description.should.not.be.an("object");
            description.should.not.be.a("number");
            description.should.not.be.instanceOf(Error);
        });

        it("handles errors gracefully ", function () {
            let description = templateService.getTemplateDescription("templssate-hello-world-ng");

            description.should.be.instanceOf(Error);
            description.should.not.be.a("string");
            description.should.not.be.an("object");
            description.should.not.be.a("number");
        });
    });

    describe("Check template flavor", function () {
        let templateService = new TemplateService();
        it("Returns a template flavor", function () {
            let flavor = templateService.checkTemplateFlavor("template-hello-world-ng");

            flavor.should.be.a("string");
            flavor.should.not.be.an("object");
            flavor.should.not.be.a("number");
            flavor.should.not.be.instanceOf(Error);
        });

        it("handles errors gracefully ", function () {
            let flavor = templateService.checkTemplateFlavor("templssate-hello-world-ng");

            flavor.should.be.instanceOf(Error);
            flavor.should.not.be.a("string");
            flavor.should.not.be.an("object");
            flavor.should.not.be.a("number");
        });

    });

    describe("Get App template Details", function () {
        let templateService = new TemplateService();
        it("Returns a Template Details object via a Promise", function () {
            templateService.getAppTemplateDetails("template-hello-world-ng").then(function (details) {
                should.exist(details);
                details.should.be.an("object");
                details.should.have.property("name");
                details.should.have.property("description");
                details.should.have.property("version");
                details.should.have.property("templateFlavor");
                details.should.not.be.instanceOf(Error);

            }).catch(function (err) {
                should.not.exist(err);
            });
        });

        it("It handles error trough Promise Reject", function () {
            templateService.getAppTemplateDetails("template-hello-world-ng").then(function (details) {
                should.not.exist(details);
            }).catch(function (err) {
                should.exist(err);
                err.should.be.instanceOf(Error);
            });
        });
    });

    describe("Get Available templates", function () {
        let templateService = new TemplateService();
        it("Returns a Template Details array for all available templates", function () {
            templateService.getAvailableTemplates().then(function (templates) {
                should.exist(templates);
                templates.should.be.an("array");

                /*templates.should.contain.a.thing.with.property("name");
                templates.should.contain.a.thing.with.property("version");
                templates.should.contain.a.thing.with.property("description");
                templates.should.contain.a.thing.with.property("templateFlavor");*/

            }).catch(function (err) {
                should.not.exist(err);
            });
        });
    });
});
