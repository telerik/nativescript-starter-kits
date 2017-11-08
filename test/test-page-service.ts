import { Yok } from "mobile-cli-lib/yok";
import { NsStarterKitsNpmService } from "../lib/services/nsStarterKitsNpmService";
import { NsStarterKitsPageService } from "../lib/services/nsStarterKitsPageService";
import util from "../lib/shared/util";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const sinon = require("sinon");

chai.use(chaiAsPromised);

let testInjector: any;

describe("PageService Api", () => {
    let npmService: NsStarterKitsNpmService;
    let pageService: NsStarterKitsPageService;

    const pageName = "dummyPageName";
    const appPath = "dummyPath";

    const pageTemplate = {
        name: "tns-page-dummy",
        displayName: "Dummy",
        description: "dummyDescription",
        version: "1.0",
        gitUrl: "dummyUrl",
        templateFlavor: "JavaScript",
        type: "Page template"
    };

    beforeEach(() => {
        npmService = new NsStarterKitsNpmService();
        pageService = new NsStarterKitsPageService(npmService);
        testInjector = new Yok();

        testInjector.register("nsStarterKitsPageService", NsStarterKitsPageService);
    });

    describe("Add page", () => {
        let sandbox: any;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => sandbox.restore());

        it("Should be rejected if page already exists", () => {
            const pageExistError = new Error(`Page with the name "${pageName}" already exists`);

            sandbox.stub(util.fs, "emptyDir")
                .returns(Promise.resolve());

            sandbox.stub(util, "pageExists")
                .returns(Promise.resolve(true));

            return expect(pageService.addPage(pageName, pageTemplate, appPath))
                .to.eventually.be.rejectedWith(pageExistError.message)
                .be.an.instanceOf(Error);
        });

        it("Should be rejected if page repository clone failed", () => {
            const pageCloneError = new Error("Error");

            sandbox.stub(util.fs, "emptyDir")
                .returns(Promise.resolve());

            sandbox.stub(util, "pageExists")
                .returns(Promise.resolve(false));

            sandbox.stub(npmService, "installPageTemplate")
                .returns(Promise.reject(pageCloneError));

            return expect(pageService.addPage(pageName, pageTemplate, appPath))
                .to.eventually.be.rejectedWith(pageCloneError.message)
                .be.an.instanceOf(Error);
        });

        it("Should return the newly created page directory path", () => {
            const newPageDirectory = "dummyDirectory";
            const clonedPagesDirectory = "dummyClonedPagesDirecotyr";

            sandbox.stub(util.fs, "emptyDir")
                .returns(Promise.resolve());

            sandbox.stub(util, "pageExists")
                .returns(Promise.resolve(false));

            sandbox.stub(npmService, "installPageTemplate")
                .returns(Promise.resolve(clonedPagesDirectory));

            sandbox.stub(pageService, "createPage")
                .returns(Promise.resolve(newPageDirectory));

            return expect(pageService.addPage(pageName, pageTemplate, appPath))
                .to.eventually.be.an("string", newPageDirectory);
        });

        it("Should run OK with empty version string", () => {
            const newPageDirectory = "dummyDirectory";

            sandbox.stub(util.fs, "emptyDir")
                .returns(Promise.resolve());

            sandbox.stub(util, "pageExists")
                .returns(Promise.resolve(false));

            sandbox.stub(util.childProcess, "spawn")
                .callsFake((command: string, commandArguments: Array<string>, options: any) => {
                    expect(commandArguments.join(" ")).not.to.include("@");

                    return {
                        on: (method: string, callback: any) => {
                            return callback(0);
                        }
                    };
                });

            sandbox.stub(pageService, "createPage")
                .returns(Promise.resolve(newPageDirectory));

            return expect(pageService.addPage(pageName, pageTemplate, appPath, ""))
                .to.eventually.be.an("string", newPageDirectory);
        });

        it("Should run OK with non-empty version string", () => {
            const newPageDirectory = "dummyDirectory";
            const templateVersion = "next";

            sandbox.stub(util.fs, "emptyDir")
                .returns(Promise.resolve());

            sandbox.stub(util, "pageExists")
                .returns(Promise.resolve(false));

            sandbox.stub(util.childProcess, "spawn")
                .callsFake((command: string, commandArguments: Array<string>, options: any) => {
                    expect(commandArguments.join(" ")).to.include("@" + templateVersion);
                    
                    return {
                        on: (method: string, callback: any) => {
                            return callback(0);
                        }
                    };
                });

            sandbox.stub(pageService, "createPage")
                .returns(Promise.resolve(newPageDirectory));

            return expect(pageService.addPage(pageName, pageTemplate, appPath, templateVersion))
                .to.eventually.be.an("string", newPageDirectory);
        });
    });
});
