const clerkImage = document.getElementById('clerk-image');
const speechText = document.getElementById('speech-text');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');

const cart = [];
const prices = {
  牛奶: 30,
  餅乾: 21,
  糖果: 10,
  飲料: 25,
  泡麵: 35,
};

let waitingForResponse = false; // 是否正在等待用戶回應
let responseTimeout; // 記錄計時器變數

// 初始化語音辨識與語音合成
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'zh-TW';
recognition.continuous = true; // 持續運行
recognition.interimResults = false; // 僅返回完整結果

// 說話功能
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  clerkImage.src = 'B.gif'; // 切換為說話圖片
  window.speechSynthesis.speak(utterance);

  utterance.onend = () => {
    clerkImage.src = 'A.png'; // 說完話切換回靜態圖片
    if (!waitingForResponse) {
      recognition.start(); // 確保說話後啟動語音辨識
    }
  };
}

// 開始語音辨識
function startRecognition() {
  waitingForResponse = true; // 設置為等待用戶回應
  speak('歡迎光臨，請問需要購買什麼？');
  startResponseTimeout(); // 啟動計時器
}

// 處理語音輸入
recognition.onresult = (event) => {
  clearTimeout(responseTimeout); // 清除計時器
  const speechResult = event.results[event.results.length - 1][0].transcript.trim();
  console.log('使用者說:', speechResult);

  if (prices[speechResult]) {
    // 若辨識到商品名稱
    cart.push(speechResult);
    const itemPrice = prices[speechResult];
    cartItems.innerHTML += `<div><img src="${speechResult}.png" alt="${speechResult}"> ${speechResult} - ${itemPrice} 元</div>`;
    const total = cart.reduce((sum, item) => sum + prices[item], 0);
    totalPrice.textContent = `總計：${total} 元`;
    speak(`這是你的${speechResult}，還需要購買什麼？`);
    startResponseTimeout(); // 重置計時器
  } else if (speechResult.includes('沒了') || speechResult.includes('夠了') || speechResult.includes('結帳')) {
    // 若辨識到結帳指令
    const total = cart.reduce((sum, item) => sum + prices[item], 0);
    speak(`總共是${total}元。謝謝購物！`);
    recognition.stop(); // 停止語音辨識
    waitingForResponse = false;
  } else {
    // 無法辨識的輸入
    speak('抱歉，我沒有聽懂，請再說一次。');
    startResponseTimeout(); // 重置計時器
  }
};

// 啟動計時等待回應
function startResponseTimeout() {
  clearTimeout(responseTimeout); // 確保清除舊的計時器
  responseTimeout = setTimeout(() => {
    if (waitingForResponse) {
      speak('抱歉，我沒有聽到您的需求，請再說一次。');
      startResponseTimeout(); // 重新開始計時
    }
  }, 60000); // 等待 60 秒
}

// 處理辨識錯誤
recognition.onerror = (event) => {
  console.error('語音辨識錯誤:', event.error);
  speak('抱歉，語音功能出現問題，請再試一次。');
};

// 啟動語音功能
window.onload = () => {
  window.setTimeout(() => {
    speak('歡迎光臨，請問需要購買什麼？');
  }, 1000); // 延遲 1 秒啟動
};