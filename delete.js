async function deleteMessage(messageDiv, sender) {
    if (sender !== userName) {
        Swal.fire('שגיאה', 'אתה יכול למחוק רק את ההודעות שלך', 'error');
        return;
    }

    const result = await Swal.fire({
        title: 'האם אתה בטוח?',
        text: "לא תוכל לשחזר הודעה זו!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'כן, מחק!',
        cancelButtonText: 'ביטול'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://chat-app1-kxa0.onrender.com/${userName}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                messageDiv.remove();
                Swal.fire('נמחק!', 'ההודעה שלך נמחקה.', 'success');
            } else {
                throw new Error('שגיאה במחיקת ההודעה');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('שגיאה', 'אירעה שגיאה במחיקת ההודעה', 'error');
        }
    }
}