import exp from "constants";

// https://stackoverflow.com/a/16436975/6318046
export const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export const arrayIndexOfMax = (arr) => {
    if (arr.length === 0){
        return -1;
    }
    let _arrayIndexOfMax = 0;
    let arrayMax = arr[_arrayIndexOfMax];
    for (let i = 1; i < arr.length; i++){
        if (arr[i] > arrayMax){
            _arrayIndexOfMax = i;
            arrayMax = arr[_arrayIndexOfMax];
        }
    }
    return _arrayIndexOfMax;
}

export const objectIsEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}