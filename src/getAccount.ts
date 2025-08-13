import {AccountDAO} from "./data";

export default class GetAccount {
    constructor(private readonly database: AccountDAO) {
    }

    async getById(accountId: string) {
        return await this.database.getAccountById(accountId);
    }

    async getByEmail(email: string) {
        return await this.database.getAccountByEmail(email);
    }
}