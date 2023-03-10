const { createApp } = Vue

createApp({
    data() {
        return {
            pathname:"",
            events: [],
            searchValue: "",
            categoryList: [],
            eventsFiltered: [],
            checkeds: [],
            favEvents:[],
            loadData:false,
            failPromise:null
        }
    },
    created() {
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(response => response.json())
            .then(data => {
                this.failPromise=false
                this.pathname = location.pathname
                this.events = this.eventsByTittlePage(document.getElementById("tittle").innerHTML, data)
                this.categoryList = Array.from(new Set(this.events.map(e => e.category)))
                this.eventsFiltered = this.events
                this.loadData=true
                if(localStorage.getItem("favEvents")){
                    this.favEvents=JSON.parse(localStorage.getItem("favEvents"))
                }
            })
            .catch(err=>this.failPromise=true)
    },
    methods: {
        applyFilter: function () {
            let filterBySearch = this.events.filter(e => e.name.toLowerCase().includes(this.searchValue.toLowerCase()))
            if (this.checkeds.length === 0) {
                this.eventsFiltered = filterBySearch;
            } else {
                let filterByCheckbox = filterBySearch.filter(e => this.checkeds.includes(e.category))
                this.eventsFiltered = filterByCheckbox
            }
        },
        eventsByTittlePage: function (tittle, data) {
            switch (tittle) {
                case "Home":
                    return data.events
                case "Upcomming Events":
                    return data.events.filter(e => e.date >= data.currentDate)
                case "Past Events":
                    return data.events.filter(e => e.date < data.currentDate)
            }
        },
        addToFavorite:function(event){
            if(this.favEvents.some(f=>f._id===event._id)){
                this.favEvents=this.favEvents.filter(f=>f._id!==event._id)
                localStorage.setItem("favEvents", JSON.stringify(this.favEvents));
            }else{
                this.favEvents.push(event)
                localStorage.setItem("favEvents", JSON.stringify(this.favEvents));
            }
        }
    }
}).mount('#app')