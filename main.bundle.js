/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function Timer(timerProperties) {
	  this.workTimerLength = timerProperties.workTimerLength || 1500000;
	  this.startedWorkTime = timerProperties.startedWorkTime;
	  this.endWorkTime = timerProperties.endWorkTime;
	  this.remainingWorkTime = timerProperties.remainingTime;
	  // this.breakTimerLength = timerProperties.breakTimerLength || 300000;
	  // this.startedBreakTime = timerProperties.startedBreakTime;
	  // this.endBreakTime = timerProperties.endBreakTime;
	  // this.remainingBreakTime = timerProperties.remainingBreakTime;
	}

	Timer.prototype.changeMillisecondsToSeconds = function(milliseconds) {
	  return milliseconds / 1000;
	};

	Timer.prototype.changeSecondsToMilliseconds = function(seconds) {
	  return seconds * 1000;
	};

	Timer.prototype.changeSecondsToMinutes = function(seconds) {
	  if (seconds > 60) { return seconds / 60;  }
	  else { return seconds + ' seconds'; }
	};

	Timer.prototype.changeMinutesToMilliseconds = function(minutes) {
	  var seconds = minutes * 60;
	  return seconds * 1000;
	};

	Timer.prototype.changeMinutesToSeconds = function(minutes) {
	  return minutes * 60;
	};

	Timer.prototype.changeMinutesToHours = function(minutes) {
	  if (minutes > 60) { return minutes / 60; }
	};

	Timer.prototype.generateStartedWorkTime = function() {
	  this.startedWorkTime = Date.now();
	};

	Timer.prototype.calculateEndOfWorkTime = function() {
	  this.endWorkTime = this.startedWorkTime + this.workTimerLength;
	};

	Timer.prototype.calculateEndOfWorkTimeAfterBreak = function() {
	  this.generateStartedWorkTime();
	  this.endWorkTime = this.startedWorkTime + this.remainingWorkTime;
	};

	Timer.prototype.findRemainingWorkTime = function() {
	  this.remainingWorkTime = this.endWorkTime - Date.now();
	}

	Timer.prototype.changeSecondsToEnglish = function(seconds) {
	  leftOverSeconds = Math.floor(seconds % 60);
	  minutes = Math.floor(seconds / 60);
	  return `${minutes} minute(s) and ${leftOverSeconds} seconds left.`
	}

	Timer.prototype.findRemainingWorkTime = function() {
	  this.remainingWorkTime = this.endWorkTime - Date.now();
	};
	// Timer.prototype.generateStartedBreakTime = function() {
	//   this.startedBreakTime = Date.now();
	// };
	//
	// Timer.prototype.calculateEndOfBreakTime = function() {
	//   this.generateStartedBreakTime();
	//   this.endBreakTime = this.startedBreakTime + this.BreakTimerLength;
	// }
	//
	// };


	// Timer.prototype.findRemainingBreakTime = function() {
	//   this.remainingBreakTime = this.endBreakTime - this.startedBreakTime;
	// };
	//
	// Timer.prototype.pauseWorkTimer = function() {
	//   this.endWorkTime = Date.now();
	// };
	//
	// Timer.prototype.restartWorkTimer = function() {
	//   this.endWorkTime = this.endWorkTime + this.remainingWorkTime;
	// };

	module.exports = Timer;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Timer = __webpack_require__(1)

	var startWorkTimerButton = $('.start-timer');
	var pauseAndRestartWorkTimerButton = $('.pause-and-restart-timer');
	var restartWorkTimerButton = $('.restart-timer');
	var userGeneratedWorkTimeLength = $('.work-timer-length');
	var countDownTimer = $('.work-timer');
	var clearTimerButton = $('.clear-timer');

	var timer = new Timer({});

	function countDown(seconds, callback) {
	  if ($(countDownTimer).hasClass('unpaused'))
	  // var englishSeconds = timer.changeSecondsToEnglish(seconds)
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
	  pauseAndRestartWorkTimerButton.attr('disabled', false)
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


/***/ }
/******/ ]);