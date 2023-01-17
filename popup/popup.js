// popup.js
// Does notification button for assignments and for lesson plans
// May or may not need to sort by year, but that will probably be an upcoming update for getAssignments()

document.getElementById("notif").addEventListener("click", displayNotif); // Gives assignment button functionality by adding click listener
document.getElementById("lessonP").addEventListener("click", displayLP); // Gives lesson plan button functionality by addig click listener
document.getElementById('changMod').addEventListener('click', changeMode); // Dark/light mode toggle button now functions
document.getElementById("missing").addEventListener('click', displayMiss); // Gives missing assignment button functionality
document.getElementById('post-btn').addEventListener('click', displayPosts);
document.getElementById('get-information-info').addEventListener('click', async () => { // refresh button to get assignments (for when you don't want to wait for autorefresh)
    await getLP();
    await getMissing();
    await getAssignments();
    await getRecentPosts();
    updateByClass(true); 
    new Promise((resolve, reject) => {
        chrome.storage.local.set({
            'unupdatedTime': new Date().valueOf(),
        }, () => {resolve(new Date().valueOf())});
    });
});

var assign = false;
var lessonP = false;
var dm = false; // light mode by default
var miss = false;
var hasMadeClassList = false;
var r = document.querySelector(':root'); // For changing mode of the popup
var rtext  = document.querySelector(".message");
const monthdict = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}; //3-letter month to number conversion
const monthdictInv = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}; //3-letter month to number conversion

var updateTime = 200 * 1000; // this is in seconds (first num)
var recentPostNum = 20; // post display limit

var assignmentsDictList = []; // initialize lists
var uniqueClassList = [];
var lessonPlansDictList = [];
var missingAssignmentsDictList = [];
var postDictList = [];

window.onload = function() {  // initialize on page load
    document.getElementById("assign").style.display = "none"; // ensure displays are hidden
    document.getElementById("miss").style.display = "none";
    document.getElementById("lppdiv").style.display = "none";
    tryErrors(); // throw any errors for the user
    
    const calcUpdate = new Promise( (resolve, reject) => { // update time elapse and initial load to see if info should be updated
        (chrome.storage.local.get('unupdatedTime', (items) => {
        val = ((new Date().valueOf() - items.unupdatedTime) > updateTime) || (Object.keys(items).length == 0);
        console.log("Unupdated time (ms): ", items.unupdatedTime);
        console.log("Current time (ms): ", new Date().valueOf());
        console.log("Current time diff (ms): ", new Date().valueOf() - items.unupdatedTime);
        resolve(val);
    }))});
    
    var waitingFunction = async () => { // update info or pull from local
        await calcUpdate.then(
            async (update) => {
                if (update) {
                    await getLP();
                    await getMissing();
                    await getAssignments();
                    await getRecentPosts();
                    updateByClass(true); 
                    new Promise((resolve, reject) => {
                        chrome.storage.local.set({
                            'unupdatedTime': new Date().valueOf(),
                        }, () => {resolve(new Date().valueOf())});
                    });
                    
                } else {
                    updateAssignmentsDict(false);
                    updateLPDict(false);
                    updateMissingDict(false);
                    updatePostsDict(false);
                    updateByClass(false); 
            }
    });
        
    };
    waitingFunction();
    
};

async function tryErrors() {
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments'); // See if link is redirected
    if (respNew.redirected == true) {
        document.getElementById("display-information-error").style.display = "flex";
    } else {
        document.getElementById("display-information-error").style.display = "none";
    }
}

function resetButtonSizes() {
    document.getElementById('missing').innerHTML = 'Missing'
    document.getElementById('lessonP').innerHTML = 'Lessons';
    document.getElementById('notif').innerHTML = 'Upcoming';
    document.getElementById('post-btn').innerHTML = 'Posts';

    document.getElementById("assign").style.display = "none";
    document.getElementById("miss").style.display = "none";
    document.getElementById("lppdiv").style.display = "none";
    document.getElementById("post-box").style.display = "none";

}

function displayNotif() {
    resetButtonSizes();
    document.getElementById("assign").style.display = "flex";
    document.getElementById('notif').innerHTML = 'Upcoming:';
}

function displayMiss() {
    resetButtonSizes();
    document.getElementById("miss").style.display = "flex";
    document.getElementById('missing').innerHTML = 'Missing:'
}

