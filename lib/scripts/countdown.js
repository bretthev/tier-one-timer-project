'use strict';

const Timer = require('./timer-prototype');

var startTimerButton = $('.start-timer');
var pauseTimerButton = $('.pause-timer');
var resumeTimerButton = $('.resume-timer');
var resetTimerButton = $('.reset-timer');
var changeWorkTimeLengthButton = $('.change-work-time-button');
var changeBreakTimeLengthButton = $('.change-break-time-button');
var userGeneratedWorkTimeLength = $('.work-timer-length');
var userGeneratedBreakTimeLength = $('.break-timer-length');
var pomodoroContainer = $('.pomodoro-container');
var countDownTimer = $('.countdown-timer');
var timerTypeInstructions = $('.timer-type-display');
var fartAudio = new Audio('fart.wav');
var damnDaniel = new Audio('damn-daniel.mp3');
var timer = new Timer({});

populateDomOnPageLoad();

function updateTimerTypeDisplay() {
  if (timer.timerType === 'work timer') {
    $(timerTypeInstructions).html('You should be working.');
  }
  if (timer.timerType === 'break timer') {
    $(timerTypeInstructions).html('You should NOT be working. Go stretch or something.');
  }
}

function updateBackgroundImage() {
  if (timer.timerType === 'work timer') {
    $('.content-container').removeClass('break-background');
    $('.content-container').addClass('work-background');
    $(countDownTimer).addClass('work-countdown');
    $(timerTypeInstructions).addClass('work-countdown');
  }
  if (timer.timerType === 'break timer') {
    $('.content-container').removeClass('work-background');
    $('.content-container').addClass('break-background');
  }
}

function populateDomOnPageLoad() {
  hideInputs();
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
  updateBackgroundImage();
  timer.checkForLast20Seconds(fartAudio);
  timer.sendTimerToLocalStorage();
  if (timer.currentState === 'running') {
    displayRemainingSecondsAsClock(seconds);
    checkForExpiredTimer();
    callback(seconds);
  }
  displayClassMessage();
}

function getTime(){
  timer.findRemainingTime();
  var seconds = timer.timeRemaining / 1000;
  if(seconds >= 0) {
    setTimeout(countDown, 10, seconds, getTime);
  }
}

function displayRemainingSecondsAsClock(seconds) {
  var timeDisplay = timer.changeSecondsToTime(seconds);
  $(countDownTimer).html(timeDisplay);
}

function hideInputs() {
    $(userGeneratedWorkTimeLength).hide();
    $(userGeneratedBreakTimeLength).hide();
}

function hideAllButtons() {
  $(startTimerButton).hide();
  $(pauseTimerButton).hide();
  $(resumeTimerButton).show();
  $(resetTimerButton).hide();
  $(changeWorkTimeLengthButton).hide();
  $(changeBreakTimeLengthButton).hide();
}

function showButtons() {
  $(resetTimerButton).show();
  $(resumeTimerButton).show();
  $(changeWorkTimeLengthButton).show();
  $(changeBreakTimeLengthButton).show();
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

function displayClassMessage() {
  if (timer.currentClass === 'work timer') {
    $(classMessage).text('You should be working.')
  }
  if (timer.currentClass === 'break timer') {
    $(classMessage).text('You should NOT be working.')
  }
}

function setButtonsIfTimerIsRunning() {
  if (timer.currentState === 'running') {
    startTimerButton.hide();
    pauseTimerButton.show();
    resumeTimerButton.hide();
    resetTimerButton.hide();
    changeWorkTimeLengthButton.hide();
    changeBreakTimeLengthButton.hide();
  }
}

function setButtonsIfTimerIsPaused() {
  if (timer.currentState === 'paused') {
    startTimerButton.hide();
    pauseTimerButton.hide();
    resumeTimerButton.show();
    resetTimerButton.show();
    changeWorkTimeLengthButton.show();
    changeBreakTimeLengthButton.show();
  }
}

function setButtonsIfTimerIsNew() {
  if (timer.currentState === 'new timer') {
    startTimerButton.show();
    pauseTimerButton.hide();
    resumeTimerButton.hide();
    resetTimerButton.hide();
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

$(startTimerButton).on('click', function() {
  timer.currentState = 'running';
  updateTimerPropertiesOnStartButton();
  hideInputs();
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
  hideInputs();
  timer.isWorkTimer();
  $(countDownTimer).removeClass('warning');
  timer.currentState = 'new timer';
  timer.timeRemaining = timer.timerLength;
  var seconds = timer.timerLength/1000;
  displayRemainingSecondsAsClock(seconds);
  timer.sendTimerToLocalStorage();
  displayRemainingSecondsAsClock(seconds);
  setAllButtonsDependingOnTimerState();
});

$(changeWorkTimeLengthButton).on('click', function() {
  userGeneratedWorkTimeLength.show();
  userGeneratedBreakTimeLength.hide();
  $(countDownTimer).addClass('blur-background');
  hideAllButtons();
});

$(changeBreakTimeLengthButton).on('click', function() {
  userGeneratedWorkTimeLength.hide();
  userGeneratedBreakTimeLength.show();
  $(countDownTimer).addClass('blur-background');
  hideAllButtons();
});

function resetTimerWithNewInput() {
  timer.timerLength = timer.changeMinutesToMilliseconds(getUserWorkInput());
  timer.isWorkTimer();
  timer.currentState = 'new timer';
}

$(userGeneratedWorkTimeLength).on('keypress', function(e) {
  if (e.keyCode === 13) {
    timer.isWorkTimer();
    $(countDownTimer).removeClass('warning');
    timer.currentState = 'new timer';
    timer.timeRemaining = timer.timerLength;
    var seconds = timer.changeMinutesToSeconds(getUserWorkInput());
    displayRemainingSecondsAsClock(seconds);
    timer.sendTimerToLocalStorage();
    setAllButtonsDependingOnTimerState();
    hideInputs();
    $(countDownTimer).removeClass('blur-background');
  }
});

$(userGeneratedBreakTimeLength).on('keypress', function(e) {
  if (e.keyCode === 13) {
    timer.nextTimerLength = timer.changeMinutesToMilliseconds(getUserBreakInput());
    userGeneratedBreakTimeLength.hide();
    $(countDownTimer).removeClass('blur-background');
    showButtons();
  }
});

$('.clock-icon').on('click', function() {
  damnDaniel.play();
});
