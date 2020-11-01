let countQuestions = document.querySelector(".quiz-app .count span");
let bulletContainer = document.querySelector(".bullets .spans");
let answers = document.querySelector(".quiz-app .answers-area");
let questionTitle = document.querySelector(".quiz-app .quiz-area");
let submitButton = document.querySelector(".submit-button");
let Bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let setAnswer = true;
let countdownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      let questionsCount = questions.length;
      //add bullets
      createCount(questionsCount);
      //add question data
      addQuestionData(questions[currentIndex], questionsCount);

      countdown(70, questionsCount);
      submitButton.onclick = () => {
        let RightAnswer = questions[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(RightAnswer, questionsCount);
        //remove previous questions
        questionTitle.innerHTML = "";
        answers.innerHTML = "";
        //add question data
        addQuestionData(questions[currentIndex], questionsCount);
        //handle Bullets
        handleBullets(); //it only stands on the next questions
        clearInterval(countdownInterval);
        countdown(70, questionsCount);
        //show results
        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}
getQuestions();
function createCount(num) {
  countQuestions.textContent = num;
  for (let i = 0; i < num; i++) {
    theBullets = document.createElement("span");
    if (i === currentIndex) theBullets.className = "on";
    bulletContainer.appendChild(theBullets);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj["title"]);
    //append h2(title)
    qTitle.appendChild(qText);
    questionTitle.appendChild(qTitle);
    for (let i = 1; i <= 4; i++) {
      let myDiv = document.createElement("div");
      myDiv.className = "answer";
      let radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "questions";
      radioButton.id = `answer_${i}`;
      radioButton.dataset.answer = obj[`answer_${i}`];
      if (i === 1) radioButton.checked = true;
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(labelText);
      myDiv.appendChild(radioButton);
      myDiv.appendChild(theLabel);

      answers.appendChild(myDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChosenAnswer;
  [...answers].forEach((answer) => {
    if (answer.checked) {
      theChosenAnswer = answer.dataset.answer;
    }
  });
  if (theChosenAnswer === rAnswer) {
    rightAnswers++;
  }
}
function handleBullets() {
  let bulletSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletSpan);
  arrayOfSpans.forEach((bullet, index) => {
    if (currentIndex === index) bullet.className = "on";
  });
}
function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    removeElements();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      //as it is the good condition
      theResult = `<span class="good">Good</span> , You have answered <span class="rightAnswer">${rightAnswers}</span> from <span class="cnt">${count}</span>`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span> , You have answered all questions right`;
    } else {
      theResult = `<span class="weak">Weak</span> , You have answered <span class="rightAnswer">${rightAnswers}</span> from <span class="cnt">${count}</span>`;
    }
    results.innerHTML = theResult;
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        submitButton.click();
      }
    }, 1000);
  }
}
function removeElements() {
  submitButton.remove();
  Bullets.remove();
  answers.remove();
  questionTitle.remove();
}
