// import
import { fetchData } from "./api.js";
import { some_suggest } from "./api.js";
import { $skeletoncard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

const $accordions = document.querySelectorAll("[data-accordion]");

const initAccortion = function ($element) {
    const $button = $element.querySelector("[data-accortion-btn]");
    let isExpanded = false;

    $button.addEventListener("click", function () {
        isExpanded = isExpanded ? false : true;
        this.setAttribute("aria-expanded", isExpanded);
    });
}
for (const $accordion of $accordions) initAccortion($accordion);

const $filterBar = document.querySelector("[data-filter-bar]");
const $filterTogglers = document.querySelectorAll("[data-filter-toggler]");
const $overlay = document.querySelector("[data-overlay]");

addEventOnElements($filterTogglers, "click", function () {
    $filterBar.classList.toggle("active");
    $overlay.classList.toggle("active");
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = bodyOverflow == "hidden" ? "visible" : "hidden";
});

const $filterClear = document.querySelector("[data-filter-clear]");
const $filterSubmit = document.querySelector("[data-filter-Apply]");
const $filterSearch = $filterBar.querySelector("input[type='search']");

const recipe_suggest = document.querySelector("[recipe-suggest]");

$filterSearch.onkeyup = function () {
    let result = [];
    let input = $filterSearch.value;
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

    // recipe_suggest.innerHTML =  "<ul style="">" + suggests + "</ul>";
    recipe_suggest.innerHTML =  `<ul> ${suggests}</ul>`;
};
$filterSubmit.addEventListener("click", function () {
    const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");

    const queries = [];
    if ($filterSearch.value) queries.push(["q", $filterSearch.value]);

    if ($filterCheckboxes.length) {
        for (const $checkbox of $filterCheckboxes) {
            const key = $checkbox.parentElement.parentElement.dataset.filter;
            queries.push([key, $checkbox.value]);
        }
    }
    window.location = queries.length ? `?${queries.join("&").replace(/,/g, "=")}` : "/COOKING/recipes.html";
});

$filterSearch.addEventListener("keydown", e => {
    if (e.key == "Enter") $filterSubmit.click();
});

$filterClear.addEventListener("click", function () {
    const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");
    $filterCheckboxes?.forEach(elem => elem.checked = false);
    $filterSearch.value &&= "";
});

const qureystr = window.location.search.slice(1);
const queries = qureystr && qureystr.split("&").map(i => i.split("="));

const $filterCount = document.querySelector("[data-filter-count]");
if (queries.length) {
    $filterCount.style.display = "block";
    $filterCount.innerHTML = queries.length;
} else {
    $filterCount.style.display = "none";
}

qureystr && qureystr.split("&").map(i => {
    if (i.split("=")[0] == "q") {
        $filterBar.querySelector("input[type='search']").value = i.split("=")[1].replace(/%20/g, " ");
    } else {
        $filterBar.querySelector(`[value="${i.split("=")[1].replace(/%20/g, " ")}"]`).checked = true;
    }
});

const $filterBtn = document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", e => {
    $filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});

const $gridList = document.querySelector("[data-grid-list]");
const $loadMore = document.querySelector("[data-load-more]");
const defaultQueries = [
    ["mealType", "breakfast"],
    ["mealType", "lunch"],
    ["mealType", "dinner"],
    ["mealType", "snack"],
    ["mealType", "teatime"],
    ...cardQueries
];

$gridList.innerHTML = $skeletoncard.repeat(20);
let nextPageUrl = "";

const renderRecipe = data => {
    data.hits.map((item, index) => {
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
        const $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * index}ms`;
        $card.innerHTML = `
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
                            <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" onclick="saveRecipe(this, '${recipeID}')">
                            <i class='bx bx-bookmarks'></i>
                            <i class='bx bxs-bookmarks'></i>
                            </button>
                    </div>
                </div>
            `;
        $gridList.appendChild($card);
    });
};

let requestedBefore ;

fetchData(queries || defaultQueries, data => {
    const { _links: { next } } = data;
    nextPageUrl = next?.href;
    $gridList.innerHTML = "";
    if (data.hits.length) {
        renderRecipe(data);
    } else {
        $loadMore.innerHTML = `<p class="info-text">No Recipe Found</p>`;
    }
});

const CONTAINER_MAX_WIDTH = 1200;
const CONTAINER_MAX_CARD = 6;

window.addEventListener("scroll", async () => {
    if ($loadMore.getBoundingClientRect().top < window.innerHeight && !requestedBefore && nextPageUrl) {

        $loadMore.innerHTML = $skeletoncard.repeat(Math.round(($loadMore.clientWidth / (CONTAINER_MAX_WIDTH)) * CONTAINER_MAX_CARD));
        requestedBefore = true;

        const response = await fetch(nextPageUrl);
        const data = await response.json();

        const { _links: { next } } = data;
        nextPageUrl = next?.href;

        renderRecipe(data);
        $loadMore.innerHTML = "";
        requestedBefore = false;

        if (!nextPageUrl) $loadMore.innerHTML = `<p class="info-text">No More Recipe</p>`;

    }
});