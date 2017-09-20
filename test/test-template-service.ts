import { Yok } from "mobile-cli-lib/yok";
import { GitService } from "../lib/services/git-service";
import { TemplateService } from "../lib/services/template-service";
import { Config } from "../lib/shared/config";

const templateBackup = require("../consts/templates-backup-data").fallback;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const sinon = require("sinon");

chai.use(chaiAsPromised);

let testInjector: any;

describe("TemplateService Api", () => {
    let gitService: GitService;
    let templateService: TemplateService;

    const packageJson = {
        name: "dummyName",
        displayName: "dummyDisplayName",
        version: "1.0",
        description: "dummyDescription",
        repository: {
            url: "dummyUrl"
        },
        templateType: "dummyType"
    };

    const appTemplate = {
        name: "tns-template-dummy-name",
        displayName: "dummyDisplayName",
        version: "1.0",
        description: "dummyDescription",
        gitUrl: "dummyUrl",
        templateType: "dummyType",
        type: "App template",
        resources: {
            android: "android",
            ios: "ios",
            thumbnail: "dummyThumbnail"
        }
    };

    beforeEach(() => {
        gitService = new GitService();
        templateService = new TemplateService(gitService);

        testInjector = new Yok();
        testInjector.register("templateService", TemplateService);
        testInjector.register("gitService", GitService);
    });

    describe("Check template flavor", () => {
        it("Should be rejected when no packageJson provided", () => {
            return expect(templateService.checkTemplateFlavor({}))
                .to.eventually.be.rejectedWith("Cannot read template details")
                .be.an.instanceOf(Error);
        });

        it("Should be rejected when no valid packageJson provided", () => {
            return expect(templateService.checkTemplateFlavor({ noName: "template-hello-world-ng" }))
                .to.eventually.be.rejectedWith("Cannot read template details")
                .be.an.instanceOf(Error);
        });

        it("Should return template flavor", () => {
            return expect(templateService.checkTemplateFlavor({ name: "template-hello-world-ng" }))
                .to.eventually.be.fulfilled
                .to.be.equal("Angular & TypeScript");
        });
    });

    describe("Get template metadata", () => {
        it("Should be rejected when no packageJson provided", () => {
            return expect(templateService.getTemplateMetaData({}))
                .to.eventually.be.rejectedWith("Missing or invalid package.json provided")
                .be.an.instanceOf(Error);
        });

        it("Should return template metadata", () => {
            const metadata = {
                name: "dummyName",
                displayName: "dummyDisplayName",
                version: "1.0",
                description: "dummyDescription",
                gitUrl: "dummyUrl",
                type: "dummyType"
            };

            return expect(templateService.getTemplateMetaData(packageJson))
                .to.eventually.be.fulfilled
                .to.be.an("object")
                .to.deep.equal(metadata);
        });
    });

    describe("Get App template details", () => {
        let sandbox: any;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => sandbox.restore());

        it("Check template details data integrity", () => {
            const expectedResources = {
                android: "android",
                ios: "ios",
                thumbnail: "dummyThumbnail"
            };

            sandbox.stub(gitService, "getPackageJsonFromSource")
                .returns(Promise.resolve(packageJson));

            sandbox.stub(gitService, "getAssetsContent")
                .returns(Promise.resolve(expectedResources));

            return expect(templateService.getAppTemplateDetails("template-hello-world-ng"))
                .to.eventually.be.fulfilled
                .to.be.an("object").then((template: any) => {
                    expect(template).to.have.property("name", "dummyName");
                    expect(template).to.have.property("description", "dummyDescription");
                    expect(template).to.have.property("displayName", "dummyDisplayName");
                    expect(template).to.have.property("gitUrl", "dummyUrl");
                    expect(template).to.have.property("version", "1.0");
                    expect(template).to.have.property("templateFlavor", "JavaScript");
                    expect(template).to.have.property("type", "dummyType");
                    expect(template.resources).to.deep.equal(expectedResources);
                });
        });

        it("Should be rejected when getPackageJsonFromSource fails", () => {
            sandbox.stub(gitService, "getPackageJsonFromSource")
                .returns(Promise.reject(new Error("Error")));

            return expect(templateService.getAppTemplateDetails("template-hello-world-ng"))
                .to.eventually.be.rejectedWith("Error")
                .be.an.instanceOf(Error);
        });

        it("Should be rejected when getAssetsContent fails", () => {
            sandbox.stub(gitService, "getPackageJsonFromSource")
                .returns(Promise.resolve(packageJson));

            sandbox.stub(gitService, "getAssetsContent")
                .returns(Promise.reject(new Error("Error")));

            return expect(templateService.getAppTemplateDetails("template-hello-world-ng"))
                .to.eventually.be.rejectedWith("Error")
                .be.an.instanceOf(Error);
        });
    });

    describe("Get Available templates", () => {
        let sandbox: any;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => sandbox.restore());

        it("Should return a Template Details array from cache", () => {
            templateService.templateCache.set("templateDetails", [appTemplate], 999999);

            return expect(templateService.getTemplates())
                .to.eventually.be.an("array")
                .to.have.length(1).then((templates: Array<any>) => {
                    templates.forEach((template: any) => {
                        expect(template).to.deep.equal(appTemplate);
                    });
                });
        });

        it("Should return a Template Details array and sets proper cache", () => {
            const templatesCount = Config.availableTemplateRepos.length;
            sandbox.stub(templateService, "getAppTemplateDetails")
                .returns(Promise.resolve(appTemplate));

            return expect(templateService.getTemplates())
                .to.eventually.be.an("array")
                .to.have.length(templatesCount).then((templates: Array<any>) => {
                    templates.forEach((template: any) => {
                        expect(template).to.deep.equal(appTemplate);
                    });
                }).then(() => {
                    templateService.templateCache.get("templateDetails", (error: any, cachedValue: any) => {
                        expect(error).to.be.a("null");
                        expect(cachedValue).to.be.an("array");
                        expect(cachedValue).to.have.length(templatesCount);

                        cachedValue.forEach((template: any) => {
                            expect(template).to.deep.equal(appTemplate);
                        });
                    });
                });
        });

        it("Should return a Template Details array from the backup data", () => {
            const templatesCount = templateBackup.length;

            sandbox.stub(templateService, "getAppTemplateDetails")
                .returns(Promise.reject(new Error("Error")));

            return expect(templateService.getTemplates())
                .to.eventually.be.an("array")
                .to.have.length(templatesCount).then((templates: Array<any>) => {
                    expect(templates).to.deep.equal(templateBackup);
                });
        });

        it("Should be rejected if cache template data fails", () => {
            const templatesCount = templateBackup.length;

            sandbox.stub(templateService.templateCache, "get").yields(new Error("Error"));

            return expect(templateService.getTemplates())
                .to.eventually.be.an("array")
                .to.have.length(templatesCount).then((templates: Array<any>) => {
                    expect(templates).to.deep.equal(templateBackup);
                });
        });
    });
});
