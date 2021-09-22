// background.js
// Detects tab change and executes improve function if the url matches tab urls that improve is made to improve


function improve(type){
   switch(type){ // Uses switch because more types will be added in the future for different class tabs
	case 0:

            var lin = document.getElementById('better-link-class-home');
            if (lin == null){ //Link shouldn't appear twice
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
	    }
	
	case 1: // assignments detail page
		   
            var lin = document.getElementById('link-to-dropbox');
            if(lin == null){
                var h = document.getElementsByClassName('full-screen-bg')[0].getElementsByClassName('app-container')[0].getElementsByClassName('detail-assignment')[0].getElementsByClassName('vx-record-header')[0].getElementsByClassName('ae-grid')[0].getElementsByClassName('ae-grid__item')[0].getElementsByClassName('vx-record-header__title')[0];
                h.innerHTML = h.innerHTML.split(':')[1];
                h.style="font-size: 150%;"
                var nedrop = document.getElementsByClassName('full-screen-bg')[0].getElementsByClassName('app-container')[0].getElementsByClassName('detail-assignment')[0].getElementsByClassName('vx-record-body')[0];
                var link = document.createElement('a');
                link.appendChild(document.createTextNode('Click Here to go to the Dropbox'));
                link.href = "https://portals.veracross.com/webb/student/submit-assignments";
                link.target = "_blank";
                link.style = "font-size: 125%;"
                link.title = "Dropbox Link";
                var li = document.createElement("div");
                li.id="link-to-dropbox";
                li.appendChild(document.createElement('br'));
                li.appendChild(document.createTextNode('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0')); //Spaces (looks nicer)
                li.appendChild(link);
                li.appendChild(document.createElement('br')); // Line breaks (to make it look nicer)
                li.appendChild(document.createElement('br'));
                nedrop.appendChild(li);      
            }    
		   
    }

}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let curtaburl = tab.url;
    if (tab.url.match(/classes.veracross.com/)) {
	chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [0]}); // Executes improve function
    }
    else if (tab.url.match(/portals.veracross.com/) && tab.url.match(/student/)) {
	if (tab.url.match(/assignment/) && tab.url.match(/detail/)){ // Specific part of the domain improve is improving
	    chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [1]}); // For assignment detail
	}
	// Other parts if portals.veracross.com improvement in the works!
    }
});
