import { UTF16ToBase64, Base64ToUTF16} from "./utils.js"

export const regexSaver = (function(){
    let regexEvaluator;
    const regexFlagsSearchParam = "f";
    const regexExprSearchParam = "re";
    const testStringsSearchParam = "ts"

    function init(_regexEvaluator){
        regexEvaluator = _regexEvaluator;
    }

    function _getURL(){
        return window.location.href;
    }

    function save(){
        const regexFlags = regexEvaluator.getRegexFlags();
        const regexExpr = regexEvaluator.getRegexExpression();
        const testStrings = regexEvaluator.getTestStrings();

        const queryParams = new URLSearchParams(window.location.search);

        queryParams.set(regexFlagsSearchParam, UTF16ToBase64(regexFlags));
        queryParams.set(regexExprSearchParam, UTF16ToBase64(regexExpr));
        queryParams.set(testStringsSearchParam, UTF16ToBase64(testStrings));

        history.replaceState(null, null, "?"+queryParams.toString());
        
        
        console.log("regexFlags: " + UTF16ToBase64(regexFlags));
        console.log("regexExpr: " + UTF16ToBase64(regexExpr));
        console.log("testStrings: " + UTF16ToBase64(testStrings));
    }

    return{
        "init" : init,
        "save" : save
    }


})();