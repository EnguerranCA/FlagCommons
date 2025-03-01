// Load the template for one flag cell
const templateFile = await fetch("src/ui/gallery/cell.html");
const template = await templateFile.text();

// Load the template for the gallery zone
const galleryFile = await fetch("src/ui/gallery/gallery.html");
const galleryTemplate = await galleryFile.text();


let Gallery = {};

// Render a gallery of flag
Gallery.render = function(flagList){
    // Check the flagList content
    console.log("test" + flagList);

    let galleryContainer = document.createElement('div');
    galleryContainer.classList.add('gallery', 'flex', 'flex-row', 'flex-wrap', 'w-full');

    flagList.forEach(flag => {
        let cell =  template.replace('{{flagName}}', flag.name).replace('{{path}}', flag.url);
        galleryContainer.innerHTML += cell;
    });

    document.body.appendChild(galleryContainer);
}




export {Gallery};