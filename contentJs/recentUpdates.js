// recentUpdates.js
// For making class names more readable by deleting IDs

for (div of document.getElementsByClassName('item-class'))
{
	div.innerHTML = '<span>' + div.innerHTML.split('<span>')[1].split('<small ')[0] + '<br>' + '<small ' + div.innerHTML.split('<small ')[1];
}