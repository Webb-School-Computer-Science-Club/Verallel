// background.js
// Detects tab change and executes certain functions (all defined here) depending on tab url
// improve, linkImprove, and dropboxOnTop, functions that are called to add links and tabs, are defined here and url define execution
// Also commmunicates with popup script for dark/light mode toggling

var dm = false;
const typObj = {"RD": 'Reading', "QZ": 'Quiz', "CL": 'Classwork', "HW": 'Homework', "WR": 'Writing', "DA": 'Daily', "OR": 'Oral', "BR": 'Book Report'};


chrome.storage.sync.get(['key'], function(result) // For acquiring dark mode if it is already stored earlier
{
   if(result.key)
   {
      dm = result.key;
   }
   chrome.storage.sync.set({key: dm}, function() {console.log('Dark or Light mode established');}); // Establishes light dark mode for extension duration
});


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


function dropboxOnTop() // Creates a link to the dropbox on the top for every portals.veracross.com page, and adds dropdown link for directories
{
	var verallelDb = document.getElementById('verallel-db-link');
   	if(verallelDb == null)
   	{
      		var ul = document.getElementsByClassName('full-screen-bg')[0].getElementsByClassName('vx-portal-nav')[0];
		var dirLi = ul.getElementsByTagName('li')[4];         
            	var dirDropDown = document.createElement('div');
            	dirDropDown.classList.add('vx-hover-menu');
            	dirDropDown.classList.add('vx-hover-menu--one-column');
            	var dirdirDropDown = document.createElement('div');
            	dirdirDropDown.classList.add('vx-hover-menu__hover-links-container');
            	var ull = document.createElement('ul');
            	ull.classList.add('vx-hover-menu__hover-links');
            	var stuLi = document.createElement('li');
            	var stuA = document.createElement('a');
            	stuA.setAttribute('href', 'https://portals.veracross.com/webb/student/directory/students');
            	var stuSpan = document.createElement('span');
            	stuSpan.classList.add('vx-hover-menu__item-link-text');
            	stuSpan.appendChild(document.createTextNode('Student Directory'));
            	stuA.appendChild(stuSpan);
            	stuLi.appendChild(stuA);
            	var houseLi = document.createElement('li');
            	var houseA = document.createElement('a');
            	houseA.setAttribute('href', 'https://portals.veracross.com/webb/student/directory/households');
            	var houseSpan = document.createElement('span');
            	houseSpan.appendChild(document.createTextNode('Household Directories'));
            	houseA.appendChild(houseSpan);
            	houseLi.appendChild(houseA);
            	var fsLi = document.createElement('li');
            	var fsA = document.createElement('a');
            	fsA.setAttribute('href', 'https://portals.veracross.com/webb/student/directory/faculty-staff');
            	var fsSpan = document.createElement('span');
            	fsSpan.appendChild(document.createTextNode('Faculty and Staff Directories'));
            	fsA.appendChild(fsSpan);
            	fsLi.appendChild(fsA);
            	ull.appendChild(stuLi);
            	ull.appendChild(houseLi);
            	ull.appendChild(fsLi);
            	dirdirDropDown.appendChild(ull);
            	dirdirDropDown.setAttribute('style', 'min-height: 60px !important;');
            	dirDropDown.appendChild(dirdirDropDown);
            	dirDropDown.setAttribute('style', 'margin-left: 58% !important;')
            	dirLi.appendChild(dirDropDown);
      		var dbLink = document.createElement('a');
      		dbLink.href = 'https://portals.veracross.com/webb/student/submit-assignments';
		var dbIcon = document.createElement('img');
            	dbIcon.classList.add('nc-icon-glyph');
            	dbIcon.classList.add('dropbox-logo');
            	dbIcon.setAttribute('src', 'https://cdn.iconscout.com/icon/free/png-256/dropbox-164-734858.png'); //Image licensed via Creative Commons at iconsout.com
            	dbLink.appendChild(dbIcon);
            	dbLink.appendChild(document.createTextNode('\xa0\xa0'));
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


async function id2class(tabId, ur, typDict) // For when class isn't there but class IDs are
{
   const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments'); // Link not unique to student
   const txt = await respNew.text(); // Trying to get json doesn't work unfortunatley
   const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1]; // Getting student id out of raw text of source code
   const yr = txt.split(';')[16].split('"')[0].split('=')[1]; // Gets the year from the raw text of the source code
   const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr; // Configures student-unique url to fetch the iframe (can't fetch in original because of CORS)
   const response = await fetch(fetchUrl); // New fetching
   const fg = await response.text();
   const fh = ((fg.split(';')[15]).split('},{'));
   var id2clas = {}
   for(f of fh)
   {
      if (f.split(',')[2].split(':')[0] == '"class_id"')
      {
         var finalclsStr = f.split(',')[3].split(':')[1].replace('"', '').replace('\\', '');
         if(finalclsStr[finalclsStr.length - 1] == '"')
         {
            finalclsStr = finalclsStr.slice(0, finalclsStr.length - 1);
         }
         id2clas[f.split(',')[2].split(':')[1]] = finalclsStr;

      }
   }
   chrome.scripting.executeScript({target: {tabId: tabId}, func: convert, args: [ur, id2clas, typDict]});
}


function convert(which, id2cls, typDict) // For actually executing class Id -> class within script
{
   switch(which)
   {
      case 1: // for main student portal. Will be worked on once all other subdomains of portals.veracross.com have an improve case.
         var f = false;
      case 2:
	 function Conv() // For persistent readability of calendars
	 {
            var g = document.getElementsByClassName('fc-event-container');
            for(f of g)
            {
               var newS = f.getElementsByClassName('fc-title')[0];
               if(newS.innerHTML[0] == '*')
               {
                   var replace =  id2cls['"' + newS.innerHTML.split('.')[0].slice(2, newS.innerHTML.split('.')[0].length)+ '"']; // ClassId -> Class
	           var noI = typDict[newS.innerHTML.split('.')[1]];
                   if (replace) // Checking if variable exists for class id -> class
                   {
                      newS.innerHTML = replace + ' - ' + newS.innerHTML.split('.')[1];
                   }
	           if(noI) // If it needs the abbreviations replaced
		   {
		      newS.innerHTML = replace.split('-')[0] + ' - ' + noI;
		   }
               }
            }
	 }
	 Conv();
	 for(button of document.getElementsByClassName('fc-button'))
         {
            button.addEventListener('click', epicConv); // So it converts
         }
	 
   }
}


async function getClasses(tabId) //async to retrieve class ids from different page
{
   const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments');
   const txt = await respNew.text();
   const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1];
   const yr = txt.split(';')[16].split('"')[0].split('=')[1];
   const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr;
   const response = await fetch(fetchUrl);
   const fg = await response.text();
   const fh = ((fg.split(';')[15]).split('},{'));
   var classRows = {};
   var classidlist = [];
   for (let i = 0; i < fh.length; i++)
   {
      if (fh[i].split(',')[2].split(':')[0] == '"class_id"')
      {
         classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1];
         classidlist.push(fh[i].split(',')[0].split(':')[1]);
      }
   }
   chrome.scripting.executeScript({target: {tabId: tabId}, func: makeClassDropDown, args: [classRows, classidlist, stuId]});
}


