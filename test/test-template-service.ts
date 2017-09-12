import { Yok } from "mobile-cli-lib/yok";
import { GitService } from "../lib/services/git-service";
import { TemplateService } from "../lib/services/template-service";

const chai = require("chai");
const should = require("chai").should();

chai.use(require("chai-things"));

let testInjector: any;

describe("TemplateService Api", () => {
    beforeEach(() => {
        testInjector = new Yok();
        testInjector.register("templateService", TemplateService);
        testInjector.register("gitService", GitService);
    });

    describe("Check template flavor", () => {
        const gitService = new GitService();
        const templateService = new TemplateService(gitService);
        it("Returns a template flavor", () => {
            templateService.checkTemplateFlavor({name: "template-hello-world-ng"}).then((flavor) => {
                flavor.should.be.a("string");
                flavor.should.not.be.an("object");
                flavor.should.not.be.a("number");
                flavor.should.not.be.instanceOf(Error);
            });
        });

        it("handles errors gracefully ", () => {
            templateService.checkTemplateFlavor({}).then((flavor) => {
                should.fail(flavor, null, "flavor should not be returned");
            }, (errorFlavor) => {
                errorFlavor.should.be.instanceOf(Error);
            });
        });

    });

    describe("Get App template Details", () => {
        const gitService = new GitService();
        const templateService = new TemplateService(gitService);
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
        const gitService = new GitService();
        const templateService = new TemplateService(gitService);
        it("Returns a Template Details array for all available templates", () => {
            templateService.getTemplates().then((templates: any) => {
                should.exist(templates);
                templates.should.be.an("array");
                if (templates.length) {
                    for (let ti = templates.length - 1; ti >= 0; ti--) {
                        templates[ti].should.have.property("name");
                        templates[ti].name.should.contain("tns-template-");
                        templates[ti].should.have.property("version");
                        templates[ti].should.have.property("description");
                        templates[ti].should.have.property("templateFlavor");
                    }
                }
            }).catch((err) => {
                should.not.exist(err);
            });
        });
    });
});
