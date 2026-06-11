'use strict';

// ===============================
// Tokenizer → Shunting-Yard → RPN Evaluator
// No eval(), no DOM — pure functions only
// ===============================

const OPERATORS = {
  '+': { precedence: 1, assoc: 'L', fn: (a, b) => a + b },
  '-': { precedence: 1, assoc: 'L', fn: (a, b) => a - b },
  '*': { precedence: 2, assoc: 'L', fn: (a, b) => a * b },
  '/': { precedence: 2, assoc: 'L', fn: (a, b) => {
    if (b === 0) { throw new Error('Division by zero'); }
    return a / b;
  }},
  '%': { precedence: 2, assoc: 'L', fn: (a, b) => a % b },
  '^': { precedence: 3, assoc: 'R', fn: (a, b) => Math.pow(a, b) },
};

// ------------------------------
// Tokenizer
// Breaks "12.5+3*(4-1)" into tokens
// ------------------------------
function tokenize(expr) {
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Skip whitespace
    if (/\s/.test(ch)) { i++; continue; }

    // Number (including decimals)
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }
      const val = parseFloat(num);
      if (isNaN(val)) { throw new Error('Invalid number: ' + num); }
      tokens.push({ type: 'number', value: val });
      continue;
    }

    // Operator
    if (OPERATORS[ch]) {
      // Handle unary minus: treat "-" as unary if at start or after "(" or operator
      if (ch === '-') {
        const prev = tokens[tokens.length - 1];
        const isUnary = !prev || prev.type === 'lparen' || prev.type === 'operator';
        if (isUnary) {
          tokens.push({ type: 'unary_minus' });
          i++;
          continue;
        }
      }
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    if (ch === '(') { tokens.push({ type: 'lparen' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'rparen' }); i++; continue; }

    throw new Error('Invalid character: ' + ch);
  }

  return tokens;
}

// ------------------------------
// Shunting-Yard Algorithm
// Converts infix tokens to RPN (Reverse Polish Notation)
// ------------------------------
function toRPN(tokens) {
  const output = [];
  const opStack = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
      continue;
    }

    if (token.type === 'unary_minus') {
      opStack.push(token);
      continue;
    }

    if (token.type === 'operator') {
      const op = OPERATORS[token.value];
      while (opStack.length) {
        const top = opStack[opStack.length - 1];
        if (top.type === 'lparen') { break; }
        if (top.type === 'unary_minus') {
          output.push(opStack.pop());
          continue;
        }
        if (top.type === 'operator') {
          const topOp = OPERATORS[top.value];
          if (topOp.precedence > op.precedence ||
             (topOp.precedence === op.precedence && op.assoc === 'L')) {
            output.push(opStack.pop());
            continue;
          }
        }
        break;
      }
      opStack.push(token);
      continue;
    }

    if (token.type === 'lparen') { opStack.push(token); continue; }

    if (token.type === 'rparen') {
      let matched = false;
      while (opStack.length) {
        const top = opStack.pop();
        if (top.type === 'lparen') { matched = true; break; }
        output.push(top);
      }
      if (!matched) { throw new Error('Mismatched parentheses'); }
      continue;
    }
  }

  while (opStack.length) {
    const top = opStack.pop();
    if (top.type === 'lparen' || top.type === 'rparen') {
      throw new Error('Mismatched parentheses');
    }
    output.push(top);
  }

  return output;
}

// ------------------------------
// RPN Evaluator
// ------------------------------
function evalRPN(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === 'number') {
      stack.push(token.value);
      continue;
    }

    if (token.type === 'unary_minus') {
      if (stack.length < 1) { throw new Error('Invalid expression'); }
      stack.push(-stack.pop());
      continue;
    }

    if (token.type === 'operator') {
      if (stack.length < 2) { throw new Error('Invalid expression'); }
      const b = stack.pop();
      const a = stack.pop();
      stack.push(OPERATORS[token.value].fn(a, b));
      continue;
    }
  }

  if (stack.length !== 1) { throw new Error('Invalid expression'); }
  return stack[0];
}

// ------------------------------
// Public API: evaluateExpression
// Takes a string like "2+3*4" → returns 14
// Throws on invalid input
// ------------------------------
function evaluateExpression(expr) {
  if (typeof expr !== 'string' || expr.trim() === '') {
    throw new Error('Empty expression');
  }

  // Reject characters that have no meaning in our calculator
  if (/[^0-9+\-*/.%^()\s]/.test(expr)) {
    throw new Error('Invalid characters in expression: ' + expr);
  }

  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  const result = evalRPN(rpn);

  if (!isFinite(result)) { throw new Error('Result is not finite'); }
  return result;
}

// ------------------------------
// Custom Feature: HEX Conversion
// Takes a decimal number string → returns uppercase hex string
// e.g. convertToHex("255") → "0xFF"
// ------------------------------
function convertToHex(value) {
  const num = parseFloat(value);

  if (isNaN(num)) { throw new Error('Invalid number for hex conversion'); }
  if (!isFinite(num)) { throw new Error('Value must be finite'); }
  if (num < 0) { throw new Error('Hex conversion requires a non-negative number'); }
  if (!Number.isInteger(num)) { throw new Error('Hex conversion requires a whole number'); }

  return '0x' + num.toString(16).toUpperCase();
}

// ------------------------------
// Export for Node.js / Jest
// (does nothing in the browser)
// ------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluateExpression, convertToHex };
}