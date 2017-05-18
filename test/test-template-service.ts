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
                version = templateService.getTemplateVersion('template-hello-world-ng');

            version.should.be.a("string");
            version.should.not.be.an("object");
            version.should.not.be.a("number");
            version.should.not.be.instanceOf(Error);
        });

        it("should handle errors gracefully", function () {
            let templateService = new TemplateService(),
                version = templateService.getTemplateVersion('templateее-hello-world-ng');

            version.should.be.instanceOf(Error);
            version.should.not.be.a("string");
            version.should.not.be.an("object");
            version.should.not.be.a("number");
        });
    });
});

