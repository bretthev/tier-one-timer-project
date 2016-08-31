const Timer = require('./timer-prototype');
require('./countdown');


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

$('.beach-icon').on('click', function() {
  damnDaniel.play();
});
