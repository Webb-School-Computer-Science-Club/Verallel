// assignmentSubmission.js
// For dropbox improvement

var dataDiv = document.getElementsByClassName('full-screen-bg')[0].getElementsByClassName('app-container')[0].getElementsByTagName('div')[0];
var sidebar = dataDiv.getElementsByClassName('sidebar')[0];
var data = dataDiv.getAttribute('data-react-props');
var today = new Date();
var newDef = false;
var ind = 0;
var i = 0;
for (prop of data.split('},{'))
{
    var dueDate = prop.split('"due_date":"')[1].split('"')[0]; // Gets index of first date later or on today
    var dueDateLis = [parseInt(dueDate.slice(8, 10)), parseInt(dueDate.slice(5, 7))];
    if(dueDateLis[1] > today.getMonth() + 1)
    {
        if(!newDef)
        {
            newDef = true;
            ind = i;
        }
    }
    else if(today.getMonth() + 1 == dueDateLis[1] && dueDateLis[0] >= today.getDate())
    {
        if(!newDef)
        {
            newDef = true;
            ind = i;
        }
    }
    i++;
}
notCompete = true;
while(notCompete) // Adjusts index to soonest-due non-completed assignment
{
    if(sidebar.getElementsByClassName('vx-record-detail')[ind])
    {
        if(sidebar.getElementsByClassName('vx-record-detail')[ind].getElementsByClassName('vx-tag')[0]) // Complete tag in sidebar
        {
            ind++;
        }
        else
        {
            notCompete = false;
        }
    }
    else
    {
        notCompete = false;
    }
}
if(ind > sidebar.getElementsByClassName('vx-record-detail').length - 1) // So it goes to an assignment that exists
{
    ind = sidebar.getElementsByClassName('vx-record-detail').length - 1
}
var goTo = sidebar.getElementsByClassName('vx-record-detail')[ind];
goTo.click();
sidebar.scrollTop = goTo.offsetTop; // Scrolls to that index with some offset
