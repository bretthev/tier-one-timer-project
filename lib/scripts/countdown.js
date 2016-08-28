const Timer = require('./timer-prototype')

var startTimerButton = $('.start-timer');
var pauseTimerButton = $('.pause-timer');
var resumeTimerButton = $('.resume-timer');
var clearTimerButton = $('.clear-timer');
var userGeneratedTimerLength = $('.work-timer-length');
var countDownTimer = $('.work-timer');

var timer = new Timer({});

function countDown(seconds, callback) {
  if (timer.currentState === 'running')
  {$(countDownTimer).html(seconds);
  callback(seconds)}
}

function getTime(){
  timer.findRemainingWorkTime();
  var seconds = timer.remainingWorkTime / 1000
  if(seconds >= 0) {
    setTimeout(countDown, 10, seconds, getTime);
  };
}

function getUserInput() {
  return +userGeneratedTimerLength.val();
}

function convertUserWorkTimeLengthToSeconds(minutes) {
  return timer.changeMinutesToSeconds(minutes);
}

function clearInputValue() {
  userGeneratedWorkTimeLength.val('');
}

function setButtonsIfTimerIsRunning() {
  if (timer.currentState === 'running') {
    startTimerButton.attr('disabled', true);
    pauseTimerButton.attr('disabled', false);
    resumeTimerButton.attr('disabled', true);
    clearTimerButton.attr('disabled', false);
  }
}

function setButtonsIfTimerIsPaused() {
  if (timer.currentState === 'paused') {
    startTimerButton.attr('disabled', true);
    pauseTimerButton.attr('disabled', true);
    resumeTimerButton.attr('disabled', false);
    clearTimerButton.attr('disabled', false)
  }
}

function setButtonsIfTimerIsNew() {
  if (timer.currentState === 'new timer') {
    startTimerButton.attr('disabled', false);
    pauseTimerButton.attr('disabled', true);
    resumeTimerButton.attr('disabled', true);
    clearTimerButton.attr('disabled', true);
  }
}

function updateTimerPropertiesOnStartButton() {
  var minutes = getUserInput();
  if (minutes > 0) {
  timer.workTimerLength = timer.changeMinutesToMilliseconds(minutes)};
  timer.generateStartedWorkTime();
  timer.calculateEndOfWorkTime();
}

function setAllButtonsDependingOnTimerState() {
  setButtonsIfTimerIsRunning();
  setButtonsIfTimerIsPaused();
  setButtonsIfTimerIsNew();
}

$(startTimerButton).on('click', function() {
  timer.currentState = 'running';
  updateTimerPropertiesOnStartButton();
  var seconds = timer.workTimerLength / 1000;
  countDown(seconds, getTime);
  setAllButtonsDependingOnTimerState();
})

$(pauseTimerButton).on('click', function() {
  timer.currentState = 'paused';
  timer.timeLeftAtPause = timer.endWorkTime - Date.now();
  var seconds = timer.timeLeftAtPause / 1000;
  countDownTimer.html(seconds);
  timer.findRemainingWorkTime();
  setAllButtonsDependingOnTimerState();
})

$(resumeTimerButton).on('click', function() {
  timer.currentState = 'running';
  timer.calculateEndOfWorkTimeAfterBreak();
  timer.remainingWorkTime = timer.timeLeftAtPause
  var seconds = timer.remainingWorkTime / 1000;
  countDown(seconds, getTime);
  setAllButtonsDependingOnTimerState();
})

$(clearTimerButton).on('click', function() {
  timer.currentState = 'new timer';
  $(countDownTimer).html(timer.workTimerLength / 1000);
  setAllButtonsDependingOnTimerState();
})

$('.test-button').on('click', function() {
  var fartAudio = new Audio("fart.wav");
  fartAudio.play();
});
