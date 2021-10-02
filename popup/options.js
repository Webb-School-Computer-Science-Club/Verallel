//options.js
//For light dark mode on options page and giving assignments but bigger

var dm = false;
var r = document.querySelector(':root');
const monthdict = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}; //3-letter month to number conversion
const monthdictInv = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}; //3-letter month to number conversion

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
    }
    else
    {
        r.style.setProperty('--background-color', '#ffffff');
        r.style.setProperty('--border-color', '#000000');
    }
}

async function getAssignmentsOptions()
{
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments');
    const txt = await respNew.text();
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1];
    const yr = txt.split(';')[16].split('"')[0].split('=')[1];
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr;
    const response = await fetch(fetchUrl);
    const fg = await response.text();
    let today = new Date();
    let tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate() + 1);
    const fh = ((fg.split(';')[15]).split('},{'));
    var assignments = [];
    var classRows = {};
    var assignDate = {'today': [], 'tmrw': []};
    var isOn = false;
    for (let i = 0; i < fh.length; i++)
    {
        var isToday = false;
        var isTmrw = false;
        if (fh[i].split(',')[2].split(':')[0] == '"class_id"')
        {
            classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1];
        }
        else if ((fh[i].split(',')[3]).split(':')[1] == '"assignment-upcoming"')
        {
            console.log(fh[i]);
            var dueDate = fh[i].split(',')[5].split(':')[1].replace('\\', '').slice(1, fh[i].split(',')[5].split(':')[1].replace('\\', '').length - 1);
            var dueDatelis = [monthdict[dueDate.slice(0, 3)], parseInt(dueDate.slice(4, dueDate.length))];
            var assignStr = '';
            let commaMuch = fh[i].split(',').length - 11;
            let colonMuch = fh[i].split(',')[7].split(':').length - 2;
            assignStr = fh[i].split(',')[7].split(':')[1]
            if(colonMuch > 0)
            {
                for (j = 1; j <= colonMuch; j++)
                {
                    assignStr = assignStr + ': ';
                    assignStr = assignStr + fh[i].split(',')[7].split(':')[1+j];
                }
            }
            if(commaMuch > 0)
            {
                for (j = 1; j <= commaMuch; j++)
                {
                    assignStr = assignStr + ', ';
                    assignStr = assignStr + fh[i].split(',')[7+j];
                }
            }
            assignStr =  'Due ' +  dueDate + ' - ' + assignStr.slice(1, assignStr.length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ')';
            if(dueDatelis[0] < today.getMonth() + 1){ // Automatically removes less month
                isOn = true;
            }
            else{
                if((dueDatelis[1] < today.getDate()) && (dueDatelis[0] == today.getMonth() + 1)){
                    isOn = true;
                }
                else if(dueDatelis[1] == today.getDate()  && dueDatelis[0] == today.getMonth() + 1){ // If the assignment is due the day of
                    assignStr = 'Due today - ' + assignStr.slice(dueDate.length + 7, assignStr.length);
                    isToday = true;

                }
                else if(dueDatelis[1] == tommorow.getDate() && dueDatelis[0] == tommorow.getMonth() + 1){ // If the assignment is due the day after
                    assignStr = 'Due tommorow - ' + assignStr.slice(dueDate.length + 7, assignStr.length);
                    isTmrw = true;
                }
            }
            for (let j = 0; j < assignments.length; j++){ // For assignments due later than a day after the date the program is runned in
                if(assignments[j] == assignStr){
                    isOn = true;
                }
            }
            if(!(assignDate['today'] == null)){ // If is an assignment due today that may be repeated
                for (let j = 0; j < assignDate['today'].length; j++){
                    if(assignDate['today'][j] == assignStr){
                         isOn = true;
                    }
                }
            }
        if(!(assignDate['tmrw'] == null)){ // If an assignment that is due tommorow is repeated
            console.log(assignDate['tmrw']);
                for (let j = 0; j < assignDate['tmrw'].length; j++){
            if(assignDate['tmrw'][j] == assignStr){
                isOn = true;
            }
        }
        }
            if(!isOn){ //The assignment should only appear once
                if(!isToday){
                    if(isTmrw){
                        if(assignDate['tmrw'] == null){
                            assignDate['tmrw'] = [assignStr];
                        }
                        else{
                            assignDate['tmrw'].push(assignStr);
                        }
                    }
                    else{
                        assignments.push(assignStr);
                    }
                }
                else{
                    if (assignDate['today'] == null){
                        assignDate['today'] = [assignStr];
                    }
                    else{
                        assignDate['today'].push(assignStr);
                    }
                }
            }
        isOn = false;
        }
    }
    var g = document.getElementById('assign'); // Getting the empty div in popup.html
    if(assignDate['today'] == null && assignDate['tmrw'] == null && assignments == null)
    {
        var h = document.createElement('p')
        h.appendChild(document.createTextNode('Congratulations! According to Veracross, you have no upcoming assignments!'));
    }
    else
    {
        if(!(assignDate['today'] == null)){
            for (let k = 0; k < assignDate['today'].length; k++){ // Assignments due today
                var h = document.createElement('p');
                h.appendChild(document.createTextNode(assignDate['today'][k]));
                g.appendChild(h);
            }
        }
        if(!(assignDate['tmrw'] == null)){
            for (let k = 0; k < assignDate['tmrw'].length; k++){ // Assignments due tommoroow
                var h = document.createElement('p');
                h.appendChild(document.createTextNode(assignDate['tmrw'][k]));
                g.appendChild(h);
            }
        }
        if(!(assignments == null)){
            var pmed = document.createElement('p');
            pmed.appendChild(document.createTextNode('Due later (sorted by class):'))
            pmed.style = "font-size: 150%; text-align: center;";
            g.appendChild(pmed);
            for (let k = 0; k < assignments.length; k++)
            {
                var h = document.createElement('p');
                h.appendChild(document.createTextNode(assignments[k]));
                g.appendChild(h);
            }
        }
        var pf = document.createElement('p')
        pf.appendChild(document.createTextNode('If you want more info, visit '));
        var a = document.createElement('a');
        a.href = "https://portals.veracross.com/webb/student/student/upcoming-assignments";
        a.appendChild(document.createTextNode('your upcoming assignments page'));
        pf.appendChild(a);
        pf.style = "text-align: center;"
        pf.appendChild(document.createTextNode('!'));
        g.appendChild(pf);
    }
}

getAssignmentsOptions();


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if(request)
    {
        console.log(request.mode);
        if(request.mode == 'light')
        {
            dm = false;
        }
        else if (request.mode == 'dark')
        {
            dm = true;
        }
        console.log(dm);
        changeOptionsMode(dm);
    }
});
