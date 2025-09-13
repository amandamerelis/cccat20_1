import pgp from 'pg-promise';
import Account from "./Account";

export interface AccountRepository {
    getAccountByEmail: (email: string) => Promise<Account>;
    getAccountById: (accountId: string) => Promise<Account>;
    saveAccount: (account: Account) => Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    async getAccountByEmail(email: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select * from ccca.account where email = $1", [email]);
        await connection.$pool.end();
        if(!output) return;
        return new Account(output.account_id, output.name, output.email, output.cpf, output.password, output.car_plate, output.is_passenger, output.is_driver);
    }

    async getAccountById(accountId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        await connection.$pool.end();
        if(!output) return;
        return new Account(output.account_id, output.name, output.email, output.cpf, output.password, output.car_plate, output.is_passenger, output.is_driver);
    }

    async saveAccount(account: Account): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver, account.password]);
        await connection.$pool.end();
    }

}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[] = [];

    async getAccountByEmail(email: string): Promise<any> {
        return Promise.resolve(this.accounts.find(account => account.email === email));
    }

    async getAccountById(accountId: string): Promise<any> {
        return this.accounts.find(account => account.accountId === accountId);
    }

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
        return Promise.resolve();
    }

}