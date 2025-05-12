function fetchMessages() {

    console.log("🔁 מנסה לשלוח fetch"); // בדיקה
    fetch("https://chat-app-8qzs.onrender.com/api/chat") 
        .then(response => response.json())
        .then(messages => {
            console.log("📦 הודעות מהשרת:", messages); // בדיקה
            const chatMessages = document.getElementById("chat-messages");
            chatMessages.innerHTML = ''; // ננקה קודם את ההודעות
            messages.forEach(msg => {
    console.log("🧾 הודעה:", msg); // הדפיסי כל הודעה שמגיעה
    console.log("🔍 msg.ID:", msg.ID);
    const isMyMessage = msg.name === userName;
    addMessageToChat(msg.name, msg.message, isMyMessage, msg.ID);
});
        })
        .catch(error => console.error('שגיאה בקבלת ההודעות:', error));
}


setInterval(fetchMessages, 3000);


fetchMessages();