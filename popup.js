// popup.js
// Does notification button for assignments
// One minor bug: \" in assignments doesn't get replaced by "
// Next update will be to sort by date in comparison to today's date

document.getElementById("notif").addEventListener("click", reqNotify);
var assign = false;

async function getAssignments(){
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments');
    const txt = await respNew.text();
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1];
    const yr = txt.split(';')[16].split('"')[0].split('=')[1];
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr;
    const response = await fetch(fetchUrl);
    const fg = await response.text();
    let today = new Date();
    console.log(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
    const fh = ((fg.split(';')[15]).split('},{'));
    var assignments = [];
    var classRows = {};
    var isOn = false;
    for (let i = 0; i < fh.length; i++){
	    if (fh[i].split(',')[2].split(':')[0] == '"class_id"'){
	        classRows[fh[i].split(',')[0].split(':')[1]] = fh[i].split(',')[3].split(':')[1];
	    }
        if ((fh[i].split(',')[3]).split(':')[1] == '"assignment-upcoming"'){
            var assignStr = '';
            let commaMuch = fh[i].split(',').length - 11
            if (commaMuch <= 0){
                assignStr = (fh[i].split(',')[7]).split(':')[1].slice(1, (fh[i].split(',')[7]).split(':')[1].length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ', due ' + fh[i].split(',')[5].split(':')[1].replace('\\', '').slice(1, fh[i].split(',')[5].split(':')[1].replace('\\', '').length - 1) + ')';
            }
            else{
                for (let o = 0; o <= commaMuch; o++){
                    if (o==0){
                        assignStr = assignStr + fh[i].split(',')[7].split(':')[1];
                    }
                    else{
                        assignStr = assignStr + ',';
                        assignStr = assignStr + fh[i].split(',')[7 + o];
                    }
                }
                assignStr = assignStr.slice(1, assignStr.length - 1).replace('\\', '') + ' (' + classRows[fh[i].split(',')[1].split(':')[1]].replace('"', '').replace('"', '') + ', due ' + fh[i].split(',')[5].split(':')[1].replace('\\', '').slice(1, fh[i].split(',')[5].split(':')[1].replace('\\', '').length - 1) + ')';
            }
	        for (let j = 0; j < assignments.length; j++){
                if(assignments[j] == assignStr){
                    isOn = true;
	            }
            }
            if(!isOn){
                assignments.push(assignStr);
            }
	    isOn = false;
        }
    }
    var message = '';
    var g = document.getElementById('assign');
    var pinit = document.createElement('p');
    pinit.appendChild(document.createTextNode('Here are your upcoming assignments:'));
    g.appendChild(pinit);
    for (let k = 0; k < assignments.length; k++){
        var h = document.createElement('p');
	    h.appendChild(document.createTextNode(assignments[k]));
	    g.appendChild(h);
    }
    var pf = document.createElement('p')
    pf.appendChild(document.createTextNode('If you want more info, visit '));
    var a = document.createElement('a');
    a.href = "https://portals.veracross.com/webb/student/student/upcoming-assignments";
    a.appendChild(document.createTextNode('your upcoming assignments page'));
    pf.appendChild(a);
    pf.appendChild(document.createTextNode('!'));
    g.appendChild(pf);
}


function reqNotify(){
    if (!(assign)){
	getAssignments();
        assign = true;
    }
}