function displayPosts() {
    resetButtonSizes();
    document.getElementById("post-box").style.display = "flex";
    document.getElementById('post-btn').innerHTML = 'Posts:';
}

function displayLP() {
    resetButtonSizes();
    document.getElementById("lppdiv").style.display = "flex";
    document.getElementById('lessonP').innerHTML = 'Lessons:';
}

function changePopupMode(dl)
{
    if(dl)
    {
        r.style.setProperty('--background-color', '#000000'); //TODO: make this easier and more modular
        r.style.setProperty('--border-color', '#4d4d59');
        r.style.setProperty('--text-color', '#ffffff');
        r.style.setProperty('--mode-change-background', 'rgb(67, 70, 102)');
        r.style.setProperty('--mode-change-background-hover', 'rgb(51, 50, 64)');
        r.style.setProperty('--divider-color', '#6f6f70');
    }
    else
    {
        r.style.setProperty('--background-color', '#ffffff');
        r.style.setProperty('--border-color', '#8b8e9f');
        r.style.setProperty('--text-color', '#000000');
        r.style.setProperty('--mode-change-background', 'rgb(196, 193, 209)');
        r.style.setProperty('--mode-change-background-hover', 'rgb(170, 166, 184)');
        r.style.setProperty('--divider-color', '#c1c1c1');
    }
}


chrome.runtime.sendMessage({ msg: 'Popup Initialization', data: null}, function(response) // Popup gets current mode from background.js
{
    if(response)
    {
	dm = response.data;
        if(response.data) //Response.data will either be true or false
        {
            document.getElementById("changMod").innerHTML = '🌑'; 
        }
        else
        {
            document.getElementById("changMod").innerHTML = '🌕';
        }
	changePopupMode(dm);
    }
});

async function getAssignments() // async for usage of fetch
{ 
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments'); // Link not unique to student
    const txt = await respNew.text() + ''; // Trying to get json doesn't work unfortunatley
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1]; // Getting student id out of raw text of source code
    const yr = txt.split(';')[16].split('"')[0].split('=')[1]; // Gets the year from the raw text of the source code
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr; // Configures student-unique url to fetch the iframe (can't fetch in original because of CORS)
    const response = await fetch(fetchUrl); // New fetching
    const fg = await response.text();

    var parser = new DOMParser();
    var script = parser.parseFromString(fg, 'text/html').scripts[3]; // parse script with assignments, convert to jsons
    var classText = script.innerHTML.match(/rows: \[.*\]/gm);
    var classJSON = JSON.parse("{" + classText[0].replace("rows: ", '"rows":') + "}"); 
    var itemsText = script.innerHTML.match(/items: \[.*\]/gm);
    var itemsJSON = JSON.parse("{" + itemsText[0].replace("items: ", '"items":') + "}");

    classIDtoClassName = new Map(); // setup initial maps and variables
    classJSON["rows"].forEach((val) => {
        classIDtoClassName[val["id"]] = val["description"];
    });

    currentMonth = new Date().getMonth()+1;
    currentDay = new Date().getDate();
            

    itemsJSON["items"].forEach( (val) => { // push assignment list
        if (val["formatted_date"] !== null) {
            assignmentsDictList.push(
                {"name": val["notes"], 
                "id": val["item_id"],
                "month": monthdict[val["formatted_date"].slice(0,3)], 
                "day": Number(val["formatted_date"].slice(4,val["formatted_date"].length)),
                "year": new Date(val["date"]).getFullYear(),
                "className": classIDtoClassName[val["row"]]}
            );

        } else {
            assignmentsDictList.push(
                {"name": val["notes"], 
                "id": val["item_id"],
                "month": new Date(val["date"]).getMonth()+1, 
                "day": new Date(val["date"]).getDate()+1,
                "year": new Date(val["date"]).getFullYear(),
                "className": classIDtoClassName[val["row"]]}
            );
        }
        console.log(new Date(val["date"]).getFullYear());
    });

    assignmentsDictList = assignmentsDictList.filter( // filter assignments list
        (v,i,a)=> {
            return (a.findIndex(v2=>(v2.id===v.id))===i) && 
            (v.month >= currentMonth && v.day >= currentDay);
        });
    
    assignmentsDictList.forEach((val) => { // add and filter unique class list
        uniqueClassList.push(val["className"]);
    });
    uniqueClassList = uniqueClassList.filter(
        (v,i,a)=> {
            return (a.findIndex(v2=>(v2===v))===i);
        });

    console.log("Sorted assignment list: ", assignmentsDictList);
    
    assignmentsDictList.sort(function(a, b) { // sort assignments list chronologically
        if (a.year > b.year)
            return 1;
        if (a.year < b.year)
            return -1;
        if (a.month > b.month)
            return 1;
        if (a.month < b.month)
            return -1;
        if (a.month == b.month) {
            if (a.day >= b.day)
                return 1;
            if (a.day < b.day)
                return -1;
    }});


    const set = true;
    updateAssignmentsDict(set); // update storage and generate visual

    return;
    
}

