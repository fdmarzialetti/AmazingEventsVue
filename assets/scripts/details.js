const { createApp } = Vue

createApp({
    data() {
        return {
            eventDetail:undefined,
            idCard:""
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(response=>response.json())
        .then(data=>{
            this.idCard=new URLSearchParams(location.search).get("id");
            this.eventDetail=data.events.filter(e=>e._id===this.idCard)
            console.log(idCard)
            console.log(eventDetail)
        })
    }
}).mount('#app')
