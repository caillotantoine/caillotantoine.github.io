function loadHTML(file, elementId) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load ' + file);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error(error));
}

function openNavMenu() {
    const nav = document.getElementById('mobileNav');
    const button = document.getElementById('menu');
    if (!nav || !button) return;

    nav.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Close navigation menu');
}

function closeNavMenu() {
    const nav = document.getElementById('mobileNav');
    const button = document.getElementById('menu');
    if (!nav || !button) return;

    nav.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation menu');
}

function toggleMenu() {
    const button = document.getElementById('menu');
    if (!button) return;

    if (button.getAttribute('aria-expanded') === 'true') {
        closeNavMenu();
    } else {
        openNavMenu();
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        const button = document.getElementById('menu');
        if (button && button.getAttribute('aria-expanded') === 'true') {
            closeNavMenu();
            button.focus();
        }
    }
});

document.addEventListener('click', event => {
    const nav = document.getElementById('mobileNav');
    const button = document.getElementById('menu');
    if (nav && button && !nav.hidden && !nav.contains(event.target) && !button.contains(event.target)) {
        closeNavMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 800) closeNavMenu();
});