async function updateAssignmentsDict(set) {
    const objDone = new Promise((resolve, reject) => { // either set or get local storage
        if (set) {
            chrome.storage.local.set({
                'assignments': assignmentsDictList,
            }, () => {resolve(true);});
        } else {
            chrome.storage.local.get('assignments', (items) => {
                assignmentsDictList = items.assignments;
                console.log("Stored assignment list: ", items.assignments);
                resolve(true);
            });
        }
    });

    objDone.then(() => generateAssignments(assignmentsDictList)); // after done, generate visual
}

function generateAssignments(dict) {
        
    var g = document.getElementById('assign');
    while(g.firstChild) { // clear html list
        g.removeChild(g.firstChild);
    }
    if (dict.length > 0) { // empty or existent list
        var pmed = document.createElement('p');
        pmed.appendChild(document.createTextNode('Due later:'));
        pmed.style = "font-size: 150%; text-align: center; margin-bottom: 5px;";
        g.appendChild(pmed);
    } else {
        var pmed = document.createElement('p');
        pmed.appendChild(document.createTextNode('No assignments due.'));
        pmed.style.textAlign = "center";
        g.appendChild(pmed);
    }

    dict.forEach((entry) => { // iterate through list and create assignments
        let assignmentEntry = document.createElement('div');
        assignmentEntry.classList.add('assignment-entry');
        let h = document.createElement('p');
        let date = document.createElement('p');
        date.appendChild(document.createTextNode(
            monthdictInv[entry["month"]] + " " + 
            entry["day"] + " - "
        ));
        assignmentEntry.appendChild(date);
        h.appendChild(document.createTextNode(
            entry["name"] +
            " (" + entry["className"] + ")"
            ));
        h.classList.add('name');
        assignmentEntry.appendChild(h);
        date.classList.add('date');
        g.appendChild(assignmentEntry);
    });

}



async function updateByClass(set) {
    const objDone = new Promise((resolve, reject) => { // either set or get local storage
        if (set) {
            chrome.storage.local.set({
                'uniqueClass': uniqueClassList,
            }, () => {resolve(true);});
        } else {
            chrome.storage.local.get('uniqueClass', (items) => {
                uniqueClassList = items.uniqueClass;
                console.log("Stored unique class list: ", items.uniqueClass);
                resolve(true);
            });
        }
    });

    objDone.then( () => {
        var dropdown = document.getElementById("change-assignment-dropdown");
        var selectedFromDropdown = document.getElementById("selected-assignment-box");

        while(dropdown.childNodes.length > 2) { // remove all visual classes but initial
            dropdown.removeChild(dropdown.lastChild);
        }

        var modifiedAssignmentList = []; // initialize modified lists and selected class
        var modifiedLPList = [];
        var modifiedMissingList = [];
        var modifiedPostList = [];

        var selectedClass = "All";
        
        uniqueClassList.sort(); // sort and modify class list 
        uniqueClassList.splice(0, 0, "All");
        uniqueClassList = uniqueClassList.filter(
            (v,i,a)=> {
                return (a.findIndex(v2=>(v2===v))===i);
            });
    
        console.log("Class generation started: ");
    
        uniqueClassList.forEach(uniqueClassName => { // iterate through unique class list
            var classBox = document.createElement("div");
            classBox.className = "change-assignment-box";
            classBox.id = "box-" + uniqueClassName;
            classBox.appendChild(
                document.createElement("p").appendChild(
                    document.createTextNode(uniqueClassName))
                );
    
            dropdown.appendChild(classBox);
    
            if (uniqueClassName == "All") {
                classBox.style.display = "none";
            }
    
            classBox.addEventListener("click", function() { // add click function
                selectedClass = uniqueClassName;
                selectedFromDropdown.getElementsByTagName("p")[0].innerText = selectedClass;
                px = classBox.offsetHeight + "px"; // variable height to fit font
                dropdown.style.height = px;
                
                let c = dropdown.getElementsByClassName("change-assignment-box");
                Array.prototype.forEach.call(c, child => {
                    if (child.innerText == selectedClass)
                        child.style.display = "none";     
                    else 
                        child.style.display = "flex"; 
                });
    
                if(c[c.length-1].style.display == "none") { // set bottom class entry in list to have specific CSS 
                    c[c.length-2].classList.add("change-assignment-box-last");
                    c[c.length-1].classList.remove("change-assignment-box-last");
                }
                if(c[c.length-1].style.display == "flex") {
                    c[c.length-2].classList.remove("change-assignment-box-last");
                    c[c.length-1].classList.add("change-assignment-box-last");
                }
                
                if (selectedClass == "All") { // filter classes
                    modifiedAssignmentList = assignmentsDictList;
                    modifiedLPList = lessonPlansDictList;
                    modifiedMissingList = missingAssignmentsDictList;
                    modifiedPostList = postDictList;
                    
                } else {
                    modifiedAssignmentList = assignmentsDictList.filter(({className}) => className === selectedClass);
                    modifiedLPList = lessonPlansDictList.filter(({className}) => className === selectedClass);
                    modifiedMissingList = missingAssignmentsDictList.filter(({className}) => className === selectedClass);
                    modifiedPostList = postDictList.filter(({className}) => className === selectedClass);
                }
    
                generateAssignments(modifiedAssignmentList); // generate visuals
                generateLP(modifiedLPList);
                generateMissing(modifiedMissingList);
                generatePosts(modifiedPostList);
    
                displayNotif();
            });
        });
    
        var a = dropdown.getElementsByClassName("change-assignment-box"); // logic for display of last class
        a[a.length-1].classList.add("change-assignment-box-last");

    });

}


