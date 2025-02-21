// "use strict";

const $Html = document.documentElement;
const isdark = window.matchMedia("(prefers-color-scheme:dark)").matches;

if (sessionStorage.getItem("thrmr")) {
    $Html.dataset.theme = sessionStorage.getItem("theme");
}else{
    $Html.dataset.theme = isdark ? "dark":"light";
}

let ispressed = false;
const changetheme = function(){
    ispressed = ispressed ?false :true;
    this.setAttribute("aria-pressed", ispressed);
    $Html.setAttribute("data-theme", ($Html.dataset.theme == "light")?"dark":"light");
    sessionStorage.setItem("theme", $Html.dataset.theme)
}

window.addEventListener("load", function(){
    const theme_btn = document.getElementsByClassName("theme-btn")[0]
    theme_btn.addEventListener('click', changetheme)
})