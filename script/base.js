var menuState = false;

function toggleMenu() {
    if(menuState)
    {
        document.getElementById("open").style["display"] = "visible";
        document.getElementById("close").style["display"] = "none";
        menuState = false;
    }
    else{
        document.getElementById("open").style["display"] = "none";
        document.getElementById("close").style["display"] = "visible";
        menuState = true;
        // document.querySelector("nav").style.setProperty('display', 'visible');
    }
}