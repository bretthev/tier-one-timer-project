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

	'use strict';

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function Timer(timerProperties) {
	  this.timerLength = timerProperties.timerLength || 1500000;
	  this.nextTimerLength = timerProperties.nextTimerLength || 300000;
	  this.startedTime = timerProperties.startedTime;
	  this.endTime = timerProperties.endTime;
	  this.timeRemaining = timerProperties.timeRemaining;
	  this.timeLeftAtPause = timerProperties.timeLeftAtPause;
	  this.currentState = timerProperties.currentState || 'new timer';
	  this.timerType = timerProperties.timerType || 'work timer';
	  this.nextTimerType = timerProperties.nextTimerType || 'break timer';
	}

	Timer.prototype.changeMillisecondsToSeconds = function (milliseconds) {
	  return milliseconds / 1000;
	};

	Timer.prototype.changeSecondsToMilliseconds = function (seconds) {
	  return seconds * 1000;
	};

	Timer.prototype.changeSecondsToMinutes = function (seconds) {
	  if (seconds > 60) {
	    return seconds / 60;
	  } else {
	    return seconds + ' seconds';
	  }
	};

	Timer.prototype.changeMinutesToMilliseconds = function (minutes) {
	  return minutes * 60000;
	};

	Timer.prototype.changeMinutesToSeconds = function (minutes) {
	  return minutes * 60;
	};

	Timer.prototype.changeMinutesToHours = function (minutes) {
	  if (minutes > 60) {
	    return minutes / 60;
	  }
	};

	Timer.prototype.generateStartedTime = function () {
	  this.startedTime = Date.now();
	};

	Timer.prototype.calculateEndTime = function () {
	  this.endTime = this.startedTime + this.timerLength;
	};

	Timer.prototype.calculateEndTimeAfterBreak = function () {
	  this.generateStartedTime();
	  this.endTime = this.startedTime + this.timeLeftAtPause;
	};

	Timer.prototype.findRemainingTime = function () {
	  this.timeRemaining = this.endTime - Date.now();
	};

	Timer.prototype.changeSecondsToTime = function (seconds) {
	  var leftOverSeconds = Math.floor(seconds % 60);
	  var minutes = Math.floor(seconds / 60);
	  if (leftOverSeconds < 10) {
	    return minutes + ':0' + leftOverSeconds;
	  } else {
	    return minutes + ':' + leftOverSeconds;
	  }
	};

	Timer.prototype.swapCurrentAndNextTimerLength = function () {
	  var currentTimerLength = this.timerLength;
	  this.timerLength = this.nextTimerLength;
	  this.nextTimerLength = currentTimerLength;
	};

	Timer.prototype.swapTimerTypes = function () {
	  var currentTimerType = this.timerType;
	  this.timerType = this.nextTimerType;
	  this.nextTimerType = currentTimerType;
	};

	Timer.prototype.checkForTimerEnd = function () {
	  if (Date.now() > this.endTime) {
	    this.currentState = 'running';
	    this.swapCurrentAndNextTimerLength();
	    this.swapTimerTypes();
	    this.generateStartedTime();
	    this.calculateEndTime();
	    this.findRemainingTime();
	    $('.countdown-timer').removeClass('warning');
	  }
	};

	Timer.prototype.sendTimerToLocalStorage = function () {
	  localStorage.setItem('timer', JSON.stringify(this));
	};

	Timer.prototype.getTimerFromLocalStorage = function () {
	  return JSON.parse(localStorage.getItem('timer'));
	};

	Timer.prototype.checkForLast20Seconds = function (sound) {
	  if (this.isNearTimeStamp(this.timeRemaining, 21) || this.isNearTimeStamp(this.timeRemaining, 16) || this.isNearTimeStamp(this.timeRemaining, 11) || this.isNearTimeStamp(this.timeRemaining, 6)) {
	    $('.countdown-timer').addClass('warning');
	    sound.play();
	  }
	};

	Timer.prototype.isNearTimeStamp = function (ms, targetSeconds) {
	  var seconds = targetSeconds * 1000;
	  return ms < seconds + 5 && ms > seconds - 5;
	};

	Timer.prototype.isWorkTimer = function () {
	  this.timerType = 'work timer';
	  this.nextTimerType = 'break timer';
	};

	Timer.prototype.nextTimer = function () {
	  if (this.isWorkTimer) {
	    return new Timer('break timer');
	  }
	};

	module.exports = Timer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Timer = __webpack_require__(1);

	var startTimerButton = $('.start-timer');
	var pauseTimerButton = $('.pause-timer');
	var resumeTimerButton = $('.resume-timer');
	var resetTimerButton = $('.reset-timer');
	var changeWorkTimeLengthButton = $('.change-work-time-button');
	var changeBreakTimeLengthButton = $('.change-break-time-button');
	var userGeneratedWorkTimeLength = $('.work-timer-length');
	var userGeneratedBreakTimeLength = $('.break-timer-length');
	var countDownTimer = $('.countdown-timer');
	var timerTypeInstructions = $('.timer-type-display');
	var fartAudio = new Audio('fart.wav');
	var damnDaniel = new Audio('damn-daniel.mp3');
	var timer = new Timer({});

	populateDomOnPageLoad();

	function updateTimerTypeInstructions() {
	  if (timer.timerType === 'work timer') {
	    $(timerTypeInstructions).html('Work.');
	  }
	  if (timer.timerType === 'break timer') {
	    $(timerTypeInstructions).html('Break.');
	  }
	}

	function updateBackgroundImage() {
	  if (timer.timerType === 'work timer') {
	    $('.content-container').removeClass('break-background');
	    $(countDownTimer).addClass('work-countdown');
	    $(countDownTimer).removeClass('break-countdown');
	    $('.content-container').addClass('work-background');
	    $('.beach-icon').hide();
	    $(timerTypeInstructions).addClass('work-countdown');
	  }
	  if (timer.timerType === 'break timer') {
	    $(countDownTimer).removeClass('work-countdown');
	    $(countDownTimer).addClass('break-countdown');
	    $('.clock-icon').hide();
	    $('.beach-icon').show();
	    $('.content-container').removeClass('work-background');
	    $('.content-container').addClass('break-background');
	  }
	}

	function updatesTimerFromStorage() {
	  var storedTimer = timer.getTimerFromLocalStorage();
	  timer.timerLength = storedTimer.timerLength;
	  timer.nextTimerLength = storedTimer.nextTimerLength;
	  timer.timeRemaining = storedTimer.timeRemaining;
	  timer.currentState = storedTimer.currentState;
	  timer.timeLeftAtPause = storedTimer.timeRemaining;
	  timer.generateStartedTime();
	  timer.calculateEndTimeAfterBreak();
	}

	function populateDomOnPageLoad() {
	  hideInputs();
	  var storedTimer = timer.getTimerFromLocalStorage();
	  if (storedTimer) {
	    var seconds = storedTimer.timeRemaining / 1000;
	    updatesTimerFromStorage();
	    setAllButtonsDependingOnTimerState();
	    displayRemainingSecondsAsClock(seconds);
	    countDown(seconds, getTime);
	  }
	}

	function countDown(seconds, callback) {
	  updateTimerTypeInstructions();
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

	function getTime() {
	  timer.findRemainingTime();
	  var seconds = timer.timeRemaining / 1000;
	  if (seconds >= 0) {
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
	    $(classMessage).text('Work.');
	  }
	  if (timer.currentClass === 'break timer') {
	    $(classMessage).text('Break.');
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

	$(startTimerButton).on('click', function () {
	  timer.currentState = 'running';
	  updateTimerPropertiesOnStartButton();
	  hideInputs();
	  var seconds = timer.timerLength / 1000;
	  countDown(seconds, getTime);
	  setAllButtonsDependingOnTimerState();
	});

	$(pauseTimerButton).on('click', function () {
	  timer.currentState = 'paused';
	  timer.timeLeftAtPause = timer.endTime - Date.now();
	  var seconds = timer.timeLeftAtPause / 1000;
	  displayRemainingSecondsAsClock(seconds);
	  timer.findRemainingTime();
	  timer.sendTimerToLocalStorage();
	  setAllButtonsDependingOnTimerState();
	});

	$(resumeTimerButton).on('click', function () {
	  timer.currentState = 'running';
	  timer.calculateEndTimeAfterBreak();
	  timer.timeRemaining = timer.timeLeftAtPause;
	  var seconds = timer.timeRemaining / 1000;
	  countDown(seconds, getTime);
	  setAllButtonsDependingOnTimerState();
	});

	$(resetTimerButton).on('click', function () {
	  hideInputs();
	  timer.isWorkTimer();
	  $(countDownTimer).removeClass('warning');
	  timer.currentState = 'new timer';
	  timer.timeRemaining = timer.timerLength;
	  var seconds = timer.timerLength / 1000;
	  displayRemainingSecondsAsClock(seconds);
	  timer.sendTimerToLocalStorage();
	  displayRemainingSecondsAsClock(seconds);
	  setAllButtonsDependingOnTimerState();
	});

	$(changeWorkTimeLengthButton).on('click', function () {
	  userGeneratedWorkTimeLength.show();
	  userGeneratedBreakTimeLength.hide();
	  $(countDownTimer).addClass('blur-background');
	  hideAllButtons();
	});

	$(changeBreakTimeLengthButton).on('click', function () {
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

	$(userGeneratedWorkTimeLength).on('keypress', function (e) {
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

	$(userGeneratedBreakTimeLength).on('keypress', function (e) {
	  if (e.keyCode === 13) {
	    timer.nextTimerLength = timer.changeMinutesToMilliseconds(getUserBreakInput());
	    userGeneratedBreakTimeLength.hide();
	    $(countDownTimer).removeClass('blur-background');
	    showButtons();
	  }
	});

	$('.clock-icon').on('click', function () {
	  damnDaniel.play();
	});

	$('.beach-icon').on('click', function () {
	  damnDaniel.play();
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "body {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  font-family: 'Cuprum', sans-serif; }\n\n.clock-icon {\n  background: url(/lib/styles/clock.png) no-repeat;\n  background-image: cover;\n  outline: none;\n  width: 25px;\n  height: 25px;\n  border: none;\n  background-color: transparent;\n  position: absolute;\n  top: 4%;\n  left: 40%; }\n\n.beach-icon {\n  background: url(/lib/styles/beach-ball.png) no-repeat;\n  background-image: cover;\n  outline: none;\n  width: 35px;\n  height: 35px;\n  border: none;\n  background-color: transparent;\n  position: absolute;\n  bottom: 1%;\n  right: 2%; }\n\nsection {\n  display: flex;\n  display: -webkit-flex; }\n\n.content-container {\n  height: 100vh;\n  flex-direction: column; }\n\n.work-background {\n  background: url(/lib/styles/busy.jpg) no-repeat;\n  background-size: cover; }\n\n.break-background {\n  background: url(/lib/styles/beach-relax.jpg) no-repeat;\n  background-size: cover; }\n\n.break-background, .timer-type-display, .pop-out-button {\n  text-shadow: #456575; }\n\n.work-countdown {\n  background-color: #7b3ea7; }\n\n.break-countdown {\n  background-color: #456575; }\n\n.pomodoro-container {\n  justify-content: center;\n  align-items: center; }\n\n.input-container {\n  z-index: 2;\n  position: absolute;\n  margin: auto;\n  top: 33%; }\n\ninput {\n  height: 90px;\n  width: 500px;\n  text-align: center;\n  font-size: 2em;\n  z-index: 3;\n  outline: none;\n  border-radius: 20px; }\n\n.timer-type-display {\n  font-size: 2.9em;\n  color: white;\n  text-shadow: 2px 2px #9068be;\n  margin: -webkit-auto;\n  margin: auto;\n  background-color: transparent;\n  border-bottom: 2px solid white; }\n\n.blur-background {\n  -webkit-filter: blur(30px); }\n\n.timer-container {\n  position: relative;\n  z-index: 1;\n  margin-top: 5%;\n  justify-content: -webkit-center;\n  justify-content: center;\n  flex-direction: column;\n  transition-duration: 1s; }\n\n.countdown-timer {\n  display: flex;\n  font-size: 5em;\n  justify-content: center;\n  align-items: center;\n  height: 300px;\n  width: 300px;\n  border-radius: 50%;\n  border: 3px solid white;\n  color: white; }\n\n.background-color-for-working {\n  background-color: #7b3ea7; }\n\n.background-color-for-break {\n  background-color: #456575; }\n\n.button-container {\n  margin-top: 3%;\n  justify-content: space-around; }\n\n.warning {\n  background-color: #ED0000 !important;\n  color: white;\n  -webkit-animation: warning 1s linear infinite; }\n\n@-webkit-keyframes \"warning\" {\n  0% {\n    color: white; }\n  90% {\n    color: rgba(255, 0, 0, 0); }\n  100% {\n    color: white; } }\n\n/* BUTTONS */\n.pop-out-button {\n  font-family: 'Cuprum', sans-serif;\n  display: inline-block;\n  font-weight: 400;\n  font-size: 2.5em;\n  margin-bottom: 2em;\n  position: relative;\n  color: #7b3ea7;\n  transform-style: preserve-3d;\n  z-index: 1;\n  border: none;\n  outline: none;\n  background-color: transparent; }\n\n.pop-out-button:before, .pop-out-button:after {\n  position: absolute;\n  content: attr(data-word);\n  transform-origin: top left;\n  left: 3px; }\n\n.pop-out-button, .pop-out-button:before, .pop-out-button:after {\n  transition: all 0.3s ease-in-out; }\n\n.pop-out-button:before {\n  color: white;\n  z-index: 3;\n  transform: rotateX(0deg); }\n\n.pop-out-button:after {\n  color: gray;\n  z-index: 2;\n  transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }\n\n.pop-out-button:hover:before {\n  color: #fafafa;\n  transform: rotateY(-40deg); }\n\n.pop-out-button:hover:after {\n  transform: rotateY(40deg) skew(0deg, 23deg); }\n\n@media (max-width: 800px) {\n  .button-container {\n    width: 245px;\n    display: block;\n    margin: auto;\n    text-align: center; }\n  .pop-out-button {\n    font-size: 2.7em;\n    margin-bottom: 5px;\n    margin-top: 25px;\n    line-height: .6; }\n  .change-break-time-button {\n    margin-bottom: 30px; } }\n\n@media (max-width: 690px) {\n  .button-container {\n    text-align: center; }\n  .pop-out-button {\n    line-height: .2; }\n  .timer-type-display {\n    font-size: 2.7em;\n    margin-top: 1px;\n    margin-bottom: 2px; }\n  .pop-out-button {\n    font-size: 2.7em; } }\n\n@media only screen and (min-device-width: 375px) and (max-device-width: 667px) {\n  .button-container {\n    text-align: center; }\n  .work-background {\n    background: url(/lib/styles/busy-mobile.jpg) no-repeat; }\n  .countdown-timer {\n    width: 250px;\n    height: 250px;\n    margin-top: 40%; }\n  .timer-type-display {\n    display: none;\n    margin: auto;\n    font-size: 1.5em;\n    width: 100%;\n    text-align: center;\n    z-index: 2;\n    position: absolute;\n    margin-bottom: 200px; }\n  .input-container {\n    top: 26%; }\n  input {\n    width: 300px;\n    height: 80px;\n    font-size: 1.3em; }\n  .blur-background {\n    margin-top: 80px; }\n  .button-container {\n    display: flex;\n    flex-direction: column; }\n  .pop-out-button {\n    font-size: 2.7em;\n    margin-bottom: 20px;\n    margin-top: 40px;\n    line-height: 2; }\n  .change-break-time-button {\n    margin-bottom: 80px; }\n  .pop-out-button:before {\n    position: absolute;\n    right: 6px; }\n  .pop-out-button:after {\n    position: absolute;\n    right: 1px; }\n  .clock-icon {\n    top: 2%;\n    left: 4%; }\n  .beach-icon {\n    bottom: 3%; } }\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);