// background.js
// Detects tab change and executes improve.js if the url matches

var shown = false;
var shownb = false;


function improve(type){
   switch(type){
	case 0:

            var needrop = document.getElementById('facebox').getElementsByClassName('popup')[0]; 
            var link = document.createElement('a');
            link.appendChild(document.createTextNode('Click Here to go to the Dropbox'));
            link.href = "https://portals.veracross.com/webb/student/submit-assignments";
            link.target = "_blank";
            link.title = "Dropbox Link";
            var li = document.createElement("div");
            li.id="better-link-class-home";
            li.appendChild(document.createTextNode('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0')); //Spaces (looks nicer)
            li.appendChild(link);
            li.appendChild(document.createElement('br')); // Line breaks (to make it look nicer)
            li.appendChild(document.createElement('br'));
            li.classList.add("body"); // If not added than background would be behind the main page text
            needrop.appendChild(li);

	default: // no popup (or no popup tab made)
	    var valid = false;
    }

}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let curtaburl = tab.url;
    console.log(curtaburl);
    if (tab.url.match(/classes.veracross.com/)) {
	if (!(shown)) {
	    chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [0]});
            shown = true;
	    shownb = false;
        }
    }
    else if (tab.url.match(/portals.veracross.com/) && tab.url.match(/student/)) {
	if (!(shownb)) {
	    console.log("Here now");
	    chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [1]});
            shownb = true;
            shown = false;
	}
    }
    else {
	shown = false;
	shownb = false;
    }

});