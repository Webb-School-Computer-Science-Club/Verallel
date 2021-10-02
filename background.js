// background.js
// Detects tab change and executes certain functions (all defined here) depending on tab url
// improve, linkImprove, and dropboxOnTop, functions that are called to add links and tabs, are defined here and url define execution
// Also commmunicates with popup script for dark/light mode toggling

var dm = false;
chrome.storage.sync.get(['key'], function(result) // For acquiring dark mode if it is already stored earlier
{
   if(result.key)
   {
      dm = result.key;
   }
});
chrome.storage.sync.set({key: dm}, function() {console.log('Dark or Light mode established');}); // Establishes light dark mode for extension duration


function improve(type) // The function that adds dropbox links, removes class ids from class names, etc.
{
	switch(type) // Uses switch because more types will be added in the future for different class tabs
	{ 
			
		case 0:
			var lin = document.getElementById('better-link-class-home');
			if (lin == null) //Link shouldn't appear twice
			{ 
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
			if(lin == null)
			{
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


		case 2: // Takes class ID out of every class for Dropbox. Eventually it will also go directly to the bottom. 
			var si = document.getElementsByClassName('full-screen-bg')[0].getElementsByClassName('app-container')[0];
			var g = si.getElementsByTagName('div')[0].getElementsByClassName('assignment-submission')[0].getElementsByClassName('ae-grid')[0].getElementsByClassName('item-xs-12')[1].getElementsByClassName('vx-record-detail');
			var conf = document.getElementById('confirm-div');
			if (conf==null)
			{
				for (k = 0; k < g.length; k ++)
				{
					var h = g[k].getElementsByClassName('vx-record-header')[0].getElementsByClassName('vx-record-header__title')[0];
					if (h.innerHTML.split(':').length > 2)
					{
						var finalclassName = h.innerHTML.split(':')[1]
						for (l = 0; l < h.innerHTML.split(':').length - 2; l++)
						{
							finalclassName = finalclassName + ': ' + h.innerHTML.split(':')[2+l];
						}
						h.innerHTML = finalclassName;
					}
					else
					{
						h.innerHTML = h.innerHTML.split(':')[1];
					}
				}
				var confdiv = document.createElement('div');
				confdiv.id = 'confirm-div';
				si.appendChild(confdiv)
			}
	}
}


function linkImprove() // Nothing will take you to a new tab in Veracross now. Much easier to Cmd-click than to right click then click open in current tab.
{
	var links = document.getElementsByTagName('a');
   	for (link of links)
   	{
      		link.setAttribute('target', '_self');
   	}
}


function dropboxOnTop() // Creates a link to the dropbox on the top for every portals.veracross.com page
{
	var verallelDb = document.getElementById('verallel-db-link');
   	if(verallelDb == null)
   	{
      		var ul = document.getElementsByClassName('full-screen-bg')[0].getElementsByClassName('vx-portal-nav')[0];
      		var dbLink = document.createElement('a');
      		dbLink.href = 'https://portals.veracross.com/webb/student/submit-assignments';
      		dbLink.appendChild(document.createTextNode('Dropbox'));
      		dbLink.classList.add('vx-portal-nav__item-link');
      		var li = document.createElement('li');
      		li.classList.add('vx-portal-nav__item');
      		li.id = 'verallel-db-link';
      		li.appendChild(dbLink);
      		ul.appendChild(li);
   	}
}


function darkLightMode(dm, url) // For changing mode of Veracross page. 
{
    var verStyl = document.getElementById('verallel-styl');
    if(verStyl == null)
    {
        if(dm)
        {
            var newStyl = document.createElement('link');
            newStyl.setAttribute('rel', 'stylesheet');
            newStyl.setAttribute('href', url);
            newStyl.id = 'verallel-styl';
            document.getElementsByTagName('head')[0].appendChild(newStyl);
        }
    }
    else
    {
        if(!(dm))
        {
           verStyl.parentNode.removeChild(verStyl); 
        }
    }
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) // Updated tab event listener
{
	let curtaburl = tab.url;
	let f = chrome.runtime.getURL("css/veracross-dark.css");
	if (tab.url.match(/classes.veracross.com/))
	{
		chrome.scripting.executeScript({target: {tabId: tabId, allFrames: true}, func: darkLightMode, args: [dm, f]});
		chrome.scripting.executeScript({target: {tabId: tabId}, func: linkImprove});
		chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [0]}); // Executes improve function
	}
	else if (tab.url.match(/portals.veracross.com/) && tab.url.match(/student/))
	{
		chrome.scripting.executeScript({target: {tabId: tabId, allFrames: true}, func: darkLightMode, args: [dm, f]});
		chrome.scripting.executeScript({target: {tabId: tabId}, func: dropboxOnTop});
		chrome.scripting.executeScript({target: {tabId: tabId}, func: linkImprove});
		if (tab.url.match(/assignment/) && tab.url.match(/detail/)) // Specific part of the domain improve is improving
		{ 
			chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [1]}); // For assignment detail
		}
		else if (tab.url.match(/submit-assignments/)) // Dropbox improvement (more features are to be added here!)
		{ 
			chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [2]});
		}
	} 
	// Other parts if portals.veracross.com improvement in the works!
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) // For communicating with popup.js
{
   if(request)
   {
      if(request.msg == 'Popup Initialization') // When popup first gets opened
      {
         sendResponse({sender: "background.js", data: dm});
      }
      else if(request.msg == 'Change to light') // Light mode change
      {
         var f = chrome.runtime.getURL("css/veracross-dark.css");
         dm = false;
         chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            chrome.scripting.executeScript({target: {tabId: tabs[0].id, allFrames: true}, func: darkLightMode, args: [dm, f]});
         });
      }
      else if(request.msg == 'Change to dark') // Dark mode change
      {
         var f = chrome.runtime.getURL("css/veracross-dark.css");
         dm = true;
         chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            chrome.scripting.executeScript({target: {tabId: tabs[0].id, allFrames: true}, func: darkLightMode, args: [dm, f]});
         });
      }
      else if(request.msg == 'oChangeL') // For if popup is in Verallel options tab
      {
         dm = false;
      }
      else if(request.msg == 'oChangeD')
      {
         dm = true;
      }
      chrome.storage.sync.set({key: dm}, function() { console.log('Dark or Light mode toggled'); }); // Updates dark mode value in storage
   }
});
