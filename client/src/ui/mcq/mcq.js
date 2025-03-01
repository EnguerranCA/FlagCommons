// Load the template for the quizz zone
const templateFile = await fetch("src/ui/mcq/template.html");
const template = await templateFile.text();

// Load the template for the table of wrong and correct answers
const tableFile = await fetch("src/ui/mcq/table.html");
const tableTemplate = await tableFile.text();

// Load the template for the cells of flags
const cellFile = await fetch("src/ui/mcq/cell.html");
const cellTemplate = await cellFile.text();


let MCQ = {};

// Renders the MCQ zone
MCQ.render = function(destination){
    destination.innerHTML += template;

    MCQ.renderQuestion();
    MCQ.renderTable(destination);
}


// Renders one question and shuffles the answers
MCQ.renderQuestion = function(question){
    if (!question) return;

    const flagImage = document.getElementById("question-image");
    const buttons = document.querySelectorAll(".answer-mcq-button ");

    flagImage.src = question.url;

    let answers = [question.name];
    while (answers.length < 4) {
        let randomFlag = MCQ.flagList[Math.floor(Math.random() * MCQ.flagList.length)];
        if (!answers.includes(randomFlag.name)) {
            answers.push(randomFlag.name);
        }
    }

    answers = answers.sort(() => Math.random() - 0.5);

    buttons.forEach((button, index) => {
        button.textContent = answers[index];
        // Add event listener to the button
        button.onclick = function() {
            // Change the color of the button depending on the answer
            buttons.forEach(btn => {
                if (btn.textContent === question.name) {
                    btn.classList.add("bg-green-500");
                    btn.classList.remove("hover:bg-blue-600");
                    btn.classList.remove("bg-blue-500");

                } else {
                    btn.classList.add("bg-red-500");
                    btn.classList.remove("hover:bg-blue-600");
                    btn.classList.remove("bg-blue-500");

                }
            });

            // Sort the flag in the correct or wrong column of the table
            if (button.textContent === question.name) {
                MCQ.renderCell(question, true);
            } else {
                MCQ.renderCell(question, false);
            }

            // Go to the next question after 1 second
            setTimeout(() => {
                buttons.forEach(btn => {
                    btn.classList.remove("bg-green-500", "bg-red-500");
                    btn.classList.add("hover:bg-blue-600");
                    btn.classList.add("bg-blue-500");
                });
                MCQ.nextQuestion();
            }, 1000);
        }
    });
}

// Starts the MCQ from a list of flags
MCQ.start = function(flagList){
    MCQ.flagList = flagList;
    MCQ.currentQuestionIndex = 0;
    MCQ.renderQuestion(MCQ.flagList[MCQ.currentQuestionIndex]);
}

// Goes to the next question
MCQ.nextQuestion = function(){
    MCQ.currentQuestionIndex++;
    if (MCQ.currentQuestionIndex < MCQ.flagList.length) {
        MCQ.renderQuestion(MCQ.flagList[MCQ.currentQuestionIndex]);
    } else {
        alert("Quiz finished!");
    }
}

// After answering a question, the flag is sorted in a wrong or correct column of a table

// Render the table
MCQ.renderTable = function(destination){
    destination.innerHTML += tableTemplate;
}

// Render a cell in the table
MCQ.renderCell = function(flag, isCorrect){
    let cell = cellTemplate.replace('{{flagName}}', flag.name).replace('{{path}}', flag.url);
    let table = document.getElementById(isCorrect ? "correct-answers" : "wrong-answers");
    table.innerHTML += cell;
}

export {MCQ};