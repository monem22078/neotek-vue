import Validations from "./Validations";

export default class SignInValidations {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    checkValidations() {
        let errors = [];

        if (!Validations.checkUsername(this.username)) {
            errors['username'] = "Invalid username"
        }
        if (!Validations.minLength(this.password, 3)) {
            errors['password'] = "Invalid password"
        }

        return errors;
    }
}