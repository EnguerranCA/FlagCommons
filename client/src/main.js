// View imports
import { MCQ } from "./ui/mcq/mcq.js";
import { Gallery } from "./ui/gallery/gallery.js";
import { Searchbar } from "./ui/searchbar/searchbar.js";

// Data imports
import { Flags } from "./data/data-flags.js";
import './index.css';

const MCQSection = document.getElementById("MCQ");
const nav = document.getElementById("nav");

let C = {};

C.init = async function(){
    V.init();
}

let V = {
    
};

V.init = async function(){
    Searchbar.render(nav);
    MCQ.render(MCQSection);
}

V.renderHeader= function(){
}


C.init();