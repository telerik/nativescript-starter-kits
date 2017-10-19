import * as path from "path";

$injector.require("nsStarterKitsGitService", path.join(__dirname, "services", "nsStarterKitsGitService"));
$injector.require("nsStarterKitsNpmService", path.join(__dirname, "services", "nsStarterKitsNpmService"));
$injector.require("nsStarterKitsPageService", path.join(__dirname, "services", "nsStarterKitsPageService"));
$injector.requirePublicClass("nsStarterKitsTemplateService", path.join(__dirname, "services", "nsStarterKitsTemplateService")); // tslint:disable-line:max-line-length
$injector.requirePublicClass("nsStarterKitsApplicationService", path.join(__dirname, "services", "nsStarterKitsApplicationService")); // tslint:disable-line:max-line-length
