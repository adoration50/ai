const clerkImage = document.getElementById('clerk-image');
const speechText = document.getElementById('speech-text');

let languageData = {}; // 存放語言檔案內容
let waitingForResponse = false; // 是否等待使用者回應
let responseTimeout; // 記錄計時器變數

// 初始化語音辨識與語音合成
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'zh-TW';
recognition.continuous = true;
recognition.interimResults = false;

// 說話功能
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  speechText.textContent = text; // 同步顯示文字
  clerkImage.src = 'B.gif'; // 切換為說話圖片
  window.speechSynthesis.speak(utterance);

  utterance.onend = () => {
    clerkImage.src = 'A.png'; // 說完話切換回靜態圖片
    if (!waitingForResponse) {
      recognition.start(); // 開啟語音辨識
      startResponseTimeout(); // 啟動計時器等待使用者回應
    }
  };
}

// 啟動計時等待回應
function startResponseTimeout() {
  clearTimeout(responseTimeout); // 確保清除舊的計時器
  responseTimeout = setTimeout(() => {
    if (waitingForResponse) {
      speak(languageData.no_response); // 提示用戶沒回應
      startResponseTimeout(); // 重新啟動計時器
    }
  }, 10000); // 等待 10 秒
}

// 載入語言檔案
function loadLanguageFile() {
  fetch('lang.json')
    .then((response) => response.json())
    .then((data) => {
      languageData = data;
      console.log('語言檔載入成功:', languageData);
      setTimeout(() => {
        speak(languageData.welcome); // 延遲 1 秒後說「歡迎光臨」
      }, 1000);
    })
    .catch((error) => {
      console.error('語言檔載入失敗:', error);
      speechText.textContent = '語言檔載入失敗，請重新整理頁面。';
    });
}

// 初始化
window.onload = () => {
  loadLanguageFile(); // 載入語言檔案
};

// 處理語音辨識結果
recognition.onresult = (event) => {
  clearTimeout(responseTimeout); // 清除等待回應計時器
  const speechResult = event.results[event.results.length - 1][0].transcript.trim();
  console.log('使用者說:', speechResult);

  // 假設處理邏輯：用戶說了商品或其他指令
  if (speechResult) {
    waitingForResponse = false; // 使用者已回應
    speak(`你說的是：${speechResult}`); // 簡單回覆
  }
};

// 處理語音辨識錯誤
recognition.onerror = (event) => {
  console.error('語音辨識錯誤:', event.error);
  speechText.textContent = '語音功能出現問題，請重新整理頁面。';
};