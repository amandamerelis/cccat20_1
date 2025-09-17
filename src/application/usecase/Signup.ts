import {inject} from "../../infra/di/Registry";
import Account from "../../domain/Account";
import {AccountRepository} from "../../infra/repository/AccountRepository";

export default class Signup {

    @inject("accountRepository")
    accountRepository!: AccountRepository;

    constructor() {
    }

    async execute(input: any) {
        const newAccount = Account.create(input.name, input.email, input.cpf, input.password, input.carPlate, input.isPassenger, input.isDriver);
        const existingAccount = await this.accountRepository.getAccountByEmail(input.email);
        if (existingAccount) throw new Error("Account already exists");
        await this.accountRepository.saveAccount(newAccount);
        return {
            accountId: newAccount.accountId
        };
    }
}

type Input = {
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
}

