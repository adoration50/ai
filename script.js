function playAudio(fileName) {
  const audio = new Audio(fileName);
  audio.play();
}

// 修改說話功能
function speak(text, fileName) {
  speechText.textContent = text; // 同步顯示文字
  clerkImage.src = 'B.gif'; // 切換為說話圖片
  playAudio(fileName); // 播放音檔

  // 等待音檔播放完畢後切回靜態圖片
  setTimeout(() => {
    clerkImage.src = 'A.png';
    if (!waitingForResponse) {
      recognition.start(); // 開啟語音辨識
      startResponseTimeout(); // 啟動計時器等待使用者回應
    }
  }, 3000); // 修改此時間為音檔長度
}

// 撥放「歡迎光臨」
setTimeout(() => {
  speak(languageData.welcome, 'welcome.mp3'); // 撥放歡迎語音檔
}, 1000);