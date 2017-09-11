import * as path from "path";

$injector.require("gitService", path.join(__dirname, "services", "git-service"));
$injector.require("pageService", path.join(__dirname, "services", "page-service"));
$injector.requirePublicClass("templateService", path.join(__dirname, "services", "template-service"));
$injector.requirePublicClass("applicationService", path.join(__dirname, "services", "application-service"));