function makeClassDropDown(classRows, classidlist, stuId)
{
   var classDrop = document.getElementById('class-link-container');
   if(!(classDrop))
   {
      var rightCalendar = document.getElementsByClassName('vx-nav-right')[0].getElementsByClassName('vx-nav-button')[1];
      rightCalendar.setAttribute('href', 'https://documents.veracross.com/webb/schedule/' + stuId);
      rightCalendar.innerHTML = rightCalendar.innerHTML.split('</i>')[0] + '</i>' + ' My Class Schedule'
      rightCalendar.getElementsByClassName('nc-icon-glyph')[0].setAttribute('class', 'nc-icon-glyph ui-2_time-clock');
      var classes = document.getElementsByClassName('vx-portal-nav__item')[0];
      var classDropDown = document.createElement('div');
      classDropDown.classList.add('vx-hover-menu');
      classDropDown.classList.add('vx-hover-menu--one-column');
      classDropDown.setAttribute('style', 'margin-left:5% !important; width: 350px !important;');
      var classesCont = document.createElement('div');
      classesCont.classList.add('vx-hover-menu__hover-links-container');
      var leftSide = document.createElement('div');
      leftSide.setAttribute('style', 'float: left;');
      var rightSide = document.createElement('div');
      rightSide.setAttribute('style', 'margin-left: 18%; width: 161px;');
      for (id of classidlist)
      {
         var classLink = document.createElement('a')
         var classUrl = 'https://classes.veracross.com/webb/course/' + id + '/website'; //links to class webpage
         classLink.setAttribute('href', classUrl);
         classLink.setAttribute('style', 'width: 100%;')
         classLink.appendChild(document.createTextNode(classRows[id].replace('\"', '').replace('"', '')));
         if(classRows[id].slice(0, 3) == '\"CC' || classRows[id].slice(0, 3) == '\"US')
         {
            leftSide.appendChild(classLink);
         }
         else
         {
            rightSide.appendChild(classLink);
         }
      }
      classesCont.appendChild(leftSide);
      classesCont.appendChild(rightSide);
      classDropDown.appendChild(classesCont);
      classDropDown.setAttribute('id', 'class-link-container'); // To make sure the element does not get added four times
      classes.appendChild(classDropDown);
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
		getClasses(tabId);
		if (tab.url.match(/assignment/) && tab.url.match(/detail/)) // Specific part of the domain improve is improving
		{ 
			chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [1]}); // For assignment detail
		}
		else if (tab.url.match(/submit-assignments/)) // Dropbox improvement (more features are to be added here!)
		{ 
			chrome.scripting.executeScript({target: {tabId: tabId}, func: improve, args: [2]});
		}
		else if (tab.url.match(/calendar/)) // Calendar page (only improves for month though)
      		{
         		id2class(tabId, 2, typObj); // Different function called because it needs to be async and fetching will fail in executeScript function call
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
