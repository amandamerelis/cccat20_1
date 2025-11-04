import {inject} from "../../infra/di/Registry";
import Account from "../../domain/Account";
import {AccountRepository} from "../../infra/repository/AccountRepository";

export default class Signup {

    @inject("accountRepository")
    accountRepository!: AccountRepository;

    constructor() {
    }

    async execute(input: Input): Promise<Output> {
        const newAccount = Account.create(input.name, input.email, input.cpf, input.password, input.isPassenger, input.isDriver, input.carPlate);
        const existingAccount = await this.accountRepository.getAccountByEmail(newAccount.getEmail());
        if (existingAccount) throw new Error("Account already exists");
        await this.accountRepository.saveAccount(newAccount);
        return {
            accountId: newAccount.getAccountId()
        };
    }
}

type Input = {
    name: string,
    email: string,
    cpf: string,
    password: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate: string,
}

type Output = {
    accountId: string,
}

