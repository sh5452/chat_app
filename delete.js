
async function deleteMessage(messageId) {
    try {
        const res = await fetch(`https://chat-app-8qzs.onrender.com/chats/${messageId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            // מחיקת ההודעה מה-DOM
            const messageDiv = document.getElementById(`message-${messageId}`);
            if (messageDiv) {
                messageDiv.remove();
            }
            Swal.fire('ההודעה נמחקה', 'ההודעה נמחקה בהצלחה', 'success');
        } else {
            throw new Error('שגיאה במחיקת ההודעה');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('שגיאה', 'אירעה שגיאה במחיקת ההודעה', 'error');
    }
}