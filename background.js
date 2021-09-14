// background.js
// Detects tab change and executes improve function if the url matches

var shown = false; // Variables
var shownb = false;


function improve(type){
   switch(type){ // Uses switch because more types will be added in the future for different class tabs
	case 0:

            var h = ((document.getElementById('container').getElementsByClassName('class-header')[0]).getElementsByTagName('h1')[0]).getElementsByTagName('a')[0];
	    h.innerHTML = (h.innerHTML).split(':')[1]; // Removing mess of numbers (probably class ID) from class page to make it look nicer
            var needrop = document.getElementById('facebox').getElementsByClassName('popup')[0]; // Element exists even when not actually visible
            var link = document.createElement('a');
            link.appendChild(document.createTextNode('Click Here to go to the Dropbox'));
            link.href = "https://portals.veracross.com/webb/student/submit-assignments"; // Changing attributes
            link.target = "_blank";
            link.title = "Dropbox Link";
            var li = document.createElement("div");
            li.id="better-link-class-home";
            li.appendChild(document.createTextNode('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0')); //Spaces (looks nicer)
            li.appendChild(link);
            li.appendChild(document.createElement('br')); // Line breaks (to make it look nicer)
            li.appendChild(document.createElement('br'));
            li.classList.add("body"); // If not added than background would be behind the main page text
            needrop.appendChild(li); // Adding to popup

	default: // no popup (or no popup tab made)
	    var valid = false; // Put this in because a default case will most likely be needed in the future
    }

}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let curtaburl = tab.url;
    if (tab.url.match(/classes.veracross.com/)) {
	if (!(shown)) { // Don't want to have 4 links in the popup; only one
	    chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [0]}); // Executes improve function
            shown = true;
	    shownb = false;
        }
    }
    else if (tab.url.match(/portals.veracross.com/) && tab.url.match(/student/)) {
	if (!(shownb)) { 
	    chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [1]}); // No compatibility for this in improve yet, but working on it!
            shownb = true;
            shown = false;
	}
    }
    else {
	shown = false; // Nothing is being shown
	shownb = false;
    }

});
