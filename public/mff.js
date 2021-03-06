"use strict";

$(document).ready(function () {
    var currentSkin = "";

    if ($('#content').find('div.account').length !== 0 || $('#content').find('div.groups').length !== 0) {
        $('#banner').css("display", "none");
    }

    $(window).on('action:ajaxify.start', function (ev, data) {
        if (data.url && ((data.url.match('user/') && !data.url.match('/chats')) || data.url.match('groups/'))) {
            $('#banner').css("display", "none");
        }

        if (ajaxify.data.template.name === 'account/settings') {
            changePageSkin(currentSkin);
        }
    });

    $(window).on('action:ajaxify.end', function (ev, data) {
        // display banner at end to avoid weird transition
        if (!data.url || ((!data.url.match('user/') || data.url.match('/chats')) && !data.url.match('groups/'))) {
            $('#banner').css("display", "block");
        }

        if (ajaxify.data.template.name === 'account/settings') {
            currentSkin = $('#mffThemeSkin').val();
            $('#mffThemeSkin').on('change', function () {
                changePageSkin($(this).val());
            });

            $("#submitBtn").on('click', function () {
                currentSkin = $('#mffThemeSkin').val();
            });
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

    function changePageSkin(skinName) {
        var cssSource = '/plugins/nodebb-theme-mff/styles/dark-skin.css';
        if (skinName === 'light') {
            $('link[href="' + cssSource + '"]').remove();
        } else if (skinName === 'dark') {
            $('head').append('<link rel="stylesheet" href="' + cssSource + '" media="screen">');
        }
    }
});
