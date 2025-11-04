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
        false,
        true,
        "ABC1234");
    await accountRepository.saveAccount(input);
    const accountByEmail = await accountRepository.getAccountByEmail(input.getEmail());
    expect(accountByEmail).toBeDefined();
    expect(accountByEmail?.getAccountId()).toBeDefined();
    expect(accountByEmail?.getName()).toBe(input.getName());
    expect(accountByEmail?.getEmail()).toBe(input.getEmail());
    expect(accountByEmail?.getCpf()).toBe(input.getCpf());
    const accountById = await accountRepository.getAccountById(input.getAccountId());
    expect(accountById?.getPassword()).toBe(input.getPassword());
    expect(accountById?.isDriver).toBe(input.isDriver);
    expect(accountById?.getCarPlate()).toBe(input.getCarPlate());
});