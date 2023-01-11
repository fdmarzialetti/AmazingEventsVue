const { createApp } = Vue

createApp({
    data() {
        return {
            events:[],
            searchValue:"",
            categoryList:[],
            eventsFiltered:[],
            checkeds:[],
            noMatchesFoundMsg:false
        }
    },
    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
        .then(response=>response.json())
        .then(data=>{
            switch(document.getElementById("tittle").innerHTML){
                case "Home": 
                    this.events=data.events 
                break;
                case "Upcomming Events": 
                    this.events=data.events.filter(e=>e.date>=data.currentDate)
                break;
                case "Past Events": 
                    this.events=data.events.filter(e=>e.date<data.currentDate)
                break;
                }
            this.categoryList=Array.from(new Set(this.events.map(e=>e.category)))
            this.eventsFiltered=this.events
        })
    },
    methods:{
        applyFilter: function(){
            let filterBySearch = this.events.filter(e=>e.name.toLowerCase().includes(this.searchValue.toLowerCase()))
            if(this.checkeds.length===0){
                this.eventsFiltered = filterBySearch;
            }else{
                let filterByCheckbox = filterBySearch.filter(e=>this.checkeds.includes(e.category))
                this.eventsFiltered=filterByCheckbox
            } 
            if(this.eventsFiltered.length===0){
                this.noMatchesFoundMsg=true
            }else{
                this.noMatchesFoundMsg=false
            }
        }       
    }
}).mount('#app')