// popup.js
// Does notification button for assignments
// One minor bug: \" in assignments doesn't get replaced by "
// Next update will be to sort by date in comparison to today's date

document.getElementById("notif").addEventListener("click", reqNotify);
var assign = false;

async function getAssignments(){ // Fetches data and adds data to popup
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments');
    const txt = await respNew.text();
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1];
    const yr = txt.split(';')[16].split('"')[0].split('=')[1];
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr;
    const response = await fetch(fetchUrl); //Fetching relevant data
    const fg = await response.text(); //Unfortunatley retrieving as text was the only option that worked (json and blob didn't work), so have to split up text
    let today = new Date();
    console.log(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
    const fh = ((fg.split(';')[15]).split('},{')); //Getting to the actual script with all the assignments
    var assignments = []; //Assignment list and classRows dictionary object
    var classRows = {};
    var isOn = false;
    for (let i = 0; i < fh.length; i++){ //Iterates through all the lists of fh
	    if (fh[i].split(',')[2].split(':')[0] == '"class_id"'){ // For associating rows with classes. This works because class id #s are listed before anything else
	        classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1]; //Row-class associations
	    }
        if ((fh[i].split(',')[3]).split(':')[1] == '"assignment-upcoming"'){ // An upcoming assignment
            var assignStr = ''; //String variable with somewhat decently-formatted assignment
            let commaMuch = fh[i].split(',').length - 11 // For dealing with assignments with commas in their description
            if (commaMuch <= 0){ // No commas in assignment description
                assignStr = (fh[i].split(',')[7]).split(':')[1].slice(1, (fh[i].split(',')[7]).split(':')[1].length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ', due ' + fh[i].split(',')[5].split(':')[1].replace('\\', '').slice(1, fh[i].split(',')[5].split(':')[1].replace('\\', '').length - 1) + ')';
            }
            else{ // For assignments with commas
                for (let o = 0; o <= commaMuch; o++){
                    if (o==0){
                        assignStr = assignStr + fh[i].split(',')[7].split(':')[1]; // Only this part has a colon
                    }
                    else{
                        assignStr = assignStr + ',';
                        assignStr = assignStr + fh[i].split(',')[7 + o];
                    }
                }
		// Some final operations to clean up the string
                assignStr = assignStr.slice(1, assignStr.length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ', due ' + fh[i].split(',')[5].split(':')[1].replace('\\', '').slice(1, fh[i].split(',')[5].split(':')[1].replace('\\', '').length - 1) + ')';
            }
	    for (let j = 0; j < assignments.length; j++){ //Code to make sure no assignment repeats
                if(assignments[j] == assignStr){
                    isOn = true;
	        }
            }
            if(!isOn){ 
                assignments.push(assignStr);
            }
	    isOn = false; // Resets for every iteration
        }
    }
    var g = document.getElementById('assign'); // Actually adding the assignments to the empty div in popup.html
    var pinit = document.createElement('p');
    pinit.appendChild(document.createTextNode('Here are your upcoming assignments:'));
    g.appendChild(pinit);
    for (let k = 0; k < assignments.length; k++){ // Assignment adding
        var h = document.createElement('p');
	h.appendChild(document.createTextNode(assignments[k]));
	g.appendChild(h);
    }
    var pf = document.createElement('p') // Adding link to upcoming assignments at the end
    pf.appendChild(document.createTextNode('If you want more info, visit '));
    var a = document.createElement('a');
    a.href = "https://portals.veracross.com/webb/student/student/upcoming-assignments";
    a.appendChild(document.createTextNode('your upcoming assignments page'));
    pf.appendChild(a);
    pf.appendChild(document.createTextNode('!'));
    g.appendChild(pf);
}


function reqNotify(){
    if (!(assign)){ // For only being able to see it once to prevent massivley long popup page
	getAssignments();
        assign = true;
    }
}

