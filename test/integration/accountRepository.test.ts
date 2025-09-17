import {AccountRepositoryDatabase} from "../../src/infra/repository/AccountRepository";
import Account from "../../src/domain/Account";
import {PgPromiseAdapter} from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";

test("Deve criar conta de motorista", async function (){
    const databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    const accountRepository = new AccountRepositoryDatabase();
    const input = Account.create(
        "Jane Doe",
        `janedoe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        "ABC1234",
        false,
        true);
    await accountRepository.saveAccount(input);
    const accountByEmail = await accountRepository.getAccountByEmail(input.email);
    expect(accountByEmail.accountId).toBeDefined();
    expect(accountByEmail.name).toBe(input.name);
    expect(accountByEmail.email).toBe(input.email);
    expect(accountByEmail.cpf).toBe(input.cpf);
    const accountById = await accountRepository.getAccountById(input.accountId);
    expect(accountById.password).toBe(input.password);
    expect(accountById.isDriver).toBe(input.isDriver);
    expect(accountById.carPlate).toBe(input.carPlate);
});