'use strict';

const fs = require('fs');
const striptags = require('striptags');
const async = require.main.require('async');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');
const minifier = require.main.require('./src/meta/minifier');

const MFFTheme = {
    init(params, callback) {
        const app = params.router;
        const middleware = params.middleware;
    
        app.get('/admin/plugins/persona', middleware.admin.buildHeader, renderAdmin);
        app.get('/api/admin/plugins/persona', renderAdmin);

        async.waterfall([
            function (next) {
                minifier.css.bundle('@import "dark-skin.less";', [ __dirname + '/less/mff'], true, true, next)
            },
            function (bundle, next) {
                fs.writeFile(__dirname + '/static/styles/dark-skin.css', bundle.code, next);
            }
        ], function(err) {
            if (err) {
                winston.warn('[theme/mff] Unable to compile dark theme', err);
            }
        });
    
        callback();
    },
    addAdminNavigation(header, callback) {
        header.plugins.push({
            route: '/plugins/persona',
            icon: 'fa-paint-brush',
            name: 'Persona Theme'
        });
    
        callback(null, header);
    },
    getTeasers(data, callback) {
        data.teasers.forEach(function(teaser) {
            if (teaser && teaser.content) {
                teaser.content = striptags(teaser.content, ['img']);
            }
        });
        callback(null, data);
    },
    defineWidgetAreas(areas, callback) {
        areas = areas.concat([
            {
                name: "Categories Sidebar",
                template: "categories.tpl",
                location: "sidebar"
            },
            {
                name: "Category Sidebar",
                template: "category.tpl",
                location: "sidebar"
            },
            {
                name: "Topic Sidebar",
                template: "topic.tpl",
                location: "sidebar"
            },
            {
                name: "Categories Header",
                template: "categories.tpl",
                location: "header"
            },
            {
                name: "Category Header",
                template: "category.tpl",
                location: "header"
            },
            {
                name: "Topic Header",
                template: "topic.tpl",
                location: "header"
            },
            {
                name: "Categories Footer",
                template: "categories.tpl",
                location: "footer"
            },
            {
                name: "Category Footer",
                template: "category.tpl",
                location: "footer"
            },
            {
                name: "Topic Footer",
                template: "topic.tpl",
                location: "footer"
            }
        ]);
    
        callback(null, areas);
    },
    getThemeConfig(config, callback) {
        meta.settings.get('persona', function(err, settings) {
            config.hideSubCategories = settings.hideSubCategories === 'on';
            config.hideCategoryLastPost = settings.hideCategoryLastPost === 'on';
            config.enableQuickReply = settings.enableQuickReply === 'on';
            callback(null, config);
        });
    },
    addUserToTopic(data, callback) {
        if (data.req.user) {
            user.getUserData(data.req.user.uid, function(err, userdata) {
                if (err) {
                    return callback(err);
                }
    
                data.templateData.loggedInUser = userdata;
                callback(null, data);
            });
        } else {
            data.templateData.loggedInUser =  {
                uid: 0,
                username: '[[global:guest]]',
                picture: user.getDefaultAvatar(),
                'icon:text': '?',
                'icon:bgColor': '#aaa',
            };
            callback(null, data);
        }
    },
    addUserSettings(data, callback) {
        let availableSkins = [{
            name: 'Light',
            value: 'light'
        }, {
            name: 'Dark',
            value: 'dark'
        }];
    
        let options = '';
        availableSkins.forEach(function(skin) {
            options += `<option value="${skin.value}" ${(data.settings.mffThemeSkin === skin.value) ? 'selected' : ''}>${skin.name}</option>`;
        });
    
        data.customSettings.push({
            title: 'Paramètre du thème',
            content: `
            <div class="form-group">
                <label for="mffThemeSkin">Style de MFFv4</label>
                <select class="form-control" id="mffThemeSkin" data-property="mffThemeSkin" autocomplete="off">
                    ${options}
                </select>
            </div>`
        });
    
        callback(null, data);
    },
    saveUserSettings(data) {
        user.setUserField(data.uid, "mffthemeskin", data.settings.mffThemeSkin);
    },
    getUserSettings(data, callback) {
        user.getUserField(data.uid, "mffthemeskin", (err, mffSkin) => {
            if(!err && mffSkin) {
                data.settings.mffThemeSkin = mffSkin;
            } else {
                data.settings.mffThemeSkin = "light";
            }
            callback(null, data);
        });
    },
    appendUserFields(data, callback) {
        data.whitelist.push("mffthemeskin");
        callback(null, data);
    },
    getLinkTags(data, callback) {
        if(data.req.uid) {
            user.getUserField(data.req.uid, "mffthemeskin", (err, mffSkin) => {
                if(!err && mffSkin === "dark") {
                    data.links.push({
                        rel: 'stylesheet',
                        href: '/plugins/nodebb-theme-mff/styles/dark-skin.css'
                    });
                }
                callback(null, data);
            });
        }
        else {
            callback(null, data);
        }
    }
};

function renderAdmin(req, res, next) {
	res.render('admin/plugins/persona', {});
}

module.exports = MFFTheme;
