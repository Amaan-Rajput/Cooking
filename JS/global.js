import { fetchData } from "./api.js";


window.addEventOnElements = ($elements, eventType, callback) => {
    for (const $element of $elements) {
        $element.addEventListener(eventType, callback);
    }
}

export const cardQueries = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"],
];

export const $skeletoncard = `
<div class="card skeleton-card">

<div class="skeleton card-banner"></div>

<div class="card-body">
<div class="skeleton card-title"></div>

<div class="skeleton card-text"></div>
</div>
</div>
`;

const ROOT = "https://api.edamam.com/api/recipes/v2";

window.saveRecipe = function (element, recipeID) {
    const isSaved = window.localStorage.getItem(`cooking-recipe${recipeID}`);
    ACCESS_POINT = `${ROOT}/${recipeID}`;

    if (!isSaved) {
        fetchData(cardQueries, function (data) {
            window.localStorage.setItem(`cooking-recipe${recipeID}`, JSON.stringify(data));
            element.classList.toggle('saved');
            element.classList.toggle('removed');
            showNotification("Added to Recipe book");
        });
        ACCESS_POINT = ROOT;
    } else {
        window.localStorage.removeItem(`cooking-recipe${recipeID}`);
        element.classList.toggle('saved');
        element.classList.toggle('removed');
        showNotification("Removed to Recipe book");
    }
}

const $snackbarcontainer = document.createElement("div");
$snackbarcontainer.classList.add("snackbar-container");
document.body.appendChild($snackbarcontainer);

function showNotification(message) {
    const $snackbar = document.createElement("div");
    $snackbar.classList.add("snackbar");
    $snackbar.innerHTML = `<p>${message}</p>`;
    $snackbarcontainer.appendChild($snackbar);
    $snackbar.addEventListener("animationend", e =>    $snackbarcontainer.
        removeChild($snackbar)
    );
};