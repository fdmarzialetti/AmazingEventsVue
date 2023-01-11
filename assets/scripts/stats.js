const { createApp } = Vue

createApp({
    data() {
        return {
            events:[],
            largerCapacity:{},
            lowestPercentage:{},
            higherPercentage:{},
            upcommingStats:[],
            pastStats:[]
        }
    },
    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
        .then(response=>response.json())
        .then(data=>{
            this.events=data.events
            // agrego la propiedad percent a los eventos
            this.events.forEach(e=>e.percent=(e.assistance*100/e.capacity).toFixed(2)) 
             // filtro por eventos con asistencia y ordeno por porcentaje
            let evsByAttPcent=data.events.filter(e=>e.assistance).sort((e1,e2)=>e1.percent-e2.percent)
            // variables de la tabla general
            this.largerCapacity=data.events.sort((e1,e2)=>e2.capacity-e1.capacity)[0]
            this.lowestPercentage=evsByAttPcent[0]
            this.higherPercentage=evsByAttPcent[evsByAttPcent.length-1]

            function accumulator(eventList,accum){
                eventList.forEach(e => {
                    accum.revenues+=(e.estimate?e.estimate:e.assistance)*e.price
                    console.log(accum.revenue)
                    accum.percentArray.push(((e.estimate?e.estimate:e.assistance)*100/e.capacity).toFixed(2))
                });
                return accum
            }
            
            function fillCategoryTable(events,list){
                console.log(events)
                let setCategory= Array.from(new Set(events.map(e=>e.category).sort()))
                setCategory.forEach(category=>{
                    let accum=accumulator(events.filter(e=>e.category===category), {"revenues":0,"percentArray":[]})
                    accum.prom= accum.percentArray.reduce((accum, percent) => accum + percent, 0)/accum.percentArray.length;
                    accum.name=category
                    list.push(accum)
                })
            }
            
            fillCategoryTable(this.events.filter(e=>e.estimate),this.upcommingStats)
            fillCategoryTable(this.events.filter(e=>e.assistance),this.pastStats)
            }
        )
    }
}).mount('#app')



//------------------AUX FUNCTIONS------------------
// function percent(total,percent){
//     return (percent*100)/total;
// }

function typeAudiance(event){
    return event.estimate??event.assistance
}

function filterEventsByDate(tbodyId,data){
    switch(tbodyId){
        case "upcommingStats":
            return data["events"].filter(e=>e.date>=data["currentDate"])
        case "pastStats":
            return data["events"].filter(e=>e.date<data["currentDate"])
    }  
}

function rowTemplate(item1,item2,item3){
    return `<tr>
                <td>${item1}</td>
                <td>${item2}</td>
                <td>${item3}</td>
            </tr>`
}

//-------------GENERAL TABLE FUNCTIONS-------------
function largerCapacityTd(data){
    let eventLgCap=data["events"].sort((e1,e2)=>e2.capacity-e1.capacity)[0]
    return `${eventLgCap.name}: ${eventLgCap.capacity}`
}

function lowerPercentAttendanceTd(data){
    let eventlwPerAtt=data["events"]
    .sort((e1,e2)=>percent(e1.capacity,typeAudiance(e1))-percent(e2.capacity,typeAudiance(e2)))[0]
    return `${eventlwPerAtt.name}: ${percent(eventlwPerAtt.capacity, typeAudiance(eventlwPerAtt)).toFixed(2)}%`
}

function higherPercentAttendanceTd(data){
    let eventhgPerAtt=data["events"]
    .sort((e1,e2)=>percent(e2.capacity,typeAudiance(e2))-percent(e1.capacity,typeAudiance(e1)))[0]
    return `${eventhgPerAtt.name}: ${percent(eventhgPerAtt.capacity, typeAudiance(eventhgPerAtt)).toFixed(2)}%`
}

function fillGeneralTable(data){
    let generalStatsTable = document.getElementById("generalStats")
    generalStatsTable.innerHTML+=rowTemplate(
    higherPercentAttendanceTd(data),
    lowerPercentAttendanceTd(data),
    largerCapacityTd(data)
    )
}

//------PAST AND UPCOMMING TABLES FUNCTIONS--------
function accumulator(eventList,accum){
    eventList.forEach(e => {
        accum.revenue+=e.price*typeAudiance(e)
        accum.percentArray.push(percent(e.capacity,typeAudiance(e)))
    });
    return accum
}

function fillCategoryTable(tbodyContainer,data){
    let eventsByDate = filterEventsByDate(tbodyContainer.id,data)
    let setCategory= Array.from(new Set(eventsByDate.map(e=>e.category).sort()))
    setCategory.forEach(category=>{
        let accum=accumulator(eventsByDate.filter(e=>e.category===category), {"revenue":0,"percentArray":[]})
        let percentTotal= accum.percentArray.reduce((accum, percent) => accum + percent, 0);
        tbodyContainer.innerHTML+=rowTemplate(
            category,
            `$${accum.revenue}`,
            `${(percentTotal/accum.percentArray.length).toFixed(2)}%`
            )
    })
}