async function getLP()
{
    const respNew = await fetch('https://portals.veracross.com/webb/student/student/upcoming-assignments');
    const txt = await respNew.text() + '';
    const stuId = txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=')[txt.split(';')[15].split('&')[txt.split(';')[15].split('&').length - 2].split('=').length - 1];
    const yr = txt.split(';')[16].split('"')[0].split('=')[1];
    const fetchUrl = 'https://portals-embed.veracross.com/webb/parent/planner?p=' + stuId + '&school_year=' + yr;
    const response = await fetch(fetchUrl);
    const fg = await response.text();
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fh = ((fg.split(';')[15]).split('},{'));
    var classRows = {};
    var lpDate = {'today': [], 'tmrw': []};


    for (let i = 0; i < fh.length; i++)
    {
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
            lpStr = monthdictInv[parseInt(lpDateLis[0])] + ' ' + lpDateLis[1] + ' - ' + lpStr;

            let potentialLPEntry = 
            {"entry": lpStr, 
            "month": lpDateLis[0], 
            "day": lpDateLis[1],
            "className": cls};
        
            if (lessonPlansDictList.some(({entry}) => entry !== lpStr)) { //check if dupe
                lessonPlansDictList.push(potentialLPEntry);
                if (uniqueClassList.some((element) => element !== cls)) { //check if class is dupe
                    uniqueClassList.push(cls);
                } 
            }
        }
    }

    lessonPlansDictList.sort(function(a, b) {
        if (a.month > b.month)
            return 1;
        if (a.month < b.month)
            return -1;
        if (a.month == b.month) {
            if (a.day >= b.day)
                return 1;
            if (a.day < b.day)
                return -1;
        }});

    let set = true;
    updateLPDict(set);

    return;
}

function updateLPDict(set) {
    const objDone = new Promise((resolve, reject) => {
        if (set) {
            chrome.storage.local.set({
                'lessonPlans': lessonPlansDictList,
            }, () => {resolve(true);});
        } else {
            chrome.storage.local.get('lessonPlans', (items) => {
                lessonPlansDictList = items.lessonPlans;
                console.log("Stored lesson plan list: ", items.lessonPlans);
                resolve(true);
            });
        }
    });

    objDone.then(() => generateLP(lessonPlansDictList));
}

