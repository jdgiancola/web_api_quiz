const quizContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const resultElement = document.getElementById("result");
const submitButton = document.getElementById("submit");
const scoreContainer = document.getElementById("score-container");
const initialsInput = document.getElementById("initials");
const saveButton = document.getElementById("save");
const scoreListElement = document.getElementById("score-list");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10 * 60;
let timerInterval;
let quizStarted = false;

// Define your quiz questions, choices, and correct answers
const quizQuestions = [
  {
    question: "Question 1: What does API stand for?",
    choices: [
      "Application Programming Interface",
      "Advanced Programming Interface",
      "Application Program Interface",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Question 2: Which Web API can be used to manipulate the browser history?",
    choices: ["DOM API", "Canvas API", "History API"],
    correctAnswer: 2,
  },
  {
    question:
      "Question 3: Which Web API can be used to fetch data from a server?",
    choices: ["DOM API", "Fetch API", "Storage API"],
    correctAnswer: 1,
  },
  {
    question:
      "Question 4: Which Web API is used to store data locally in the browser?",
    choices: ["Session Storage API", "Local Storage API", "IndexedDB API"],
    correctAnswer: 1,
  },
  {
    question:
      "Question 5: Which Web API is used to play audio and video in the browser?",
    choices: ["Web Audio API", "MediaStream API", "WebRTC API"],
    correctAnswer: 0,
  },
  {
    question:
      "Question 6: Which Web API allows you to track the user's location?",
    choices: [
      "Web Geolocation API",
      "Web Notifications API",
      "Web Workers API",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Question 7: Which Web API is used to manipulate HTML5 canvas elements?",
    choices: ["DOM API", "Canvas API", "Web Animation API"],
    correctAnswer: 1,
  },
  {
    question:
      "Question 8: Which Web API is used for real-time communication between browsers?",
    choices: ["WebRTC API", "Drag and Drop API", "Web Speech API"],
    correctAnswer: 0,
  },
  {
    question:
      "Question 9: Which Web API allows you to store data in a key-value format?",
    choices: ["Web Storage API", "IndexedDB API", "Clipboard API"],
    correctAnswer: 0,
  },
  {
    question:
      "Question 10: Which Web API provides functionality to perform asynchronous operations?",
    choices: ["Web Workers API", "XHR API", "Promise API"],
    correctAnswer: 2,
  },
];

// Start the quiz when the start button is clicked
submitButton.addEventListener("click", function () {
  if (!quizStarted) {
    startQuiz();
  } else {
    submitAnswer();
  }
});

// Start the timer and display the first question
function startQuiz() {
  quizStarted = true;
  submitButton.textContent = "Submit";
  submitButton.disabled = true;
  submitButton.classList.remove("start-button");
  timerInterval = setInterval(updateTimer, 1000);
  displayQuestion();
}

// Display the current question and choices
function displayQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  choicesElement.innerHTML = "";
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    const choice = currentQuestion.choices[i];
    const choiceElement = document.createElement("li");
    choiceElement.textContent = choice;
    choiceElement.addEventListener("click", function () {
      submitButton.disabled = false;
      const selectedChoice = choicesElement.querySelector("li.selected");
      if (selectedChoice) {
        selectedChoice.classList.remove("selected");
      }
      choiceElement.classList.add("selected");
    });
    choicesElement.appendChild(choiceElement);
  }
}

// Submit the answer and move to the next question
function submitAnswer() {
  const selectedChoice = choicesElement.querySelector("li.selected");
  if (selectedChoice !== null) {
    const selectedIndex = Array.prototype.indexOf.call(
      choicesElement.children,
      selectedChoice
    );
    checkAnswer(selectedIndex);
  }
  submitButton.disabled = true;
}

// Check the selected answer and move to the next question
function checkAnswer(selectedIndex) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  if (selectedIndex === currentQuestion.correctAnswer) {
    score++;
    resultElement.textContent = "Correct!";
  } else {
    timeLeft -= 30; // Deduct 30 seconds for an incorrect answer
    resultElement.textContent = "Incorrect!";
    const timeDeduction = document.createElement("span");
    timeDeduction.textContent = " -30 seconds!";
    timeDeduction.classList.add("time-deduction");
    resultElement.appendChild(timeDeduction);
    setTimeout(function () {
      resultElement.removeChild(timeDeduction);
    }, 1000);
  }

  currentQuestionIndex++;

  if (currentQuestionIndex === quizQuestions.length) {
    finishQuiz();
  } else {
    displayQuestion();
    submitButton.disabled = true;
  }
}

// Finish the quiz and display the final score
function finishQuiz() {
  clearInterval(timerInterval);
  quizContainer.style.display = "none";
  resultElement.textContent = `Final Score: ${score}`;
  scoreContainer.style.display = "block";
}

// Update the timer display
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeft--;

  document.getElementById("time-left").textContent = `${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  if (timeLeft < 0) {
    clearInterval(timerInterval);
    finishQuiz();
  }
}

// Save the score when the save button is clicked
saveButton.addEventListener("click", saveScore);

// Save the score to local storage
function saveScore() {
  const initials = initialsInput.value.trim();
  if (initials !== "") {
    const scoreData = { initials, score };
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(scoreData);
    localStorage.setItem("scores", JSON.stringify(scores));
    displayScores();
    initialsInput.value = "";
    scoreContainer.style.display = "none";
    quizContainer.style.display = "block";
  }
}

// Display the saved scores
function displayScores() {
  scoreListElement.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.sort((a, b) => b.score - a.score);
  scores.forEach((scoreData, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${scoreData.initials} - ${
      scoreData.score
    }`;
    scoreListElement.appendChild(listItem);
  });
}

// Load the saved scores when the page loads
window.addEventListener("load", displayScores);

// Set the initial button text to "Start" and add the start-button class
submitButton.textContent = "Start";
submitButton.classList.add("start-button");

// Add event listener to clear scores button
const clearScoresButton = document.getElementById("clear-scores");
clearScoresButton.addEventListener("click", clearScores);

// Function to clear high scores
function clearScores() {
  localStorage.removeItem("scores");
  scoreListElement.innerHTML = ""; // Clear score list from the DOM
}
