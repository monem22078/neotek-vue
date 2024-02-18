export default class Validations {
    static checkUsername(username) {
        if (
            username != null && username != '' && username.length != 0
        ) {
            return true
        }
        return false;
    }

    static minLength(name, length) {
        console.log(name.length, length)
        if (name.length < length) {
            return false
        }
        return true;
    }
}