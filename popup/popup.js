// popup.js
// Does notification button for assignments and for lesson plans
// May or may not need to sort by year, but that will probably be an upcoming update for getAssignments()

document.getElementById("notif").addEventListener("click", reqNotify); // Gives assignment button functionality by adding click listener
document.getElementById("lessonP").addEventListener("click", reqLP); // Gives lesson plan button functionality by addig lick listener
var assign = false;
var lessonP = false;
const monthdict = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}; //3-letter month to number conversion
const monthdictInv = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}; //3-letter month to number conversion

async function getAssignments() // async for usage of fetch
{ 
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments'); // Link not unique to student
    const txt = await respNew.text(); // Trying to get json doesn't work unfortunatley
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1]; // Getting student id out of raw text of source code
    const yr = txt.split(';')[16].split('"')[0].split('=')[1]; // Gets the year from the raw text of the source code
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr; // Configures student-unique url to fetch the iframe (can't fetch in original because of CORS)
    const response = await fetch(fetchUrl); // New fetching
    const fg = await response.text();
    let today = new Date(); // Defining today and tomorrow
    let tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate() + 1);
    const fh = ((fg.split(';')[15]).split('},{')); // More text splitting to retrieve features
    var assignments = []; // Defining arrays and objects for use in the function
    var classRows = {};
    var assignDate = {'today': [], 'tmrw': []};
    var isOn = false; // Mostly for making sure no assignment repeats and no assignments before current date are on there
    for (let i = 0; i < fh.length; i++) // Loops through all possible assignments
    { 
        var isToday = false;
        var isTmrw = false;
	if (fh[i].split(',')[2].split(':')[0] == '"class_id"')
	{
	    classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1];
	}
        if ((fh[i].split(',')[3]).split(':')[1] == '"assignment-upcoming"')
	{
            var dueDate = fh[i].split(',')[5].split(':')[1].replace('\\', '').slice(1, fh[i].split(',')[5].split(':')[1].replace('\\', '').length - 1);
            var dueDatelis = [monthdict[dueDate.slice(0, 3)], parseInt(dueDate.slice(4, dueDate.length))];
            var assignStr = '';
            let commaMuch = fh[i].split(',').length - 11;
	    let colonMuch = fh[i].split(',')[7].split(':').length - 2;
            assignStr = fh[i].split(',')[7].split(':')[1];
            if(colonMuch > 0)
            {
                for (j = 1; j <= colonMuch; j++)
                {
                    console.log(assignStr);
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
            if(dueDatelis[0] < today.getMonth() + 1) // Automatically removes less month
	    { 
                isOn = true;
            }
            else
	    {
                if((dueDatelis[1] < today.getDate()) && (dueDatelis[0] == today.getMonth() + 1))
		{
                    isOn = true;
                }
                else if(dueDatelis[1] == today.getDate()  && dueDatelis[0] == today.getMonth() + 1) // If the assignment is due the day of
		{ 
                    assignStr = 'Due today - ' + assignStr.slice(dueDate.length + 7, assignStr.length);
                    isToday = true;

                }
                else if(dueDatelis[1] == tommorow.getDate() && dueDatelis[0] == tommorow.getMonth() + 1) // If the assignment is due the day after
		{ 
                    assignStr = 'Due tommorow - ' + assignStr.slice(dueDate.length + 7, assignStr.length);
                    isTmrw = true;
                }
            }
	    for (let j = 0; j < assignments.length; j++) // For assignments due later than a day after the date the program is runned in
	    { 
                if(assignments[j] == assignStr)
		{
                    isOn = true;
	        }
            }
            if(!(assignDate['today'] == null)) // If is an assignment due today that may be repeated
	    { 
                for (let j = 0; j < assignDate['today'].length; j++)
		{
                    if(assignDate['today'][j] == assignStr)
		    {
                         isOn = true;
                    }
                }
            }
	    if(!(assignDate['tmrw'] == null)) // If an assignment that is due tommorow is repeated
	    { 
                for (let j = 0; j < assignDate['tmrw'].length; j++)
		{
		    if(assignDate['tmrw'][j] == assignStr)
		    {
		        isOn = true;
		    }
		}
	    }
            if(!isOn) // Adding elements to assignDate[today], assignDate[tmrw], or assignments if need be
	    { 
                if(!isToday)
		{
                    if(isTmrw)
		    {
                        if(assignDate['tmrw'] == null)
			{
                            assignDate['tmrw'] = [assignStr];
                        }
                        else
			{
                            assignDate['tmrw'].push(assignStr);
                        }
                    }
                    else
		    {
                        assignments.push(assignStr);
                    }
                }
                else
		{
                    if (assignDate['today'] == null)
		    {
                        assignDate['today'] = [assignStr];
                    }
                    else
		    {
                        assignDate['today'].push(assignStr);
                    }
                }
            }
	    isOn = false; // Resets every iteration
        }
    }
    var g = document.getElementById('assign'); // Getting the empty div in popup.html
    if(!(assignDate['today'] == null)) // Needs to exist if the length attribute can be collected from it
    { 
    	for (let k = 0; k < assignDate['today'].length; k++) // Assignments due today
	{ 
            var h = document.createElement('p');
            h.appendChild(document.createTextNode(assignDate['today'][k]));
            g.appendChild(h);
        }
    }
    if(!(assignDate['tmrw'] == null)) // Needs to exist if the length attribute can be collected from it
    { 
        for (let k = 0; k < assignDate['tmrw'].length; k++)
	{ // Assignments due tommoroow
            var h = document.createElement('p');
            h.appendChild(document.createTextNode(assignDate['tmrw'][k]));
            g.appendChild(h);
        }
    }
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
    var pf = document.createElement('p'); // Adding ending link and p tag
    pf.appendChild(document.createTextNode('If you want more info, visit '));
    var a = document.createElement('a');
    a.href = "https://portals.veracross.com/webb/student/student/upcoming-assignments";
    a.appendChild(document.createTextNode('your upcoming assignments page'));
    pf.appendChild(a);
    pf.style = "text-align: center;"
    pf.appendChild(document.createTextNode('!'));
    g.appendChild(pf);
}


