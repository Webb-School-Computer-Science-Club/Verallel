// Initialize button with user's preferred mode

var lightmode = true; // Defining variables and queryselector so popup.css variables can be changed
var r = document.querySelector(':root');

document.getElementById("changeColor").addEventListener("click", changeMode);


function darkMode(){ // Changes popup.css variables
    r.style.setProperty('--background-color', '#000000');
    r.style.setProperty('--border-color', '#ffffff');
}


function lightMode(){ // Changes popup.css variables
    r.style.setProperty('--background-color', '#ffffff');
    r.style.setProperty('--border-color', '#000000');
}


function changeMode(){ // Main function that popup.html calls
    if (lightmode == true){
	changeColor.innerHTML = "Press button for light mode";
	lightmode = false;
	darkMode();
    }
    else{
        changeColor.innerHTML = "Press button for dark mode";
	lightmode = true;
	lightMode();
    }
}
