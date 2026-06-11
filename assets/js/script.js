'use strict';
/* eslint-disable no-unused-vars */

// ===============================
// UI Wiring — DOM only
// All maths lives in src/calculator.js
// Functions are called via onclick="" in index.html,
// not from JS — ESLint can't see HTML so warns about them.
// ===============================

var currentExpression = '';
var LAST_RESULT = 0;

// ------------------------------
// Theme Toggle
// ------------------------------
function toggleTheme() {
  var body = document.body;
  var btn = document.getElementById('theme-toggle');

  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    btn.innerHTML = '☀️';
    btn.title = 'Switch to light mode';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.innerHTML = '🌙';
    btn.title = 'Switch to dark mode';
    localStorage.setItem('theme', 'light');
  }
}

window.addEventListener('DOMContentLoaded', function () {
  var theme = localStorage.getItem('theme');
  var btn = document.getElementById('theme-toggle');

  if (btn) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      btn.innerHTML = '☀️';
      btn.title = 'Switch to light mode';
    } else {
      btn.innerHTML = '🌙';
      btn.title = 'Switch to dark mode';
    }
  }
});

// ------------------------------
// Display
// ------------------------------
function updateDisplay() {
  document.getElementById('result').value = currentExpression || '0';
}

// ------------------------------
// Button Handlers
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateDisplay();
}

function bracketToResult(value) {
  currentExpression += value;
  updateDisplay();
}

function operatorToResult(value) {
  currentExpression += value;
  updateDisplay();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function clearResult() {
  currentExpression = '';
  updateDisplay();
}

// ------------------------------
// Percent Helper
// "200+10%" → uses engine to compute 200, then applies 10% of that
// ------------------------------
function percentToResult() {
  if (!currentExpression) { return; }

  var match = currentExpression.match(/^(.+?)([+\-*/%])([0-9.]+)$/);

  if (!match) {
    var num = parseFloat(currentExpression);
    if (isNaN(num)) { return; }
    currentExpression = (num / 100).toString();
  } else {
    var leftPart = match[1];
    var rightPart = match[3];
    if (!rightPart) { return; }

    var leftVal;
    try {
      leftVal = evaluateExpression(leftPart);
    } catch (_e) {
      leftVal = parseFloat(leftPart);
    }

    var rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) { return; }

    var percentVal = (leftVal * rightVal) / 100;
    currentExpression = leftPart + match[2] + percentVal.toString();
  }

  updateDisplay();
}

// ------------------------------
// Calculate (= button)
// ------------------------------
function calculateResult() {
  if (!currentExpression) { return; }

  var display = document.getElementById('result');

  // Substitute "ans" with the last result
  var expr = currentExpression.replace(/\bans\b/gi, LAST_RESULT.toString());

  var result;
  try {
    result = evaluateExpression(expr);
  } catch (_e) {
    display.value = 'Error';
    currentExpression = '';
    return;
  }

  LAST_RESULT = result;
  currentExpression = String(result);
  display.value = currentExpression;
}

// ------------------------------
// HEX button handler — calls engine's convertToHex()
// Named differently to avoid recursion with the engine function
// ------------------------------
function hexButtonPressed() {
  if (!currentExpression) { return; }

  var display = document.getElementById('result');
  var num = parseFloat(currentExpression);

  // If it looks like an expression (not a plain number), evaluate it first
  if (isNaN(num) && currentExpression.match(/[+\-*/%^()]/)) {
    try {
      num = evaluateExpression(currentExpression);
    } catch (_e) {
      display.value = 'Error';
      currentExpression = '';
      return;
    }
  }

  try {
    var result = convertToHex(num.toString());
    currentExpression = result;
    display.value = result;
  } catch (e) {
    display.value = e.message;
    currentExpression = '';
  }
}