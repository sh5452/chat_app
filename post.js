

async function sendMessage() {
    const message = document.getElementById('message-input').value.trim();
    if (message && userName) {
        try {
            const res = await fetch('https://chat-app1-kxa0.onrender.com/chat', {
                method: "POST",
                body: JSON.stringify({
                    name: userName,
                    message: message,
                    time: new Date().toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit'})
                }),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            });
            if (res.ok) {
                addMessageToChat(userName, message, new Date().toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit'}));
                document.getElementById('message-input').value = '';
            } else {
                throw new Error('error sending message');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('שגיאה', 'אירעה שגיאה בשליחת ההודעה', 'error');
        }
    } else if (!userName) {
        Swal.fire('שגיאה', 'אנא הגדר את שמך', 'error');
    }
}