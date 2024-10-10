
        async function editMessage(messageDiv,sender) {
            if(userName!==sender){
                swal.fire('you can edit only you`r messages', 'שגיאה', 'error')
                return;
            }

            const messageContent=messageDiv.querySelector('.message-content')
            const currentMessage=messageContent.textContent;

            const result = await Swal.fire({
                title:'edit you`r message',
                input: 'text',
                inputValue: currentMessage,
                showCancelButton: true,
                confirmButtonText: 'save',
                cancelButtonText: 'cancel'
            });
            if(result.isConfirm){
                const newText=result.value
                try {
                    const res = await fetch(`https://chat-app1-kxa0.onrender.com/${user}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            user: userName,
                            text: newText,
                            time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
        
                        }),
                        headers: { 'Content-Type': 'application/json, charset=UTF-8' }
                    })
                    if(res.ok){
                        messageContent.textContent=newText
                        Swal.fire('עודכן!', 'ההודעה עודכנה בהצלחה', 'success');
                    }else{
                        throw new Error('שגיאה בעדכון ההודעה');
                    }
                    
                } catch (error) {
                    
            console.error('Error:', error);
            Swal.fire('שגיאה', 'אירעה שגיאה בעדכון ההודעה', 'error');
                }
            }

         
        
            
        }

       
         
