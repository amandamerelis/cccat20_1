import {AccountRepositoryDatabase} from "../src/AccountRepository";
import Account from "../src/Account";

test("Deve criar conta de motorista", async function (){
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
    expect(accountByEmail.account_id).toBeDefined();
    expect(accountByEmail.name).toBe(input.name);
    expect(accountByEmail.email).toBe(input.email);
    expect(accountByEmail.cpf).toBe(input.cpf);
    const accountById = await accountRepository.getAccountById(input.accountId);
    expect(accountById.password).toBe(input.password);
    expect(accountById.is_driver).toBe(input.isDriver);
    expect(accountById.car_plate).toBe(input.carPlate);
});