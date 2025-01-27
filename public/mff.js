'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const hiddenCategoriesIds = getHiddenCategoriesIds();
    setInitialCollapseStateAndListenEvents(hiddenCategoriesIds);
    // Hide MFF banner on account and group page.
    if (document.querySelector('#content div.account') !== null || document.querySelector('#content div.groups') !== null) {
        document.getElementById('banner').style.display = 'none';
    }

    // Hide MFF banner when transition to account or group page.
    window.addEventListener('action:ajaxify.start', function (ev, data) {
        if (data.url && ((data.url.match('user/') && !data.url.match('/chats')) || data.url.match('groups/'))) {
            document.getElementById('banner').style.display = 'none';
        }
    });

    // Show again MFF banner when living user or group page
    window.addEventListener('action:ajaxify.end', function (ev, data) {
        if (!data.url || ((!data.url.match('user/') || data.url.match('/chats')) && !data.url.match('groups/'))) {
            document.getElementById('banner').style.display = "block";
        }

        if (data.url === '' || data.url === 'categories') {
            setInitialCollapseStateAndListenEvents(hiddenCategoriesIds);
        }
    });

    /**
     * Remove all characters before the last - and parse as integer.
     * Example: collapse-section-5 -> 5
     */
    function extractCid(cid) {
        return parseInt(cid.substring(cid.lastIndexOf('-') + 1));
    }

    function getHiddenCategoriesIds() {
        try {
            const cIds = JSON.parse(localStorage.getItem('hidden-cids'));
            if (Array.isArray(cIds)) {
                return new Set(cIds);
            }
            return new Set();
        } catch (e) {
            console.log('Invalid hidden-cids, reset to empty array');
            return new Set();
        }
    }

    function saveHiddenCategoriesIds(cids) {
        localStorage.setItem('hidden-cids', JSON.stringify(Array.from(cids)));
    }

    function setInitialCollapseStateAndListenEvents(hiddenCids) {
        for (const cid of hiddenCids) {
            const section = document.getElementById(`collapse-section-${cid}`);
            if (section) {
                section.classList.remove('show');
            }
            const linkIcon = document.querySelector(`a[data-bs-target='#collapse-section-${cid}'] > i`);
            if (linkIcon) {
                linkIcon.classList.remove('fa-minus');
                linkIcon.classList.add('fa-plus');
            }

            const link = document.querySelector(`a[data-bs-target='#collapse-section-${cid}']`);
            if (link) {
                link.setAttribute('aria-expanded', 'false');
                link.classList.add('collapsed');
            }
        }

        const sectionContents = document.querySelectorAll('.section-contents');
        sectionContents.forEach(section => {
            section.addEventListener('hidden.bs.collapse', function (e) {
                const icon = document.querySelector(`a[data-bs-target='#${e.currentTarget.id}'] > i`);
                if (icon) {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
                const cid = extractCid(e.currentTarget.id);
                hiddenCategoriesIds.add(cid);
                saveHiddenCategoriesIds(hiddenCategoriesIds);
            });

            section.addEventListener('shown.bs.collapse', function (e) {
                const icon = document.querySelector(`a[data-bs-target='#${e.currentTarget.id}'] > i`);
                if (icon) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
                const cid = extractCid(e.currentTarget.id);
                hiddenCategoriesIds.delete(cid);
                saveHiddenCategoriesIds(hiddenCategoriesIds);
            });
        });
    }

    function getPreferredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
        }
    });

    setTheme(getPreferredTheme());

    const themePickerItems = document.querySelectorAll('#theme-picker li a');
    themePickerItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const theme = event.target.dataset.theme;
            localStorage.setItem('theme', theme);
            setTheme(theme);
        });
    });
});
