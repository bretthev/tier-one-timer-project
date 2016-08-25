const Timer = require('./timer-prototype')

var startWorkTimerButton = $('.start-timer');
var pauseAndRestartWorkTimerButton = $('.pause-and-restart-timer');
var restartWorkTimerButton = $('.restart-timer');
var userGeneratedWorkTimeLength = $('.work-timer-length');
var countDownTimer = $('.work-timer');
var clearTimerButton = $('.clear-timer');

var timer = new Timer({});

function countDown(seconds, callback) {
  if ($(countDownTimer).hasClass('unpaused'))
  {$('.work-timer').html(seconds);
  seconds--;
  callback(seconds)};
}

function getTime(){
  timer.findRemainingWorkTime();
  var seconds = timer.remainingWorkTime / 1000
  if(seconds >= 0) {
    setTimeout(countDown, 10, seconds, getTime);
  };
}

function getUserInput() {
  return +userGeneratedWorkTimeLength.val();
}

function convertUserWorkTimeLengthToSeconds(minutes) {
  return timer.changeMinutesToSeconds(minutes);
}

function checkForPaused(element) {
  element.toggleClass;
}

function clearInputValue() {
  userGeneratedWorkTimeLength.val('');
}

function checkStartButton() {
  if (countDownTimer.val() !== timer.workTimerLength / 1000) {
    startWorkTimerButton.text('Restart');
    pauseAndRestartWorkTimerButton.text('Pause');
  }
}

function checkPauseAndRestartButton() {
  if (countDownTimer.hasClass('unpaused')) {
    pauseAndRestartWorkTimerButton.text('Pause');
  }
  else {
    pauseAndRestartWorkTimerButton.text('Unpause');
  }
}

function resetWorkTimer() {
  var seconds = timer.workTimerLength / 1000;
  countDownTimer.text(seconds);
  disableEnableButton();
  startWorkTimerButton.text('Start');
  if (countDownTimer.hasClass('unpaused')) {  countDownTimer.toggleClass('unpaused')};
}

function disableEnableButton() {
  if(+countDownTimer.text() === timer.workTimerLength / 1000) {
    pauseAndRestartWorkTimerButton.attr('disabled', true);
  }
  else {
    pauseAndRestartWorkTimerButton.attr('disabled', false);
  };
}

$(startWorkTimerButton).on('click', function() {
  disableEnableButton();
  if (countDownTimer.hasClass('unpaused')) {
    seconds = timer.workTimerLength / 1000;
    clearInputValue();
    timer.generateStartedWorkTime();
    timer.workTimerLength = timer.changeSecondsToMilliseconds(seconds);
    timer.calculateEndOfWorkTime();
    countDown(seconds, getTime);
  }
  else {
    $(countDownTimer).toggleClass('unpaused');
    var userInput = getUserInput();
    checkStartButton();
    var seconds;
    if (userInput === 0) { seconds = timer.workTimerLength / 1000}
    else {seconds = convertUserWorkTimeLengthToSeconds(userInput)};
      clearInputValue();
      timer.generateStartedWorkTime();
      timer.workTimerLength = timer.changeSecondsToMilliseconds(seconds);
      timer.calculateEndOfWorkTime();
      countDown(seconds, getTime);
    };
})

$(pauseAndRestartWorkTimerButton).on('click', function() {
  if (countDownTimer.hasClass('unpaused')) {
    $(countDownTimer).toggleClass('unpaused');
    timer.findRemainingWorkTime();
}
  else {
    $(countDownTimer).toggleClass('unpaused');
    timer.calculateEndOfWorkTimeAfterBreak();
    var seconds = timer.remainingWorkTime / 1000;
    countDown(seconds, getTime);
  };
  checkPauseAndRestartButton();
})

$(restartWorkTimerButton).on('click', function() {
  $(countDownTimer).toggleClass('unpaused');
  timer.calculateEndOfWorkTimeAfterBreak();
  var seconds = timer.remainingWorkTime / 1000;
  countDown(seconds, getTime);
})

$(clearTimerButton).on('click', resetWorkTimer)
