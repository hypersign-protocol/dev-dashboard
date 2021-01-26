export function specialCharCheck(str) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (format.test(str)) {
        return true;
    } else {
        return false;
    }
}