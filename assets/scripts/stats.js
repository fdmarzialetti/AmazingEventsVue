//------------------AUX FUNCTIONS------------------
function percent(total,percent){
    return (percent*100)/total;
}

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

//---------------FILL TABLES-----------------------
let url = "https://mindhub-xj03.onrender.com/api/amazing";

fetch(url)
    .then(response => response.json())
    .then(data => {
        let upcommingTbodyContainer = document.getElementById("upcommingStats")
        let pastTbodyContainer = document.getElementById("pastStats")
        fillGeneralTable(data)
        fillCategoryTable(upcommingTbodyContainer,data)
        fillCategoryTable(pastTbodyContainer,data)
    })
    .catch(err=>console.error(err))

