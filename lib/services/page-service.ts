export class PageService implements IPageService {
    getPages(flavor: string) {
        console.log("Hello World");
    }
}

$injector.register("pageService", PageService);
