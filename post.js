async function sendMessage(){
    const message=document.getElementById('message-input').value.trim()
    if(message&&userName){
        try {
            const res= await fetch('https://chat-app1-kxa0.onrender.com/', {
                method:"POST",
                body:JSON.stringify({
                    name:userName,
                    message:message,
                    time:new Date().toLocaleTimeString('he-LI', {hour:'2-digit',minute:'2-digit'})
                }),
                headers: { 'Content-Type': 'application/json, charset=UTF-8' }
                
            })
            if(res.ok){
               addMessageToChat(userName,message,new Date().toLocaleTimeString('he-LI',{ hour:'2-digit', minute:'2-digit'}))
               document.getElementById('input-message').innerHTML=''
            }else{
                new Error('error sending message')
            }
            
        } catch (error) {
            console.log('error');
            
        }
    }else if (!userName) {
        swal.fire('please set you`r name','error','שגיאה')
    }
 
}