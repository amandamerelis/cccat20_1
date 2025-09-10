import crypto from "crypto";
import {validateCpf} from "./validateCpf";
import {SignUpRequest} from './types/SignUpRequest';
import {AccountDAO} from "./data";
import {inject} from "./Registry";

export default class SignUp {

    @inject("accountDAO")
    accountDAO!: AccountDAO;

    constructor() {
    }

    async execute(input: SignUpRequest) {
        this.validateSignupInput(input);
        const existingAccount = await this.accountDAO.getAccountByEmail(input.email);
        if (existingAccount) throw new Error("Account already exists");
        const newAccount = {
            accountId: crypto.randomUUID(),
            name: input.name,
            email: input.email,
            cpf: input.cpf,
            carPlate: input.carPlate,
            isPassenger: input.isPassenger,
            isDriver: input.isDriver,
            password: input.password,
        };
        await this.accountDAO.saveAccount(newAccount);
        return {
            accountId: newAccount.accountId
        };
    }

    private validateSignupInput(input: SignUpRequest): void {
        if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
        if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
        if (!input.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)) throw new Error("Invalid password");
        if (!validateCpf(input.cpf)) throw new Error("Invalid CPF");
        if (input.isDriver && !(input.carPlate?.match(/[A-Z]{3}[0-9]{4}/))) throw new Error("Invalid car plate");
    }
}

