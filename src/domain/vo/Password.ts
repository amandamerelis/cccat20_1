import {validatePassword} from "../validatePassword";

export default class Password {
    private value: string;

    constructor(password: string) {
        if (!validatePassword(password)) throw new Error("Invalid password");
        this.value = password;
    }

    getValue() {
        return this.value;
    }
}