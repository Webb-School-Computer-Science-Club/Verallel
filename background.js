// background.js
// Detects tab change and executes improve function if the url matches tab urls that improve is made to improve


function improve(type)
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	let curtaburl = tab.url;
	if (tab.url.match(/classes.veracross.com/))
	{
		chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [0]}); // Executes improve function
	}
	else if (tab.url.match(/portals.veracross.com/) && tab.url.match(/student/))
	{
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
