import { regexEvaluator as regexEvaluator} from "./models/regexEvaluator.js"
import { testStringsInput as testStringsInput } from "./views/testStringInput.js"
import { regexInput as regexInput } from "./views/regexInput.js"

function init() {
    const regexInputElement = document.getElementById("regex-input");
    const testStringsInputElement = document.getElementById("test-strings-input");
    const testStringsOutputElement = document.getElementById("test-strings-output");

    regexEvaluator.init()
    testStringsInput.init(testStringsInputElement, testStringsOutputElement, regexEvaluator);
    regexInput.init(regexInputElement, regexEvaluator);

    regexEvaluator.registerObserver(regexInput.modelUpdatedHandler);
    regexEvaluator.registerObserver(testStringsInput.regexUpdatedHandler)
    regexEvaluator.registerObserver(testStringsInput.testStringUpdatedHandler)
}

//======================
//StartingPoint of APP.
//======================
window.addEventListener("DOMContentLoaded", () => {
    init();
})