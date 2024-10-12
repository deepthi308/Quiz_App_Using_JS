const API_URL = "http://localhost:3000/questions";

// Requirement:-
// Next button :- Move to Next Question
// Previous button: Move to previous Question
// Option - Select the option

// Getting the HTML elements reference with the help of Document Object Model
let optionsEl = document.querySelectorAll(".option");
let prevEl = document.getElementById("prev");
let nextEl = document.getElementById("next");
let questionContainerEl = document.getElementById("question-answers");
let titleEl = document.getElementById("title");

// Global variable declaration
let questions = [];
let currentQuestion = 1;
let totalQuestions;
let score = 0;
let answers = [];

// To display the question and its options on the UI
const displayQuestionOnUI = (questionId) => {
  let question = questions.find((question) => {
    return question.id === questionId.toString();
  });
  let questionContainer = `
        <h3 class="question" id="question">
         ${question.id}. ${question.question}
        </h3>
        <ol class="answers" id="answers">
          <li class="option" id="option">${question.options[0]}</li>
          <li class="option" id="option">${question.options[1]}</li>
          <li class="option" id="option">${question.options[2]}</li>
          <li class="option" id="option">${question.options[3]}</li>
        </ol>`;
  questionContainerEl.innerHTML = questionContainer;
  // Adding event listener to each of the options
  optionsEl = document.querySelectorAll(".option");
  optionsEl.forEach((optionEl) => {
    optionEl.addEventListener("click", handleSelectOption);
  });
};

const handleSaveAnswers = (optionsEl) => {
  let selectedIndex = "";
  optionsEl.forEach((optionEl, index) => {
    if (optionEl.classList.contains("selected")) {
      selectedIndex = index;
    }
  });
  if (selectedIndex !== "") {
    let answer = {
      id: questions[currentQuestion - 1].id,
      answer: selectedIndex,
    };
    isAnsExist = answers.find((ans) => {
      return ans.id === answer.id;
    });

    if (isAnsExist) {
      answers = answers.map((ans) => {
        if (ans.id === answer.id) {
          return {
            answer: selectedIndex,
            ...ans,
          };
        } else {
          return ans;
        }
      });
    } else {
      answers.push(answer);
    }
  } else {
  }
};

// This function will be triggered once the dom content is loaded
const handleFetchQuestions = async () => {
  async function getQuestions() {
    let response = await fetch(API_URL);
    let data = await response.json();
    return data;
  }

  questions = await getQuestions();
  totalQuestions = questions.length;
  displayQuestionOnUI(currentQuestion);
  prevEl.disabled = true;
};

window.addEventListener("DOMContentLoaded", handleFetchQuestions);

// This function will be triggered on click of the option
const handleSelectOption = (e) => {
  // Select the option
  optionsEl = document.querySelectorAll(".option");
  optionsEl.forEach((optionEl) => {
    if (optionEl !== e.target) {
      if (optionEl.classList.contains("selected")) {
        optionEl.classList.remove("selected");
      }
    } else {
      if (e.target.classList.contains("selected")) {
        e.target.classList.remove("selected");
        answers = answers.filter((ans) => {
          return ans.id !== questions[currentQuestion - 1].id;
        });
      } else {
        e.target.classList.add("selected");
      }
    }
  });
};

// This function will be triggered on click of the previous button
const handleMoveToPrev = () => {
  // Move the previous question
  if (currentQuestion > 1) {
    currentQuestion = currentQuestion - 1;
    displayQuestionOnUI(currentQuestion);
    optionsEl = document.querySelectorAll(".option");
    handleSaveAnswers(optionsEl);
  }

  if (answers.length > 0) {
    let [ans] = answers.filter((answer) => {
      return answer.id === questions[currentQuestion - 1].id;
    });

    if (ans) {
      let selectedIndex = ans.answer;
      optionsEl = document.querySelectorAll(".option");
      optionsEl[selectedIndex].classList.add("selected");
    }
  }

  if (currentQuestion === totalQuestions - 1) {
    nextEl.innerText = "Next";
  }

  if (currentQuestion === 1) {
    prevEl.disabled = true;
  }
};

const handleSubmit = () => {
  if (answers.length === totalQuestions) {
    let userScore = questions.reduce((score, question) => {
      let answer = answers.find((ans) => {
        return ans.id === question.id;
      });
      if (question.answer === answer.answer + 1) {
        score = score + 1;
        return score;
      } else {
        score = score;
        return score;
      }
    }, 0);
    titleEl.innerText = `Score: ${userScore} / ${totalQuestions}`;
    nextEl.innerHTML = "Restart Quiz";
  } else {
    // Display error
    alert("Please answer all the questions before submitting");
  }
};

// This function will be triggered on click of the next button
const handleMoveToNext = () => {
  optionsEl = document.querySelectorAll(".option");
  handleSaveAnswers(optionsEl);

  // Move to next question
  if (currentQuestion < totalQuestions) {
    currentQuestion = currentQuestion + 1;
    displayQuestionOnUI(currentQuestion);
  }

  if (answers.length > 0) {
    let [ans] = answers.filter((answer) => {
      return answer.id === questions[currentQuestion - 1].id;
    });

    if (ans) {
      let selectedIndex = ans.answer;
      optionsEl = document.querySelectorAll(".option");
      optionsEl[selectedIndex].classList.add("selected");
    }
  }

  if (nextEl.innerText === "SUBMIT") {
    handleSubmit();
    return;
  }

  if (nextEl.innerText === "RESTART QUIZ") {
    currentQuestion = 1;
    titleEl.innerText = "Web Dev Quiz";
    nextEl.innerText = "Next";
    answers = [];
    handleFetchQuestions();
    return;
  }

  if (currentQuestion === totalQuestions) {
    nextEl.innerText = "Submit";
    return;
  }

  if (currentQuestion === 2) {
    prevEl.disabled = false;
  }
};

// Adding event listner to the next button
prevEl.addEventListener("click", handleMoveToPrev);

// Adding event listner to the previous button
nextEl.addEventListener("click", handleMoveToNext);