async function getLP()
{
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments');
    const txt = await respNew.text();
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1];
    const yr = txt.split(';')[16].split('"')[0].split('=')[1];
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr;
    const response = await fetch(fetchUrl);
    const fg = await response.text();
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fh = ((fg.split(';')[15]).split('},{'));
    var lessonPlans = [];
    var classRows = {};
    var lpDate = {'today': [], 'tmrw': []};
    for (let i = 0; i < fh.length; i++)
    {
        var isOn = false;
        var isToday = false;
        var isTmrw = false;
        if (fh[i].split(',')[2].split(':')[0] == '"class_id"')
        {
            classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1];
        }
        else if ((fh[i].split(',')[3]).split(':')[1] == '"lesson-plan"')
        {  
            var lpStr = '';
            var formDate = fh[i].split(',')[4].split(':')[1];
            var cls = classRows[fh[i].split(',')[1].split(':')[1]].slice(1, classRows[fh[i].split(',')[1].split(':')[1]].length - 1);
            var lpDateLis = [formDate.slice(6, 8), formDate.slice(9, 11)];
            let commaMuch = fh[i].split(',').length - 11;
            let colonMuch = fh[i].split(',')[6].split(':').length - 2;
            lpStr = fh[i].split(',')[6].split(':')[1];
            if(colonMuch > 0)
            {
                for (j = 1; j < colonMuch; j++)
                {
                    lpStr = lpStr + ': ';
                    lpStr = lpStr + fh[i].split(',')[6].split(':')[1+j];
                }
            }
            if(commaMuch > 0)
            {
                for (j = 1; j < commaMuch; j++)
                {
                    lpStr = lpStr + ', ';
                    lpStr = lpStr + fh[i].split(',')[6+j];
                }
            }
            lpStr = lpStr.slice(1, lpStr.length - 1) + ' (' + cls + ')';
            if(parseInt(lpDateLis[0]) < today.getMonth() + 1)
            {
                isOn = true;
            }
            else
            {
                if(parseInt(lpDateLis[0]) == today.getMonth() + 1 && parseInt(lpDateLis[1]) < today.getDate())
                {
                    isOn = true;
                }
                else if (parseInt(lpDateLis[0]) == today.getMonth() + 1 && parseInt(lpDateLis[1]) == today.getDate())
                {
                    isToday = true;
                    lpStr = 'Today - ' + lpStr;
                }
                else if (parseInt(lpDateLis[0]) == tomorrow.getMonth() + 1 && parseInt(lpDateLis[1]) == tomorrow.getDate())
                {
                    isTmrw = true;
                    lpStr = 'Tomorrow - ' + lpStr;
                }
                else
                {
                    lpStr = monthdictInv[parseInt(lpDateLis[0])] + ' ' + lpDateLis[1] + ' - ' + lpStr;
                }
            }
            var totLis = [lessonPlans, lpDate['today'], lpDate['tmrw']]
            for(lis of totLis)
            {
                for(f of lis)
                {
                    if(f==lpStr)
                    {
                        isOn = true;
                    }
                }
            }
            if(!isOn)
            {
                if(isToday)
                {
                    lpDate['today'].push(lpStr);
                }
                else if(isTmrw)
                {
                    lpDate['tmrw'].push(lpStr);
                }
                else
                {
                    lessonPlans.push(lpStr);
                }
            }
        }
    }
    var g = document.getElementById('lppdiv');
    for (k of lpDate['today']) // Today's lesson plans
    { 
        var h = document.createElement('p');
        h.appendChild(document.createTextNode(k));
        g.appendChild(h);
    }
    for (k of lpDate['tmrw']) // Tommorow's lesson plans
    { 
        var h = document.createElement('p');
        h.appendChild(document.createTextNode(k));
        g.appendChild(h);
    }
    var pmed = document.createElement('p');
    pmed.appendChild(document.createTextNode('Later (sorted by class):'))
    pmed.style = "font-size: 150%; text-align: center;";
    g.appendChild(pmed);
    for (k of lessonPlans){
        var h = document.createElement('p');
        h.appendChild(document.createTextNode(k));
        g.appendChild(h);
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
    document.getElementById('changMod').innerHTML = 'Here are your lesson plans:';
}


function reqNotify()
{ 
    if (!(assign)) // To make sure getAssignments doesn't run more than once
    {
	getAssignments();
        assign = true;
    }
}


function reqLP()
{
    if(!lessonP)
    {
        getLP();
        lessonP = true;
    }
}