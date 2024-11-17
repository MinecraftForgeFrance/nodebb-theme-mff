'use strict';

const meta = require.main.require('./src/meta');
const controllers = require('./lib/controllers');

const MFFTheme = {
    async init(params) {
        const { router, middleware } = params;

        const routeHelpers = require.main.require('./src/routes/helpers');
        routeHelpers.setupAdminPageRoute(router, '/admin/plugins/persona', [], controllers.renderAdminPage);

        routeHelpers.setupPageRoute(router, '/user/:userslug/theme', [
            middleware.exposeUid,
            middleware.ensureLoggedIn,
            middleware.canViewUsers,
            middleware.checkAccountPermissions,
        ], controllers.renderThemeSettings);
    },
    async addAdminNavigation(header) {
        header.plugins.push({
            route: '/plugins/persona',
            icon: 'fa-paint-brush',
            name: 'MFF Theme (persona based)'
        });
        return header;
    },
    async addProfileItem(data) {
        data.links.push({
            id: 'theme',
            route: 'theme',
            icon: 'fa-paint-brush',
            name: '[[themes/persona:settings.title]]',
            visibility: {
                self: true,
                other: false,
                moderator: false,
                globalMod: false,
                admin: false,
            },
        });

        return data;
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
                name: 'Main post header',
                template: 'topic.tpl',
                location: 'mainpost-header',
            },
            {
                name: 'Main post footer',
                template: 'topic.tpl',
                location: 'mainpost-footer',
            },
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
    }
};

module.exports = MFFTheme;
