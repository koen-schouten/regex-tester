const regexEvaluator = (function () {

    let regex = new RegExp();
    let testStrings = [];

    function setRegex(expr, flags = "g") {
        regex = new RegExp(expr, flags)
        console.log(regex);
    }

    function getRegex() {
        return regex;
    }

    function setTestStrings(...strings) {
        testStrings = strings;
        console.log(testStrings);

    }

    function getTestStrings(...strings) {
        return testStrings;
    }

    function regexUpdatedHandler(origin) {
        setRegex(origin.getRegexString());
    }

    function testStringUpdatedHandler(origin) {
        setTestStrings(origin, getTestStrings());
    }

    function init() {
        console.log("test");
    }

    return {
        "init": init,
        "setRegex": setRegex,
        "getRegex": getRegex,
        "setTestStrings": setTestStrings,
        "getTestStrings": getTestStrings,
        "regexUpdatedHandler": regexUpdatedHandler,
        "testStringUpdatedHandler": testStringUpdatedHandler
    }
})();

// In order to have an Editable Textarea that can also be styled,
// we need to create 2 seperate elements that are duplicates. 
// An <textarea> input and a <pre> output that shows the result to the user.
// This code makes sure that these 2 elements are in sync,
//
// see: https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
const testStringsInput = (function () {
    let testStringsInputElement, testStringsOutputElement;
    const observers = []

    function init(_testStringsInputElement, _testStringsOutputElement) {
        testStringsInputElement = _testStringsInputElement;
        testStringsOutputElement = _testStringsOutputElement;

        testStringsOutputElement.innerHTML = escapeHTML(testStringsInputElement.value);

        setupEventListeners();
    }

    function setupEventListeners() {
        testStringsInputElement.addEventListener("input", (event) => {
            event.preventDefault();
            result = event.target.value;
            if (result[result.length - 1] == "\n") { // If the last character is a newline character
                result += " "; // Add a placeholder space character to the final line 
            }

            testStringsOutputElement.innerHTML = escapeHTML(result);
            syncscroll();
            _notifyObservers();
        })

        testStringsInputElement.addEventListener("scroll", (event) => {
            syncscroll();
        });
    }

    function escapeHTML(unsafe) {
        return unsafe.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function syncscroll() {
        testStringsOutputElement.scrollTop = testStringsInputElement.scrollTop;
        testStringsOutputElement.scrollLeft = testStringsInputElement.scrollLeft;
    }

    function getTestStrings() {
        return testStringsInputElement.value;
    }

    function setTestStringsOutputElement(value) {
        testStringsOutputElement.innerHTML = value;
    }

    function registerObserver(fn) {
        observers.push(fn);
    }

    function unregisterObserver(fn) {
        this.observers = this.handlers.filter(item => item !== fn);
    }

    function _notifyObservers() {
        observers.forEach(function (fn) {
            fn.call(this, testStringsInput);
        });
    }

    return {
        "init": init,
        "getTestStrings": getTestStrings,
        "registerObserver": registerObserver,
        "unregisterObserver": unregisterObserver

    }
})();

const regexInput = (function () {
    let regexInputElement;
    const observers = []

    function setupEventListeners() {
        regexInputElement.addEventListener("input", (event) => {
            event.preventDefault();
            _notifyObservers();
        })
    }

    function init(_regexInputElement) {
        regexInputElement = _regexInputElement;
        setupEventListeners();
    }

    function getRegexString() {
        return regexInputElement.value
    }

    function registerObserver(fn) {
        observers.push(fn);
    }

    function unregisterObserver(fn) {
        this.observers = this.handlers.filter(item => item !== fn);
    }

    function _notifyObservers() {
        observers.forEach(function (fn) {
            fn.call(this, regexInput);
        });
    }

    return {
        "init": init,
        "getRegexString": getRegexString,
        "registerObserver": registerObserver,
        "unregisterObserver": unregisterObserver
    }
})();


function init() {
    regexEvaluator.init();

    const regexInputElement = document.getElementById("regex-input");
    const testStringsInputElement = document.getElementById("test-strings-input");
    const testStringsOutputElement = document.getElementById("test-strings-output");

    testStringsInput.init(testStringsInputElement, testStringsOutputElement);
    regexInput.init(regexInputElement);

    testStringsInput.registerObserver(regexEvaluator.testStringUpdatedHandler);
    regexInput.registerObserver(regexEvaluator.regexUpdatedHandler);
}

//======================
//StartingPoint of APP.
//======================
window.addEventListener("DOMContentLoaded", () => {
    init();
})