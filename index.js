'use strict';

var STATE = {
  displayStartPage: true,
  displayQuestions: false,
  displayResultPage: false,
  currentQuestion: 0,
  totalWrong: 0,
  questionAnswered: false,
};

var QUIZ = [
  {
    question: "The largest circular storm in our solar system is on the surface of which of the following planets?", 
    answers: ["Jupiter","Venus","Uranus","Earth"], 
    correctAnswerIndex: 0,
    fact: "The Great Red Spot's dimensions are 24–40,000 km, west to east and 12–14,000 km, south to north. It is large enough to contain two or three planets the size of Earth. The cloudtops of this storm are about 8 km above the surrounding cloudtops."
  },
  {
    question: "Rounded to the nearest day, the Mercurian year is equal to:", 
    answers: ["111 days","88 days","50 days","25 days"], 
    correctAnswerIndex: 1,
    fact: "Mercury is the smallest and innermost planet in the Solar System. Its orbital period around the Sun of 88 days is the shortest of all the planets in the Solar System."
  },
  {
    question: "One of the largest volcanoes in our solar system-if not the largest-is named Olympus Mons.  This volcano is located on:", 
    answers: ["Jupiter's moon Callisto","Venus","Saturn's moon Titan","Mars"], 
    correctAnswerIndex: 3,
    fact: "Olympus Mons is a very large shield volcano on the planet Mars. By one measure, it has a height of nearly 22 km Olympus Mons stands about two and a half times as tall as Mount Everest's height above sea level."
  },
  {
    question: "One Jupiter day is equal to which of the following?", 
    answers: ["30 hrs 40 min","9 hrs 50 min","3 hrs 20 min","52 hrs 10 min"], 
    correctAnswerIndex: 1,
    fact: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a giant planet with a mass one-thousandth that of the Sun, but two and a half times that of all the other planets in the Solar System combined."
  },
  {
    question: "Of the following four times, which one best represents the time it takes energy generated in the core of the sun to reach the surface of the sun and be radiated?", 
    answers: ["Three minutes","Thirty days","One thousand years","One million years"], 
    correctAnswerIndex: 3,
    fact: "The original statement is often something like, “It takes tens of thousands of years for a photon to get from the core to the surface of the Sun, but only eight minutes to get from the Sun to the Earth”."
  },
  {
    question: "About how many light years across is the Milky Way? Is it:", 
    answers: ["1,000","10,000","100,000","1,000,000"], 
    correctAnswerIndex: 2,
    fact: "The Milky Way is about 1,000,000,000,000,000,000 km (about 100,000 light years or about 30 kpc) across. The Sun does not lie near the center of our Galaxy. It lies about 8 kpc from the center on what is known as the Sagittarius arm of the Milky Way."
  },
  {
    question: "The planet Jupiter has a mass that is:", 
    answers: ["equal to the combined masses of the earth and Mars","equal to the combined masses of Saturn and Pluto","equal to the combined masses of Saturn, Neptune and Uranus","greater than the combined masses of all of the planets"], 
    correctAnswerIndex: 3,
    fact: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a giant planet with a mass one-thousandth that of the Sun, but two and a half times that of all the other planets in the Solar System combined."
  },
  {
    question: "A comet's tail points in which direction?", 
    answers: ["toward the sun","toward the earth","behind the comet in its orbit","away from the sun"], 
    correctAnswerIndex: 3,
    fact: "A comet is an icy small Solar System body that, when passing close to the Sun, warms and begins to release gasses, a process called outgassing. This produces a visible atmosphere or coma, and sometimes also a tail."
  },
  /*
  {
    question: "", 
    answers: [,,,], 
    correctAnswerIndex: ,
    fact: ""
  },
  {question: "", answers: [,,,], correct-answer-index: , fact: ""},*/
];

