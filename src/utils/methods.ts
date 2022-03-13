// --------
// Static helper functions
// --------

// Developed with help from https://stackoverflow.com/a/34217353
export function getStringDelta(
    oldString: string,
    newString: string,
    selEnd: number
) {
    const textLost: boolean = newString.length < oldString.length;
    if (textLost) {
        console.log("Notice: User has removed or cut character(s)");
        return "";
    }

    const deltaSize: number = newString.length - oldString.length;
    const selStart: number = selEnd - deltaSize;

    const isAppend: boolean = newString.substring(0, selStart) === oldString;

    if (isAppend) {
        return newString.substring(selStart, selEnd);
    } else {
        console.log("Notice: User has overwritten content");
        return "";
    }
}

// https://stackoverflow.com/a/18679657/4440865
export function countWords(str: string) {
    return str.split(" ").filter(function (n) {
        return n !== "";
    }).length;
}

// -----
// accessing DOM methods
// -----

/**
 * blur the input box
 */
export function blurInputBox() {
    // focus-on and select input box
    const inputElement: HTMLInputElement = document.getElementById(
        "input"
    )! as HTMLInputElement;
    inputElement.blur();
}

/**
 * focus-on and select input box
 */
export function selectInputBox() {
    const inputElement: HTMLInputElement = document.getElementById(
        "input"
    )! as HTMLInputElement;
    if (inputElement === null || inputElement === undefined) {
        alert("input el is null");
    }
    inputElement.select();

    inputElement.focus();
}

export function validateString(str: string): boolean {

    // impose 50-character limit
    // (max phrase is of length 43)
    if (str.length > 50) {
        console.log(`Error: string invalid as exceeds 75-character limit`)
        return false
    }

    // character whitelist
    const whitelistArr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.,-\' '.split('')
    const whitelistSet = new Set(whitelistArr)

    const isValid = str.split('').every((char) => { 
        return whitelistSet.has(char) 
    })

    if (!isValid) console.log(`Error: string invalid: ${str}`)

    return isValid
}
