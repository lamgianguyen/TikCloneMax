var navigation = {};
navigation.defaultPage = "start";
navigation.currentPage = null;
navigation.lastPage = null;
navigation.lastSubPageOpen = null;
navigation.lastSubPageAreaName = null;
navigation.navigatedFromLanguage = null;

navigation.init = function () {

    const navApp = createNavigation();
    navApp.mount("#navigation-app");

    $(".menuitemmain").click(navigation.onMainPageClick);

    let urlParts = window.location.pathname.split("/").slice(1);
    let urlPage = urlParts[urlParts.length - 1];

    if (urlParts[0].length === 2) {
        navigation.navigatedFromLanguage = urlParts[0];
    }

    if (urlPage) {
        navigation.pageChange(urlPage);
    } else {
        navigation.pageChange(navigation.defaultPage);
    }
}

navigation.onMainPageClick = function (event) {
    var menuItem = $(event.target);
    var pageId = menuItem.data("pageid");
    var dialogId = menuItem.data("dialogid");

    if (dialogId !== undefined) {
        navigation.handleDialogs(dialogId)
    }

    if (pageId === undefined || pageId === '') {
        return;
    }

    if (!pageId) pageId = menuItem.parent().data("pageid");
    navigation.pageChange(pageId);
}

navigation.handleDialogs = function (dialogId) {
    switch(dialogId) {
         case 'giftbrowser':
            giftBrowser.dialog();
            break;
        default:
        console.warn('dialogId:', dialogId);
    }
}

navigation.pageChange = function (pageId, isPopState) {
    if (navigation.lastPage === pageId) {
        navigation.setSubMenuItems();
        return;
    }

    try {
        if (typeof setup === 'object') setup.closeNativeUpgradeModal();
    } catch (err) { }

    var menuItem = $(".menuitemmain[data-pageid=" + pageId + "]").first();
    var page = $(".page[data-pageid=" + pageId + "]").first();
    $(".menuitemmain").removeClass("menuitemselected");
    $(".page").removeClass("pageenabled");

    // page scroll top
    $("html,body").animate({ scrollTop: 0 }, 2);

    // scroll to menu item (if element not visible)
    try {
        var menuItemList = $(".sidebarmenuitemlist").first();
        var scrollToOffset = menuItemList.scrollTop() + menuItem.position().top - 450;
        if (scrollToOffset > menuItemList.scrollTop() + 180 || scrollToOffset < menuItemList.scrollTop() - 50) {
            menuItemList.animate({
                scrollTop: scrollToOffset
            }, 500);
        }
    } catch (err) { }

    // pause youtube videos
    try {
        $('.ytvideo').each(function () {
            if (this.contentWindow && this.contentWindow.postMessage) this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        });
    } catch (err) { }

    menuItem.addClass("menuitemselected");
    page.addClass("pageenabled");
    navigation.currentPage = pageId;

    let urlPrefix = "";

    if (navigation.navigatedFromLanguage) {
        urlPrefix = "/" + navigation.navigatedFromLanguage;
    }

    if (!isPopState) {
        if (pageId === navigation.defaultPage) {
            if (window.location.pathname === "/") {
                window.history.replaceState({ page: pageId }, "", urlPrefix + '/');
            } else {
                window.history.pushState({ page: pageId }, "", urlPrefix + '/');
            }
        } else {
            window.history.pushState({ page: pageId }, "", urlPrefix + '/tiktok/' + pageId);
        }
    }

    if (navigation.lastPage && window[navigation.lastPage] && typeof window[navigation.lastPage].onHide === "function") {
        window[navigation.lastPage].onHide();
    }

    if (window[pageId] && typeof window[pageId].onVisible === "function") {
        window[pageId].onVisible();
    }

    navigation.lastPage = pageId;

    navigation.setSubMenuItems();
}

navigation.setSubMenuItems = function () {
    if (!navigation.currentPage) return;

    var $menuItem = $(".menuitemmain[data-pageid=" + navigation.currentPage + "]").first();
    var $page = $(".page[data-pageid=" + navigation.currentPage + "]").first();

    // open subpage navigation
    let $oldContainers = $(".subMenuContainer");


    $oldContainers.slideUp(200, () => {
        $oldContainers.remove();
    });

    if ($oldContainers.length > 0) {
        if (navigation.currentPage === navigation.lastSubPageAreaName) return;
    }

    if (navigation.currentPage === "setup" && !window.session.channel) return;
    if (!$menuItem.data("hassubmenu")) return;

    if (navigation.lastSubPageOpen === navigation.currentPage) {
        navigation.lastSubPageOpen = null;
        //return;
    }

    let $headerElements = $page.find("h3:visible");
    let $subMenuContainer = $("<div>").addClass("subMenuContainer").hide();
    $headerElements.each((i, $headerElement) => {
        if ($($headerElement).data("nosubitem")) return;
        let $subMenuEntry = $("<div>").addClass("subMenuEntry");
        let text = $($headerElement).text();
        if (text) {
            navigation.lastSubPageOpen = navigation.currentPage;
        }
        if (typeof text === 'string' && text.includes('Pro')) {
            $subMenuEntry.addClass('proColor').css('font-weight', 'bold');
        }
        $subMenuEntry.text(text);
        $subMenuContainer.append($subMenuEntry);
        $subMenuEntry.click(() => {
            const $target = $($headerElement);
            const offset = $target.offset();
            if (!offset) return;
            $(".shakeEffect").removeClass("shakeEffect");
            $('html, body').animate({
                scrollTop: offset.top - 40
            }, 300, () => {
                if ($target.parent().hasClass("greyBackgroundSection")) {
                    $target.parent().addClass("shakeEffect");
                } else {
                    $target.addClass("shakeEffect");
                    $target.nextUntil("h3").addClass("shakeEffect");
                }
            });
        })
    })

    $menuItem.after($subMenuContainer);
    $subMenuContainer.css("margin-left", "-5px");
    $subMenuContainer.css("opacity", "0");

    if ($headerElements.length > 0) {
        $subMenuContainer.slideDown(200);
        $subMenuContainer.animate({ "opacity": "1", "margin-left": "0px" }, 200);
        navigation.lastSubPageAreaName = navigation.currentPage;
    }
}

navigation.scrollToPageElement = function (page, selector) {
    navigation.pageChange(page);
    $('.shakeEffect').removeClass('shakeEffect');
    setTimeout(() => {
        const $target = $(selector);
        const offset = $target.offset();
        if (!offset) return;
        $('html, body').animate({
            scrollTop: offset.top - 40
        }, 500, () => {
            setTimeout(() => {
                $target.addClass("shakeEffect");
            }, 200)
        });
    }, 100)
}

window.addEventListener("popstate", (event) => {
    var currentPageFromEvent = event.state ? event.state.page : null;
    if (!currentPageFromEvent) return;
    if (currentPageFromEvent !== navigation.currentPage) {
        navigation.pageChange(currentPageFromEvent, true);
    }
});
