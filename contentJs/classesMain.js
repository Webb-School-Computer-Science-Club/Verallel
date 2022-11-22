//classesMain.js
//For adding a link back to main portals page from class page

var sideArea = document.getElementsByClassName('teacher-pages')[0];
var portalsLink = document.createElement('a');
portalsLink.setAttribute('href', 'https://portals.veracross.com/webb/student');
portalsLink.appendChild(document.createTextNode('Back to Main portal page'));
sideArea.insertBefore(portalsLink, sideArea.firstElementChild);
