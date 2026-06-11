'use strict';

const { evaluateExpression, convertToHex } = require('../src/calculator');

// ===============================
// Arithmetic Tests
// ===============================
describe('evaluateExpression — basic arithmetic', () => {
  it('adds two numbers', () => {
    expect(evaluateExpression('2+3')).toBe(5);
  });

  it('subtracts two numbers', () => {
    expect(evaluateExpression('10-4')).toBe(6);
  });

  it('multiplies two numbers', () => {
    expect(evaluateExpression('3*4')).toBe(12);
  });

  it('divides two numbers', () => {
    expect(evaluateExpression('20/4')).toBe(5);
  });

  it('respects operator precedence (2+3*4 = 14)', () => {
    expect(evaluateExpression('2+3*4')).toBe(14);
  });

  it('handles parentheses correctly', () => {
    expect(evaluateExpression('(2+3)*4')).toBe(20);
  });

  it('handles decimal numbers', () => {
    expect(evaluateExpression('1.5+2.5')).toBe(4);
  });

  it('handles unary minus', () => {
    expect(evaluateExpression('-5+10')).toBe(5);
  });

  it('handles chained operations', () => {
    expect(evaluateExpression('100-50+25')).toBe(75);
  });

  it('handles modulo', () => {
    expect(evaluateExpression('10%3')).toBe(1);
  });
});

// ===============================
// Error Handling Tests
// ===============================
describe('evaluateExpression — errors', () => {
  it('throws on division by zero', () => {
    expect(() => evaluateExpression('10/0')).toThrow('Division by zero');
  });

  it('throws on invalid characters', () => {
    expect(() => evaluateExpression('2&3')).toThrow();
  });

  it('throws on empty expression', () => {
    expect(() => evaluateExpression('')).toThrow();
  });

  it('throws on mismatched parentheses', () => {
    expect(() => evaluateExpression('(2+3')).toThrow();
  });
});

// ===============================
// Custom Feature: HEX Conversion
// ===============================
describe('convertToHex — custom feature', () => {
  it('converts 255 to 0xFF', () => {
    expect(convertToHex('255')).toBe('0xFF');
  });

  it('converts 0 to 0x0', () => {
    expect(convertToHex('0')).toBe('0x0');
  });

  it('converts 16 to 0x10', () => {
    expect(convertToHex('16')).toBe('0x10');
  });

  it('converts 256 to 0x100', () => {
    expect(convertToHex('256')).toBe('0x100');
  });

  it('converts large number 65535 to 0xFFFF', () => {
    expect(convertToHex('65535')).toBe('0xFFFF');
  });

  it('throws on non-numeric input', () => {
    expect(() => convertToHex('abc')).toThrow('Invalid number');
  });

  it('throws on negative numbers', () => {
    expect(() => convertToHex('-1')).toThrow();
  });

  it('throws on decimal numbers', () => {
    expect(() => convertToHex('3.14')).toThrow();
  });
});