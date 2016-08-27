const Timer = require('./timer-prototype')

var startWorkTimerButton = $('.start-timer');
var pauseAndRestartWorkTimerButton = $('.pause-and-restart-timer');
var restartWorkTimerButton = $('.restart-timer');
var userGeneratedWorkTimeLength = $('.work-timer-length');
var countDownTimer = $('.work-timer');
var clearTimerButton = $('.clear-timer');

var timer = new Timer({});

function countDown(seconds, callback) {
  if (timer.currentState === 'running')
  {$('.work-timer').html(seconds);
  // seconds--;
  callback(seconds)}
  else {$('.work-timer').html(timer.remainingWorkTime / 1000)};
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

function clearInputValue() {
  userGeneratedWorkTimeLength.val('');
}


function setsButtonTextIfTimerIsRunning() {
  if (timer.currentState === 'running') {
    startWorkTimerButton.attr('disabled', true);
    pauseAndRestartWorkTimerButton.text('Pause');
    pauseAndRestartWorkTimerButton.attr('disabled', false)
    restartWorkTimerButton.attr('disabled', false);

  }
}

function updateTimerPropertiesOnStartButton(timer) {
  var userInput = getUserInput();
  if (userInput > 0) { timer.workTimerLength = timer.changeMinutesToMilliseconds(userInput)}
  timer.generateStartedWorkTime();
  timer.calculateEndOfWorkTime();
}

function setsButtonTextIfTimerIsPaused() {
  if (timer.currentState === 'paused') {
    pauseAndRestartWorkTimerButton.text('Unpause');
    clearTimerButton.attr('disabled', false);
  }
}

function setsButtonTextIfTimerIsNew() {
  if (timer.currentState === 'new timer') {
    startWorkTimerButton.text('Start');
    pauseAndRestartWorkTimerButton.attr('disabled', true);
    clearTimerButton.attr('disabled', true);
  }
}

function setAllButtons() {
  setsButtonTextIfTimerIsRunning();
  setsButtonTextIfTimerIsPaused();
  setsButtonTextIfTimerIsNew();
}

function resetWorkTimer() {
  var seconds = timer.workTimerLength / 1000;
  countDownTimer.text(seconds);
  setAllButtons();
  startWorkTimerButton.text('Start');
}

$(startWorkTimerButton).on('click', function() {
  updateTimerPropertiesOnStartButton(timer);
  timer.currentState = 'running';
  setAllButtons();
  var seconds = timer.workTimerLength / 1000;
  countDown(seconds, getTime);
})

$(pauseAndRestartWorkTimerButton).on('click', function() {
  debugger;
    if (timer.currentState === 'running') {
      timer.findRemainingWorkTime();
      countDown(timer.remainingWorkTime/1000, getTime);
    }
    if (timer.currentState === 'paused') {
      timer.calculateEndOfWorkTimeAfterBreak();
      var seconds = timer.remainingWorkTime / 1000;
      countDown(seconds, getTime)
    }
    if (timer.currentState === 'running') 
    setAllButtons();
})

$(restartWorkTimerButton).on('click', function() {
  $(countDownTimer).toggleClass('unpaused');
  timer.calculateEndOfWorkTimeAfterBreak();
  var seconds = timer.remainingWorkTime / 1000;
  countDown(seconds, getTime);
})

$(clearTimerButton).on('click', resetWorkTimer)


//next two functions updates button text if timer is paused
// function checkPauseAndRestartButton() {
//   if (countDownTimer.hasClass('unpaused')) {
//     pauseAndRestartWorkTimerButton.text('Pause');
//   }
//   else {
//     pauseAndRestartWorkTimerButton.text('Unpause');
//   }
// }

//updates button text if timer is new


//next two functions update button text if timer is running
// function checkStartButton() {
//   if (countDownTimer.val() !== timer.workTimerLength / 1000) {
//     startWorkTimerButton.text('Restart');
//     pauseAndRestartWorkTimerButton.text('Pause');
//   }
// }

// function disableEnableButton() {
//   if(+countDownTimer.text() === timer.workTimerLength / 1000) {
//     pauseAndRestartWorkTimerButton.attr('disabled', true);
//   }
//   else {
//     pauseAndRestartWorkTimerButton.attr('disabled', false);
//   };
// }


//start timer on click
// pauseAndRestartWorkTimerButton.attr('disabled', false)
// if (countDownTimer.hasClass('unpaused')) {
//   seconds = timer.workTimerLength / 1000;
//   clearInputValue();
//   timer.generateStartedWorkTime();
//   timer.workTimerLength = timer.changeSecondsToMilliseconds(seconds);
//   timer.calculateEndOfWorkTime();
//   countDown(seconds, getTime);
// }
// else {
//   $(countDownTimer).toggleClass('unpaused');
//   var userInput = getUserInput();
//   checkStartButton();
//   var seconds;
//   if (userInput === 0) { seconds = timer.workTimerLength / 1000}
//   else {seconds = convertUserWorkTimeLengthToSeconds(userInput)};
//     clearInputValue();
//     timer.generateStartedWorkTime();
//     timer.workTimerLength = timer.changeSecondsToMilliseconds(seconds);
//     timer.calculateEndOfWorkTime();
//     countDown(seconds, getTime);
//   };
