const Timer = require('./timer-prototype')

var startWorkTimerButton = $('.start-timer');
var pauseWorkTimerButton = $('.pause-timer');
var restartWorkTimerButton = $('.restart-timer');
var userGeneratedWorkTimeLength = $('.work-timer-length');


var timer = new Timer({});

function countDown(seconds, callback) {
  $('.work-timer').html(seconds);
  seconds--;
  callback(seconds);
}

function getTime(seconds){
  if(seconds >= 0) {
    setTimeout(countDown, 1000, seconds, getTime);
  };
}

function getUserInput() {
  return +userGeneratedWorkTimeLength.val();
}

function convertUserWorkTimeLengthToSeconds(minutes) {
  return timer.changeMinutesToSeconds(minutes);
}

$(startWorkTimerButton).on('click', function() {
  var userInput = getUserInput();
  var seconds = convertUserWorkTimeLengthToSeconds(userInput);
  timer.generateStartedWorkTime();
  timer.workTimerLength = timer.changeSecondsToMilliseconds(seconds);
  timer.calculateEndOfWorkTime();
  countDown(seconds, getTime);
})

$(pauseWorkTimerButton).on('click', function() {
  timer.findRemainingWorkTime();
})

$(restartWorkTimerButton).on('click', function() {
  timer.calculateEndOfWorkTimeAfterBreak();
  debugger;
})
