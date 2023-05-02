let blockedSites = [];
let permaBlocked = [];
let timeRemaining = [];
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if (request.openUrlInEditor) {
    blockedSites.push(request.openUrlInEditor);
    timeRemaining.push(request.displayTimeRemaining);
    //alert('message received ' + request.openUrlInEditor + ' ' + request.displayTimeRemaining);
    sendResponse({ success: true, AckFromBG: 'I have received your messgae. Thanks!' }); // sending back the acknowlege to the webpage
    console.log('List now contains');
    localStorage.setItem('LIST', JSON.stringify(blockedSites));
    localStorage.setItem('LIST1', JSON.stringify(timeRemaining));
    chrome.storage.local.set({ foo: blockedSites }, function () {});
    chrome.storage.local.set({ foo1: timeRemaining }, function () {});
  } else if (request.addPermanent) {
    permaBlocked.push(request.addPermanent);
    localStorage.setItem('LIST2', JSON.stringify(permaBlocked));
    chrome.storage.local.set({ foo2: permaBlocked }, function () {});
  } else if (request.delete) {
    blockedSites = blockedSites.filter(link => link != request.delete);
    timeRemaining = timeRemaining.splice(request.remove, 1);
    localStorage.setItem('LIST', JSON.stringify(blockedSites));
    localStorage.setItem('LIST1', JSON.stringify(timeRemaining));
    chrome.storage.local.set({ foo: blockedSites }, function () {});
    chrome.storage.local.set({ foo1: timeRemaining }, function () {});
    return true;
  } else if (request.Permdelete) {
    permaBlocked = permaBlocked.filter(link => link != request.Permdelete);
    localStorage.setItem('LIST2', JSON.stringify(permaBlocked));
    chrome.storage.local.set({ foo2: permaBlocked }, function () {});
    return true;
  } else if (request.empty) {
    permaBlocked = [];
    timeRemaining = [];
    blockedSites = [];

    localStorage.setItem('LIST', JSON.stringify(blockedSites));
    chrome.storage.local.set({ foo: blockedSites }, function () {});
    localStorage.setItem('LIST1', JSON.stringify(timeRemaining));
    chrome.storage.local.set({ foo1: timeRemaining }, function () {});
    localStorage.setItem('LIST2', JSON.stringify(permaBlocked));
    chrome.storage.local.set({ foo2: permaBlocked }, function () {});
  }
});
