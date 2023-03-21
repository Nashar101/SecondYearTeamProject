let blockedsites = [];
const generateHTML = pageName => {
  return (
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '  <head> </head>\n' +
    '  <body>\n' +
    '    <div class="main">\n' +
    '      <h1>Stop Procastinating</h1>\n' +
    '      <hr />\n' +
    '      <span>\n' +
    '        Current Blocked Sites:\n' +
    '        <span style="color: #ff0100;">Youtube</span>\n' +
    '        |\n' +
    '        <span style="color: #0e8ef2;">Facebook</span>\n' +
    '        |\n' +
    '        <span style="color: #e50914;">Netflix</span>\n' +
    '      </span>\n' +
    '    </div>\n' +
    '  </body>\n' +
    '</html>'
  );
};

function updateList() {
  chrome.storage.local.get(['foo'], result => {
    if (!result.foo) {
      alert('this is empty');
    }
    blockedsites = result.foo;
    /**for (let j = 0; j < blockedsites.length; j++) {
      alert("List item" + (j + 1) + " " + blockedsites[j])
    }**/
    main();
  });
}
updateList();
function main() {
  for (let i = 0; i < blockedsites.length; i++) {
    if (window.location.hostname == blockedsites[i].toString() || window.location.href == blockedsites[i].toString()) {
      document.body.innerHTML = generateHTML('site is blocked');
      break;
    }
  }
}
