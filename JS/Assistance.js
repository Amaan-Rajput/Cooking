
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
    massageInput.style.textTransform = "capitalize";
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
