let pokeUrl = [];
let pokeAll = document.getElementsByClassName("poke");
let id;
let start = 0;
let end = 13;
//------------------------start request for paintig DOM-------

let requestFirst = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${start}&offset=${end}`, {
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
    requestFirst.then(data => {
        data.results.map(element => {
            pokeUrl.push(element.url);
        });
    }).then(function () {
        requestDetails(start, end);
    });
}

function requestDetails(start, end) {
    for (let i = start; i < end; i++) {
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
            .then(data => {
                // console.log(data);
                addToHTML(data);
                clickToElement(data);
            })
            .catch((err) => {
                console.log("ERROR:", err.message);
            })
    }
}

function addToHTML(data) {
    let box = document.querySelector(".poke-box");
    box.innerHTML += `<div class="poke" id=${data.id}>
                            <div class="poke-img">
                                <img class="photo" src=${data.sprites.front_default} alt="img">
                            </div>
                            <div class="poke-name">${data.name}</div>
                            <div class="poke-skills">
                                <span>${data.abilities[0].ability.name}</span>
                                <span>${data.abilities[1].ability.name}</span>
                           </div>
                        </div>`
}

//------------------------request for details of some one pokemon------------------
function requesForOne(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`, {
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
            // console.log(data);
            showDetailsAboutOne(data);
        })
        .catch((err) => {
            console.log("ERROR:", err.message);
        })
}

//------------------------painting details of some one pokemon------------------

function showDetailsAboutOne(data) {
    let boxDetails = document.querySelector(".poke-details");
    boxDetails.innerHTML = '';
    let out = '';
    let id = data.id;
    if (id < 10) {
        id = '00' + id;
    } else if (id < 100) {
        id = '0' + id;
    } else if (id < 99) {
        id = id;
    }
    let power = data.stats;
    for (let k = 0; k < power.length; k++) {
        out += `<tr>
                  <td>${power[k].stat.name}</td>
                  <td>${power[k].base_stat}</td>
                </tr>`
    }

    boxDetails.innerHTML = `<div class="details-block">
                                <span class='close'>X</span>
                                <div class="details-block-data">
                                    <img src=${data.sprites.front_default} alt="img">
                                    <div class="poke-details-name">${data.name} #${id}</div>
                                    <table>
                                        <tr>
                                            <td>Type</td>
                                            <td>Fire</td>
                                        </tr>
                                        ${out}
                                        <tr>
                                            <td>Weight</td>
                                            <td>${data.weight}</td>
                                        </tr>
                                        <tr>
                                            <td>Total moves</td>
                                            <td>${data.base_experience}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>`
}

function clickToElement() {
    for (let i = 0; i < pokeAll.length; i++) {
        pokeAll[i].onclick = () => {
            requesForOne(pokeAll[i].id);
            smallScreen();
        }
    }
}


//------------------------select by type----------------------------------------
function sortByType(){
    document.querySelector(".poke-box").innerHTML = '';
    pokeUrl = [];
    if (select.value == "" || select.value == "all"){
        reciveRequests();
    }else{
        byType();

    }
}

function byType() {
    let select = document.getElementById("select");
    start = 0;
    end = 12;
    
    let requestForType = new Promise((resolve, reject) => {
        fetch(`https:pokeapi.co/api/v2/type/${select.value}/`, {
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
            });
    });

    requestForType.then(data => {
        console.log(data);
        for (let i = start; i < end; i++) {
            pokeUrl.push(data.pokemon[i].pokemon.url);
        }
    }).then(function () {
        requestDetails(start, end);
    });

}
document.getElementById("select").addEventListener("change", sortByType);

//------------------------------------script for change view pokemon`s details-----
function smallScreen() {
    document.querySelector(".poke-details").style.display = "block";
    if (window.innerWidth < 800) {
        document.querySelector(".poke-details").style.display = "block";
        document.querySelector(".close").style.display = "block";
        document.querySelector(".poke-big").style.display = "none";
    }
}

function close() {
    document.querySelector(".poke-details").style.display = "none";
    document.querySelector(".poke-details").innerHTML = '';
    document.querySelector(".poke-big").style.display = "flex";
    document.querySelector(".close").style.display = "none";
}

document.querySelector(".close").addEventListener("click", close);
document.querySelector(".poke-details").addEventListener("click", close);




//----------------------------show more pokemon---------------------------------

function loadMore() {
    start += 12;
    end += 12;
    let select = document.getElementById("select");
    if (select.value == "" || select.value == "all"){
        reciveRequests();
    }else{
        byType()
    }
}

document.getElementById("loadMore").addEventListener("click", loadMore);

reciveRequests();