//options.js
//For light dark mode on options page


var lightmode = true;
var r = document.querySelector(':root');

document.getElementById('changeColor').addEventListener('click', changeMode);

function changeMode()
{
	if (lightmode)
	{
		changeColor.innerHTML = "Press button for light mode";
		lightmode = false;
		r.style.setProperty('--background-color', '#000000');
		r.style.setProperty('--border-color', '#ffffff');
	}
	else
	{
		changeColor.innerHTML = "Press button for dark mode";
		lightmode = true;
		r.style.setProperty('--background-color', '#ffffff');
		r.style.setProperty('--border-color', '#000000');
	}
	
	chrome.tabs.query({currentWindow: true, active: true}, function (tabs)
	{
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"message": "change"});
	});
}