var NAV_BUTTON_IDENTIFIER = ".js-nav-button";
var QUESTION_AND_ANSWER_IDENTIFIER = ".js-questions-and-answer";
var QUESTION_AND_ANSWER_TEMPLATE = "#question-answer-template";
var RESULTS_TEMPLATE_IDENTIFIER = "#results-template"
var QUIZ_QUESTION_IDENTIFIER = ".js-quiz-question";
var ANSWER_1_IDENTIFIER = ".js-answer-1";
var ANSWER_2_IDENTIFIER = ".js-answer-2";
var ANSWER_3_IDENTIFIER = ".js-answer-3";
var ANSWER_4_IDENTIFIER = ".js-answer-4";
var ANSWERS_IDENTIFIER = [ANSWER_1_IDENTIFIER,ANSWER_2_IDENTIFIER,ANSWER_3_IDENTIFIER,ANSWER_4_IDENTIFIER];
var INTERESTING_FACT_IDENTIFIER = ".js-interesting-fact";
var INTRO_SCREEN_IDENTIFIER = ".js_intro-screen";
var RESULTS_TABLE_IDENTIFIER = ".js-results-table";
var WRONG_ANSWER_IDENTIFIER = "js-wrong-answer";
var CORRECT_ANSWER_IDENTIFIER = "js-correct-answer";
var RESULT_CONTAINER_IDENTIFIER = ".js_result_container"
var RESULT_CORRECT_ANSWER_IDENTIFIER = ".js-result-correct-answer"
var DISABLE_ANSWER_IDENTIFIER = "js-disabled-answer"
var RESULT_USER_ANSWER_IDENTIFIER = ".js-result-user-answer"
var RESULTS_SCREEN_IDENTIFIER = ".js-results-screen"
var RESULT_QUESTION_IDENTIFIER = ".js-result-question"
var RESULTS_SCORE_IDENTIFIER =  ".js-results-score"
var STATUS_PROGRESS = ".js-status-progress"
var STATUS_SCORE = ".js-status-score"

function handleNavButton() {
  $(NAV_BUTTON_IDENTIFIER).click(function(event) {
    if((STATE.displayStartPage === true) || (STATE.displayResultPage === true)){
      clearResults(); // clear result page
      initializeQuiz();
      displayPage(false, true, false);
      $(STATUS_PROGRESS).show();
      $(STATUS_SCORE).show();
      $(NAV_BUTTON_IDENTIFIER).text("Next");
    }
    else {
      STATE.currentQuestion++;
    }
    
    if(STATE.currentQuestion >= QUIZ.length) {
      $(STATUS_PROGRESS).hide();
      $(STATUS_SCORE).hide();
      displayPage(false, false, true);
      $(NAV_BUTTON_IDENTIFIER).text("Restart");
    }
    
    if(STATE.displayQuestions){
      updateStatus();
      hideSolution();
      $(NAV_BUTTON_IDENTIFIER).hide();
      STATE.questionAnswered = false;
      
      var quizString = generateQuestion(STATE.currentQuestion);
      // insert that HTML into the DOM
      $(QUESTION_AND_ANSWER_IDENTIFIER).html(quizString);
    }
  });
}

function handleAnswerButtons() {
  $(QUESTION_AND_ANSWER_IDENTIFIER).on('click',ANSWER_1_IDENTIFIER,function(event){processAnswerButton(0)});
  $(QUESTION_AND_ANSWER_IDENTIFIER).on('click',ANSWER_2_IDENTIFIER,function(event){processAnswerButton(1)});
  $(QUESTION_AND_ANSWER_IDENTIFIER).on('click',ANSWER_3_IDENTIFIER,function(event){processAnswerButton(2)});
  $(QUESTION_AND_ANSWER_IDENTIFIER).on('click',ANSWER_4_IDENTIFIER,function(event){processAnswerButton(3)});
}

function processAnswerButton(userAnswerIndex) {
  if(!STATE.questionAnswered) {
    STATE.questionAnswered = true;
    var correctAnswerIndex = QUIZ[STATE.currentQuestion].correctAnswerIndex;
    showSolution(userAnswerIndex, correctAnswerIndex);
    updateResults(userAnswerIndex, correctAnswerIndex);
    if(userAnswerIndex !== correctAnswerIndex) {STATE.totalWrong++;};
    updateStatus();
    
    $(NAV_BUTTON_IDENTIFIER).show();
  }
}

function initializeQuiz() {
  STATE.currentQuestion = 0;
  STATE.totalWrong = 0;
  displayPage(true, false, false);
  $(STATUS_PROGRESS).hide();
  $(STATUS_SCORE).hide();
}

