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

    if (result.isConfirmed && messageId) {
        const newText = result.value;
        try {
            console.log("Editing message ID:", messageId);
            const res = await fetch(`https://chat-app-8qzs.onrender.com/api/chat/${messageId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    NAME: userName,
                    MESSAGE: newText,
                    TIME: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const responseData = await res.json();
            console.log("Response status:", res.status);
            console.log("Response body:", responseData);

            if (res.ok) {
                messageContent.textContent = newText;
                Swal.fire('ההודעה עודכנה בהצלחה', 'ההודעה שלך עודכנה', 'success');
            } else {
                throw new Error(responseData.error || 'שגיאה בעדכון ההודעה');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('שגיאה', 'אירעה שגיאה בעדכון ההודעה', 'error');
        }
    }
}