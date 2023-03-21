let i = 0;
const blockedSites = [];
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  console.log('this works');
  blockedSites.push(request.openUrlInEditor);
  console.log(blockedSites[i].toString());
  i++;
  if (request.openUrlInEditor) alert('message received ' + request.openUrlInEditor);
  sendResponse({ success: true, AckFromBG: 'I have received your messgae. Thanks!' }); // sending back the acknowlege to the webpage
  console.log('List now contains');
  /**for (let j = 0; j < blockedSites.length; j++) {
        console.log("List item" + (j + 1) + " " + blockedSites[j])
    }**/
  localStorage.setItem('LIST', JSON.stringify(blockedSites));
  chrome.storage.local.set({ foo: blockedSites }, function () {
    console.log('Settings saved');
  });
});
