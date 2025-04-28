async function editMessage(messageDiv, sender, messageId) {
    if (userName !== sender) {
        Swal.fire('שגיאה', 'אתה יכול לערוך רק את ההודעות שלך', 'error');
        return;
    }

    const messageContent = messageDiv.querySelector('.message-content');
    const currentMessage = messageContent ? messageContent.textContent : '';

    const result = await Swal.fire({
        title: 'ערוך את ההודעה שלך',
        input: 'text',
        inputValue: currentMessage,
        showCancelButton: true,
        confirmButtonText: 'שמור',
        cancelButtonText: 'בטל'
    });

    if (result.isConfirmed && messageId) {  // בדיקה שה-ID תקין
        const newText = result.value;
        try {
            const res = await fetch(`https://chat-app-8qzs.onrender.com/api/db/chats/${messageId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    user: userName,
                    text: newText,
                    time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                messageContent.textContent = newText;
                Swal.fire('ההודעה עודכנה בהצלחה', 'ההודעה שלך עודכנה', 'success');
            } else {
                throw new Error('שגיאה בעדכון ההודעה');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('שגיאה', 'אירעה שגיאה בעדכון ההודעה', 'error');
        }
    }
}
