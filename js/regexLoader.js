import { UTF16ToBase64, Base64ToUTF16} from "./utils.js"

export const regexLoader = (function(){
    let regexEvaluator;
    const regexFlagsSearchParam = "f";
    const regexExprSearchParam = "re";
    const testStringsSearchParam = "ts"

    function load(){
        const queryParams = new URLSearchParams(window.location.search);
        const regexFlags = Base64ToUTF16(queryParams.get(regexFlagsSearchParam));
        const regexExpr = Base64ToUTF16(queryParams.get(regexExprSearchParam));
        const testStrings = Base64ToUTF16(queryParams.get(testStringsSearchParam));

        console.log(regexFlags)
        console.log(regexExpr)
        console.log(testStrings)

        regexEvaluator.setTestStrings(testStrings);
        regexEvaluator.setRegex(regexExpr, regexFlags)
    }

    function init(_regexEvaluator) {
        regexEvaluator = _regexEvaluator;
    }

    return{
        "init" : init,
        "load" : load
    }


})();