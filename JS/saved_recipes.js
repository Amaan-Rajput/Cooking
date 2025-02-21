import { getTime } from "./module.js";

const savedRecipes = Object.keys(window.localStorage).filter(item => {
    return item.startsWith("cooking-recipe");
});

console.log(savedRecipes);

const $savedRecipeContainer = document.querySelector("[data-saved-recipes-container]");

$savedRecipeContainer.innerHTML = `
<h2 class="headline-small section-title">All Saved Recipes</h2>
`;

const $gridList = document.createElement("div");
$gridList.classList.add("grid-list");

if (savedRecipes.length) {
    savedRecipes.map((savedRecipe, index) => {
        const {
            recipe: {
                image,
                label: title,
                totalTime: cookingTime,
                uri
            }
        } = JSON.parse(window.localStorage.getItem(savedRecipe));

        const recipeID = (uri.slice(uri.lastIndexOf("_") + 1));
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeID}`);

        const $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * index}ms`;

        $card.innerHTML = 
        `
            <figure class="card-media img-holder">
                <img src="${image}" class="img-cover" alt="${title}" width="195px" height="195px"
                loading="lazy">
            </figure>
            <div class="card-body">
                <h3 class="title-small">
                    <a href="./detail.html?recipe=${recipeID}" class="card-link">${title ?? "Untitled"}</a>
                </h3>

                <div class="meta-wrapper">
                    <div class="meta-item">
                        <i class='bx bx-time-five'></i>
                        <span>${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUniit}</span>
                    </div>
                    <button class="icon-btn has-state ${isSaved ? "removed" : "saved" }" onclick="saveRecipe(this, '${recipeID}')">
                    <i class='bx bxs-bookmarks'></i>
                    <i class='bx bx-bookmarks'></i>
                    </button>
                </div>
            </div>
        `;

        $gridList.appendChild($card);

    });
} else {
    $savedRecipeContainer.innerHTML += `
    <p class="body-large"> You don't saved any recipes!</p>
    `
};

$savedRecipeContainer.appendChild($gridList);
