// In order to have an Editable Textarea that can also be styled,
// we need to create 2 seperate elements that are duplicates. 
// An <textarea> input and a <pre> output that shows the result to the user.
// This code makes sure that these 2 elements are in sync,
//
// see: https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
export const testStringsInput = (function () {
    let testStringsInputElement, testStringsOutputElement;
    let regexEvaluator;


    function init(_testStringsInputElement, _testStringsOutputElement, _regexEvaluator) {
        testStringsInputElement = _testStringsInputElement;
        testStringsOutputElement = _testStringsOutputElement;
        regexEvaluator = _regexEvaluator;

        regexEvaluator.setTestStrings(_testStringsInputElement.value)

        setupEventListeners();
    }


    function setupEventListeners() {
        testStringsInputElement.addEventListener("input", (event) => {
            event.preventDefault();
            regexEvaluator.setTestStrings(testStringsInputElement.value);
            syncscroll();
        })

        testStringsInputElement.addEventListener("scroll", (event) => {
            syncscroll();
        });
    }

    function syncscroll() {
        testStringsOutputElement.scrollTop = testStringsInputElement.scrollTop;
        testStringsOutputElement.scrollLeft = testStringsInputElement.scrollLeft;
    }

    function setTestStringsInputElement(inputString){
        testStringsInputElement.value = inputString;
    }


    function setTestStringsOutputElement(raw_html) {
        testStringsOutputElement.innerHTML = raw_html;
        syncscroll();
    }

    function testStringUpdatedHandler(){
        setTestStringsInputElement(regexEvaluator.getTestStrings());
        setTestStringsOutputElement(regexEvaluator.evaluateRegex());
    }

    function regexUpdatedHandler(){
        setTestStringsOutputElement(regexEvaluator.evaluateRegex());
    }

    return {
        "init": init,
        "regexUpdatedHandler": regexUpdatedHandler,
        "testStringUpdatedHandler": testStringUpdatedHandler,
        "setTestStringsOutputElement": setTestStringsOutputElement
    }
})();