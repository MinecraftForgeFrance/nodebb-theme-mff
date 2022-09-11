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
});
