const Timer = require('./timer-prototype')

var startWorkTimerButton = $('.start-timer');
var pauseWorkTimerButton = $('.pause-timer');
var restartWorkTimerButton = $('.restart-timer');
var userGeneratedWorkTimeLength = $('.work-timer-length');

var timer = new Timer({});

function countDown(seconds, callback) {
  if ($('h2').hasClass('unpaused'))
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
  element.toggleClass
}

// function pauseInterval() {}

// $( "#mydiv" ).hasClass( "foo" )


$(startWorkTimerButton).on('click', function() {
  $('h2').toggleClass('unpaused');
  var userInput = getUserInput();
  var seconds = convertUserWorkTimeLengthToSeconds(userInput);
  timer.generateStartedWorkTime();
  timer.workTimerLength = timer.changeSecondsToMilliseconds(seconds);
  timer.calculateEndOfWorkTime();
  countDown(seconds, getTime);
})

$(pauseWorkTimerButton).on('click', function() {
  $('h2').toggleClass('unpaused');
  timer.findRemainingWorkTime();
})

$(restartWorkTimerButton).on('click', function() {
  debugger;
  $('h2').toggleClass('unpaused');
  timer.calculateEndOfWorkTimeAfterBreak();
  var seconds = timer.remainingWorkTime / 1000;
  countDown(seconds, getTime)
})
