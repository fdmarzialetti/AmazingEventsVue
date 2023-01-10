//---------------CARDS FUNCTIONS--------------

function addCardTemplate(card){
    return `<div class="col col-md-6 col-lg-3">
                <div class="card mt-0">
                    <img src="${card.image}" alt="${card.name} image">
                    <div class="card-body d-flex flex-column align-items-center justify-content-between">
                        <h5 class="card-title w-100 text-center">${card.name}</h5>
                        <p class="card-text h-100">${card.description}</p>
                        <div class=" card-bottom d-flex justify-content-between align-items-center w-100">
                            <p class="m-0 fw-bold text-align-center">Price $${card.price}</p>
                            <a href="./details.html?id=${card._id}" class="btn btn-danger">View more</a>
                        </div>
                    </div>
                </div>
            </div>`
}

function createTemplateCards(events,currentDate){
    if(!events.length){
        return `<div class="notFoundMsg mt-3 text-center"><h3>No matches found</h3></div>`;
    }
    let pageTittle=document.getElementsByTagName("h1")[0].innerText;
    let template="";
    switch(pageTittle){
        case "Home":{
            for(let e of events){
                template+=addCardTemplate(e);
            }
            return template;
        }
        case "Past Events":{
            for(let e of events){
                if(e.date < currentDate){
                    template+=addCardTemplate(e);
                }
            }
            return template;
        }
        case "Upcomming Events":{
            for(let e of events){
                if(e.date >= currentDate){
                    template+=addCardTemplate(e);
                }
            }
            return template;
        }
    }
}

function renderCards(events,currentDate){
    let cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML=createTemplateCards(events,currentDate);
}

//-----------CHECKBOX/SEARCH FUNCTIONS---------

function filterByCheckbox(data){
    let arrCategories = document.querySelectorAll("input[type=checkbox]:checked")
    arrCategories = Array.from(arrCategories).map(chkCategory=>chkCategory.value)
    if(!arrCategories.length){
        return data.events;
    }  
    let filteredEvents = data.events.filter(event=>arrCategories.includes(event["category"]))
    return filteredEvents; 
    
}

function filterBySearch(events){
    let searchValue = document.getElementById("searchBar").value;
    if(searchValue!==""){
        events=events.filter(e=>e.name.toLowerCase().includes(searchValue.toLowerCase()))
    }
    return events
}

function addCheckboxTemplate(chk){
    return `<input type="checkbox" class="btn-check" id="${chk}" value="${chk}">
    <label class="checkboxProp btn btn-outline-danger rounded-2" for="${chk}">${chk}</label>`
}

function createTemplateCheckbox(categories){
    let template=""
    for(let c of categories){
        template+=addCheckboxTemplate(c);
    }
    return template;
}

function renderCheckbox(data){
    let arrCategories=new Set(data.events.map(e=>e.category))
    let checkboxsContainer=document.getElementsByClassName("btn-group")[0];
    checkboxsContainer.innerHTML=createTemplateCheckbox(arrCategories)
}

//-----------RENDER AND LISTENERS----------------
let url = "https://mindhub-xj03.onrender.com/api/amazing";
fetch(url)
    .then(response=>response.json())
    .then(data=>{
        renderCards(data.events,data.currentDate)
        renderCheckbox(data)
        function applyFilter(){
            renderCards(filterBySearch(filterByCheckbox(data)),data.currentDate);
        }
        document.getElementById("searchBar").addEventListener("input", applyFilter);
        document.getElementById("checkboxGroup").addEventListener("change",applyFilter);
    })
    .catch(err=>console.error(err)) 












