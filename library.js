'use strict';

const fs = require('fs');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');
const minifier = require.main.require('./src/meta/minifier');

const MFFTheme = {
    async init(params) {
        const { router, middleware } = params;

        const routeHelpers = require.main.require('./src/routes/helpers');
        routeHelpers.setupAdminPageRoute(router, '/admin/plugins/persona', middleware, [], (req, res) => {
            res.render('admin/plugins/persona', {});
        });

        try {
            const bundle = await minifier.css.bundle('@import "dark-skin.less";', [ __dirname + '/less/mff'], true, true);
            fs.writeFileSync(__dirname + '/static/styles/dark-skin.css', bundle.code);
        }
        catch (err) {
            winston.warn('[theme/mff] Unable to compile dark theme', err);
        }
    },
    async addAdminNavigation(header) {
        header.plugins.push({
            route: '/plugins/persona',
            icon: 'fa-paint-brush',
            name: 'MFF Theme (persona based)'
        });
        return header;
    },
    async defineWidgetAreas(areas) {
        const locations = ['header', 'sidebar', 'footer'];
        const templates = [
            'categories.tpl', 'category.tpl', 'topic.tpl', 'users.tpl',
            'unread.tpl', 'recent.tpl', 'popular.tpl', 'top.tpl', 'tags.tpl', 'tag.tpl',
            'login.tpl', 'register.tpl',
        ];
        function capitalizeFirst(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        templates.forEach((template) => {
            locations.forEach((location) => {
                areas.push({
                    name: `${capitalizeFirst(template.split('.')[0])} ${capitalizeFirst(location)}`,
                    template: template,
                    location: location,
                });
            });
        });

        areas = areas.concat([
            {
                name: 'Account Header',
                template: 'account/profile.tpl',
                location: 'header',
            },
        ]);
        return areas;
    },
    async getThemeConfig(config) {
        const settings = await meta.settings.get('persona');
        config.hideSubCategories = settings.hideSubCategories === 'on';
        config.hideCategoryLastPost = settings.hideCategoryLastPost === 'on';
        config.enableQuickReply = settings.enableQuickReply === 'on';
        return config;
    },
    async addUserToTopic(data) {
        const settings = await meta.settings.get('persona');
        if (settings.enableQuickReply === 'on') {
            if (data.req.user) {
                const userData = await user.getUserData(data.req.user.uid);
                data.templateData.loggedInUser = userData;
            } else {
                data.templateData.loggedInUser = {
                    uid: 0,
                    username: '[[global:guest]]',
                    picture: user.getDefaultAvatar(),
                    'icon:text': '?',
                    'icon:bgColor': '#aaa',
                };
            }
        }

        return data;
    },
    async addUserSettings(data) {
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
        return data;
    },
    saveUserSettings(data) {
        user.setUserField(data.uid, "mffthemeskin", data.settings.mffThemeSkin);
    },
    async getUserSettings(data) {
        const mffSkin = await user.getUserField(data.uid, "mffthemeskin");
        data.settings.mffThemeSkin = mffSkin || "light";
        return data;
    },
    appendUserFields(data) {
        data.whitelist.push("mffthemeskin");
        return data;
    },
    async getLinkTags(data) {
        if (data.req.uid) {
            const mffSkin = await user.getUserField(data.req.uid, "mffthemeskin");
            if(mffSkin === "dark") {
                data.links.push({
                    rel: 'stylesheet',
                    href: '/plugins/nodebb-theme-mff/styles/dark-skin.css'
                });
            }
        }
        return data;
    }
};

module.exports = MFFTheme;
