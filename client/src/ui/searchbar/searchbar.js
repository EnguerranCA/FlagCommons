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
    Searchbar.pageName = url.pathname.split("/").pop();

    console.log(Searchbar.pageName);

    // Clear the content of the gallery and the table if the quiz has started
    if (MCQ.started) {
        Gallery.clear(document.getElementById("gallery"));
        MCQ.clearTable(document.getElementById("mcq"));
    }

    // Render the filters that are the name of the sections of the page
    Searchbar.renderFilters(await Flags.getSections(Searchbar.pageName));


    // Check if the page is a category to adapt the request
    if (Searchbar.pageName.includes("Category:")){
        Searchbar.pageName = Searchbar.pageName.replace("Category:", "");
        MCQ.start(await Flags.getByCategory(Searchbar.pageName));
        Gallery.render(document.getElementById("gallery"),await Flags.getByCategory(Searchbar.pageName));
    } else {
        MCQ.start(await Flags.getByPage(Searchbar.pageName));
        Gallery.render(document.getElementById("gallery"),await Flags.getByPage(Searchbar.pageName));
    }

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

// Render the filters
Searchbar.renderFilters = function(sections){
    //Clear the filters
    document.getElementById("filters-list").innerHTML = ""; 
    let filters = document.getElementById("filters-list");

    sections.forEach(section => {
        let filterElement = document.createElement("div");
        filterElement.classList.add("filter-sort");

        let labelElement = document.createElement("label");
        labelElement.classList.add("inline-flex", "items-center");

        let checkboxElement = document.createElement("input");
        checkboxElement.type = "checkbox";
        checkboxElement.classList.add("form-checkbox");
        checkboxElement.onclick = function(){
            Searchbar.updateFilters();
        };

        let spanElement = document.createElement("span");
        spanElement.classList.add("ml-2");
        spanElement.textContent = section.line;

        labelElement.appendChild(checkboxElement);
        labelElement.appendChild(spanElement);
        filterElement.appendChild(labelElement);
        filters.appendChild(filterElement);
    });
}

// Update the filters, when one is checked or unchecked, the gallery and the table are updated accordingly
Searchbar.updateFilters = async function(){
    // Replace the image of the MCQ with a loader
    document.getElementById("question-image").src = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif";

    // Get the checked filters
    let filters = document.querySelectorAll(".filter-sort input");
    let checkedFilters = Array.from(filters).filter(filter => filter.checked).map(filter => filter.nextSibling.textContent);

    // Get the flags of the page
    let allSectionsFlags = await Flags.getSortedBySection(Searchbar.pageName);
    let filteredFlags = [];

    // Get the flags that are in the checked sections
    checkedFilters.forEach(section => {
        if (allSectionsFlags[section]) {
            filteredFlags = filteredFlags.concat(allSectionsFlags[section]);
        }
    });

    console.log("filtered flags",filteredFlags);
    
    // Clear the gallery and the table
    Gallery.clear(document.getElementById("gallery"));
    MCQ.clearTable(document.getElementById("mcq"));

    // Render the gallery and the table
    Gallery.render(document.getElementById("gallery"), filteredFlags);
    MCQ.start(filteredFlags);

}


export {Searchbar};