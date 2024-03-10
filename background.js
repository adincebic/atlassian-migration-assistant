chrome.runtime.onInstalled.addListener(function (object) {
    let internalUrl = chrome.runtime.getURL("popup.html");

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: internalUrl }, function (tab) {
            console.log("Launched setup wizard");
        });
    }
});

chrome.webNavigation.onCommitted.addListener(function(details) {

    let domainStorageKey = "com.adincebic.atlassianMigrationAssistant.domain";
    chrome.storage.local.get([domainStorageKey]).then((result) => {
        let domain = result[domainStorageKey];
        
        var components = domain.split('.');
        components.pop();
        let hostWithoutDomain = components.join('.');

        var url = new URL(details.url);
        let confluenceDomain = `confluence.${domain}`;

        if (url.hostname === confluenceDomain && !url.pathname.includes("auth")) {

            let newUrl = url.href.replace(confluenceDomain, `${hostWithoutDomain}.atlassian.net/wiki`);
            chrome.tabs.update(details.tabId, {url: newUrl});
        }

        let jiraDomain = `jira.${domain}`;
        if (url.hostname === jiraDomain && !url.pathname.includes("auth")) {
            
            let newUrl = url.href.replace(jiraDomain, `${hostWithoutDomain}.atlassian.net`);
            chrome.tabs.update(details.tabId, {url: newUrl});
        }

    });
});
