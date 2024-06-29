document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";
  const quizElement = document.querySelector(".quiz");
  const questionElement = document.querySelector(".question");
  const choicesElement = document.querySelector(".choices");
  const timerElement = document.querySelector(".timer");
  const resultElement = document.querySelector(".result");
  const resultTableBody = document.querySelector("#resultTable tbody");
  let questions = [];
  let currentQuestionIndex = 0;
  let answers = [];
  let timer;

  async function fetchQuestions() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.slice(0, 10);
  }

  function parseChoices(text) {
    const words = text.split(" ");
    return [
      words.slice(0, 4).join(" "),
      words.slice(4, 8).join(" "),
      words.slice(8, 12).join(" "),
      words.slice(12, 16).join(" "),
    ];
  }

  function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showResults();
      return;
    }

    const question = questions[currentQuestionIndex];
    const choices = parseChoices(question.body);

    questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${
      question.title
    }`;
    choicesElement.innerHTML = "";
    choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.textContent = `ABCD`[index] + ": " + choice;
      button.disabled = true;
      button.onclick = () => handleAnswer(choice);
      choicesElement.appendChild(button);
    });

    let timeLeft = 30;
    timerElement.textContent = `Time: ${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `Time: ${timeLeft}s`;
      if (timeLeft === 20) {
        choicesElement
          .querySelectorAll("button")
          .forEach((button) => (button.disabled = false));
      }
      if (timeLeft === 0) {
        clearInterval(timer);
        answers.push({ question: question.title, answer: "No Answer" });
        currentQuestionIndex++;
        showQuestion();
      }
    }, 1000);
  }

  function handleAnswer(answer) {
    answers.push({ question: questions[currentQuestionIndex].title, answer });
    currentQuestionIndex++;
    clearInterval(timer);
    showQuestion();
  }

  function showResults() {
    quizElement.style.display = "none";
    resultElement.style.display = "block";
    answers.forEach((answer) => {
      const row = document.createElement("tr");
      const questionCell = document.createElement("td");
      const answerCell = document.createElement("td");
      questionCell.textContent = answer.question;
      answerCell.textContent = answer.answer;
      row.appendChild(questionCell);
      row.appendChild(answerCell);
      resultTableBody.appendChild(row);
    });
  }

  await fetchQuestions();
  showQuestion();
});
