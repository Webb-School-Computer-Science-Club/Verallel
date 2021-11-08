// documentsMain.js: adds a link back to main portals page from the top of every document without interfering with print to pdf function

var page = document.getElementById('page');
var portalsLink = document.createElement('a');
portalsLink.setAttribute('href', 'https://portals.veracross.com/webb/student');
portalsLink.appendChild(document.createTextNode('Back to Main portal page'));
portalsLink.classList.add('doc-link');
page.insertBefore(portalsLink, page.firstElementChild);
