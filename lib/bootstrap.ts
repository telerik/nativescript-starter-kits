import * as path from "path";

$injector.require("nsStarterKitsGitService", path.join(__dirname, "services", "nsStarterKitsGitService"));
$injector.require("nsStarterKitsPageService", path.join(__dirname, "services", "nsStarterKitsPageService"));
$injector.requirePublicClass("nsStarterKitsTemplateService", path.join(__dirname, "services", "nsStarterKitsTemplateService"));
$injector.requirePublicClass("nsStarterKitsApplicationService", path.join(__dirname, "services", "nsStarterKitsApplicationService"));
