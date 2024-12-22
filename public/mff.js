'use strict';

$(document).ready(function () {
    const hiddenCategoriesIds = getHiddenCategoriesIds();
    setInitialCollapseStateAndListenEvents(hiddenCategoriesIds);
    // Hide MFF banner on account and group page.
    if ($('#content').find('div.account').length !== 0 || $('#content').find('div.groups').length !== 0) {
        $('#banner').css("display", "none");
    }

    // Hide MFF banner when transition to account or group page.
    $(window).on('action:ajaxify.start', function (ev, data) {
        if (data.url && ((data.url.match('user/') && !data.url.match('/chats')) || data.url.match('groups/'))) {
            $('#banner').css("display", "none");
        }
    });

    // Show again MFF banner when living user or group page
    $(window).on('action:ajaxify.end', function (ev, data) {
        if (!data.url || ((!data.url.match('user/') || data.url.match('/chats')) && !data.url.match('groups/'))) {
            $('#banner').css("display", "block");
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
        }
        catch(e) {
            console.log('Invalid hidden-cids, reset to empty array');
            return new Set();
        }
    }

    function saveHiddenCategoriesIds(cids) {
        localStorage.setItem('hidden-cids', JSON.stringify(Array.from(cids)));
    }

    function setInitialCollapseStateAndListenEvents(hiddenCids) {
        for (const cid of hiddenCids) {
            $(`#collapse-section-${cid}`).removeClass('show');
            $("a[data-bs-target='#collapse-section-" + cid + "'] > i").removeClass("fa-minus");
            $("a[data-bs-target='#collapse-section-" + cid + "'] > i").addClass("fa-plus");
            $("a[data-bs-target='#collapse-section-" + cid + "']").attr("aria-expanded", "false");
            $("a[data-bs-target='#collapse-section-" + cid + "']").addClass("collapsed");
        }

        $('.section-contents').on('hidden.bs.collapse', function (e) {
            $("a[data-bs-target='#" + e.currentTarget.id + "'] > i").removeClass("fa-minus");
            $("a[data-bs-target='#" + e.currentTarget.id + "'] > i").addClass("fa-plus");
            const cid = extractCid(e.currentTarget.id);
            hiddenCategoriesIds.add(cid);
            saveHiddenCategoriesIds(hiddenCategoriesIds);
        });

        $('.section-contents').on('show.bs.collapse', function (e) {
            $("a[data-bs-target='#" + e.currentTarget.id + "'] > i").removeClass("fa-plus");
            $("a[data-bs-target='#" + e.currentTarget.id + "'] > i").addClass("fa-minus");
            const cid = extractCid(e.currentTarget.id);
            hiddenCategoriesIds.delete(cid);
            saveHiddenCategoriesIds(hiddenCategoriesIds);
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

    $('#theme-picker li a').click(item => {
        const theme = $(item.target).data('theme');
        localStorage.setItem('theme', theme);
        setTheme(theme);
    });
});
