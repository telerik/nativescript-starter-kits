import {TemplateService} from "../lib/services/template-service"
import {Yok} from "mobile-cli-lib/yok";

const should = require('chai').should();

let testInjector: any;

describe("TemplateService Api", () => {
    beforeEach(function () {
        testInjector = new Yok();
        testInjector.register("templateService", TemplateService);
    });

    describe("Get template Version", function () {
        it("returns a template's version from package.json", function () {
            let templateService = new TemplateService(),
                version = templateService.getTemplateVersion("template-hello-world-ng");

            version.should.be.a("string");
            version.should.not.be.an("object");
            version.should.not.be.a("number");
            version.should.not.be.instanceOf(Error);
        });

        it("should handle errors gracefully", function () {
            let templateService = new TemplateService(),
                version = templateService.getTemplateVersion("templateее-hello-world-ng");

            version.should.be.instanceOf(Error);
            version.should.not.be.a("string");
            version.should.not.be.an("object");
            version.should.not.be.a("number");
        });
    });

    describe("Get template description", function () {
        it("returns a template description from package.json", function () {
            let templateService = new TemplateService(),
                description = templateService.getTemplateDescription("template-hello-world-ng")

            description.should.be.a("string");
            description.should.not.be.an("object");
            description.should.not.be.a("number");
            description.should.not.be.instanceOf(Error);
        });

        it("handles errors gracefully ", function () {
            let templateService = new TemplateService(),
                description = templateService.getTemplateDescription("templssate-hello-world-ng")

            description.should.be.instanceOf(Error);
            description.should.not.be.a("string");
            description.should.not.be.an("object");
            description.should.not.be.a("number");
        });
    });

    describe("Check template flavor", function () {
        it("Returns a template flavor", function () {
            let templateService = new TemplateService(),
                flavor = templateService.checkTemplateFlavor("template-hello-world-ng");

            flavor.should.be.a("string");
            flavor.should.not.be.an("object");
            flavor.should.not.be.a("number");
            flavor.should.not.be.instanceOf(Error);
        });

        it("handles errors gracefully ", function () {
            let templateService = new TemplateService(),
                flavor = templateService.checkTemplateFlavor("templssate-hello-world-ng")

            flavor.should.be.instanceOf(Error);
            flavor.should.not.be.a("string");
            flavor.should.not.be.an("object");
            flavor.should.not.be.a("number");
        });

    });
});

