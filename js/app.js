import { regexEvaluator as regexEvaluator} from "./models/regexEvaluator.js";
import { testStringsInput as testStringsInput } from "./views/testStringInput.js";
import { regexInput as regexInput } from "./views/regexInput.js";
import { regexSaver } from "./regexSaver.js";
import { regexLoader } from "./regexLoader.js";


function initSaveButtons(){
    const saveRegexButton = document.getElementById("save-regex-button");
    regexSaver.init(regexEvaluator);

    saveRegexButton.addEventListener("click", (event)=>{
        console.log("save button clicked");
        regexSaver.save();
    })
}


function init() {
    const regexInputElement = document.getElementById("regex-input");
    const testStringsInputElement = document.getElementById("test-strings-input");
    const testStringsOutputElement = document.getElementById("test-strings-output");

    regexEvaluator.init()
    initSaveButtons();

    testStringsInput.init(testStringsInputElement, testStringsOutputElement, regexEvaluator);
    regexInput.init(regexInputElement, regexEvaluator);

    regexEvaluator.registerObserver(regexInput.modelUpdatedHandler);
    regexEvaluator.registerObserver(testStringsInput.regexUpdatedHandler)
    regexEvaluator.registerObserver(testStringsInput.testStringUpdatedHandler)

    regexLoader.init(regexEvaluator);
    regexLoader.load();
}



//======================
//StartingPoint of APP.
//======================
window.addEventListener("DOMContentLoaded", () => {
    init();
})