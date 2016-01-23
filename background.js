function toggleSidebar() {
  chrome.storage.sync.get('sidebarVisible', function(res) {
    var visible;
    console.log(JSON.stringify(res));
    if(res['sidebarVisible'] && res['sidebarVisible']['visible']) {
      visible = false;
      chrome.browserAction.setIcon({path: 'icon48off.png'});
    } else {
      visible = true;
      chrome.browserAction.setIcon({path: 'icon48.png'});
    }

    var sidebarVisible = {};
    sidebarVisible['sidebarVisible'] = {'visible': visible};
    chrome.storage.sync.set(sidebarVisible, null);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {operation: "toggle_sidebar", "visible": visible}, null);
    });
  });
}

chrome.browserAction.onClicked.addListener(toggleSidebar);
