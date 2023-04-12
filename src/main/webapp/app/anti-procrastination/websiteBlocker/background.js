let i = 0;
let blockedSites = [];
let extensionID1 = chrome.runtime.id;
let testing = 100;
console.log(extensionID1);
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if (request.openUrlInEditor) {
    console.log('this works');
    blockedSites.push(request.openUrlInEditor);
    console.log(blockedSites[i].toString());
    i++;
    alert('message received ' + request.openUrlInEditor);
    sendResponse({ success: true, AckFromBG: 'I have received your messgae. Thanks!' }); // sending back the acknowlege to the webpage
    console.log('List now contains');
    localStorage.setItem('LIST', JSON.stringify(blockedSites));
    chrome.storage.local.set({ foo: blockedSites }, function () {
      console.log('Settings saved');
    });
  } else if (request.delete) {
    alert('message recieved for delete' + request.delete);
    blockedSites = blockedSites.filter(link => link != request.delete);
    localStorage.setItem('LIST', JSON.stringify(blockedSites));
    chrome.storage.local.set({ foo: blockedSites }, function () {
      console.log('Settings saved');
    });
    return true;
  }
});