function updateStatus() {
  $(STATUS_PROGRESS).text("Question: " + (STATE.currentQuestion+1) + " of " + QUIZ.length);
  $(STATUS_SCORE).text("Wrong: " + STATE.totalWrong);
}

function updateResults(userAnswerIndex, correctAnswerIndex) {
  var template = $(RESULTS_TEMPLATE_IDENTIFIER).clone();
  var quiz = QUIZ[STATE.currentQuestion];
  
  template.find(RESULT_QUESTION_IDENTIFIER).text(quiz.question);
  template.find(RESULT_CORRECT_ANSWER_IDENTIFIER).text("Correct answer: " + quiz.answers[correctAnswerIndex]);
  if(correctAnswerIndex != userAnswerIndex) {
    template.find(RESULT_USER_ANSWER_IDENTIFIER).text("Your answer: " + quiz.answers[userAnswerIndex]);
    template.find(RESULT_CONTAINER_IDENTIFIER).addClass("js-result-incorrect")
  }
   $(RESULTS_TABLE_IDENTIFIER).html($(RESULTS_TABLE_IDENTIFIER).html() + template.html()); //append results to end of result screen
   var correctCount = QUIZ.length - STATE.totalWrong;
   $(RESULTS_SCORE_IDENTIFIER).text("Score: " + correctCount/QUIZ.length * 100. + "%");
}

function clearResults() {
  $(RESULTS_TABLE_IDENTIFIER).text("");
}

function showSolution(userAnswerIndex, correctAnswerIndex) {
  if(userAnswerIndex!==correctAnswerIndex) {
    $(ANSWERS_IDENTIFIER[userAnswerIndex]).addClass(WRONG_ANSWER_IDENTIFIER);
  }
  $(ANSWERS_IDENTIFIER[correctAnswerIndex]).addClass(CORRECT_ANSWER_IDENTIFIER);
  
  $(INTERESTING_FACT_IDENTIFIER).css('opacity','1');
  
  for(var i=0; i<=ANSWERS_IDENTIFIER.length; i++) {
    if((userAnswerIndex!==i) && (correctAnswerIndex!==i)){$(ANSWERS_IDENTIFIER[i]).addClass(DISABLE_ANSWER_IDENTIFIER);};
  }
}

function hideSolution()
{
  ANSWERS_IDENTIFIER.forEach(function(answerIndentifier){
    $(answerIndentifier).removeClass(CORRECT_ANSWER_IDENTIFIER + " " + WRONG_ANSWER_IDENTIFIER + " " + DISABLE_ANSWER_IDENTIFIER);
  });
  
  $(INTERESTING_FACT_IDENTIFIER).css('opacity','0');
}

function displayPage (displayStartPage, displayQuestions, displayResultPage) {
  STATE.displayStartPage = displayStartPage;
  STATE.displayQuestions = displayQuestions;
  STATE.displayResultPage = displayResultPage;
  
  if(displayStartPage) {$(INTRO_SCREEN_IDENTIFIER).show();}
  else {$(INTRO_SCREEN_IDENTIFIER).hide();}
  
  if(displayQuestions) {$(QUESTION_AND_ANSWER_IDENTIFIER).show();}
  else {$(QUESTION_AND_ANSWER_IDENTIFIER).hide();}
  
  if(displayResultPage) {$(RESULTS_SCREEN_IDENTIFIER).show();}
  else {$(RESULTS_SCREEN_IDENTIFIER).hide();}
}

function generateQuestion(questionIndex) {
  var template = $(QUESTION_AND_ANSWER_TEMPLATE).clone();
  var quiz = QUIZ[questionIndex];
  template.find(QUIZ_QUESTION_IDENTIFIER).text(quiz.question);
  for(var i=0; i<ANSWERS_IDENTIFIER.length; i++) {
    template.find(ANSWERS_IDENTIFIER[i]).text(quiz.answers[i]);
  }
  template.find(INTERESTING_FACT_IDENTIFIER).text(quiz.fact);
  
  return(template.html());
}

$(function() {
  handleNavButton();
  handleAnswerButtons();
  initializeQuiz();
}); 