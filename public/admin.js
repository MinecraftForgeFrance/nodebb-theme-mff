'use strict';

define('admin/plugins/persona', ['settings'], function (Settings) {
    const ACP = {};

    ACP.init = function () {
        const settingsElem = document.querySelector('.persona-settings');
        const saveButton = document.getElementById('save');

        if (settingsElem) {
            Settings.load('persona', settingsElem);
        }

        if (saveButton) {
            saveButton.addEventListener('click', function () {
                if (settingsElem) {
                    Settings.save('persona', settingsElem);
                }
            });
        }
    };

    return ACP;
});
