// popup.js
// Does notification button for assignments
// One minor bug: \" in assignments doesn't get replaced by "
// May or may not need to sort by year, but that will probably be an upcoming update for getAssignments()

document.getElementById("notif").addEventListener("click", reqNotify); // Gives button functionality by adding click listener
var assign = false;
const monthdict = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}; //3-letter month to number conversion

async function getAssignments() // async for usage of fetch
{ 
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments'); // Link not unique to student
    const txt = await respNew.text(); // Trying to get json doesn't work unfortunatley
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1]; // Getting student id out of raw text of source code
    const yr = txt.split(';')[16].split('"')[0].split('=')[1]; // Gets the year from the raw text of the source code
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr; // Configures student-unique url to fetch the iframe (can't fetch in original because of CORS)
    const response = await fetch(fetchUrl); //New fetching
    const fg = await response.text();
    let today = new Date(); //Defining today and tomorrow
    let tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate() + 1);
    const fh = ((fg.split(';')[15]).split('},{')); // More text splitting to retrieve features
    var assignments = []; // Defining arrays and objects for use in the function
    var classRows = {};
    var assignDate = {};
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
            if (commaMuch <= 0)
	    {
                let colonMuch = fh[i].split(',')[7].split(':').length;
                if (colonMuch <= 2) // Checking if the assignment has a colon in it
		{ 
                    assignStr =  'Due ' +  dueDate + ' - ' + (fh[i].split(',')[7]).split(':')[1].slice(1, (fh[i].split(',')[7]).split(':')[1].length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ')';
                }
                else
		{
                    for(let o = 0; o <= colonMuch - 2; o++) // Adding colons to assignment name with colons
		    { 
                        if(o == 0)
			{
                            assignStr = assignStr + fh[i].split(',')[7].split(':')[1];
			}
                        else // Getting rest of assignment after colon(s)
			{ 
                            assignStr = assignStr + ': ';
                            assignStr = assignStr + fh[i].split(',')[7].split(':')[1 + o];
                        }
                    }
                    assignStr = 'Due ' + dueDate + ' - ' + assignStr.slice(1, assignStr.length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ')';
                }
            }
            else
	    {
                for (let o = 0; o <= commaMuch; o++)
		{
                    let colonMuch = fh[i].split(',')[7 + o].split(':').length; // For every comma-separated item colon spliiting is now addressed
                    if (o==0)
		    {
                        if(colonMuch <= 2)
			{
                            assignStr = assignStr + fh[i].split(',')[7].split(':')[1];
                        }
                        else
			{
                            for(let n = 0; n <= colonMuch - 2; n++)
			    {
                                if(n == 0)
				{
                                    assignStr = assignStr + fh[i].split(',')[7].split(':')[1];
                                }
                                else
				{
                                    assignStr = assignStr + ': ';
                                    assignStr = assignStr + fh[i].split(',')[7].split(':')[1 + n];
                                }
                            }
                        }		
                    }
                    else // Don't need to use colonMuch for here, as splitting by colon is unecessary to get desired text
		    { 
                        assignStr = assignStr + ',';
                        assignStr = assignStr + fh[i].split(',')[7 + o];
                    }
                }
                assignStr = 'Due ' + dueDate  + ' - ' + assignStr.slice(1, assignStr.length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ')';
            }
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
    var pinit = document.createElement('p');
    pinit.style = "font-size: 150%; text-align: center;";
    pinit.appendChild(document.createTextNode('Here are your upcoming assignments:'));
    g.appendChild(pinit);
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


function reqNotify()
{ 
    if (!(assign)) // To make sure getAssignments doesn't run more than once
    {
	getAssignments();
        assign = true;
    }
}
