import * as path from 'path';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as https from 'https';

const CONFIG = require('../../config.js');

export class TemplateService implements ITemplateService {
    constructor() {
    }

    /*private _readTemplatePackageJson(tempPath: string) {
        let isDir = fs.statSync(tempPath).isDirectory(),
            tempContent;

        if (isDir) {
            tempContent = fs.readdirSync(tempPath);

            if (tempContent.indexOf("package.json") > -1) {
                return fs.readFileSync(path.join(tempPath, "package.json"), "utf8");
            } else {
                return new Error("Missing package.json file!");
            }
        }
    }*/

    // TODO make private
    public base64Decode(encoded: string) {
        let buf = Buffer.from(encoded, 'base64');
        return buf.toString('utf8');
    }

    // TODO make private
    public tmpPackageJsonFromSrc(templateName: string) {
        let that = this,
            content: any,
            options: any = {
            host: 'api.github.com',
            path: '/repos/NativeScript/' + templateName + '/contents/package.json?ref=master',
            headers: {
                'user-agent': 'nativescript-starter-kits'
            }
        };

        return new Promise(function (resolve, reject) {
            https.request(options, function (res) {
                let str = '';

                res.on('error', function (err) {
                    reject(err);
                });

                res.on('data', function (chunk) {
                    str += chunk;
                });

                res.on('end', function () {
                    try {
                        content = that.base64Decode(JSON.parse(str).content);
                        content = JSON.parse(content);
                        resolve(content);
                    } catch (err) {
                        // Handle API rate error
                        let errMsg = JSON.parse(str).message;
                        reject({message: errMsg, error: err});
                    }
                });
            }).end();
        });
    }

    public imageEncode(filePath: string) {
        let bitmap = fs.readFileSync(filePath);

        return new Buffer(bitmap).toString('base64');
    }

    public getTemplateVersion(templateName: string) {
        let that = this,
            packageJsonContent: any,
            version: any;
        return new Promise(function (resolve, reject) {
            that.tmpPackageJsonFromSrc(templateName)
                .then(function (pj) {
                    packageJsonContent = pj;
                    version = packageJsonContent.version;
                    resolve(version);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    public getTemplateDescription(templateName: string) {
        let that = this,
            packageJsonContent: any,
            description: any;

        return new Promise(function (resolve, reject) {
            that.tmpPackageJsonFromSrc(templateName)
                .then(function (pj) {
                    packageJsonContent = pj;
                    description = packageJsonContent.description;
                    resolve(description);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    public checkTemplateFlavor(templateName: string) {
        let that = this,
            packageJsonContent: any,
            dependencies: any,
            devDependencies: any;

        return new Promise(function (resolve, reject) {
            that.tmpPackageJsonFromSrc(templateName)
                .then(function (pj) {
                    packageJsonContent = pj;
                    dependencies = Object.keys(packageJsonContent.dependencies);
                    devDependencies = Object.keys(packageJsonContent.devDependencies);

                    if (dependencies.indexOf("nativescript-angular") > -1 || dependencies.indexOf("@angular") > -1) {
                        resolve("Angular & TypeScript");
                    } else if (devDependencies.indexOf("typescript") > -1 || devDependencies.indexOf("nativescript-dev-typescript") > -1) {
                        resolve("TypeScript");
                    } else {
                        resolve ("JavaScript");
                    }
                })
                .catch(function (err) {
                    reject(err);
                });
        });

    }

    public getAppTemplateDetails(templateName: string) {
        let that = this,
            templateDetails: any = {};

        templateDetails.name = templateName;

        return new Promise(function (resolve, reject) {
            that.getTemplateDescription(templateName)
                .then(function (desc) {
                    templateDetails.description = desc;
                    return that.getTemplateVersion(templateName);
                })
                .then(function (version) {
                    templateDetails.version = version;
                    return that.checkTemplateFlavor(templateName);
                })
                .then(function (flav) {
                    templateDetails.flavor = flav;
                    resolve(templateDetails);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    }

    public getTemplates() {
        let that = this,
            tempDetails: any = [],
            promises: any = [];

        return new Promise(function (resolve, reject) {
            for (let i = 0; i < CONFIG.appTemplates.length; i++) {
                promises.push(
                    that.getAppTemplateDetails(CONFIG.appTemplates[i])
                        .then(function (details) {
                            tempDetails.push(details);
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                );

            }
            Promise.all(promises)
                .then(function () {
                   resolve(tempDetails);
                });
        });
    }

    public downloadAppTemplate(url: string) {
        let command = 'git clone ' + url,
            templatesDir = __dirname.replace('services', 'templates'), // Temp hack
            exists;

        try {
            exists = fs.statSync(templatesDir);
        } catch (err) {
            console.error(err);
        }

        if (exists) {
            childProcess.exec(command, {cwd: templatesDir}, function (error, stdout, stderr) {
                if (error) {
                    console.error(error);
                } else if (stderr) {
                    console.error(error);
                } else {
                    console.log(stdout);
                }
            });
        } else {
            console.error('Missing templates directory');
        }
    }

    public getPageTemplateDetails(templateName: string) {
        let version: string,
            flavor: string,
            description: string,
            templateDetails: any;

        return new Promise(function (resolve, reject) {
            try {
                //version = that.getTemplateVersion(templateName);
                //flavor = that.checkTemplateFlavor(templateName);
                //description = that.getTemplateDescription(templateName);
            } catch (err) {
                reject(err);
            }

            templateDetails = {
                name: templateName,
                description: description,
                version: version,
                templateFlavor: flavor,
                gitUrl: 'https://github.com/NativeScript/template-drawer-navigation-ts.git',
                type: 'Page template',
                resources: []
            };

            resolve(templateDetails);

        });
    }

    public createApp(appName: string, location: string) {
        let appPath: string = path.join(location, appName);

        //TODO: Check if path is a valid system path!!!
        return new Promise(function (resolve, reject) {
            fs.mkdir(appPath, '0744', function (err) {
                if (err && err.code === 'EEXIST') {
                    reject({
                        message: appName + ' App already exists',
                        error: err
                    });
                } else {
                    resolve({
                        message: 'Successfully created ' + appName + ' App',
                        appPath: appPath
                    });
                }
            });
        });
    }

    public addPage(pageName: string, location: string) {
        let pagePath: string = path.join(location, pageName),
            exists: any;

        return new Promise(function (resolve, reject) {
            try {
                exists = fs.statSync(location);
            } catch (err) {
                reject(err);
            }

            if (!exists.isDirectory()) {
                reject({message: 'Invalid Path'});
            } else {
                // TODO: add Page logic here
                resolve({
                    message: 'Page' + pageName + ' added successfully!',
                    pagePath: pagePath
                });
            }
        });
    }
}

//$injector.register('templateService', TemplateService);

let test = new TemplateService();

test.getTemplates()
    .then(function (data) {
    console.log(data);
})
    .catch(function (err) {
        console.error(err);
    });
