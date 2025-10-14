// Quiz questions
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which of the following is used to style web pages?",
        options: [
            "HTML",
            "JavaScript",
            "CSS",
            "Python"
        ],
        correct: 2
    },
    {
        question: "What is the correct way to declare a JavaScript variable?",
        options: [
            "variable myVar;",
            "var myVar;",
            "v myVar;",
            "let = myVar;"
        ],
        correct: 1
    },
    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        options: [
            "//",
            "/*",
            "#",
            "--"
        ],
        correct: 0
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: 2
    }
];

// DOM elements
const startScreen = document.getElementById('start-screen'); 
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const currentQuestion = document.getElementById('current-question');
const currentScore = document.getElementById('current-score');
const finalScore = document.getElementById('final-score');
const feedbackMessage = document.getElementById('feedback-message');
const badgesContainer = document.getElementById('badges-container');
const progressBar = document.getElementById('progress-bar');

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = new Array(questions.length).fill(null); // track user answers 
let answeredQuestions = new Array(questions.length).fill(false); // track if question was answered 

// Initialize the app
function init() {
    startBtn.addEventListener('click', startQuiz); // start quiz 
    prevBtn.addEventListener('click', showPreviousQuestion); // pervious question 
    nextBtn.addEventListener('click', showNextQuestion); // next question 
    restartBtn.addEventListener('click', restartQuiz); // restart quiz 
}

// Start the quiz
function startQuiz() {
    showScreen(quizScreen);
    displayQuestion();
    updateProgressBar();
}

// Display the current question
function displayQuestion() {
    const question = questions[currentQuestionIndex]; //get current question 
    questionText.textContent = question.question; // set question text 
    optionsList.innerHTML = ''; // clear pervious options 

    currentQuestion.textContent = currentQuestionIndex + 1; //index
    currentScore.textContent = score; //score

    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'option'; // Add a common class for styling 

        // If this option was previously selected, mark it
        if (userAnswers[currentQuestionIndex] === index) {
            li.classList.add('selected');

            // If the question was answered, show if it was correct/incorrect
            if (answeredQuestions[currentQuestionIndex])
            {
                if (index === question.correct) {
                    li.classList.add('correct');
                } else {
                    li.classList.add('incorrect');
                }
            }
        }

        li.textContent = option;
        li.addEventListener('click', () => selectOption(index));
        optionsList.appendChild(li);
    });

    updateNavigationButtons();
}

// Select an option
function selectOption(optionIndex) {
    // If this question was already answered, don't allow changing the answer
    if (answeredQuestions[currentQuestionIndex]) {
        return;
    }

    const question = questions[currentQuestionIndex]; //get current question 
    userAnswers[currentQuestionIndex] = optionIndex; // Store user answer 
    answeredQuestions[currentQuestionIndex] = true; // Mark question as answered 
    console.log(answeredQuestions); //Console log for debugging 

    // Remove selected class from all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect'); // Remove all states 
    });

    // Add selected class to the clicked option
    options[optionIndex].classList.add('selected');

    // Check if the answer is correct and update score
    if (optionIndex === question.correct) {
        options[optionIndex].classList.add('correct'); // Show correct answer 
        score += 10;
        currentScore.textContent = score; // Update score display 
    } else {
        options[optionIndex].classList.add('incorrect'); // show incorrect answer
        // Also show the correct answer
        options[question.correct].classList.add('correct'); // Show correct answer 
    }

    updateNavigationButtons(); // Enable next button after answering 
}

// Show the next question
function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) { 
        currentQuestionIndex++;
        displayQuestion(); // Display the next question 
        updateProgressBar(); // Update progress bar 
    } else {
        showResults(); // Show results if its teh last question 
    }
}

// Show the previous question
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(); // Dispaly the pervious question 
        updateProgressBar(); // Update progress bar 
    }
}

// Update navigation buttons state
function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'; // Change text on last question 

    // Enable next button if current question is answered
    if (answeredQuestions[currentQuestionIndex]) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = currentQuestionIndex === questions.length - 1; // Disable if last question  is not answered  
    }
}

