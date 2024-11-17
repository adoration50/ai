const clerkImage = document.getElementById('clerk-image');
const speechText = document.getElementById('speech-text');

let waitingForResponse = false; // 是否等待使用者回應
let responseTimeout; // 記錄計時器變數

// 播放音檔
function playAudio(fileName) {
  const audio = new Audio(fileName);
  audio.play();
  return new Promise((resolve) => {
    audio.onended = resolve; // 當音檔播放結束時觸發
  });
}

// 說話功能
async function speak(text, fileName) {
  speechText.textContent = text; // 同步顯示文字
  clerkImage.src = 'B.gif'; // 切換為說話圖片
  await playAudio(fileName); // 播放音檔

  clerkImage.src = 'A.png'; // 說完話切換回靜態圖片
  if (!waitingForResponse) {
    startListening(); // 開啟語音辨識
  }
}

// 啟動語音辨識（模擬）
function startListening() {
  waitingForResponse = true;
  clearTimeout(responseTimeout); // 清除舊計時器

  // 模擬語音辨識等待
  responseTimeout = setTimeout(() => {
    if (waitingForResponse) {
      speak("沒聽清楚或聲音太小，請嘗試再說一次。", "no_response.mp3");
    }
  }, 10000); // 等待 10 秒
}

// 初始化
window.onload = () => {
  setTimeout(() => {
    speak("歡迎光臨，請問需要購買什麼？", "welcome.mp3"); // 延遲 1 秒後播放歡迎語音
  }, 1000);
};