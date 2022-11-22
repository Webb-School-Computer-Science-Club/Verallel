// documentsMain.js: adds a link back to main portals page from the top of every document without interfering with print to pdf function

dm = false;
chrome.storage.sync.get(['key'], function(result) // For acquiring dark mode if it is already stored earlier, for yellow boxes
{
   console.log(result.key)
   if(result.key)
   {
      dm = result.key;
   }
   if(dm) // Changes all yellow boxes to dark mode
   {
   		for (block of document.getElementsByClassName('block'))
   		{
   			var styl = block.getAttribute('style')
   			if(styl.split('background-color: '))
   			{
   				if(styl.split('background-color: ')[1] == '#EFF604;')
   				{
   					block.setAttribute('style', styl.split('background-color: ')[0] + 'background-color: ' + '#F4871A;');
   				}
   			}
   		}
   }
});
var page = document.getElementById('page');
var portalsLink = document.createElement('a');
portalsLink.setAttribute('href', 'https://portals.veracross.com/webb/student');
portalsLink.appendChild(document.createTextNode('Back to Main portal page'));
portalsLink.classList.add('doc-link');
page.insertBefore(portalsLink, page.firstElementChild);
