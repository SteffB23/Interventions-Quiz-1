const quizData = [
  {
    question:
      'What should you do if your client is screaming, yelling and crying for an item that he/she wants access to, is not allergic to and is accessible in the environment?',
    a: "Verbally prompt the child to 'be quiet'",
    b: 'ignore the child',
    c: 'wait for the child to become calm and assist the child to use some form of communicative intent',
    d: 'make the item disappear',
    correct: 'c',
  },
  {
    question: "What does the term 'ABC' stand for in ABA'?",
    a: 'Analysis, Behavior, Consequence',
    b: 'Antecedent, Behavior, Control',
    c: 'Analysis, Behavior, Control',
    d: 'Antecedent, Behavior, Consequence',
    correct: 'd',
  },
  {
    question: "In ABA, what does 'prompt fading' refer to",
    a: 'Increasing the intensity of prompts over time',
    b: 'Gradually removing prompts until the behavior occurs independently',
    c: 'Using the same prompts consistently',
    d: 'Providing verbal prompts only',
    correct: 'b',
  },
  {
    question:
      "The child understands when directives are given in short and easy to understand phrases. What type of technique would you use to teach the child that he/she won't have access to a reinforcer until they finish their task?",
    a: 'give an explanation of the benefits of completing the task',
    b: "'Pre-mack Prinicpal'",
    c: 'explain why the task is so important',
    d: 'remove the task to avoid tantrums',
    correct: 'b',
  },
  {
    question: 'What is the difference between an antecedent and a consequence?',
    a: 'An antecedent is what happens before a behavior, while a consequence is what happens after',
    b: 'An antecedent is the result of a behavior, while a consequence is the cause',
    c: 'An antecedent is a type of reinforcement, while a consequence is a type of punishment',
    d: 'There is no difference',
    correct: 'a',
  },
  {
    question:
      'Which of the following is an example of a continuous reinforcement schedule?',
    a: 'Reinforcing a behavior every time it occurs',
    b: 'Reinforcing a behavior every third time it occurs',
    c: 'Reinforcing a behavior after a fixed amount of time',
    d: 'Reinforcing a behavior randomly',
    correct: 'a',
  },
  {
    question: "What is a 'token economy'?",
    a: 'A system where individuals earn tokens for desired behaviors that can be exchanged for rewards',
    b: 'A method of negative reinforcement',
    c: 'A punishment system for undesired behaviors',
    d: 'A data collection technique',
    correct: 'a',
  },
  {
    question: "What is 'modeling' in the context of ABA?",
    a: 'Creating a behavior intervention plan',
    b: 'Demonstrating a behavior for someone to imitate',
    c: 'Collecting data on behavior',
    d: 'Analyzing the function of behavior',
    correct: 'b',
  },
  {
    question: "What is 'functional communication training' (FCT)?",
    a: 'Analyzing the function of a behavior',
    b: 'Recording data on communication',
    c: 'Providing reinforcement for verbal behaviors only',
    d: 'Teaching alternative communication behaviors to replace challenging behaviors',
    correct: 'd',
  },
  {
    question:
      'Which of the following is an example of a fixed-ratio reinforcement schedule?',
    a: 'Reinforcing a behavior every 5th time it occurs',
    b: 'Reinforcing a behavior every 5 minutes',
    c: 'Reinforcing a behavior randomly',
    d: 'Reinforcing a behavior every time it occurs',
    correct: 'a',
  },
];

const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result');
const historyBtn = document.getElementById('history-btn');

let currentQuiz = 0;
let score = 0;
let answered = false;
let userAnswers = [];

// Load score history from localStorage
function getScoreHistory() {
  const history = localStorage.getItem('quizScoreHistory');
  return history ? JSON.parse(history) : [];
}

