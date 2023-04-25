let blockedsites = [];
const generateHTML = pageName => {
  return (
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<title>Blocked</title>\n' +
    '<link rel="stylesheet" type="text/css" href="style.css">\n' +
    '</head>\n' +
    '<body style="align-items: center; justify-content: center; width: 100%;">\n' +
    '<div style="border-bottom: 7px solid black;">\n' +
    '</div>\n' +
    '<div id="runner">\n' +
    '</div>\n' +
    '<div id="road">\n' +
    '</div>\n' +
    '<div style="border-bottom: 7px solid black; height: 200px">\n' +
    '</div>\n' +
    '<div style="width: 100%; height:0px;">\n' +
    '</div>\n' +
    '<div style="animation: myAnim 2s ease 0s 1 normal forwards; text-align: center; position: center">Sorry this website has been blocked</div>\n' +
    '<div>\n' +
    '<script type="text/javascript" src="Content.js"> blockedSite.toString()\n' +
    '</script>\n' +
    '</div>\n' +
    '<div style="text-align: center; animation: myAnim 2s ease 0s 1 normal forwards;">Remaining Time </div>\n' +
    '<div class="cloud">\n' +
    '</div>\n' +
    '</body>\n' +
    '</html>'
  );
};

boot();

function boot() {
  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
  });

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
      // Collect the necessary data.
      // (For your specific requirements `document.querySelectorAll(...)`
      //  should be equivalent to jquery's `$(...)`.)
      var domInfo = {
        ExtensionID: chrome.runtime.id,
      };

      // Directly respond to the sender (popup),
      // through the specified callback.
      response(domInfo);
    }
  });

  updateList();
}

function updateList() {
  chrome.storage.local.get(['foo'], result => {
    /**if (!result.foo) {
      alert('this is empty');
    }**/
    blockedsites = result.foo;
    /**for (let j = 0; j < blockedsites.length; j++) {
      alert("List item" + (j + 1) + " " + blockedsites[j])
    }**/
    main();
  });
}

let blockedSite = '';
function main() {
  for (let i = 0; i < blockedsites.length; i++) {
    if (window.location.hostname == blockedsites[i].toString() || window.location.href == blockedsites[i].toString()) {
      document.body.innerHTML = generateHTML('site is blocked');
      blockedSite = blockedsites[i].toString();
      break;
    }
  }
}