function generateLP(dict) {
        
    var g = document.getElementById('lppdiv');
    while (g.firstChild) {
        g.removeChild(g.firstChild);
    }
    if (dict.length > 0) {
        var pmed = document.createElement('p');
        pmed.appendChild(document.createTextNode('Later:'))
        pmed.style = "font-size: 150%; text-align: center; margin-bottom: 3px;";
        g.appendChild(pmed);
        
        for (k of dict)
        {
            var h = document.createElement('p');
            h.appendChild(document.createTextNode(k['entry']));
            g.appendChild(h);
        }
    } else {
        var pf = document.createElement('p')
        pf.appendChild(document.createTextNode('No upcoming lesson plans.'));
        pf.style = "text-align: center;"
        g.appendChild(pf);
    }

}



async function getMissing()
{
    const db = await fetch('https://portals.veracross.com/webb/student/submit-assignments');
    const dbTxt = await db.text();
    const parser = new DOMParser;
    var htmlMissing = parser.parseFromString(dbTxt, 'text/html');
    var missingList = htmlMissing.querySelector('[data-react-class="system/assignment-submission/AssignmentSubmission"]');
    var missingText = missingList.getAttribute("data-react-props");
    var missingJson = JSON.parse(missingText);
    let today = new Date();

    missingJson["assignments"].forEach((assignm) => {
        console.log(assignm);
        var pastDue = false;
        var missStr = '';
        var dueDate = new Date(assignm["due_date"]);
        if((today.getMonth() + 1 > dueDate.getMonth() + 1) && (today.getDate() > dueDate.getDate()))
        {
            pastDue = true;
        }
        else if(today.getMonth() + 1 == dueDate.getMonth() + 1 && today.getDate() > dueDate.getDate())
        {
            pastDue = true;
        }
        if(assignm["completion_status"] == 3)
        {
            pastDue = false;
        }
        if(pastDue)
        {
            let cls = assignm["class_description"];
            missStr = assignm["assignment_description"];
            let potentialMissEntry = 
            {"entry": missStr, 
            "month": dueDate.getMonth() + 1, 
            "day": dueDate.getDate(),
            "className": cls};
            missingAssignmentsDictList.push(potentialMissEntry);
        }
    });

    missingAssignmentsDictList.sort(function(a, b) {
        if (a.month > b.month)
            return 1;
        if (a.month < b.month)
            return -1;
        if (a.month == b.month) {
            if (a.day >= b.day)
                return 1;
            if (a.day < b.day)
                return -1;
        }});

        missingAssignmentsDictList = missingAssignmentsDictList.filter(
        (v,i,a)=> {
            return (a.findIndex(v2=>(v2.entry===v.entry))===i);
        });
    
    
        let set = true;
        updateMissingDict(set);
    
    return;
}

function updateMissingDict(set) {
    const objDone = new Promise((resolve, reject) => {
        if (set) {
            chrome.storage.local.set({
                'missingAssignments': missingAssignmentsDictList,
            }, () => {resolve(true);});
        } else {
            chrome.storage.local.get('missingAssignments', (items) => {
                missingAssignmentsDictList = items.missingAssignments;
                console.log("Stored missing assignments list: ", items.missingAssignments);
                resolve(true);
            });
        }
    });

    objDone.then(() => generateMissing(missingAssignmentsDictList));
}

function generateMissing(dict) {
    var misDiv = document.getElementById('miss');
    while (misDiv.firstChild) {
        misDiv.removeChild(misDiv.firstChild);
    }
    if (dict.length > 0) {
        var pmed = document.createElement('p');
        pmed.appendChild(document.createTextNode('Missing:'))
        pmed.style = "font-size: 150%; text-align: center; margin-bottom: 3px;";
        misDiv.appendChild(pmed);

        for (missin of dict)
        {
            var missP = document.createElement('p');
            missP.appendChild(document.createTextNode(missin['entry']));
            misDiv.appendChild(missP);
        }
    } else {
        var misP = document.createElement('p')
        misP.appendChild(document.createTextNode('No missing assignments according to the Dropbox.'));
        misP.style.textAlign = "center";
        misDiv.appendChild(misP);
    }
}



