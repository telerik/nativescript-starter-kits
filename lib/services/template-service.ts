import * as path from 'path';
import * as fs from 'fs';
import * as childProcess from 'child_process';

const request = require('request-promise');
const Config = require('../../config.js');
const NodeCache = require("node-cache");
const tmpCache = new NodeCache();

export class TemplateService implements ITemplateService {
    constructor() {
    }

    public _filterRepoResults(repos: any) {
        let names: Array<any> = [],
            regEx = new RegExp(/^template-(?!hello).*/gm); // Match all templates
        return new Promise(function (resolve) {
            for (let i = 0; i < repos.length; i++) {
                if (repos[i].name.match(regEx)) {
                    names.push(repos[i].name);
                }
            }
            resolve(names);
        });
    }

    public _getNsGitRepos(uri: string, repos: Array<any>) {
        let that = this;
        return request({
            method: "GET",
            uri: uri,
            json: true,
            resolveWithFullResponse: true,
            headers: {
                'user-agent': 'nativescript-starter-kits'
            }
        })
            .then(function (response: any) {
                if (!repos) {
                    repos = [];
                }

                repos = repos.concat(response.body);

                if (response.headers.link.split(",").filter(function (link: any) {
                        return link.match(/rel="next"/);
                    }).length > 0) {
                    let next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function (link: any) {
                        return link.match(/rel="next"/);
                    })[0])[1];
                    return that._getNsGitRepos(next, repos);
                }
                return repos;
            })
            .catch(function (err: any) {
                return {message: 'Error retrieving github repositories', err: err};
            });
    }

    // TODO make private
    public base64Decode(encoded: string) {
        let buf = Buffer.from(encoded, 'base64');
        return buf.toString('utf8');
    }

    // TODO make private
    public tmpPackageJsonFromSrc(templateName: string) {
        let content: any;

        return request({
            method: "GET",
            uri: 'https://raw.githubusercontent.com/NativeScript/' + templateName + '/master/package.json',
            json: true,
            resolveWithFullResponse: true,
            headers: {
                'user-agent': 'nativescript-starter-kits'
            }
        })
            .then(function (res: any) {
                content = res.body;
                if (content.hasOwnProperty('templateType')) {
                    return content;
                }
            })
            .catch(function (err: any) {
                return {
                    message: 'Error retrieving ' + templateName + ' package.json from src',
                    err: err
                };
            });
    }

    public imageEncode(filePath: string) {
        let bitmap = fs.readFileSync(filePath);

        return new Buffer(bitmap).toString('base64');
    }

    public getTemplateVersion(templateName: string, packageJson: any) {
        let version: string;
        return new Promise(function (resolve, reject) {
            version = packageJson.version;
            resolve(version);

        });
    }

    public getTemplateGitUrl(templateName: string, packageJson: any) {
        let gitUrl: string;

        return new Promise(function (resolve, reject) {
            gitUrl = packageJson.repository.url;
            resolve(gitUrl);
        });
    }

    public getTemplateDescription(templateName: string, packageJson: any) {
        let description: string;

        return new Promise(function (resolve, reject) {
            description = packageJson.description;
            resolve(description);
        });
    }

    public checkTemplateFlavor(templateName: string, packageJson: any) {
        let dependencies: any,
            devDependencies: any;

        return new Promise(function (resolve, reject) {

            dependencies = Object.keys(packageJson.dependencies);
            devDependencies = Object.keys(packageJson.devDependencies);

            if (dependencies.indexOf("nativescript-angular") > -1 || dependencies.indexOf("@angular") > -1) {
                resolve("Angular & TypeScript");
            } else if (devDependencies.indexOf("typescript") > -1 || devDependencies.indexOf("nativescript-dev-typescript") > -1) {
                resolve("TypeScript");
            } else {
                resolve("JavaScript");
            }
        });
    }

    public getAppTemplateDetails(templateName: string) {
        let that = this,
            templateDetails: any = {};

        templateDetails.name = templateName;

        return new Promise(function (resolve, reject) {
            that.tmpPackageJsonFromSrc(templateName)
                .then(function (pj: any) {
                    let packageJson = pj;
                    //console.log('packageJson====  ', typeof packageJson);
                    that.getTemplateDescription(templateName, packageJson)
                        .then(function (desc: string) {
                            templateDetails.description = desc;
                            return that.getTemplateVersion(templateName, packageJson);
                        })
                        .then(function (version: string) {
                            templateDetails.version = version;
                            return that.getTemplateGitUrl(templateName, packageJson);
                        })
                        .then(function (gitUrl: string) {
                            templateDetails.gitUrl = gitUrl;
                            return that.checkTemplateFlavor(templateName, packageJson);
                        })
                        .then(function (flav: string) {
                            templateDetails.flavor = flav;
                            resolve(templateDetails);
                        })
                        .catch(function (error: any) {
                            reject({
                                message: 'Error retrieving data for ' + templateName,
                                error: error
                            });
                        });
                })
                .catch(function (error: any) {
                    reject(error);
                });
        });
    }

    public getTemplates() {
        let that = this,
            tempDetails: Array<any> = [],
            promises: Array<any> = [],
            gitRepos: Array<any> = [];

        return new Promise(function (resolve, reject) {
            tmpCache.get("tempDetails", function (err: any, value: any) {
                if (!err) {
                    if (value === undefined) {
                        console.log('No cache ==== ');
                        that._getNsGitRepos(Config.options.orgBaseUrl, gitRepos)
                            .then(function (repos: any) {
                                return that._filterRepoResults(repos);
                            })
                            .then(function (names: any) {
                                for (let i = 0; i < names.length; i++) {
                                    promises.push(
                                        that.getAppTemplateDetails(names[i])
                                            .then(function (details) {
                                                tempDetails.push(details);
                                            })
                                            .catch(function (error) {
                                                reject(error);
                                            })
                                    );
                                }
                                Promise.all(promises)
                                    .then(function () {
                                        tmpCache.set('tempDetails', tempDetails, Config.options.cacheTime);
                                        resolve(tempDetails);

                                    });
                            })
                            .catch(function (error: any) {
                                console.error(error);
                            });

                    } else {
                        // Load data from cache
                        resolve(value);
                    }
                }
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

$injector.register('templateService', TemplateService);
