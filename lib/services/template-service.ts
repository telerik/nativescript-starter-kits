import * as path from 'path';
import * as fs from 'fs';
import * as childProcess from 'child_process';

const request = require('request-promise');
const Config = require('../../config.js');
const Backup = require('../../consts/backup-data');
const NodeCache = require("node-cache");
const tmpCache = new NodeCache();
const _indexof = require('lodash.indexof');
const _sortby = require('lodash.sortby');

export class TemplateService implements ITemplateService {
    constructor() {
    }

    public _sortTmpData(templates: Array<any>) {
        let flavOrder: Array<string> = ['JavaScript', 'TypeScript', 'Angular & TypeScript'],
            typeOrder: Array<string> = ['Blank', 'Navigation Drawer', 'Tabs', 'Master-Detail with Firebase'],
            sortedByType: Array<any>,
            sortByFlav: Array<any>;

        sortedByType = _sortby(templates, function (temp: any) {
            return _indexof(typeOrder, temp.displayName);
        });

        sortByFlav = _sortby(sortedByType, function (temp: any) {
            return _indexof(flavOrder, temp.templateFlavor);
        });

        return sortByFlav;
    }

    public _getTemplatesNames() {
        let repos: Array<any> = [
            'template-drawer-navigation',
            'template-tab-navigation',
            'template-master-detail',
            'template-blank',
            'template-drawer-navigation-ts',
            'template-master-detail-ts',
            'template-blank-ts',
            'template-tab-navigation-ts',
            'template-drawer-navigation-ng',
            'template-tab-navigation-ng',
            'template-master-detail-ng',
            'template-blank-ng'
        ];

        return new Promise(function (resolve, reject) {
            if (!repos || typeof repos === 'undefined') {
                reject('Error retrieving Template Name');
            } else {
                resolve(repos);
            }
        });
    }

    public _getTmpAssetsContent(templateName: string) {
        let that = this,
            platforms: any = {};
        return request({
            method: "GET",
            uri: 'https://api.github.com/repos/NativeScript/' + templateName + '/contents/tools/assets',
            json: true,
            resolveWithFullResponse: true,
            headers: {
                'user-agent': 'nativescript-starter-kits'
            }
        })
            .then(function (res: any) {
                for (let i = 0; i < res.body.length; i++) {
                    if (res.body[i].name.indexOf('phone') === -1) {
                        let platform = res.body[i].name.split('-').pop().split('.').shift();
                        if (platform !== 'android' || platform !== 'ios') {
                            let rep = platform.match(/^(?!android|ios).*$/g);
                            platform = platform.replace(rep, 'thumbnail');
                        }

                        platforms[platform] = res.body[i].name;
                    }
                }
                return that.tmpResourcesFromSrc(templateName, platforms);

            })
            .catch(function (err: any) {
                return {message: 'Error retrieving assets from repository', err: err};
            });
    }

    public tmpPackageJsonFromSrc(templateName: string) {
        let content: any;
        return request({
            method: 'GET',
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

    public tmpResourcesFromSrc(templateName: string, asset: any) {
        let content: any = {},
            promises: Array<any> = [];
        return new Promise(function (resolve, reject) {
            for (let key in asset) {
                if (asset.hasOwnProperty(key)) {
                    promises.push(
                        request({
                            method: 'GET',
                            uri: 'https://raw.githubusercontent.com/NativeScript/' + templateName + '/master/tools/assets/' + asset[key],
                            resolveWithFullResponse: true,
                            encoding: 'binary',
                            headers: {
                                'user-agent': 'nativescript-starter-kits'
                            }
                        })
                            .then(function (res: any) {
                                content[key] = 'data:image/png;base64,' + new Buffer(res.body.toString(), 'binary').toString('base64');
                            })
                            .catch(function (err: any) {
                                return {
                                    message: 'Error retrieving ' + templateName + ' assets from source',
                                    err: err
                                };
                            }));

                }
            }
            Promise.all(promises)
                .then(function () {
                    resolve(content);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    public imageEncode(filePath: string) {
        let bitmap = fs.readFileSync(filePath);

        return new Buffer(bitmap).toString('base64');
    }

    public checkTemplateFlavor(packageJson: any) {
        return new Promise(function (resolve) {
            if (packageJson.name.indexOf("-ng") > -1) {
                resolve("Angular & TypeScript");
            } else if (packageJson.name.indexOf("-ts") > -1) {
                resolve("TypeScript");
            } else {
                resolve("JavaScript");
            }
        });
    }

    public getTemplateMetaData(packageJson: any) {
        let meta: any = {};

        return new Promise(function (resolve, reject) {
            if (typeof packageJson === 'undefined') {
                reject({message: 'Missing package.json'});
            } else {
                meta.name = packageJson.name;
                meta.displayName = packageJson.displayName;
                meta.version = packageJson.version;
                meta.description = packageJson.description;
                meta.gitUrl = packageJson.repository.url;
                meta.type = packageJson.templateType;

                resolve(meta);
            }
        });
    }

    public getAppTemplateDetails(templateName: string) {
        let that = this,
            templateDetails: any = {};

        return new Promise(function (resolve, reject) {
            that.tmpPackageJsonFromSrc(templateName)
                .then(function (pj: any) {
                    let packageJson = pj;
                    that.getTemplateMetaData(packageJson)
                        .then(function (data: any) {
                            templateDetails.name = data.name;
                            templateDetails.displayName = data.displayName;
                            templateDetails.description = data.description;
                            templateDetails.version = data.version;
                            templateDetails.gitUrl = data.gitUrl;
                            templateDetails.type = data.type;

                            return that.checkTemplateFlavor(packageJson);
                        })
                        .then(function (flav) {
                            templateDetails.templateFlavor = flav;
                            return that._getTmpAssetsContent(templateName);
                        })
                        .then(function (resources) {
                            templateDetails.resources = resources;
                            resolve(templateDetails);
                        })
                        .catch(function (error) {
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
            promises: Array<any> = [];

        return new Promise(function (resolve, reject) {
            tmpCache.get("tempDetails", function (err: any, value: any) {
                if (!err) {
                    if (value === undefined) {
                        that._getTemplatesNames()
                            .then(function (repos: any) {
                                return repos;
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
                                        tempDetails = that._sortTmpData(tempDetails);
                                        tmpCache.set('tempDetails', tempDetails, Config.options.cacheTime);
                                        resolve(tempDetails);

                                    })
                                    .catch(function (error: any) {
                                        // TODO Implement error logger
                                        resolve(Backup.fallback);
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