async function getRecentPosts()
{
    const classList = await fetch('https://portals.veracross.com/webb/student/component/ClassListStudent/1308/load_data'); // get class JSON
    const classListText = await classList.json();
    
    let inc = 0; // set up incrementation counter for resolve condition

    const promise = new Promise(function(resolve, reject) {Array.prototype.forEach.call(classListText["courses"], async (classEntry, ind, arr) => { // iterate through number of classes
        var class_pk = classEntry["class_pk"];
        var class_name = classEntry["class_name"];

        class_name = class_name.replace(/ \(AP\)/, ''); // remove redundant markers in class name
        class_name = class_name.replace(/ \(Honors\)/, '');

        var classPostsLink = "https://classes.veracross.com/webb/course/" + class_pk + "/website/posts"; // get document and parse it
        var classPostsText = await (await fetch(classPostsLink)).text();
        var parser = new DOMParser();
		var doc = parser.parseFromString(classPostsText, 'text/html');


        const scan = new Promise(async (resolve, reject) => { 
            do {
                Array.prototype.forEach.call(doc.getElementsByClassName("message"), async (post) => { // iterate through each post
                    let date = post.getElementsByClassName("message-date")[0].getElementsByClassName("month")[0].innerHTML;
    
                    let monthNum = monthdict[date.slice(0,3)];
                    let day = parseInt(date.slice(4,date.length));
                    let title = post.getElementsByClassName("message-title")[0].getElementsByTagName("a")[0].innerHTML;
                    let titleLink = post.getElementsByClassName("message-title")[0].getElementsByTagName("a")[0].getAttribute("href");
                    
                    let postDict = {
                    "title": title,
                    "link": "https://classes.veracross.com" + titleLink,
                    "month": monthNum,
                    "day": day,
                    "className": class_name
                    };
    
                    postDictList.push(postDict);
                    uniqueClassList.push(class_name);
                    
                });
                if(doc.getElementsByClassName('older').length>0) { // if there's a page 2, iterate through it again
                    classPostsLink = "https://classes.veracross.com/" + doc.getElementsByClassName('older')[0].getAttribute('href');
                    classPostsText = await (await fetch(classPostsLink)).text();
                    doc = parser.parseFromString(classPostsText, 'text/html');
                }
                
            } while (doc.getElementsByClassName('older').length>0)
            resolve(); // resolve individual class scanning after do while completion
        });

        await scan.then(()=> {
            inc++;
            if ((inc === arr.length) && doc.getElementsByClassName('older').length===0) { // resolve scanning posts after all classes have been scanned
                resolve();
                console.log("finished getting posts");
}
        });          
        
    });
    }); 

    await promise.then( // promises are the devil incarnate
        (() => {
            function between(x, min, max) {
                return x >= min && x <= max;
            }              
            let t = new Date();
            console.log(t.getMonth());
            if (between(t.getMonth(), 0, 3)) {
                postDictList = postDictList.sort((a, b)=> {
                    if (between(a.month, 0, 3) && b.month > 3) {
                        return -1;
                    } 
                    if (between(b.month, 0, 3) && a.month > 3) {
                        return 1;
                    }
                    if (between(a.month, 0, 3) && between(b.month, 0, 3)) {
                        if (a.month > b.month)
                            return -1;
                        if (a.month < b.month)
                            return 1;
                            
                        if (a.month == b.month) {
                            if (a.day >= b.day)
                                return -1;
                            if (a.day < b.day)
                                return 1;
                        }
                    } if (a.month > 3 && b.month > 3) {
                        if (a.month > b.month)
                            return -1;
                        if (a.month < b.month)
                            return 1;
                            
                        if (a.month == b.month) {
                            if (a.day >= b.day)
                                return -1;
                            if (a.day < b.day)
                                return 1;
                        }
                    }
                });
            } else {
                postDictList = postDictList.sort(function(a, b) {
                    if (a.month > b.month)
                        return -1;
                    if (a.month < b.month)
                        return 1;
                        
                    if (a.month == b.month) {
                        if (a.day >= b.day)
                            return -1;
                        if (a.day < b.day)
                            return 1; 
                    }
                    
                });
            }
            
            postDictList = postDictList.filter(
                (v,i,a)=> {
                    return (a.findIndex(v2=>(v2.title===v.title))===i);
                });
            console.log("Sorted posts list: ", postDictList);

            uniqueClassList = uniqueClassList.filter( // filter unique classes for dupes
                (v,i,a)=> {
                    return (a.findIndex(v2=>(v2===v))===i);
            });

            let set = true;
            updatePostsDict(set); // update storage and generate visual
            return;
            
        }
    ),
    () => {}
    );

}

