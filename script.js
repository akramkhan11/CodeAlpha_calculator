
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
    currentDisplay.textContent = currentValue;
}

function inputNumber(number) {
    if (currentValue === "Error") clearCalculator();

    if (shouldReset) {
        currentValue = number;
        shouldReset = false;
    } else {
        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentValue === "Error") clearCalculator();

    if (shouldReset) {
        currentValue = "0";
        shouldReset = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (currentValue === "Error") return;

    if (operator && !shouldReset) {
        calculate();
    }

    previousValue = Number(currentValue);
    operator = nextOperator;
    shouldReset = true;

    previousDisplay.textContent =
        `${previousValue} ${operator}`;
}

function calculate() {
    if (operator === null || previousValue === null) return;

    const current = Number(currentValue);
    let result;

    switch (operator) {
        case "+":
            result = previousValue + current;
            break;

        case "−":
            result = previousValue - current;
            break;

        case "×":
            result = previousValue * current;
            break;

        case "÷":
            if (current === 0) {
                currentValue = "Error";
                previousDisplay.textContent = "Cannot divide by zero";
                previousValue = null;
                operator = null;
                shouldReset = true;
                updateDisplay();
                return;
            }
            result = previousValue / current;
            break;
    }

    currentValue = String(
        Number.parseFloat(result.toPrecision(12))
    );

    previousValue = null;
    operator = null;
    shouldReset = true;
    previousDisplay.textContent = "= ";
    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    shouldReset = false;

    previousDisplay.textContent = "";
    updateDisplay();
}

function deleteNumber() {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    if (shouldReset) return;

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    if (currentValue === "-") currentValue = "0";

    updateDisplay();
}

function percentage() {
    if (currentValue === "Error") return;

    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
}

function changeSign() {
    if (currentValue === "Error" || currentValue === "0") return;

    currentValue = String(Number(currentValue) * -1);
    updateDisplay();
}

// Button click events
document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "clear") clearCalculator();
        if (action === "delete") deleteNumber();
        if (action === "decimal") inputDecimal();
        if (action === "equals") calculate();
        if (action === "percent") percentage();
        if (action === "sign") changeSign();
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) inputNumber(key);
    else if (key === ".") inputDecimal();
    else if (key === "+") chooseOperator("+");
    else if (key === "-") chooseOperator("−");
    else if (key === "*") chooseOperator("×");
    else if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
    }
    else if (key === "Enter" || key === "=") calculate();
    else if (key === "Backspace") deleteNumber();
    else if (key === "Escape") clearCalculator();
    else if (key === "%") percentage();
});
