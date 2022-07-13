const regexEvaluator = (function(){

    let regex = new RegExp();
    let testStrings = [];

    function setRegex(expr, flags="g"){
        regex = new RegExp(expr, flags)
    }

    function getRegex(){
        return regex;
    }

    function setTestStrings(...strings){
        testStrings = strings;
        console.log(testStrings);

    }

    function getTestStrings(...strings){
        return testStrings;
    }


    function init(){
        console.log("test");
    }


    return {
        "init": init,
        "setRegex": setRegex,
        "getRegex": getRegex,
        "setTestStrings" : setTestStrings,
        "getTestStrings" : getTestStrings
    }
})();

function escapeHTML(unsafe){
    return unsafe.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function init(){
    regexEvaluator.init();

    const regexInputElement = document.getElementById("regex-input");
    const testStringsInputElement = document.getElementById("test-strings-input");
    const testStringsOutputElement = document.getElementById("test-strings-output");

    regexInputElement.addEventListener("input", (event) =>{
        event.preventDefault();
        regexEvaluator.setRegex(event.target.value);
    })
    setupTestStringsInputElement(testStringsInputElement, 
                                    testStringsOutputElement)
}


// In order to have an Editable Textarea that can also be styled,
// we need to create 2 seperate elements that are duplicates. 
// An <textarea> input and a <pre> output that shows the result to the user.
// This code makes sure that these 2 elements are in sync,
//
// see: https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
function setupTestStringsInputElement(testStringsInputElement, testStringsOutputElement ){
    //When the user scrolls the textarea. Then the output should scroll as well.
    function syncscroll(){
        testStringsOutputElement.scrollTop = testStringsInputElement.scrollTop;
        testStringsOutputElement.scrollLeft = testStringsInputElement.scrollLeft;
    }

    //escape all special HTML chars when copying to output.


    testStringsOutputElement.innerHTML = escapeHTML(testStringsInputElement.value);

    testStringsInputElement.addEventListener("input", (event) =>{
        event.preventDefault();
        result = event.target.value;
        regexEvaluator.setTestStrings(result.split('\n'));

        if(result[result.length-1] == "\n") { // If the last character is a newline character
            result += " "; // Add a placeholder space character to the final line 
          }

        testStringsOutputElement.innerHTML = escapeHTML(result);
        syncscroll();
    })


    testStringsInputElement.addEventListener("scroll", (event) =>{
        syncscroll();
    });


}

//======================
//StartingPoint of APP.
//======================
window.addEventListener("DOMContentLoaded", ()=>{
    init();
    
})