const { createApp } = Vue

createApp({
    data() {
        return {
            events: [],
            largerCapacity: {},
            lowestPercentage: {},
            higherPercentage: {},
            upcommingStats: [],
            pastStats: [],
            loadData: false,
            failPromise:null
        }
    },
    created() {
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(response => response.json())
            .then(data => {
                this.failPromise=false
                this.events = data.events
                this.createGeneralStats()
                this.createCategoryStats(this.events.filter(e => e.estimate), this.upcommingStats)
                this.createCategoryStats(this.events.filter(e => e.assistance), this.pastStats)
                this.loadData = true
            }
            )
            .catch(err=>this.failPromise=true)
    },
    methods: {
        accumulator: function (eventList) {
            let accum = { "revenues": 0, "percentArray": [], "prom": 0 }
            eventList.forEach(e => {
                accum.revenues += (e.estimate ? e.estimate : e.assistance) * e.price
                accum.percentArray.push(((e.estimate ? e.estimate : e.assistance) * 100 / e.capacity))
            });
            accum.prom = accum.percentArray.reduce((accum, percent) => accum + percent, 0);
            accum.prom = (accum.prom / accum.percentArray.length).toFixed(2)
            return accum
        },
        createCategoryStats: function (events, list) {
            let setCategory = Array.from(new Set(events.map(e => e.category).sort()))
            setCategory.forEach(category => {
                let categoryStats = this.accumulator(events.filter(e => e.category === category))
                categoryStats.name = category
                list.push(categoryStats)
            })
        },
        createGeneralStats: function(){
                this.largerCapacity = this.events.sort((e1, e2) => e2.capacity - e1.capacity)[0]
                this.events.forEach(e => e.percent = (e.assistance * 100 / e.capacity).toFixed(2))
                let evsByAttPcent = this.events.filter(e => e.assistance).sort((e1, e2) => e1.percent - e2.percent)
                this.lowestPercentage = evsByAttPcent[0]
                this.higherPercentage = evsByAttPcent[evsByAttPcent.length - 1]
        }
    }
}).mount('#app')