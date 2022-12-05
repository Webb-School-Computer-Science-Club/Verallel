//options.js
//For light dark mode on options page and the Verallel Assignment Manager (VAM)

var dm = false;
var r = document.querySelector(':root');
const monthdict = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}; //3-letter month to number conversion
const monthdictInv = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}; //3-letter month to number conversion
const progress = {'Not started': 0, 'In progress': 1, 'Complete': 2};
const relDate = {1: 'Due tommorow', 2: 'Due today', 3: 'Late'};
var assignSto = [];

chrome.storage.sync.get(['key'], function(result)
{
   if(result.key)
   {
      dm = result.key;
   }
   changeOptionsMode(dm);
});


function changeOptionsMode(dm)
{
    if(dm)
    {
        r.style.setProperty('--background-color', '#000000');
        r.style.setProperty('--border-color', '#ffffff');
        r.style.setProperty('--assign-bkg-color', '#333');
        r.style.setProperty('--not-started-color', '#123');
        r.style.setProperty('--in-progress-color', '#aa5555');
        r.style.setProperty('--complete-color', '#11aa44');
    }
    else
    {
        r.style.setProperty('--background-color', '#ffffff');
        r.style.setProperty('--border-color', '#000000');
        r.style.setProperty('--assign-bkg-color', '#ccc');
        r.style.setProperty('--not-started-color', '#ddd');
        r.style.setProperty('--in-progress-color', '#ff6666');
        r.style.setProperty('--complete-color', '#22ff66');

    }
}



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if(request)
    {
        if(request.mode == 'light')
        {
            dm = false;
        }
        else if (request.mode == 'dark')
        {
            dm = true;
        }
        changeOptionsMode(dm);
    }
});
