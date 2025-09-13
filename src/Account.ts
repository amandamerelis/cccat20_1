import {validateCpf} from "./validateCpf";
import {validatePassword} from "./validatePassword";

export default class Account {

    constructor(
        readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly password: string,
        readonly carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
    ) {
        if (!this.validateName(name)) throw new Error("Invalid name");
        if (!this.validateEmail(email)) throw new Error("Invalid email");
        if (!validateCpf(cpf)) throw new Error("Invalid CPF");
        if (!validatePassword(password)) throw new Error("Invalid password");
        if (this.validateCarPlate(isDriver, carPlate)) throw new Error("Invalid car plate");
    }

    validateName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    validateEmail(email: string) {
        return email.match(/^(.+)@(.+)$/);
    }

    validateCarPlate(isDriver: boolean, carPlate: string) {
        return isDriver && !(carPlate?.match(/[A-Z]{3}[0-9]{4}/));
    }

    static create(name: string,
                  email: string,
                  cpf: string,
                  password: string,
                  carPlate: string,
                  isPassenger: boolean,
                  isDriver: boolean) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, password, carPlate, isPassenger, isDriver);
    }
}