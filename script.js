function handleRequest(userInput) {
    const assistantText = document.getElementById("speech-bubble");
    const response = document.getElementById("response");

    let product = "";

    // 調整匹配條件
    if (userInput.includes("牛奶") || userInput.includes("牛")) {
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

    // 顯示商品回應
    shoppingCart.push(product);
    const responseText = `好的，這是您要的${product}。請問還要買什麼商品嗎？`;
    assistantText.innerText = "";
    displayTextLetterByLetter(responseText, "speech-bubble");
    response.innerHTML = `<img src="${product.toLowerCase()}.png" alt="${product}" class="item-image" onerror="imageLoadError('${product.toLowerCase()}.png')">`;
    speakAndWait(responseText, startVoiceRecognition);
    updateCart();
}