let blockedsites = [];
let timeRemaining = [];

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
    '<script type="text/javascript" src="Content.js">' +
    '</script>\n' +
    '<div id="site" style="text-align: center; animation: myAnim 2s ease 0s 1 normal forwards;">\n' +
    '</div>\n' +
    '</div>\n' +
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
    console.log(blockedsites[0]);
    chrome.storage.local.get(['foo1'], result => {
      timeRemaining = result.foo1;
      startCountDown();
    });
  });
}

class List {
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
}
function startCountDown() {
  for (let i = 0; i < timeRemaining.length; i++) {
    //refreshTimer(i)

    setInterval(() => {
      let refresh = new List();
      let currentDate = new Date().getTime();

      const savedDate = new Date(timeRemaining[i]).getTime();
      let time = (savedDate - currentDate) / 1000;

      if (time <= 0 || isNaN(time)) {
        timeRemaining.splice(i, 1);
        blockedsites.splice(i, 1);
        localStorage.setItem('LIST', JSON.stringify(blockedsites));
        chrome.storage.local.set({ foo: blockedsites }, function () {
          console.log('Settings saved');
        });
        localStorage.setItem('LIST1', JSON.stringify(timeRemaining));
        chrome.storage.local.set({ foo1: timeRemaining }, function () {
          console.log('Settings saved');
        });
        return;
      } else {
        refresh.days = Math.floor(time / 86400);
        refresh.hours = Math.floor((time - refresh.days * 24 * 60 * 60) / 3600);
        refresh.minutes = Math.floor((time - refresh.days * 24 * 60 * 60 - refresh.hours * 60 * 60) / 60);
        refresh.seconds = Math.floor((time - refresh.days * 24 * 60 * 60 - refresh.hours * 60 * 60 - refresh.minutes * 60) / 1);
      }
    }, 1000);
  }
  main();
}

let blockedSite = '';

function main() {
  for (let i = 0; i < blockedsites.length; i++) {
    if (window.location.hostname == blockedsites[i].toString() || window.location.href == blockedsites[i].toString()) {
      document.body.innerHTML = generateHTML('site is blocked');
      const displaySite = document.getElementById('site');
      displaySite.textContent = blockedsites[i].toString();
      blockedSite = blockedsites[i].toString();
      break;
    }
  }
}
