const { createApp } = Vue

createApp({
    data() {
        return {
            event:undefined,
            idCard:""
            
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(response=>response.json())
        .then(data=>{
            this.idCard=new URLSearchParams(location.search).get("id");
            this.event=data.events.find(e=>e._id===this.idCard)
        })
    }
}).mount('#app')