// Update progress bar
function updateProgressBar() 
{
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100; // calculate progress 
    progressBar.style.width = `${progress}%`;
}

// Show the results screen
function showResults() {
    showScreen(resultsScreen); // Show results 
    finalScore.textContent = score;

    // Calculate final score and provide feedback
    const percentage = (score / (questions.length * 10)) * 100;

    if (percentage >= 80) // Feedback 
    {
        feedbackMessage.textContent = "Excellent! You're a coding master!"; // Feedback message 
        feedbackMessage.style.backgroundColor = '#d4edda';
        feedbackMessage.style.color = '#155724';
        feedbackMessage.style.border = '1px solid #c3e6cb';
    } else if (percentage >= 60) {
        feedbackMessage.textContent = "Great job! You have a good understanding of coding concepts.";
        feedbackMessage.style.backgroundColor = '#d1ecf1';
        feedbackMessage.style.color = '#0c5460';
        feedbackMessage.style.border = '1px solid #bee5eb';
    } else if (percentage >= 40) {
        feedbackMessage.textContent = "Good effort! Keep learning and you'll improve.";
        feedbackMessage.style.backgroundColor = '#fff3cd';
        feedbackMessage.style.color = '#856404';
        feedbackMessage.style.border = '1px solid #ffeaa7';
    } else {
        feedbackMessage.textContent = "Don't worry! Keep practicing and try again."; // Feedback message  
        feedbackMessage.style.backgroundColor = '#f8d7da';
        feedbackMessage.style.color = '#721c24';
        feedbackMessage.style.border = '1px solid #f5c6cb';
    }

    // Award badges based on performance
    awardBadges(percentage);
}

// Award badges based on performance
function awardBadges(percentage) {
    badgesContainer.innerHTML = '';

    // Always award the participant badge
    const participantBadge = document.createElement('div'); // Participant badge 
    participantBadge.className = 'badge'; // Common class 
    participantBadge.textContent = 'Code Explorer'; // Badge for participating 
    participantBadge.style.background = 'linear-gradient(135deg, #3498db, #2980b9)'; // Blue Gradient 
    badgesContainer.appendChild(participantBadge);

    // Award additional badges based on score
    if (percentage >= 60) {
        const achieverBadge = document.createElement('div'); // Achiever badge 
        achieverBadge.className = 'badge';
        achieverBadge.textContent = 'Code Achiever'; // Badge for scoring 60% 
        achieverBadge.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        badgesContainer.appendChild(achieverBadge);
    }

    if (percentage >= 80) { 
        const masterBadge = document.createElement('div'); // Master badge 
        masterBadge.className = 'badge'; // Special class for master badge 
        masterBadge.textContent = 'Code Master'; // Special badge for scoring 80% 
        masterBadge.style.background = 'linear-gradient(135deg, #9b59b6, #8e44ad)'; // Purple gradient 
        badgesContainer.appendChild(masterBadge); // Add to container 
    }

    if (percentage === 100) {
        const perfectBadge = document.createElement('div'); // Perfect score badge 
        perfectBadge.className = 'badge'; // Special class for perfect score 
        perfectBadge.textContent = 'Perfect Score'; // Special bagde for scooring 100% 
        perfectBadge.style.background = 'linear-gradient(135deg, #fdbb2d, #b21f1f)'; //Gold gradient 
        badgesContainer.appendChild(perfectBadge); // Add to container 
    }
}

// Restart the quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = new Array(questions.length).fill(null); //Reset user answers 
    answeredQuestions = new Array(questions.length).fill(false); //reset answered questions 
    showScreen(startScreen); // Show start screen 
    updateProgressBar(); // reset progress bar
}

// Show a specific screen
function showScreen(screen) {
    startScreen.classList.remove('active'); // Hide all screens 
    quizScreen.classList.remove('active'); // Hide all screens 
    resultsScreen.classList.remove('active');  // Hide all screens 
    screen.classList.add('active');  // Show the selected screen 
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); //Initialize the app 