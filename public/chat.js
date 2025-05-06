let lastMessageId=0;

function  fetchMessages(){
fetch('https://chat-app-8qzs.onrender.com/api/chat/')
.then(response => response.json())
.then(data=>{
data.forEach(message=>{
    if(message.id>lastMessageId){
        addMessageToChat(message.Name,message.Message,false,message.ID)
        lastMessageId=message.id
    }
})
})
}
setInterval(fetchMessages,3000)