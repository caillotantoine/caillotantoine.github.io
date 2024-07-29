var menuState = false;

function openNavMenu() {
    document.querySelector("nav").style.setProperty('display', 'block');
    document.getElementById("open").style["display"] = "none";
    document.getElementById("close").style["display"] = "block";
    menuState = true;
}

function closeNavMenu() {
    document.querySelector("nav").style.setProperty('display', 'none');
    document.getElementById("open").style["display"] = "block";
    document.getElementById("close").style["display"] = "none";
        
    menuState = false;
}

function toggleMenu() {
    if(menuState)
    {
        closeNavMenu();
    }
    else{
        openNavMenu();
    }
}