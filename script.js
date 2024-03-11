document.addEventListener('DOMContentLoaded', function() {
  let domainInput = document.getElementById('domainInput');
  let confluenceCheckbox = document.getElementById('confluence-checkbox');
  let saveButton = document.getElementById('saveButton');
  let errorMessage = document.getElementById('errorMessage');
  
  
  saveButton.addEventListener('click', function() {
    handleSavingDomain();
  });
  
  domainInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      handleSavingDomain();
    }
  });

  function handleSavingDomain() {
    var domain = domainInput.value;
    if (!isValidDomain(domain)) {
      errorMessage.textContent = 'Please enter a valid domain name (e.g., example.com)';
      errorMessage.style.display = 'block';
      return;
    }
    saveDomain(domain);
  }
  
  function saveDomain(domain) {
    let confleuenceEnabledStorageKey = "com.adincebic.atlassianMigrationAssistant.confluenceEnabled"
    chrome.storage.local.set({ confleuenceEnabledStorageKey: confluenceCheckbox.checked }, function(){
      console.log("Confluence enabled: ", confluenceCheckbox.checked);
    });

    chrome.storage.local.set({ "com.adincebic.atlassianMigrationAssistant.domain": domain }, function(){

      console.log(`Saved domain: ${domain}`);
      var components = domain.split('.');
      components.pop();
      var hostnameOnly = components.join('.');
      var url = `https://${hostnameOnly}.atlassian.net`;

      chrome.tabs.create({ url: url }, function (tab) {
        console.log(url);
        
        chrome.tabs.query({ url: chrome.runtime.getURL("popup.html") }, function(tabs) {
          if (tabs.length > 0) {
            var tabToClose = tabs[0];
            chrome.tabs.remove(tabToClose.id, function() {
              console.log("Tab with popup.html closed successfully");
            });
          } else {
            console.log("No tabs with popup.html found");
          }
        });
      });
    });
    
    
    
  }

  function isValidDomain(domain) {
    var domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (domainPattern.test(domain)) {
      return true;
    }
    return false;
  }

});
