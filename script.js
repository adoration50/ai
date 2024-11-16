const clerkImage = document.getElementById('clerk-image');
const speechText = document.getElementById('speech-text');
const startButton = document.getElementById('start-button');
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

// 初始化語音功能
const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();
recognition.lang = 'zh-TW';

// 說話功能
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW'; // 設定語言
  clerkImage.src = 'B.gif'; // 切換圖片
  window.speechSynthesis.speak(utterance);
  utterance.onend = () => {
    clerkImage.src = 'A.png'; // 語音結束後恢復
  };
}

// 啟動語音互動
function startInteraction() {
  speak('歡迎光臨，請問需要購買什麼？');
  recognition.start();
}

// 處理語音回應
recognition.onresult = (event) => {
  const speechResult = event.results[0][0].transcript;
  console.log('使用者說:', speechResult);

  if (prices[speechResult]) {
    cart.push(speechResult);
    const itemPrice = prices[speechResult];
    cartItems.innerHTML += `<div><img src="${speechResult}.png" alt="${speechResult}"> ${speechResult} - ${itemPrice} 元</div>`;
    const total = cart.reduce((sum, item) => sum + prices[item], 0);
    totalPrice.textContent = `總計：${total} 元`;
    speak(`這是你的${speechResult}，還需要購買什麼？`);
  } else if (speechResult.includes('沒了') || speechResult.includes('夠了') || speechResult.includes('結帳')) {
    const total = cart.reduce((sum, item) => sum + prices[item], 0);
    speak(`總共是${total}元。謝謝購物！`);
  } else {
    speak('抱歉，我不明白您的需求，請再說一次。');
  }
};

// 瀏覽器限制解決：點擊按鈕啟動語音功能
startButton.addEventListener('click', () => {
  startButton.style.display = 'none'; // 隱藏按鈕
  speechText.textContent = '歡迎光臨！';
  setTimeout(() => {
    startInteraction();
  }, 1000); // 延遲 1 秒後啟動
});

// 檢查瀏覽器支援
if (!('speechSynthesis' in window) || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
  alert('您的瀏覽器不支援語音功能，請使用最新版本的 Chrome 或 Edge。');
}