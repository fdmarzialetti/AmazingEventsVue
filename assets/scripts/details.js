const { createApp } = Vue

createApp({
    data() {
        return {
            event: undefined,
            backPathname: "",
            idCard: "",
            loadData:false
        }
    },
    created() {
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
            .then(response => response.json())
            .then(data => {
                this.backPathname = new URLSearchParams(location.search).get("backPathname")
                this.idCard = new URLSearchParams(location.search).get("id")
                this.event = data.events.find(e => e._id === this.idCard)
                this.loadData=true
            })
    }
}).mount('#app')
