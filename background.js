chrome.runtime.onInstalled.addListener(function (object) {
    let internalUrl = chrome.runtime.getURL("popup.html");

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: internalUrl }, function (tab) {
            console.log("Launched setup wizard");
        });
    }
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {

    var domainStorageKey = "com.adincebic.atlassianMigrationAssistant.domain";
    chrome.storage.local.get([domainStorageKey]).then((result) => {
        var domain = result[domainStorageKey];
        
        var components = domain.split('.');
        components.pop();
        var hostWithoutDomain = components.join('.');

        var url = new URL(details.url);
        var confluenceDomain = `confluence.${domain}`;

        if (url.hostname === confluenceDomain) {
            var newUrl = url.href.replace(confluenceDomain, `${hostWithoutDomain}.atlassian.net/wiki`);
            chrome.tabs.update(details.tabId, {url: newUrl});
        }

        var jiraDomain = `jira.${domain}`;
        if (url.hostname === jiraDomain) {
            var pathname = url.pathname;
            var ticketIdPattern = /[a-z]+-\d+/i;

            if (ticketIdPattern.test(pathname)) {
                pathname = pathname.replace(/^\/+/, '');
                pathname = "/browse/" + pathname;
            }

            var newUrl = `https://${hostWithoutDomain}.atlassian.net` + pathname + url.search;
            chrome.tabs.update(details.tabId, {url: newUrl});
        }

    });
});
