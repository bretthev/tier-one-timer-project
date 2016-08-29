'use strict';

const Timer = require('./timer-prototype')

var startTimerButton = $('.start-timer');
var pauseTimerButton = $('.pause-timer');
var resumeTimerButton = $('.resume-timer');
var resetTimerButton = $('.reset-timer');
var userGeneratedWorkTimeLength = $('.work-timer-length');
var userGeneratedBreakTimeLength = $('.break-timer-length');
var countDownTimer = $('.countdown-timer');
var timerTypeInstructions = $('.timer-type-display');
var allButtons = [startTimerButton, pauseTimerButton, resumeTimerButton, resetTimerButton]

var timer = new Timer({});

populateDomOnPageLoad();

function updateTimerTypeDisplay() {
  if (timer.timerType === 'work timer') {
    $(timerTypeInstructions).html('You should be working.');
  }
  if (timer.timerType === 'break timer') {
    $(timerTypeInstructions).html('You should NOT be working. Go stretch or something.')
  }
}

function populateDomOnPageLoad() {
  debugger;
  var storedTimer = timer.getTimerFromLocalStorage();
  if (storedTimer) {
    var seconds = storedTimer.timeRemaining / 1000;
    timer.timerLength = storedTimer.timerLength;
    timer.nextTimerLength = storedTimer.nextTimerLength;
    timer.timeRemaining = storedTimer.timeRemaining;
    timer.currentState = storedTimer.currentState;
    timer.timeLeftAtPause = storedTimer.timeRemaining;
    timer.generateStartedTime();
    timer.calculateEndTimeAfterBreak();
    setAllButtonsDependingOnTimerState();
    displayRemainingSecondsAsClock(seconds);
    countDown(seconds, getTime);
  }
}

function countDown(seconds, callback) {
  updateTimerTypeDisplay();
  // var fartAudio = new Audio("fart.wav");
  timer.checkForLast20Seconds();
  timer.sendTimerToLocalStorage();
  if (timer.currentState === 'running') {
    displayRemainingSecondsAsClock(seconds);
    checkForExpiredTimer();
    callback(seconds);
  }
}

function displayRemainingSecondsAsClock(seconds) {
  var timeDisplay = timer.changeSecondsToTime(seconds);
  $(countDownTimer).html(timeDisplay);
}

function getTime(){
  timer.findRemainingTime();
  var seconds = timer.timeRemaining / 1000;
  if(seconds >= 0) {
    setTimeout(countDown, 10, seconds, getTime);
  }
}

function getUserWorkInput() {
  return +userGeneratedWorkTimeLength.val();
  clearWorkInput();
}

function getUserBreakInput() {
  return +userGeneratedBreakTimeLength.val();
  clearBreakInput();
}

function convertUserTimeLengthToSeconds(minutes) {
  return timer.changeMinutesToSeconds(minutes);
}

function clearWorkInput() {
  userGeneratedWorkTimeLength.val('');
}

function clearBreakInput() {
  userGeneratedBreakTimeLength.val('');
}

function checkForExpiredTimer() {
  if (countDownTimer.text() === '0:00') {
    timer.checkForTimerEnd();
  }
}

function setButtonsIfTimerIsRunning() {
  if (timer.currentState === 'running') {
    startTimerButton.attr('hidden', true);
    pauseTimerButton.attr('hidden', false);
    resumeTimerButton.attr('hidden', true);
    resetTimerButton.attr('hidden', false);
  }
}

function setButtonsIfTimerIsPaused() {
  if (timer.currentState === 'paused') {
    startTimerButton.attr('hidden', true);
    pauseTimerButton.attr('hidden', true);
    resumeTimerButton.attr('hidden', false);
    resetTimerButton.attr('hidden', false);
  }
}

function setButtonsIfTimerIsNew() {
  if (timer.currentState === 'new timer') {
    startTimerButton.attr('hidden', false);
    pauseTimerButton.attr('hidden', true);
    resumeTimerButton.attr('hidden', true);
    resetTimerButton.attr('hidden', true);
  }
}

function updateTimerPropertiesOnStartButton() {
  var minutes = getUserWorkInput();
  var breakMinutes = getUserBreakInput();
  if (minutes > 0) {
    timer.timerLength = timer.changeMinutesToMilliseconds(minutes);
  }
  timer.generateStartedTime();
  timer.calculateEndTime();
  if (breakMinutes > 0) {
    timer.nextTimerLength = timer.changeMinutesToMilliseconds(breakMinutes);
  }
}

function setAllButtonsDependingOnTimerState() {
  setButtonsIfTimerIsRunning();
  setButtonsIfTimerIsPaused();
  setButtonsIfTimerIsNew();
}

function hideDisabledButtons(buttonArray) {
  debugger;
  for (var i = 0; i < buttonArray.length; i++) {
    if (buttonArray[i].attr('disabled')) {
      buttonArray[i].attr('hidden', true);
    }
  }
}

$(startTimerButton).on('click', function() {
  timer.currentState = 'running';
  updateTimerPropertiesOnStartButton();
  var seconds = timer.timerLength / 1000;
  countDown(seconds, getTime);
  setAllButtonsDependingOnTimerState();
});

$(pauseTimerButton).on('click', function() {
  timer.currentState = 'paused';
  timer.timeLeftAtPause = timer.endTime - Date.now();
  var seconds = timer.timeLeftAtPause / 1000;
  displayRemainingSecondsAsClock(seconds);
  timer.findRemainingTime();
  timer.sendTimerToLocalStorage();
  setAllButtonsDependingOnTimerState();
});

$(resumeTimerButton).on('click', function() {
  timer.currentState = 'running';
  timer.calculateEndTimeAfterBreak();
  timer.timeRemaining = timer.timeLeftAtPause;
  var seconds = timer.timeRemaining / 1000;
  countDown(seconds, getTime);
  setAllButtonsDependingOnTimerState();
});

$(resetTimerButton).on('click', function() {
  timer.timerType = 'work timer';
  timer.nextTimerType = 'break timer';
  $(countDownTimer).removeClass('warning');
  timer.currentState = 'new timer';
  timer.timeRemaining = timer.timerLength;
  var seconds = timer.timerLength/1000;
  displayRemainingSecondsAsClock(seconds);
  timer.sendTimerToLocalStorage();
  displayRemainingSecondsAsClock(seconds);
  setAllButtonsDependingOnTimerState();
});

$('.test-button').on('click', function() {
  var fartAudio = new Audio("fart.wav");
  fartAudio.play();
});
