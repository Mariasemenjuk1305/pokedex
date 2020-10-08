let pokeName = [];
let pokeUrl = [];
let info = [];
let pokeAll = document.getElementsByClassName("poke");
let start = 0;
let end = 12;
console.log(info);
//------------------------start request for paintig DOM-------

let requestAll = new Promise((resolve, reject) => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=999", {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            mode: "cors",
            credentials: "same-origin"
        })
        .then(data => {
            resolve(data.json());
        })
        .catch((err) => {
            console.log("ERROR:", err.message);
        })
});


function reciveRequests() {
    requestAll.then(data => {
        data.results.map(element => {
            pokeName.push(element.name);
            pokeUrl.push(element.url);
        });
    }).then(function () {
        requestDetails(start, end);
    })
}



function requestDetails(start, end) {
    for (let i = start; i <= end; i++) {
        fetch(pokeUrl[i], {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                mode: "cors",
                credentials: "same-origin"
            })
            .then(data => {
                return data.json();
            })
            .then((data) => {
                addToHTML(data, i);
                info.push(data);
                clickToElement()
            })
            .catch((err) => {
                console.log("ERROR:", err.message);
            })
    }
}


function addToHTML(data, index) {
    let box = document.querySelector(".poke-box");
    box.innerHTML += `<div class="poke">
                            <div class="poke-img">
                                <img class="photo" src=${data.sprites.front_default} alt="img">
                            </div>
                            <div class="poke-name">${pokeName[index]}</div>
                            <div class="poke-skills">
                                <span>${data.abilities[0].ability.name}</span>
                                <span>${data.abilities[1].ability.name}</span>
                           </div>
                        </div>`


}


//------------------------painting details of some one pokemon------------------

function showDetailsAboutOne(index) {
    let boxDetails = document.querySelector(".poke-details");
    boxDetails.innerHTML = '';
    let out = '';
    let id = info[index].id;
    if (id < 10) {
        id = '00' + id;
    } else if (id < 100) {
        id = '0' + id;
    } else if (id < 99) {
        id = id;
    }
    let power = info[index].stats;
    for (let k = 0; k < power.length; k++) {
        out += `<tr>
                  <td>${power[k].stat.name}</td>
                  <td>${power[k].base_stat}</td>
                </tr>`
    }

    boxDetails.innerHTML = `<div class="details-block">
                                <span class='close'>X</span>
                                <div class="details-block-data">
                                    <img src=${info[index].sprites.front_default} alt="img">
                                    <div class="poke-details-name">${info[index].name} #${id}</div>
                                    <table>
                                        <tr>
                                            <td>Type</td>
                                            <td>Fire</td>
                                        </tr>
                                        ${out}
                                        <tr>
                                            <td>Weight</td>
                                            <td>${info[index].weight}</td>
                                        </tr>
                                        <tr>
                                            <td>Total moves</td>
                                            <td>${info[index].base_experience}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>`
}

function clickToElement() {
    for (let i = 0; i < pokeAll.length; i++) {
        pokeAll[i].onclick = () => {
            showDetailsAboutOne(i)
            smallScreen();
        }
    }
}

//------------------------------------script for change view pokemon`s details-----
function smallScreen() {
    document.querySelector(".poke-details").style.display = "block";
    if (window.innerWidth < 800) {
        document.querySelector(".poke-details").style.display = "block";
        document.querySelector(".close").style.display = "block";
        document.querySelector(".poke-big").style.display = "none";
    }
}

function close(){
    document.querySelector(".poke-details").style.display = "none";
    document.querySelector(".poke-details").innerHTML = '';
    document.querySelector(".poke-big").style.display = "flex";
    document.querySelector(".close").style.display = "none";
}

document.querySelector(".close").addEventListener("click", close);
document.querySelector(".poke-details").addEventListener("click", close);

 

//------------------------select by type----------------------------------------

document.getElementById("select").onchange = () => {
    let box = document.querySelector(".poke-box");
    let select = document.getElementById("select");
    box.innerHTML = '';
    for(let i=0; i<info.length; i++){
        info[i].types.forEach(element => {
            if (element.type.name == select.value) {
                box.innerHTML += `<div class="poke">
                <div class="poke-img">
                    <img class="photo" src=${info[i].sprites.front_default} alt="img">
                </div>
                <div class="poke-name">${info[i].name}</div>
                <div class="poke-skills">
                    <span>${info[i].abilities[0].ability.name}</span>
                    <span>${info[i].abilities[1].ability.name}</span>
                 </div>
            </div>`
            }
    
        });
    }
   
}

//----------------------------show more pokemon---------------------------------

function loadMore() {
    start += 12;
    end += 12;
    reciveRequests();
}

document.getElementById("loadMore").addEventListener("click", loadMore);

reciveRequests();