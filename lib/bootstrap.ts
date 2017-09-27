import * as path from "path";

$injector.require("gitApiService", path.join(__dirname, "services", "git-service"));
$injector.require("pageService", path.join(__dirname, "services", "page-service"));
$injector.requirePublicClass("templateService", path.join(__dirname, "services", "template-service"));
$injector.requirePublicClass("applicationService", path.join(__dirname, "services", "application-service"));