// Save score to history
function saveScore(score, total) {
  const history = getScoreHistory();
  const newScore = {
    score,
    total,
    percentage: ((score / total) * 100).toFixed(1),
    date: new Date().toISOString(),
  };
  history.push(newScore);
  localStorage.setItem('quizScoreHistory', JSON.stringify(history));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function showScoreHistory() {
  const history = getScoreHistory();
  const historyHTML = history.length === 0 
    ? '<p class="text-gray-500 text-center">No previous attempts recorded</p>'
    : history.reverse().map((item, index) => `
        <div class="p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium">Score: ${item.score}/${item.total} (${item.percentage}%)</p>
              <p class="text-sm text-gray-600">${formatDate(item.date)}</p>
            </div>
            <div class="text-lg font-semibold ${Number(item.percentage) >= 70 ? 'text-green-600' : 'text-red-600'}">
              ${Number(item.percentage) >= 70 ? 'PASS' : 'FAIL'}
            </div>
          </div>
        </div>
      `).join('');

  quizContainer.innerHTML = `
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Score History</h2>
        <button id="back-to-quiz" class="text-blue-600 hover:text-blue-800">
          Back to Quiz
        </button>
      </div>
      <div class="space-y-2">
        ${historyHTML}
      </div>
    </div>
  `;

  document.getElementById('back-to-quiz').addEventListener('click', () => {
    currentQuiz = 0;
    score = 0;
    userAnswers = [];
    submitBtn.style.display = 'block';
    submitBtn.textContent = 'Next';
    loadQuiz();
  });
}

function loadQuiz() {
  answered = false;
  const currentQuizData = quizData[currentQuiz];
  
  quizContainer.innerHTML = `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800">Question ${currentQuiz + 1} of ${quizData.length}</h2>
      <p class="text-lg text-gray-700">${currentQuizData.question}</p>
      <div class="space-y-2">
        <label class="block hover:bg-gray-50 rounded-lg">
          <input type="radio" name="answer" value="a" class="mr-3"> 
          <span>${currentQuizData.a}</span>
        </label>
        <label class="block hover:bg-gray-50 rounded-lg">
          <input type="radio" name="answer" value="b" class="mr-3"> 
          <span>${currentQuizData.b}</span>
        </label>
        <label class="block hover:bg-gray-50 rounded-lg">
          <input type="radio" name="answer" value="c" class="mr-3"> 
          <span>${currentQuizData.c}</span>
        </label>
        <label class="block hover:bg-gray-50 rounded-lg">
          <input type="radio" name="answer" value="d" class="mr-3"> 
          <span>${currentQuizData.d}</span>
        </label>
      </div>
    </div>
  `;
}

function getSelected() {
  const answers = document.querySelectorAll('input[name="answer"]');
  let answer = undefined;
  answers.forEach((ans) => {
    if (ans.checked) {
      answer = ans.value;
    }
  });
  return answer;
}

function highlightAnswer(isCorrect, answer) {
  const labels = document.querySelectorAll('label');
  labels.forEach((label) => {
    const input = label.querySelector('input');
    if (input.value === answer) {
      label.classList.add(isCorrect ? 'correct' : 'wrong');
    } else if (input.value === quizData[currentQuiz].correct) {
      label.classList.add('correct');
    }
    input.disabled = true;
  });
}

submitBtn.addEventListener('click', () => {
  if (answered) {
    currentQuiz++;
    if (currentQuiz < quizData.length) {
      loadQuiz();
      submitBtn.textContent = 'Next';
    } else {
      showResults();
    }
  } else {
    const answer = getSelected();
    if (answer) {
      answered = true;
      userAnswers.push(answer);
      if (answer === quizData[currentQuiz].correct) {
        score++;
      }
      highlightAnswer(answer === quizData[currentQuiz].correct, answer);
      submitBtn.textContent = currentQuiz === quizData.length - 1 ? 'Show Results' : 'Next Question';
    } else {
      alert('Please select an answer before continuing.');
    }
  }
});

function showResults() {
  const percentage = (score / quizData.length) * 100;
  saveScore(score, quizData.length);
  
  let resultsHTML = `
    <div class="space-y-6">
      <div class="text-center p-6 bg-gray-50 rounded-lg">
        <h2 class="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p class="text-xl">You scored ${score} out of ${quizData.length} (${percentage.toFixed(1)}%)</p>
        <p class="text-lg mt-2 ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}">
          ${percentage >= 70 ? 'PASS' : 'FAIL'}
        </p>
      </div>
      <div class="space-y-6">
  `;
  
  quizData.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === q.correct;
    
    resultsHTML += `
      <div class="p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}">
        <p class="font-semibold mb-2">Question ${index + 1}: ${q.question}</p>
        <p class="mb-1">Your answer: <span class="${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium">${q[userAnswer]}</span></p>
        ${!isCorrect ? `<p class="text-green-600">Correct answer: ${q[q.correct]}</p>` : ''}
      </div>
    `;
  });
  
  resultsHTML += `
      </div>
      <div class="flex space-x-4">
        <button id="reload-btn" class="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Retake Quiz
        </button>
        <button id="view-history" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
          View History
        </button>
      </div>
    </div>
  `;
  
  quizContainer.innerHTML = resultsHTML;
  submitBtn.style.display = 'none';
  
  document.getElementById('reload-btn').addEventListener('click', () => {
    currentQuiz = 0;
    score = 0;
    userAnswers = [];
    submitBtn.style.display = 'block';
    submitBtn.textContent = 'Next';
    loadQuiz();
  });

  document.getElementById('view-history').addEventListener('click', showScoreHistory);
}

// Add history button event listener
document.getElementById('history-btn').addEventListener('click', showScoreHistory);

loadQuiz();