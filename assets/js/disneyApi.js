//Global variabler
let myPage = 1;
const myAppElement = document.getElementById('app');
const MickeyMouseURI = "4703";

///////ENTRY POINT////////////////////////////////////////////////////////
//Kalder functioner
loadingScreen();
setupShowAllButtons();
setUpSearchForm();
fetchMickeyMouse(MickeyMouseURI);


///////LOADING SCREEN////////////////////////////////////////////////////////
//loadingSreen kaldes hver gang der bliver hentet data(fetch)
function loadingScreen(){
    myAppElement.innerHTML = "<h2>Loading...</h2>";
};


////////////////////////////////////////////////////////////////////////////////
///////SETUP FUNKTIONER////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Sætter en eventlistener på knappen, som hedder showAllButton
//Eventlisteneren sætter den globale variabel myPage til 1 og kalder fetchCharacterPage()
function setupShowAllButtons(){
    let showAllButtons = document.getElementById("showAllButton");
    showAllButtons.addEventListener('click',(e)=>{
        e.preventDefault();
        myPage = 1; 
        fetchCharacterPage();
    });
};

//Sætter en evnetlistener på søg-knappen, som hedder searchButton
//Eventlisteneren tager det som er tastet ind i inputtet(value) og gemmer det i en variabel myValue
//Hvis der er skrevet noget i inputtet, kalder if-statementen fetchSearchName og sender value med.
//Hvis det ikke er skrevet noget i input, sendes en meddelelse med en besked.
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
};

//Bygger tilbage-knappen og næste-knappen og sætter en eventlisteneren på hver af knapperne
//Eventlistenerne tilføjer eller fjerne 1 fra myPage og sender det til fetchCharacterPage
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
};



////////////////////////////////////////////////////////////////////////////////
/////// FETCH MED ID //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Fetcher fra api'et baseret på id fra karakteren. 
//Den er sat til Mickey Mouse til at starte med, men kan ændres med data fra showCharacterPage
//Sender arrays videre til showMickeyMouse
function fetchMickeyMouse(myId, mySender){
    loadingScreen();
   
    fetch(`https://api.disneyapi.dev/characters/${myId}`).then(
        (response)=> {
           // console.log("responce'et vi kan se i console: ", response);
           return response.json();
        }
    ).then(
        (data) => {
           //console.log("Her er data: ", data);
           //send data til en function og kald functionen. 
           showMickeyMouse(data, mySender);
        }
    ).catch( //finder fejl tidligt
       (error) => {
           console.error(error);
        }
    );
};

//Bruger en literal string til at vise navn og billede i DOM
//Switchen laver en tilbage-knap, som har en eventListener der kalder fetchCharacterPage
function showMickeyMouse(data, mySender){
    console.log(mySender);
    myAppElement.innerHTML =    `<h2>Her er ${data.name}</h2> 
                                <img src="${data.imageUrl}" alt="Mickey Mouse">`;
    switch (mySender) {
        case "showCharacterPage":
            let myResultButton = document.createElement('button');
            myResultButton.innerText = "Tilbage";
            myResultButton.classList.add('resultButtonClass');
            myResultButton.addEventListener("click", ()=>{
                fetchCharacterPage();
            });
            myAppElement.appendChild(myResultButton);
            break;
        case "searchResult":
            break;
        default:
            break;
    };
};



/////////////////////////////////////////////////////////////////////////////////////
/////// FETCH ALLE KARAKTERE ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//Fetcher fra api'et baseret på sidetal, hvor myPage bestemmer sidetallet
//Sender dataobjektets arrays videre til showCharacterPage
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
};

//Bygger cards og tilføjer en eventListener, som kalder fetchMickeyMouse og sender id og showCharacterPage med
//Kalder buildNavButtons
function showCharacterPage(myData){
    // console.log("HER: ", myData);
        
    myData.map((myCharecter)=>{
        let myCard = document.createElement("article");
        let myHTML = `<h3>${myCharecter.name}</h3><img src="${myCharecter.imageUrl}">`;
        myCard.innerHTML = myHTML;

        myCard.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('id: ' + myCharecter._id);
            console.log('klik' + e.currentTarget);
            fetchMickeyMouse(myCharecter._id, "showCharacterPage");
        });
        myAppElement.appendChild(myCard);
    });
    buildNavButtons();
};



/////////////////////////////////////////////////////////////////////////////////////
/////// FETCH SØG EFTER NAVN ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

//Fetcher fra api'et baseret på navn, hvor myvalue bestemmer karakterene som bliver vist
//Kalder showSearchName og sender dataobjektets arrays med
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

//Mapper dataen og bygger cards for hvert af karakterene
function showSearchName(myData){
    // console.log("her er data", data);
        let myHTML= "";
        
    myData.map((myCharecter)=>{
        myHTML+= `<h3>${myCharecter.name}</h3><img src="${myCharecter.imageUrl}" <br>`;
    });
    myAppElement.innerHTML = myHTML;
};