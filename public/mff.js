'use strict';

$(document).ready(function () {
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
    });

    $('.section-contents').on('hidden.bs.collapse', function (e) {
        $("i[data-target='#" + e.currentTarget.id + "']").removeClass("fa-minus");
        $("i[data-target='#" + e.currentTarget.id + "']").addClass("fa-plus");
    });

    $('.section-contents').on('show.bs.collapse', function (e) {
        $("i[data-target='#" + e.currentTarget.id + "']").removeClass("fa-plus");
        $("i[data-target='#" + e.currentTarget.id + "']").addClass("fa-minus");
    });

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
