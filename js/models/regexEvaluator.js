export const regexEvaluator = (function () {
    let testStrings = ""
    let testStringLines = []
    let regexFlags;
    let regexExpr = "";
    let regex;
    const observers = []

    function setTestStrings(_testString) {
        testStrings = _testString;
        testStringLines = [];
        testStrings.split("\n").forEach((line) => {
            testStringLines.push(line);
        })
        _notifyObservers();
    }

    function setRegex(_expr, _flags = "g") {
        regexExpr = _expr
        regexFlags = _flags

        if (_expr.length > 0) {
            try {
                regex = new RegExp(_expr, _flags)
            } catch (e) {
                regex = null;
            }
        } else {
            regex = null;
        }

        _notifyObservers();
    }

    function evaluateRegex() {
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

        if (regex == undefined) {
            return testStringLines.join("\n");
        }

        if (testStringLines == undefined) {
            return "";
        }

        testStringLines.forEach((str) => {
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

    function init() {
    }

    function registerObserver(fn) {
        observers.push(fn);
        _notifyObservers();
    }

    function unregisterObserver(fn) {
        this.observers = this.handlers.filter(item => item !== fn);
        _notifyObservers();
    }

    function _notifyObservers() {
        observers.forEach(function (fn) {
            fn.call(this);
        });
    }

    function getRegexExpression() {
        return regexExpr;
    }

    function getRegexFlags() {
        return regexFlags;
    }

    function getTestStringLines() {
        return testStringLines;
    }

    return {
        "init": init,
        "setRegex": setRegex,
        "setTestStrings": setTestStrings,
        "getRegexFlags": getRegexFlags,
        "getTestStringLines": getTestStringLines,
        "getRegexExpression": getRegexExpression,
        "evaluateRegex": evaluateRegex,
        "registerObserver": registerObserver,
        "unregisterObserver": unregisterObserver,
    }
})();