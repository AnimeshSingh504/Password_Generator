// to display password
let pswdDisplay = document.querySelector("[password-display]");
// to copy the password
let showCopy = document.querySelector("[copy-span]");
// to show password copied
let pswdCopy = document.querySelector("[password-copy]");
// to show length of password
let pswdLengthDisplay = document.querySelector("[password-lengthNumber]");
// to set the length of password(slider)
let setPswdLength = document.querySelector("[set-passwordLength]");

// check for uppercase
let uppercaseCheck = document.querySelector("#forupper");
// check for lowercase
let lowercaseCheck = document.querySelector("#forlower");
// check for numbers
let numberCheck = document.querySelector("#fornumbers");
// check for symbols
let symbolCheck = document.querySelector("#forsymbols");

// to set the indicator for password
let pswdIndicator = document.querySelector("[pswd-colorIndicator]");
// button to create password
let pswdButton = document.querySelector("[create-password]");

// to select all the check boxes
let allCheckBox = document.querySelectorAll("input[type=checkbox]");

// default length of password
let pswdLength = 10;
// content of password
let password = "";
// count of number of checkbox checked
let checkboxChecked = 0;
// string of symbols
let symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// initially set the color to gray in strength section
setIndicator("#ccc");

setupSlider();

function setupSlider(){
    setPswdLength.value = pswdLength;
    pswdLengthDisplay.innerText = pswdLength;
    // need to add some thing more

    const maxi = setPswdLength.max;
    const mini = setPswdLength.min;
    
    // to set the backgroud of slider to a specified color
    setPswdLength.style.backgroundSize = ((pswdLength - mini)*100 / (maxi-mini)) + "% 100%";
}

// function to generate random number between min and max val
function setRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min) ) + min;
}

// function to generate random upper case between min and max val
function generateUpperCase(){
    return String.fromCharCode(setRandomInteger(65,91));
}

// function to generate random lower case between min and max val
function generateLowerCase(){
    return String.fromCharCode(setRandomInteger(97,123));
}

// function to generate random number between min and max val
function generateNumbers(){
    return setRandomInteger(0,9);
}

// function to generate random symbol between min and max val
function generateSymbols(){
    let value = setRandomInteger(0,symbols.length);
    return symbols.charAt(value);
}

// to copy the content ie., password
async function copyContent(){
    try{
        await navigator.clipboard.writeText(pswdDisplay.value);
        showCopy.innerText = "copied";
    }
    catch(e){
        showCopy.innerText = "Failed";
    }
    // some thing more needed to be there
    showCopy.classList.add("active");

    // to make it visible for only 2seconds and then invisible
    setTimeout(()=>{
        showCopy.classList.remove("active");
    },2000);

}

// checking how many checkbox are checked
function handleCheckBoxChange(){
    checkboxChecked=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkboxChecked++;
    });

    // special case(if length of password is less than no. of checked
    // boxes)
    if(checkboxChecked > pswdLength){
        pswdLength = checkboxChecked;
        setupSlider();
    }
}

// setting up some event listeners

// for all checkbox event Listener
allCheckBox.forEach((checkbox) => {
    addEventListener('change', handleCheckBoxChange);
})

// for slider event Listener, setting the value and displaying it
setPswdLength.addEventListener('input', (e)=>{
    pswdLength = e.target.value;
    setupSlider();
})

pswdCopy.addEventListener('click',()=>{
    if(pswdDisplay.value)
        //call copy function
        copyContent();
})

// setting up the indicator with color to show the strength of color
function setIndicator(color){
    pswdIndicator.style.backgroundColor = color;
    pswdIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// shuffling the password (Fisher Yetes Method)
function shufflePassword(passwordArray){
    for(let i= passwordArray.length-1;i>0;i--){
        // taking a random index number into variable j
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = passwordArray[i];
        passwordArray[i] = passwordArray[j];
        passwordArray[j] = temp;
    }
    let shuffledPasswordUpdatedString = "";
    passwordArray.forEach(element => {
        shuffledPasswordUpdatedString += element;
    });
    return shuffledPasswordUpdatedString;
}

// to calculate the strength of the password
function calculateStrength(passworString){
    // setting up all the checklist and initializing it to false
    let isUpperChecked = false;
    let isLowerChecked = false;
    let isNumbersChecked = false;
    let isSymbolsChecked = false;

    // now checking for each and every checking and mark it true if checked

    if(uppercaseCheck.checked)
        isUpperChecked = true;
    if(lowercaseCheck.checked)
        isLowerChecked = true;
    if(numberCheck.checked)
        isNumbersChecked = true;
    if(symbolCheck.checked)
        isSymbolsChecked = true;
    
    if(isUpperChecked && isLowerChecked && isNumbersChecked && isSymbolsChecked && pswdLength>=8){
        setIndicator("#0f0");
    }
    else if(isUpperChecked && (isLowerChecked || isSymbolsChecked) && isNumbersChecked && pswdLength>=6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00");
    }
}

// for the button to generate create passowrd eventlistener
pswdButton.addEventListener('click',()=>{
    // if nothing is selected
    if(checkboxChecked == 0){
        return;
    }

    // if checkcount is more than the length of password count
    if(checkboxChecked > pswdLength){
        pswdLength = checkboxChecked;
        setupSlider();
    }

    // password
    password = "";

    // array which will be holding all the function functionalities
    let funcArray = [];

    // going through all the conditions and store its function call
    // in func array

    // checking for the check of uppercase letters
    if(uppercaseCheck.checked){
        funcArray.push(generateUpperCase);
    }

    // checking for the check of lowercase letters
    if(lowercaseCheck.checked){
        funcArray.push(generateLowerCase);
    }

    // checking for the check of numbers
    if(numberCheck.checked){
        funcArray.push(generateNumbers);
    }

    // checking for the check of symbols
    if(symbolCheck.checked){
        funcArray.push(generateSymbols);
    }

    // now generating the password according to the check that are listed

    for(let i=0;i<funcArray.length;i++){
        password += funcArray[i]();
    }

    // now if the length of password is greater than the cheked conditions

    for(let i=0;i<pswdLength-funcArray.length;i++){
        let randomIndex = setRandomInteger(0,funcArray.length);
        password += funcArray[randomIndex]();
    }
    // checking the strength of the password
    calculateStrength(password);

    // need to shuffle the password
    password = shufflePassword(Array.from(password));

    pswdDisplay.value = password;
});









