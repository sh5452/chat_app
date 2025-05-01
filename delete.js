
async function deleteMessage(messageId) {
    console.log('Deleting message with ID:', messageId);
    try {
        const res = await fetch(`https://chat-app-8qzs.onrender.com/api/chat/${messageId}`, {
            method: 'DELETE'
        });

        if (res.ok || res.status === 404) {
            const messageDiv = document.getElementById(`message-${messageId}`);
            if (messageDiv) {
                messageDiv.remove();
            }
            Swal.fire('ההודעה נמחקה', 'ההודעה כבר לא קיימת', 'success');
        } else {
            throw new Error('שגיאה במחיקת ההודעה');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('שגיאה', 'אירעה שגיאה במחיקת ההודעה', 'error');
    }
}