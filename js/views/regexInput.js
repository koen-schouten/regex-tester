// TODO: Add menu for picking regex flags
export const regexInput = (function () {
    let regexInputElement;
    let regexEvaluator;
  
    function setupEventListeners() {
        regexInputElement.addEventListener("input", (event) => {
            event.preventDefault();
            regexEvaluator.setRegex(regexInputElement.value);
        })
    }

    function init(_regexInputElement, _regexEvaluator) {
        regexInputElement = _regexInputElement;
        regexEvaluator = _regexEvaluator
        regexEvaluator.setRegex(regexInputElement.value)
        setupEventListeners();
    }

    function modelUpdatedHandler(){
        regexInputElement.value = regexEvaluator.getRegexExpression();
    }

    return {
        "init": init,
        "modelUpdatedHandler": modelUpdatedHandler
    }
})();