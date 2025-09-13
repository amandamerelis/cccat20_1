import {inject} from "./Registry";
import {AccountRepository} from "./AccountRepository";

export default class GetAccount {
    @inject("accountRepository")
    accountRepository!: AccountRepository;

    constructor() {
    }

    async getById(accountId: string) {
        return await this.accountRepository.getAccountById(accountId);
    }

    async getByEmail(email: string) {
        return await this.accountRepository.getAccountByEmail(email);
    }
}