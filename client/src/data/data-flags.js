// Uses the MediaWiki API to get a list of requested flags and images



let Flags = {}



// From the title of a page with flags, get the images links, the flag name
Flags.getByPage = async function(page) {
    let requestText = `https://commons.wikimedia.org/w/api.php?action=query&titles=${page}&generator=images&prop=imageinfo&iiprop=url&format=json&origin=*&gimlimit=500`

    let response = await fetch(requestText)
    let data = await response.json()
    console.log(data)

    // Format the data to make it more readable
    let flags = []

    // Go across the pages to take the names of the flags and the links
    for (let page in data.query.pages) {
        let pageData = data.query.pages[page]
        let flagName = pageData.title.replace(/^File:/, '').replace(/^Flag of /, '').replace(/\.svg$/, '').replace(/\.png$/, '').replace(/\.jpg$/, '');
        let flagUrl = pageData.imageinfo[0].url;


        // FILTER - Has to be completed
        // Skip images that are part of the Wikimedia interface
        if (flagUrl.includes('System-search.svg')) {
            continue;
        }

        let flag = {
            name: flagName,
            url: flagUrl
        }
        flags.push(flag)
    }

    return flags;
}

// Get the flags from a Category
// Example : https://commons.wikimedia.org/wiki/Category:SVG_blue_ensigns_of_France
Flags.getByCategory = async function(category) {
    let requestText = `https://commons.wikimedia.org/w/api.php?action=query&titles=Category:${category}&generator=categorymembers&prop=imageinfo&iiprop=url&format=json&origin=*&gcmtype=file&gcmtitle=Category:${category}&gimlimit=150`

    let response = await fetch(requestText)
    let data = await response.json()
    console.log(data)

    // Format the data to make it more readable
    let flags = []

    // Go across the pages to take the names of the flags and the links
    for (let page in data.query.pages) {
        let pageData = data.query.pages[page]
        let flagName = pageData.title.replace(/^File:/, '').replace(/^Flag of /, '').replace(/\.svg$/, '').replace(/\.png$/, '').replace(/\.jpg$/, '');
        let flagUrl = pageData.imageinfo[0].url;

        // FILTER - Has to be completed
        // Skip images that are part of the Wikimedia interface
        if (flagUrl.includes('System-search.svg')) {
            continue;
        }

        let flag = {
            name: flagName,
            url: flagUrl
        }
        flags.push(flag)
    }

    return flags;
}

// Get the list ofd sections of a page
Flags.getSections = async function(page) {
    let requestText = `https://commons.wikimedia.org/w/api.php?action=parse&page=${page}&prop=sections&format=json&origin=*&gimlimit=150`

    let response = await fetch(requestText)
    let data = await response.json()
    console.log(data.parse.sections)

    return data.parse.sections;
}

// Get the flags in a list of sections
Flags.getSortedBySection = async function(page) {
    let requestText = `https://commons.wikimedia.org/w/api.php?action=parse&page=${page}&prop=sections|images&format=json&origin=*&gimlimit=150`

    let response = await fetch(requestText)
    let data = await response.json()
    console.log(data)

    // Format the data to make it more readable
    let flags = {}

    // Go across the sections to take the names of the flags and the links
    for (let section of data.parse.sections) {
        let sectionIndex = section.index
        let sectionTitle = section.line

        let sectionRequestText = `https://commons.wikimedia.org/w/api.php?action=parse&page=${page}&section=${sectionIndex}&prop=images&format=json&origin=*&gimlimit=150`
        let sectionResponse = await fetch(sectionRequestText)
        let sectionData = await sectionResponse.json()

        let imageTitles = sectionData.parse.images.map(image => `File:${image}`).join('|')
        let imageRequestText = `https://commons.wikimedia.org/w/api.php?action=query&titles=${imageTitles}&prop=imageinfo&iiprop=url&format=json&origin=*&gimlimit=150`
        let imageResponse = await fetch(imageRequestText)
        let imageData = await imageResponse.json()

        let sectionFlags = []

        for (let page in imageData.query.pages) {
            let pageData = imageData.query.pages[page];
            if (!pageData.title || !pageData.imageinfo || !pageData.imageinfo[0].url) {
                continue;
            }
            let flagName = pageData.title.replace(/^File:/, '').replace(/^Flag of /, '').replace(/\.svg$/, '').replace(/\.png$/, '').replace(/\.jpg$/, '').replace(/\.jpeg$/, '');
            let flagUrl = pageData.imageinfo[0].url;

            // FILTER - Has to be completed
            // Skip images that are part of the Wikimedia interface
            if (flagUrl.includes('System-search.svg')) {
                continue;
            }

            let flag = {
                name: flagName,
                url: flagUrl
            }
            sectionFlags.push(flag)
        }

        flags[sectionTitle] = sectionFlags
    }

    console.log(flags)

    return flags;
}


Flags.getPredifinedOptions = async function() {
    const response = await fetch('./src/data/json/predefined.json');
    const options = await response.json();

    return options;
}



export { Flags };
