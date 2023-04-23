console.log('<----- Extension script started running ----->');

const setID = ID => {
  document.getElementById('ExtensionID').textContent = ID.ExtensionID;
};
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  console.log('testing 1');
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    tabs => {
      // ...and send a request for the DOM info...
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(
          tabs[i].id,
          { from: 'popup', subject: 'DOMInfo' },
          // ...also specifying a callback to be called
          //    from the receiving end (content script).
          setID
        );
      }
    }
  );
});
let id = chrome.runtime.id;
