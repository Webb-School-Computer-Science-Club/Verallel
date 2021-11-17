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
    var assignStorage = [];
    for (let i = 0; i < fh.length; i++)
    {
        var isToday = false;
        var isTmrw = false;
        var isOnStor = false;
        if (fh[i].split(',')[2].split(':')[0] == '"class_id"')
        {
            classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1];
        }
        else if ((fh[i].split(',')[3]).split(':')[1] == '"assignment-upcoming"')
        {
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
            for(assign of assignStorage)
            {
                if(assign[0] == dueDate && assign[1] == assignStr.slice(1, assignStr.length - 1).replace('\\', '') && assign[2] == classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', ''))
                {
                    isOnStor = true;
                }
            }
            if(!(isOnStor))
            {
                assignStorage.push([dueDate, assignStr.slice(1, assignStr.length - 1).replace('\\', ''), classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', ''), 0]);
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
    // Sorting assignStorage by date
    assignStorage = assignStorage.sort(function(x, y)
    {
        if(monthdict[x[0].split(' ')[0]] > monthdict[y[0].split(' ')[0]])
        {
            return 1
        }
        else if(monthdict[x[0].split(' ')[0]] < monthdict[y[0].split(' ')[0]])
        {
            return -1
        }
        else
        {
            if(parseInt(x[0].split(' ')[1]) > parseInt(y[0].split(' ')[1]))
            {
                return 1
            }
            else if(parseInt(x[0].split(' ')[1]) < parseInt(y[0].split(' ')[1]))
            {
                return -1
            }
            else
            {
                return 0
            }
        }
    });
    assignSto = assignStorage;
    newAssignSto = [];
    chrome.storage.sync.get(['assignments'], function(assignList)
    {
        if(assignList.assignments)
        {
            for(uAssign of assignSto)
            {
                var onAlready = false;
                var diffDate = false;
                for(assign of assignList.assignments)
                {
                    if(assign[1] == uAssign[1])
                    {
                        onAlready = true;
                        if(!(assign[0] == uAssign[0]))
                        {
                            var newAssign = [uAssign[0], assign[1], assign[2], assign[3]];
                        }
                        else
                        {
                            var newAssign = assign;
                        }
                    }
                }
                if(onAlready)
                {
                    newAssignSto.push(newAssign);
                }
                else
                {
                    newAssignSto.push(uAssign);
                }
            }
        }
        else
        {
            newAssignSto = assignSto;
        }
        assignSto = newAssignSto;
        for (assignment of newAssignSto)
        {
            var assignDiv = document.createElement('div');
            var assignTab = document.createElement('table');
            var assignTr = document.createElement('tr');
            var assignTd = document.createElement('td');
            var dNcls = document.createElement('p');
            dNcls.appendChild(document.createTextNode(assignment[0] + ' - ' + assignment[2] + ': '));
            assignTd.appendChild(dNcls);
            assignTr.appendChild(assignTd);
            var assignTd = document.createElement('td');
            var progForm = document.createElement('form');
            progForm.setAttribute('style', 'text-align: right !important;');
            var progOption = document.createElement('select');
            if(assignment[3] == 0)
            {
                var progresses = ['Not started', 'In progress', 'Complete'];
                var progClass = 'not-started';
            }
            else if (assignment[3] == 1)
            {
                var progresses = ['In progress', 'Complete', 'Not started'];
                var progClass = 'in-progress';
            }
            else
            {
                var progresses = ['Complete', 'Not started', 'In progress'];
                var progClass = 'complete';
            }
            var progInd = 0;
            for (option of progresses)
            {
                var optioN = document.createElement('option');
                optioN.setAttribute('value', option);
                optioN.appendChild(document.createTextNode(option));
                progOption.appendChild(optioN);
                progInd ++;
            }
            var description = document.createElement('p');
            description.appendChild(document.createTextNode(assignment[1]));
            assignTd.appendChild(description);
            progForm.appendChild(progOption);
            assignTr.appendChild(assignTd);
            var assignTd = document.createElement('td');
            assignTd.appendChild(progForm);
            assignTr.appendChild(assignTd);
            assignTab.appendChild(assignTr);
            assignDiv.appendChild(assignTab);
            progForm.classList.add('forme');
            progForm.classList.add(progClass);
            assignDiv.classList.add('assignment');
            document.getElementById('assign').appendChild(assignDiv);
        }
        document.querySelectorAll('.forme').forEach(function(item)
        {
            var classItem = {0: 'not-started', 1: 'in-progress', 2: 'complete'}
            item.addEventListener('input', function()
            {
                var assignName = item.parentNode.parentNode.getElementsByTagName('p')[1].innerHTML;
                var assignDate = item.parentNode.parentNode.getElementsByTagName('p')[0].innerHTML.split(' -')[0];
                isnotIt = true;
                j = 0;
                for(let i = 0; i < assignSto.length; i++)
                {
                    if(assignSto[i][1].replace('&', '&amp;').replace('"', '&quot;') == assignName)
                    {
                        if(assignSto[i][0] == assignDate)
                        {
                            isnotIt = false;
                        }
                        else
                        {
                            if(isnotIt)
                            {
                                j++;
                            }
                        }
                    }
                    else
                    {   
                        if(isnotIt)
                        {
                            j++;
                        }
                    }
                }
                item.classList.remove(classItem[assignSto[j][3]]);
                assignSto[j][3] = progress[item.getElementsByTagName('select')[0].value];
                item.classList.add(classItem[assignSto[j][3]]);
                newAssignSto = assignSto;
                chrome.storage.sync.set({assignments: assignSto}, function() {console.log('Assignments have been updated');});
            });
        });
        chrome.storage.sync.set({assignments: newAssignSto}, function() {console.log('Assignments have been stored');});
    });
}

getAssignmentsOptions();

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
    }
});
