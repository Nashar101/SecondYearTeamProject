console.log('<----- Extension script started running ----->');
timeRemaining = [];
displaylink = [];
function refreshTimer(x) {
  let refresh = new List();
  let currentDate = new Date().getTime();

  const savedDate = new Date(timeRemaining[x]).getTime();
  let time = (savedDate - currentDate) / 1000;
  console.log(timeRemaining);
  if (time <= 0) {
    //this.delete(this.todos[link].id);
  } else {
    refresh.days = Math.floor(time / 86400);
    refresh.hours = Math.floor((time - refresh.days * 24 * 60 * 60) / 3600);
    refresh.minutes = Math.floor((time - refresh.days * 24 * 60 * 60 - refresh.hours * 60 * 60) / 60);
    refresh.seconds = Math.floor((time - refresh.days * 24 * 60 * 60 - refresh.hours * 60 * 60 - refresh.minutes * 60) / 1);
    console.log(refresh.hours);
    displaytime.push(refresh);
  }
}

class List {
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
}
function displayitems() {
  const myListContainer = document.getElementById('timerList');
  const myList = document.createElement('ul');
  myList.id = 'timerList';

  for (let i = 0; i < timeRemaining.length; i++) {
    const listItem = document.createElement('li');
    //refreshTimer(i)

    setInterval(() => {
      let refresh = new List();
      let currentDate = new Date().getTime();

      const savedDate = new Date(timeRemaining[i]).getTime();
      let time = (savedDate - currentDate) / 1000;

      if (time <= 0 || displaylink[i] == 'undefined' || isNaN(time)) {
        timeRemaining.splice(i, 1);
        console.log('remove from popup');
        var remove = myListContainer.getElementsByTagName('li')[i];
        myListContainer.removeChild(remove);
        localStorage.setItem('LIST', JSON.stringify(displaylink));
        chrome.storage.local.set({ foo: displaylink }, function () {
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
        listItem.textContent = `${displaylink[i]}  ${refresh.days} : ${refresh.hours} : ${refresh.minutes} : ${refresh.seconds}`;
      }
    }, 1000);

    //`${days}d ${hours}h ${minutes}m ${seconds}s
    myList.appendChild(listItem);
    //startTimer2(i)
  }
  myListContainer.appendChild(myList);
}

chrome.storage.local.get(['foo1'], result => {
  timeRemaining = result.foo1;
  chrome.storage.local.get(['foo'], result => {
    displaylink = result.foo;
  });
  displayitems();
});

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
