export class Config {
    static cacheTime = 3600;
    static orgBaseUrl = "https://github.com/NativeScript/%s";

    static availableTemplateRepos: Array<any> = [
        "template-drawer-navigation",
        "template-tab-navigation",
        "template-master-detail",
        "template-blank",
        "template-drawer-navigation-ts",
        "template-master-detail-ts",
        "template-blank-ts",
        "template-tab-navigation-ts",
        "template-drawer-navigation-ng",
        "template-tab-navigation-ng",
        "template-master-detail-ng",
        "template-blank-ng",
        "template-master-detail-kinvey",
        "template-master-detail-kinvey-ng",
        "template-master-detail-kinvey-ts"
    ];

    static availablePages: Array<any> = [
        "blank",
        "login",
        "signup"
    ];
}
