import { Flags } from "../../data/data-flags.js";
import { Gallery } from "../gallery/gallery.js";
import { MCQ } from "../mcq/mcq.js";

// Load the template for the quizz zone
const templateFile = await fetch("src/ui/searchbar/searchbar.html");
const template = await templateFile.text();


let Searchbar = {};

// Analyze the link and ask the api for the flag list
Searchbar.searchPage = async function(){
    // Get the search value
    let search = document.getElementById("wikimedia-link").value;

    // Parse the link
    let url = new URL(search);
    let pageName = url.pathname.split("/").pop();

    console.log(pageName);

    
    MCQ.start(await Flags.getByPage(pageName));
    Gallery.render(await Flags.getByPage(pageName));
}

// Renders the predefined options in the select element
// Searchbar.renderPredefinedOptions = async function(){
//     let selectElement = document.getElementById("predefined-lists-select");
//     let options = await Flags.getPredifinedOptions();

//     options.forEach(option => {
//         let optionElement = document.createElement("option");
//         optionElement.textContent = option.name;
//         optionElement.setAttribute("data-url", option.url);
//         selectElement.appendChild(optionElement);
//     });

// }

// Renders the Searchbar zone
Searchbar.render = async function(destination){
    let searchbarElement = document.createElement("div");
    searchbarElement.innerHTML = template;
    destination.appendChild(searchbarElement);

    // Render the predefined options
    let selectElement = document.getElementById("predefined-lists-select");
    let options = await Flags.getPredifinedOptions();

    options.forEach(option => {
        let optionElement = document.createElement("option");
        optionElement.textContent = option.name;
        optionElement.setAttribute("data-url", "https://commons.wikimedia.org/wiki/" + option.value);
        selectElement.appendChild(optionElement);
    });
    
    // add event listener to the search button
    document.getElementById("submit-wikimedia-link").addEventListener("click", this.searchPage);

    // add event listener to the predefined search list
    document.getElementById("predefined-lists-select").addEventListener("change", this.setSearch);
}

// Sets the predefined search values from the selected option
Searchbar.setSearch = function(){
    let selectElement = document.getElementById("predefined-lists-select");
    let selectedOption = selectElement.options[selectElement.selectedIndex];
    let optionUrl = selectedOption.getAttribute("data-url");

    // Set the search value to the selected option
    let search = document.getElementById("wikimedia-link");
    search.value = optionUrl;
}




export {Searchbar};