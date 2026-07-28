const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
let currentExpression = '';

function updateDisplay(value) {
  display.value = value;
}

function isOperator(token) {
  return ['+', '-', '*', '/'].includes(token);
}

function precedence(operator) {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/') return 2;
  return 0;
}

function applyOperation(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? 'Error' : a / b;
    default:
      return b;
  }
}

function evaluateExpression(expression) {
  const tokens = expression.match(/\d+(?:\.\d+)?|[+\-*/]/g);
  if (!tokens || tokens.length === 0) return '0';

  const values = [];
  const operators = [];

  const pushResult = () => {
    const b = Number(values.pop());
    const a = Number(values.pop());
    const op = operators.pop();
    const result = applyOperation(a, b, op);
    if (result === 'Error') {
      values.push(result);
      return;
    }
    values.push(result);
  };

  for (const token of tokens) {
    if (/^\d+(?:\.\d+)?$/.test(token)) {
      values.push(Number(token));
    } else if (isOperator(token)) {
      while (operators.length && precedence(operators[operators.length - 1]) >= precedence(token)) {
        pushResult();
      }
      operators.push(token);
    }
  }

  while (operators.length) {
    pushResult();
  }

  return String(values[0]);
}

function handleButtonClick(button) {
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'clear') {
    currentExpression = '';
    updateDisplay('0');
    return;
  }

  if (action === 'number') {
    if (currentExpression === '' || currentExpression === '0') {
      currentExpression = value === '.' ? '0.' : value;
    } else {
      currentExpression += value;
    }
    updateDisplay(currentExpression);
    return;
  }

  if (action === 'operator') {
    if (currentExpression === '') {
      currentExpression = value === '-' ? '-' : '';
    } else {
      currentExpression += value;
    }
    updateDisplay(currentExpression);
    return;
  }

  if (action === 'equals') {
    const result = evaluateExpression(currentExpression);
    currentExpression = result;
    updateDisplay(result);
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => handleButtonClick(button));
});

document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (/^[0-9.]$/.test(key)) {
    const button = document.querySelector(`button[data-value="${key}"]`);
    if (button) button.click();
  }

  if (['+', '-', '*', '/', '=', 'Enter', 'Escape'].includes(key)) {
    if (key === 'Enter') {
      document.querySelector('button[data-action="equals"]').click();
    } else if (key === 'Escape') {
      document.querySelector('button[data-action="clear"]').click();
    } else {
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) button.click();
    }
  }
});
