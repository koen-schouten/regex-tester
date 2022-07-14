const regexEvaluator = (function () {

    let regex;
    let testStrings = [];

    function setRegex(expr, flags = "g") {
        if (expr.length > 0) {
            regex = new RegExp(expr, flags)
        } else {
            regex = null;
        }
    }

    function getRegex() {
        return regex;
    }

    function setTestStrings(...strings) {
        testStrings = strings;
    }

    function _evaluateRegex() {
        let results = [];

        //
        // TODO: Make this function work for non global regex
        //
        // For now this only works for GLOBAL regex because the callback substr.replace 
        // is called for every match when using global regex. 
        // As is if it were replaceAll.
        //  

        //
        // TODO: Make this function work for named capture groups
        // 
        testStrings.forEach((str) => {
            let result = "";
            let index = 0;
            let substr;

            while (index < str.length) {
                substr = str.substring(index, str.length)
                //check if substring contains regex
                if (substr.search(regex) != -1) {
                    //If it contain the regex, surround the found match by mark.
                    //Everything befor the match should be surrounded by span elements (Maybe?)
                    substr.replace(regex, (...args) => {
                        //Capture all arguments from replacerfunction
                        let match = args[0]
                        let captureGroups = args[1, args.length - 2]
                        let offset = args[args.length - 2]
                        let string = args[args.length - 1]
                        let groups = args[args.length]

                        // Before the match
                        if (offset > index) {
                            result = result + "<span>" + str.substring(index, offset) + "</span>";
                        }
                        //The match
                        result = result + "<mark>" + _escapeHTML(match) + "</mark>";
                        //move index to after match
                        index = offset + match.length;
                    })
                }

                //If not match is found put the remaining substr between span tags at the end of the string
                // and break the loop
                else {
                    if (index < str.length) {
                        result = result + "<span>" + _escapeHTML(substr) + "</span>";
                    }
                    break;
                }
            }
            results.push(result);
        })

        return results;
    }

    function _escapeHTML(unsafe) {
        return unsafe.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }


    function getTestStrings(...strings) {
        return testStrings;
    }

    function regexUpdatedHandler() {
        setRegex(regexInput.getRegexString());
        testStringsInput.setTestStringsOutputElement(_evaluateRegex());
    }

    function testStringUpdatedHandler() {
        setTestStrings(testStringsInput.getTestStrings());
        testStringsInput.setTestStringsOutputElement(_evaluateRegex());
    }

    function init() {
        setRegex("");
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
        syncscroll();
    }

    function registerObserver(fn) {
        observers.push(fn);
        _notifyObservers();
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
        "unregisterObserver": unregisterObserver,
        "setTestStringsOutputElement": setTestStringsOutputElement

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
        _notifyObservers();
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

    const regexInputElement = document.getElementById("regex-input");
    const testStringsInputElement = document.getElementById("test-strings-input");
    const testStringsOutputElement = document.getElementById("test-strings-output");

    testStringsInput.init(testStringsInputElement, testStringsOutputElement);
    regexInput.init(regexInputElement);

    testStringsInput.registerObserver(regexEvaluator.testStringUpdatedHandler);
    regexInput.registerObserver(regexEvaluator.regexUpdatedHandler);

    regexEvaluator.init();

}

//======================
//StartingPoint of APP.
//======================
window.addEventListener("DOMContentLoaded", () => {
    init();
})