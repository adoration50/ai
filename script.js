// script.js
let shoppingCart = [];  // 儲存顧客選擇的商品
const greetingText = "你好，請問您需要購買什麼商品？"; // 啟動問候語

// 網頁載入後執行
window.onload = function () {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            setTimeout(() => {
                playGreeting();
                displayTextLetterByLetter(greetingText, "speech-bubble"); // 啟動文字顯示動畫
            }, 2000);
            startVoiceRecognition();
        })
        .catch(function (error) {
            console.error("無法啟用麥克風:", error);
            alert("請允許麥克風存取，以便進行語音識別！");
        });
};

// 播放語音
function playGreeting() {
    speak(greetingText);
}

// 文字逐字顯示動畫
function displayTextLetterByLetter(text, elementId) {
    const element = document.getElementById(elementId);
    element.innerText = "";
    let index = 0;

    const interval = setInterval(() => {
        if (index < text.length) {
            element.innerText += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 150);
}

// 語音合成
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-TW";
    synth.speak(utterance);
}

// 語音合成並等待完成
function speakAndWait(text, callback) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-TW";

    utterance.onend = () => {
        callback && callback();
    };

    synth.speak(utterance);
}

// 啟動語音識別
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "zh-TW";
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = (event) => {
        const userInput = event.results[0][0].transcript.trim().toLowerCase();
        console.log("語音輸入:", userInput);
        handleRequest(userInput);
    };

    recognition.onerror = (event) => {
        console.error("語音識別錯誤:", event.error);
        speakAndWait("抱歉，無法辨識您的需求，請再試一次。", startVoiceRecognition);
    };

    recognition.onend = () => {
        console.log("語音識別結束，重新啟動");
        startVoiceRecognition();
    };
}

// 處理顧客需求
function handleRequest(userInput) {
    const assistantText = document.getElementById("speech-bubble");
    const response = document.getElementById("response");

    let product = "";
    if (userInput.includes("牛奶")) {
        product = "牛奶";
    } else if (userInput.includes("餅乾")) {
        product = "餅乾";
    } else if (userInput.includes("飲料")) {
        product = "飲料";
    } else if (userInput.includes("便當")) {
        product = "便當";
    } else if (userInput.includes("麵包")) {
        product = "麵包";
    } else if (isEndShoppingRequest(userInput)) {
        finishShopping();
        return;
    } else {
        assistantText.innerText = "抱歉，我無法識別這個商品，請嘗試其他品項。";
        speakAndWait("抱歉，我無法識別這個商品，請嘗試其他品項。", startVoiceRecognition);
        return;
    }

    shoppingCart.push(product);
    const responseText = `好的，這是您要的${product}。請問還要買什麼商品嗎？`;
    assistantText.innerText = "";
    displayTextLetterByLetter(responseText, "speech-bubble");
    response.innerHTML = `<img src="${product.toLowerCase()}.png" alt="${product}" class="item-image" onerror="imageLoadError('${product.toLowerCase()}.png')">`;
    speakAndWait(responseText, startVoiceRecognition);
    updateCart();
}

// 檢查結束購物指令
function isEndShoppingRequest(userInput) {
    const endCommands = ["沒有", "沒了", "結帳", "夠了", "不用了"];
    return endCommands.some(command => userInput.includes(command));
}

// 結束購物
function finishShopping() {
    const assistantText = document.getElementById("speech-bubble");
    const response = document.getElementById("response");

    if (shoppingCart.length > 0) {
        const summaryText = `這次您總共買了 ${shoppingCart.join("、")}。謝謝！`;
        assistantText.innerText = "";
        displayTextLetterByLetter(summaryText, "speech-bubble");
        speak(summaryText);
    } else {
        assistantText.innerText = "您沒有選擇任何商品。";
        speak("您沒有選擇任何商品。");
    }

    response.innerHTML = "";
    shoppingCart = [];
    updateCart();
}

// 更新購物車
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    shoppingCart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        cartItems.appendChild(listItem);
    });
}

// 圖片加載錯誤處理
function imageLoadError(imagePath) {
    console.error(`無法加載圖片：${imagePath}`);
}