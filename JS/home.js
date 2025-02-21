// import
import { fetchData } from "./api.js";
import { some_suggest } from "./api.js";
import { $skeletoncard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

// search_bar
// const $search = document.getElementById('search');
const $search = document.querySelector('[Search]');
const $search_btn = document.getElementById("search-btn");

$search_btn.addEventListener('click', function () {
    if ($search.value)
        window.location = `/COOKING/recipes.html?q=${$search.value}`;
});
// within keyborad
$search.addEventListener("keyup", e => {
    if (e.key == "Enter") {
        $search_btn.click();
    }
});
const recipe_suggest = document.querySelector("[recipe-suggest]");

$search.onkeyup = function () {
    let result = [];
    let input = $search.value;
    if (input.length) {
        result = some_suggest.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    };
    suggest(result);

    if (!result.length) {
        recipe_suggest.innerHTML = '';
    }
};


function suggest(result) {
    const suggests = result.map((list) => {
        return `<li onclick=selectInput(this)> ${list}</li>`;
        
    }).join('');

    recipe_suggest.innerHTML =  "<ul>" + suggests + "</ul>";
};

const $tabBtns = document.querySelectorAll("[Recipe-tab-btn]");
const $tabPanels = document.querySelectorAll("[Recipe-tab-panel]");

let [$lastactiveTabPanel] = $tabPanels;
let [$lastactiveTabBtn] = $tabBtns;

addEventOnElements($tabBtns, "click", function () {
    $lastactiveTabPanel.setAttribute("hidden", "");
    $lastactiveTabBtn.setAttribute("aria-selected", false);
    $lastactiveTabBtn.setAttribute("tabindex", -1);

    const $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
    $currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", 0);

    $lastactiveTabPanel = $currentTabPanel;
    $lastactiveTabBtn = this;
    addTabContent(this, $currentTabPanel)
});

addEventOnElements($tabBtns, "keyup", function (e) {
    const nextElement = this.nextElementSibling;
    const previousElement = this.previousElementSibling;

    if (e.key == "ArrowRight" && nextElement) {
        this.setAttribute("tabindex", -1);
        nextElement.setAttribute("tabindex", 0);
        nextElement.focus();
    } else if (e.key == "ArrowLeft" && previousElement) {
        this.setAttribute("tabindex", -1);
        previousElement.setAttribute("tabindex", 0);
        previousElement.focus();
    } else if (e.key == "Tab") {
        this.setAttribute("tabindex", -1);
        $lastactiveTabBtn.setAttribute("tabindex", 0);
    }
});

const addTabContent = ($currentTabBtn, $currentTabPanel) => {

    const gridList = document.createElement("div");
    gridList.classList.add("grid-list");

    $currentTabPanel.innerHTML = `
    <div class="grid-list">
    ${$skeletoncard.repeat(12)}
    </div>
    `;

    fetchData([['mealType', $currentTabBtn.textContent.trim().toLowerCase()], ...cardQueries], function (data) {
        $currentTabPanel.innerHTML = "";

        for (let i = 0; i < 12; i++) {

            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingTime,
                    uri
                }
            } = data.hits[i];

            const recipeID = (uri.slice(uri.lastIndexOf("_") + 1));
            const isSaved = window.localStorage.getItem(`cookio-recipe${recipeID}`);

            const $card = document.createElement("div");
            $card.classList.add("card");
            $card.style.animationDelay = `${100 * i}ms`;

            $card.innerHTML = `
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
                                        <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" onclick="saveRecipe(this, '${recipeID}')">
                                        <i class='bx bx-bookmarks'></i>
                                        <i class='bx bxs-bookmarks'></i>
                                        </button>
                                    </div>
                                </div>
                                `;

            gridList.appendChild($card);
        }

        $currentTabPanel.appendChild(gridList);

        $currentTabPanel.innerHTML += `
        <a href="./recipes.html?mealType=${$currentTabBtn.textContent.trim().toLowerCase()}" class="btn btn-secondary has-state">Show more</a>
        `;
    });
}

addTabContent($lastactiveTabBtn, $lastactiveTabPanel);

let cuisineType = ["Asian", "French"];

const $slidersections = document.querySelectorAll("[data-slider-section]");

for (const [index, $slidersection] of $slidersections.entries()) {

    $slidersection.innerHTML = `
        <div class="container">
            <h2 class="section-title" id="section-label-1">
                Latest ${cuisineType[index]} Recipes
            </h2>

            <div class="slider">
                <ul class="slider-wrapper" data-slider-wrapper>
                ${`<li class="slider-item">${$skeletoncard}</li>`.repeat(10)}
                </ul>
            </div>
        </div>
    `;

    const $sliderWrapper = $slidersection.querySelector("[data-slider-wrapper]");

    fetchData([...cardQueries, ["cuisineType", cuisineType[index]]], function (data) {
        $sliderWrapper.innerHTML = "";
        data.hits.map(item => {
            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingTime,
                    uri
                }
            } = item;

            const recipeID = (uri.slice(uri.lastIndexOf("_") + 1));
            const isSaved = window.localStorage.getItem(`cookio-recipe${recipeID}`);

            const $sliderItem = document.createElement("li");
            $sliderItem.classList.add("slider-item");

            $sliderItem.innerHTML = `
            <div class="card">
                <figure class="card-media img-holder">
                    <img src="${image}" class="img-cover" alt="${title}" width="195px" height="195px" loading="lazy">
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
                            <button class="icon-btn has-state"><i class='bx ${isSaved ? "bxs-bookmarks" : "bx-bookmarks"}' onclick="saveRecipe(this, '${recipeID}')"></i></button>
                        </div>
                    </div>
            </div>
            `;

            $sliderWrapper.appendChild($sliderItem);

        });
        $sliderWrapper.innerHTML += `
            <li class="slider-item" data-slider-item>
                <a href="./recipes.html?cuisineType=${cuisineType[index].toLowerCase()}" class="load-more has-state">
                    <span class="label">See more</span>
                <i class='bx bxs-chevron-right'></i></a>
            </li>
        `;
    });


};
