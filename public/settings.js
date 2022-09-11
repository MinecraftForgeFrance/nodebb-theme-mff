'use strict';

define('forum/account/theme', ['forum/account/header', 'storage', 'settings', 'alerts', 'api'], function (header, Storage, settings, alerts, api) {
	const Theme = {};

	Theme.init = () => {
		header.init();
		Theme.setupForm();
	};

	Theme.setupForm = () => {
		const saveEl = document.getElementById('save');
		const formEl = document.getElementById('theme-settings');
		const mffThemeSkinEl = document.getElementById('mffThemeSkin');
		const [sidebarSwapped, autohideNavbarEnvs] = [
			!!Storage.getItem('persona:menus:legacy-layout'),
			Storage.getItem('persona:navbar:autohide'),
		];

		document.getElementById('persona:menus:legacy-layout').checked = sidebarSwapped;
		try {
			const parsed = JSON.parse(autohideNavbarEnvs) || ['xs', 'sm'];
			parsed.forEach((env) => {
				const optionEl = document.getElementById('persona:navbar:autohide').querySelector(`option[value="${env}"]`);
				optionEl.selected = true;
			});
		} catch (e) {
			console.warn(e);
		}

		if (saveEl) {
			saveEl.addEventListener('click', () => {
				const themeSettings = settings.helper.serializeForm($(formEl));
				Object.keys(themeSettings).forEach((key) => {
					if (key === 'persona:menus:legacy-layout') {
						if (themeSettings[key] === 'on') {
							Storage.setItem('persona:menus:legacy-layout', 'true');
						} else {
							Storage.removeItem('persona:menus:legacy-layout');
						}

						return;
					}

					Storage.setItem(key, themeSettings[key]);
				});

				api.put(`/users/${ajaxify.data.uid}/settings/theme`, { mffThemeSkin: mffThemeSkinEl.value }).then(() => {
					alerts.success('[[success:settings-saved]]');
				});
			});
		}

		if (mffThemeSkinEl) {
			$('#mffThemeSkin').on('change', function () {
                changePageSkin($(this).val());
            });
		}
	};

	function changePageSkin(skinName) {
        var cssSource = '/assets/plugins/@minecraftforgefrance/nodebb-theme-mff/styles/dark-skin.css';
        if (skinName === 'light') {
            $('link[href="' + cssSource + '"]').remove();
        } else if (skinName === 'dark') {
            $('head').append('<link rel="stylesheet" href="' + cssSource + '" media="screen">');
        }
    }

	return Theme;
});

