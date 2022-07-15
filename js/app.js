const regexEvaluator = (function () {
    function _evaluateRegex(regex, testStrings) {
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

        if(regex == undefined){
            return testStrings.join("\n");
        }

        if(testStrings == undefined){
            return "";
        }

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

                        // Formating text before match
                        if (offset > index) {
                            result = result + "<span>" + str.substring(index, offset) + "</span>";
                        }
                        // Formating the match
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
        return results.join("\n");
    }

    function _escapeHTML(unsafe) {
        return unsafe.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function regexUpdatedHandler() {
        testStringsInput.setTestStringsOutputElement(_evaluateRegex(regexInput.getRegex(),
            testStringsInput.getTestStrings()));
    }

    function testStringUpdatedHandler() {
        let output = _evaluateRegex(regexInput.getRegex(), testStringsInput.getTestStrings());
        testStringsInput.setTestStringsOutputElement(output);
    }

    return {
        "init": init,
        "regexUpdatedHandler": regexUpdatedHandler,
        "testStringUpdatedHandler": testStringUpdatedHandler
    }
})();

//
// TODO: Make teststrings savable
//

// In order to have an Editable Textarea that can also be styled,
// we need to create 2 seperate elements that are duplicates. 
// An <textarea> input and a <pre> output that shows the result to the user.
// This code makes sure that these 2 elements are in sync,
//
// see: https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
const testStringsInput = (function () {
    let testStringsInputElement, testStringsOutputElement;
    let testStrings = []
    const observers = []


    function init(_testStringsInputElement, _testStringsOutputElement) {
        testStringsInputElement = _testStringsInputElement;
        testStringsOutputElement = _testStringsOutputElement;
        setTestStrings(testStringsInputElement.value);
        testStringsOutputElement.innerText = _escapeHTML(testStrings);
        setupEventListeners();
    }

    function setTestStrings(_testStrings){
        let lines = [];
        _testStrings.split("\n").forEach((line)=>{
            lines.push(line);
        })
        testStrings = lines;
        _notifyObservers();
    }

    function setupEventListeners() {
        testStringsInputElement.addEventListener("input", (event) => {
            event.preventDefault();
            setTestStrings(testStringsInputElement.value);
            syncscroll();
        })

        testStringsInputElement.addEventListener("scroll", (event) => {
            syncscroll();
        });
    }

    function _escapeHTML(unsafe) {
        return unsafe.forEach((unsafe)=> {unsafe.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
        });
    }
    

    function syncscroll() {
        testStringsOutputElement.scrollTop = testStringsInputElement.scrollTop;
        testStringsOutputElement.scrollLeft = testStringsInputElement.scrollLeft;
    }

    function getTestStrings() {
        return testStrings;
    }

    function setTestStringsOutputElement(raw_html) {
        testStringsOutputElement.innerHTML = raw_html;
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
        "setTestStrings": setTestStrings,
        "getTestStrings": getTestStrings,
        "registerObserver": registerObserver,
        "unregisterObserver": unregisterObserver,
        "setTestStringsOutputElement": setTestStringsOutputElement
    }
})();


// TODO: Add menu for picking regex flags
// TODO: Make regex savable
const regexInput = (function () {
    let regexInputElement;
    let regex;
    const observers = []

    function setRegex(expr, flags = "g") {
        if (expr.length > 0) {
            try {
                regex = new RegExp(expr, flags)
            } catch (e) {
                regex = null;
            }
        } else {
            regex = null;
        }

        _notifyObservers();
    }

    
    function setupEventListeners() {
        regexInputElement.addEventListener("input", (event) => {
            event.preventDefault();
            setRegex(regexInputElement.value);
        })
    }

    function init(_regexInputElement) {
        regexInputElement = _regexInputElement;
        setRegex(regexInputElement.value);
        setupEventListeners();
    }

    function getRegex() {
        return regex;
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
        "setRegex": setRegex,
        "getRegex": getRegex,
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

}

//======================
//StartingPoint of APP.
//======================
window.addEventListener("DOMContentLoaded", () => {
    init();
})