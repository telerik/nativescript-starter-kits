import { Yok } from "mobile-cli-lib/yok";
import { GitService } from "../lib/services/git-service";
import { PageService } from "../lib/services/page-service";
import util from "../lib/shared/util";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const sinon = require("sinon");

chai.use(chaiAsPromised);

let testInjector: any;

describe("PageService Api", () => {
    let gitService: GitService;
    let pageService: PageService;

    const pageName = "dummyPageName";
    const appPath = "dummyPath";

    const pageTemplate = {
        name: "tns-page-dummy",
        displayName: "Dummy",
        description: "dummyDescription",
        version: "1.0",
        gitUrl: "dummyUrl",
        templateFlavor: "dummyFlavor",
        type: "Page template"
    };

    beforeEach(() => {
        gitService = new GitService();
        pageService = new PageService(gitService);
        testInjector = new Yok();

        testInjector.register("pageService", PageService);
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

            sandbox.stub(gitService, "clonePageTemplate")
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

            sandbox.stub(gitService, "clonePageTemplate")
                .returns(Promise.resolve(clonedPagesDirectory));

            sandbox.stub(pageService, "createPage")
                .returns(Promise.resolve(newPageDirectory));

            return expect(pageService.addPage(pageName, pageTemplate, appPath))
                .to.eventually.be.an("string", newPageDirectory);
        });
    });
});
