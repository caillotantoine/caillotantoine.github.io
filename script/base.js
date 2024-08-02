var menuState = false;

const PageStates = {
    INDEX: 'index',
    RESEARCH: 'research',
    PROJECTS: 'projects'
};
var pageState = PageStates.INDEX;

function loadHTML(file, elementId) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

function loadContent() {
    switch (pageState) {
        case PageStates.INDEX:
            loadHTML('content/frontpage.html', 'contentMatter');
            break;

        case PageStates.RESEARCH:
            break;
    
        default:
            loadHTML('content/frontpage.html', 'contentMatter');
            break;
    }
}

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