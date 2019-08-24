// scripts to modify default Hugo rendering

window.onload = function () {
    // tables

    var tables = document.querySelectorAll('table');
    tables.forEach(function(el) {
        var tableWrapper = document.createElement('div');
        tableWrapper.classList.add("table-container");
        wrap(el, tableWrapper);
        addClass(el, "table");
    });

    // pre

    var code = document.querySelectorAll('pre code');
    code.forEach(function(el) {
        var codeWrapper = document.createElement('div');
        codeWrapper.classList.add("code-container");
        var clipButton = document.createElement('button');
        clipButton.classList.add("copy-to-clipboard");
        clipButton.classList.add("is-hidden-touch");
        var clipIcon = document.createElement('i');
        clipIcon.classList.add("mdi");
        clipIcon.classList.add("clipboard-icon");
        clipButton.appendChild(clipIcon);
        codeWrapper.appendChild(clipButton);
        wrap(el.parentElement, codeWrapper);
    });
}

function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
}

function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
}
