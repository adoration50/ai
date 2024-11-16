let shoppingCart = [];
const greetingText = "你好，請問您需要購買什麼商品？";

// 頁面載入後顯示按鈕
window.onload = function () {
    document.getElementById("enable-voice-btn").style.display = "block";
    console.log("頁面已加載，語音按鈕顯示。");
};

// 點擊按鈕啟用語音功能
function enableVoice() {
    console.log("嘗試啟用語音功能...");
    speak("語音功能已啟用，現在您可以與虛擬店員互動。");

    // 隱藏按鈕
    document.getElementById("enable-voice-btn").style.display = "none";

    // 播放問候語並啟用語音識別
    playGreeting();
    startVoiceRecognition();
}

// 播放問候語
function playGreeting() {
    console.log("播放問候語音...");
    speak(greetingText);
    displayTextLetterByLetter(greetingText, "speech-bubble");
}

// 使用瀏覽器語音合成功能
function speak(text) {
    if (!window.speechSynthesis) {
        console.error("不支援 SpeechSynthesis。");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-TW";

    utterance.onstart = () => console.log("語音播放開始");
    utterance.onend = () => console.log("語音播放結束");
    utterance.onerror = (e) => console.error("語音播放錯誤:", e);

    window.speechSynthesis.speak(utterance);
}

// 啟用語音識別
function startVoiceRecognition() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        console.error("不支援 SpeechRecognition。");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "zh-TW";
    recognition.interimResults = false;

    recognition.start();
    console.log("語音識別已啟動...");

    recognition.onresult = (event) => {
        const userInput = event.results[0][0].transcript.trim().toLowerCase();
        console.log("語音識別成功：", userInput);
        handleRequest(userInput);
    };

    recognition.onerror = (event) => {
        console.error("語音識別錯誤：", event.error);
        speak("抱歉，無法辨識您的需求，請再試一次。");
    };
}

// 簡單處理輸入
function handleRequest(userInput) {
    if (userInput.includes("牛奶")) {
        speak("好的，這是您要的牛奶。");
    } else {
        speak("抱歉，我無法識別這個商品，請嘗試其他品項。");
    }
}

// 逐字顯示文字
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