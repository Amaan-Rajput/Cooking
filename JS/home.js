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

// Assistance Code

const chatbotIcon = document.querySelector(".chatbot-icon");
const chatbot = document.querySelector(".chatbot");
const chatclose = document.querySelector(".chatclose");
const massageInput = document.querySelector(".massage-input");
const chatbotBody = document.querySelector(".chatbot-body");
const chatbotFooter = document.querySelector(".chatbot-footer");
const chatform = document.querySelector(".chat-form");
const fileInput = document.querySelector("#file-input");
const fileUpload = document.querySelector("#file-upload");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancel = document.querySelector("#file-cancel");

const activeChatBot = () => {
    chatbotIcon.classList.toggle('active');
    chatbot.classList.toggle('active');
}
chatbotIcon.addEventListener('click', () => {
    activeChatBot();
    startedmassage();
});
chatclose.addEventListener('click', () => {
    activeChatBot();
    chatbotBody.innerHTML = '';
});

const startedmassage = () => {
    const startmassage = document.createElement('div');
    startmassage.classList.add('ai-massage-box');
    startmassage.innerHTML = `<img src="./robo.png" class="profile-pic" alt="" srcset="">
                <div class="ai-massage preload ">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>`;
    setTimeout(() => {
        startmassage.innerHTML = `<img src="./robo.png" class="profile-pic" alt="" srcset="">
                <div class="ai-massage started">
                    <p>Hi 👋</p>
                    <p>I am Ava, Virtual assistant for all services what you need </p>
                    <p>So, how can I help you</p>
                    </div>`;
        SeeNewMassage();
    }, 1000);
    chatbotBody.appendChild(startmassage);
}
const API_KEY = "AIzaSyDIcR_CP8ydqwGk4kz4IU9Ljhqdce9LxqY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const UsermassageData = {
    massage: null,
    file: {
        data: null,
        mime_type: null
    }
}
const SeeNewMassage = () => {
    chatbotBody.scrollTop += 9999999;
}

const UsermassageOut = (e) => {
    e.preventDefault();
    UsermassageData.massage = massageInput.value.trim();
    fileUploadWrapper.classList.remove('file-upload');
    massageInput.style.height = "";
    chatform.style.height = "";
    const massage = document.createElement('div');
    massage.classList.add('user-massage');
    massage.innerHTML = `<div class="area"></div>
    ${UsermassageData.file.data ? `<img src="data:${UsermassageData.file.mime_type};base64,${UsermassageData.file.data}" class="userupimage" />` : ""}`;
    massage.querySelector('.area').textContent = UsermassageData.massage;
    massageInput.value = null;
    chatbotBody.appendChild(massage);
    AImassagein();
    SeeNewMassage();
}

massageInput.addEventListener("keydown", (e) => {
    const Usermassage = e.target.value.trim();
    if (e.key === "Enter" && Usermassage) {
        UsermassageOut(e)
        massageInput.value = null;
        document.body.classList.remove('show-emoji-picker');
    }
});

const inputInitHeight = massageInput.scrollHeight;

massageInput.addEventListener('input', () => {
    massageInput.style.height = `${inputInitHeight}px`;
    massageInput.style.height = `${massageInput.scrollHeight}px`;
    massageInput.style.maxHeight = "50px";
    chatform.style.height = `${inputInitHeight + 7}px`;
    chatform.style.height = `${massageInput.scrollHeight + 7}px`;
    chatform.style.maxHeight = "54px";
});

const SendBtn = document.querySelector('#Send');

SendBtn.addEventListener('click', (e) => UsermassageOut(e))

async function generateBotmassage(massagein) {

    const massageicmEle = massagein.querySelector('.ai-massage');

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: UsermassageData.massage }, ...(UsermassageData.file.data ? [{ inline_data: UsermassageData.file }] : [])]
            }]
        })
    }
    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.massage);
        const apiresponseed = data.candidates[0].content.parts[0].text.trim();
        massageicmEle.textContent = apiresponseed;
    } catch (error) {
        massageicmEle.textContent = "I got some error please reload     browse";

    } finally {
        UsermassageData.file = {};
        massageicmEle.classList.remove('preload');
    }
}
const AImassagein = () => {
    const massagein = document.createElement('div');
    massagein.classList.add('ai-massage-box');
    massagein.innerHTML = `<img src="./robo.png" class="profile-pic" alt="" srcset="">
                <div class="ai-massage preload">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                </div>`;
    generateBotmassage(massagein);
    SeeNewMassage();
    chatbotBody.appendChild(massagein);
}

const minimizeBtn = document.querySelector('.minimize');

minimizeBtn.addEventListener('click', () => {
    minimizeBtn.classList.toggle('active');
    chatbotBody.classList.toggle('minimized');
    chatbotFooter.classList.toggle('minimized');
})
const picker = new EmojiMart.Picker({
    previewPosition: "none",
    navPosition: "bottom",
    categories: ["frequent", "people", "nature", "foods", "activity", "places", "objects", "symbols"],
    emojiButtonSize: "24",
    emojiSize: "16",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = massageInput;
        massageInput.setRangeText(emoji.native, start, end, "end");
        massageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === 'emoji-picker') {
            document.body.classList.toggle('show-emoji-picker');
        } else {
            document.body.classList.remove('show-emoji-picker');
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);


fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector('img').src = e.target.result;
        fileUploadWrapper.classList.add('file-upload')
        const base64String = e.target.result.split(",")[1];

        UsermassageData.file = {
            data: base64String,
            mime_type: file.type
        }
        fileInput.value = "";
    }

    reader.readAsDataURL(file)
});

fileCancel.addEventListener('click', () => {
    UsermassageData.file = {};
    fileUploadWrapper.classList.remove('file-upload');
})

document.querySelector('#file-upload').addEventListener('click', () => fileInput.click());