function updatePostsDict(set) {
    const objDone = new Promise((resolve, reject) => { // get or set storage
        if (set) {
            chrome.storage.local.set({
                'posts': postDictList,
            }, () => {resolve(postDictList);});
        } else {
            chrome.storage.local.get('posts', (items) => {
                postDictList = items.posts;
                console.log("Sorted posts list", items.posts);
                resolve(postDictList);
            });
        }
    });

    objDone.then(() => generatePosts(postDictList)); 
}

function generatePosts(dict) { // generate visuals for posts
    var g = document.getElementById('post-box');
        while (g.firstChild) {
            g.removeChild(g.firstChild);
        }
        if (dict.length > 0) {
            var pmed = document.createElement('p');
            pmed.appendChild(document.createTextNode('Recent Posts:'))
            pmed.style = "font-size: 150%; text-align: center; margin-bottom: 3px;";
            g.appendChild(pmed);
    
            dict.forEach((val, ind) => {
                if (ind < recentPostNum) {
                    let postEntry = document.createElement('div');
                    postEntry.classList.add('post-entry');
                    let postDate = document.createElement('a');
                    postDate.appendChild(
                        document.createTextNode(
                            monthdictInv[val['month']] + " " + 
                            val['day'] + " - "
                    ));
                    let postA = document.createElement('a');
                    postA.appendChild(document.createTextNode(
                        val['title'] + " (" + val["className"] + ")"
                    ));
                    postA.setAttribute("href", val['link']);
                    postA.setAttribute("target", "_blank");

                    postEntry.appendChild(postDate);
                    postEntry.appendChild(postA);
                    g.appendChild(postEntry); 
                }    
            });
            
        } else {
            var postP = document.createElement('p')
            postP.appendChild(document.createTextNode('No recent posts.'));
            postP.style.textAlign = "center";
            g.appendChild(postP);
        }
}


function changeMode()
{
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        var p = document.getElementById('not-vera');
        if(!dm)
        {
            dm = true;
            if(activeTab.url.match(/classes.veracross.com/) || activeTab.url.match(/portals.veracross.com/) || activeTab.url.match(/portals-embed.veracross.com/) || activeTab.url.match(/documents.veracross.com/))
            {
                document.getElementById('changMod').innerHTML = '🌑';
                chrome.runtime.sendMessage({msg: 'Change to dark', data: null});
                if(!(p == null))
                {
                    p.parentNode.removeChild(p);
                }
		changePopupMode(dm);
            }
            else if(activeTab.url.match(/options/) && activeTab.url.match(/options.html/))
            {
                document.getElementById('changMod').innerHTML = '🌑';
                chrome.runtime.sendMessage({msg: 'oChangeD', data: null});
                chrome.tabs.sendMessage(activeTab.id, {mode: '🌕'}); // For options.js
                if(!(p == null))
                {
                    p.parentNode.removeChild(p);
                }
                changePopupMode(dm);
            }
            else
            {
                if(p == null)
                {
                    var notVera = document.createElement('p')
                    notVera.appendChild(document.createTextNode('You must be in Veracross to switch modes!'));
                    notVera.id = 'not-vera';
                    document.getElementById('not-veracross-error').appendChild(notVera);
                }
            }
        }
        else
        {
            dm = false;
            if(activeTab.url.match(/classes.veracross.com/) || activeTab.url.match(/portals.veracross.com/) || activeTab.url.match(/portals-embed.veracross.com/) || activeTab.url.match(/documents.veracross.com/))
            {
                document.getElementById('changMod').innerHTML = '🌕';
                chrome.runtime.sendMessage({msg: 'Change to light', data: null});
                if(!(p == null))
                {
                    p.parentNode.removeChild(p);
                }
		changePopupMode(dm);
            }
            else if(activeTab.url.match(/options/) && activeTab.url.match(/options.html/))
            {
                document.getElementById('changMod').innerHTML = '🌕';
                chrome.runtime.sendMessage({msg: 'oChangeL', data: null});
                chrome.tabs.sendMessage(activeTab.id, {mode: '🌑'}); // For options.js
                if(!(p == null))
                {
                    p.parentNode.removeChild(p);
                }
                changePopupMode(dm);
            }
            else
            {
                if(p == null)
                {
                    var notVera = document.createElement('p')
                    notVera.appendChild(document.createTextNode('You must be in Veracross to switch modes!'));
                    notVera.id = 'not-vera';
                    document.getElementById('not-veracross-error').appendChild(notVera);
                }                
            }
        }
    });
}

