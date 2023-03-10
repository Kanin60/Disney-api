//micky mouse = 4703
//Global variabler
let myPage = 1;
const myAppElement = document.getElementById('app');
const MickeyMouseURI = "https://api.disneyapi.dev/characters/4703";

//Kalder functioner - entry point
loadingScreen();
setupShowAllButtons();
setUpSearchForm();
fetchMickeyMouse();

//loadingSreen kaldes hver gang der bliver hentet data(fetch)
function loadingScreen(){
    myAppElement.innerHTML = "<h2>Loading...</h2>";
};

function setupShowAllButtons(){
    let showAllButtons = document.getElementById("showAllButton");
    showAllButtons.addEventListener('click',(e)=>{
        e.preventDefault();
        myPage = 1; 
        fetchCharacterPage();
    });
    
}
function setUpSearchForm(){

    let searchButton = document.getElementById("searchButton");

    searchButton.addEventListener('click',(e)=>{
        e.preventDefault();
        let searchInput = document.getElementById("searchInput");
        let myValue = searchInput.value;
        
        if(myValue){
            console.log(' vi har en string: ', myValue);
            fetchSearchName(myValue);
        } else{
            alert("Skriv navnet i søgefeltet");
        }
    });
}

function fetchCharacterPage(){
    console.log('fetchCharacterPage');
    loadingScreen();

    const sideApi = `https://api.disneyapi.dev/characters?page=${myPage}`;

    fetch(sideApi).then(
        (response)=> {
           // console.log("responce'et vi kan se i console: ", response);
           return response.json();
        }
    ).then(
        (data) => {
        //    console.log("Her er data: ", data);
           //send data til en function og kald functionen. 
           showCharacterPage(data.data);
        }
    ).catch( //finder fejl tidligt
       (error) => {
           console.error(error);
        });
}
function showCharacterPage(myData){
    // console.log("HER: ", myData);
    let myHTML= "";
        
    myData.map((myCharecter)=>{
        myHTML+= `<h3>${myCharecter.name}</h3><img src="${myCharecter.imageUrl}"> <br>`;
    });
    myAppElement.innerHTML = myHTML;
    buildNavButtons();
}
function buildNavButtons(){
    let previouslyButton = document.createElement("button");
    previouslyButton.innerHTML = "Tilbage";
    previouslyButton.addEventListener("click", (e) => {
        fetchCharacterPage(myPage--);
    });

    let nextButton = document.createElement("button");
    nextButton.innerHTML = "næste";   
    nextButton.addEventListener("click", (e) => {
        fetchCharacterPage(myPage++);
    });

    myAppElement.appendChild(previouslyButton);
    myAppElement.appendChild(nextButton);

}



async function fetchMickeyMouse(){
    /* Kald loadingScreen()
    Fetch fra api baseret på id=4703: URI https://api.disneyapi.dev/characters/4703 
    Hvis vi har data, så kald showMickyMouse(data) med det data vi har fået. 
    Hvis vi ikke har data så vis bruger at der gik noget galt: kald showError med en (”fejl 40”) - mangler i flowchart */
    loadingScreen();
    await new Promise(resolve => setTimeout(resolve, 1000))
   
   
    fetch(MickeyMouseURI).then(
        (response)=> {
           // console.log("responce'et vi kan se i console: ", response);
           return response.json();
        }
    ).then(
        (data) => {
        //    console.log("Her er data: ", data);
           //send data til en function og kald functionen. 
           showMickeyMouse(data);
        }
    ).catch( //finder fejl tidligt
       (error) => {
           console.error(error);
        }
    );
};

function showMickeyMouse(data){
    myAppElement.innerHTML =    `<h2>Her er ${data.name}</h2> 
                                <img src="${data.imageUrl}" alt="Mickey Mouse">`;
};

function fetchSearchName(myValue){
    loadingScreen();
    const seachApi = `https://api.disneyapi.dev/character?name=${myValue}`;
    console.log("API", seachApi);
    
    fetch(seachApi).then(
        (response)=> {
           // console.log("responce'et vi kan se i console: ", response);
           return response.json();
        }
    ).then(
        (data) => {
           console.log("Her er data: ", data);
           //send data til en function og kald functionen. 
           showSearchName(data.data);
        }
    ).catch( //finder fejl tidligt
       (error) => {
           console.error(error);
        }
    );
};

function showSearchName(myData){
    // console.log("her er data", data);
        let myHTML= "";
        
    myData.map((myCharecter)=>{
        myHTML+= `<h3>${myCharecter.name}</h3><img src="${myCharecter.imageUrl}" <br>`;
    });
    myAppElement.innerHTML = myHTML;

};