import {AccountDAO} from "./data";
import {inject} from "./Registry";

export default class GetAccount {
    @inject("accountDAO")
    accountDAO!: AccountDAO;

    constructor() {
    }

    async getById(accountId: string) {
        return await this.accountDAO.getAccountById(accountId);
    }

    async getByEmail(email: string) {
        return await this.accountDAO.getAccountByEmail(email);
    }
}