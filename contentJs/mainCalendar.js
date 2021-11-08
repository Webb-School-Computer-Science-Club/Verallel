// mainCalendar.js: For scrolling down to today on the main calendar for easier navigation

var today = document.getElementsByClassName('fc-today')[0];
var calendar = document.getElementsByClassName('app-container')[0];
calendar.scrollTop = today.parentNode.parentNode.parentNode.parentNode.parentNode.offsetTop; // Scrolls it down
