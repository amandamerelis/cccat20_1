import {AccountDAODatabase} from "../src/data";

test("Deve criar conta de motorista", async function (){
    const accountDAO = new AccountDAODatabase();
    const input = {
        accountId: crypto.randomUUID(),
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234"
    };
    await accountDAO.saveAccount(input);
    const accountByEmail = await accountDAO.getAccountByEmail(input.email);
    expect(accountByEmail.account_id).toBeDefined();
    expect(accountByEmail.name).toBe(input.name);
    expect(accountByEmail.email).toBe(input.email);
    expect(accountByEmail.cpf).toBe(input.cpf);
    const accountById = await accountDAO.getAccountById(input.accountId);
    expect(accountById.password).toBe(input.password);
    expect(accountById.is_driver).toBe(input.isDriver);
    expect(accountById.car_plate).toBe(input.carPlate);
});