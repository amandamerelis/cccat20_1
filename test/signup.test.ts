import {AccountDAODatabase} from "../src/data";
import SignUp from "../src/signup";
import GetAccount from "../src/getAccount";

let signup: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
    const database = new AccountDAODatabase();
    signup = new SignUp(database);
    getAccount = new GetAccount(database);
});

test("Deve aprovar o cadastro de passageiro", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const resultSignup = await signup.execute(input);
    expect(resultSignup.accountId).toBeDefined();
    const resultGetAccount = await getAccount.getById(resultSignup.accountId);
    expect(resultGetAccount.name).toBe(input.name);
    expect(resultGetAccount.email).toBe(input.email);
    expect(resultGetAccount.cpf).toBe(input.cpf);
    expect(resultGetAccount.is_passenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
});

test("Deve aprovar o cadastro de motorista", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234"
    };
    const resultSignup = await signup.execute(input);
    expect(resultSignup.accountId).toBeDefined();
    const resultGetAccount = await getAccount.getById(resultSignup.accountId);
    expect(resultGetAccount.name).toBe(input.name);
    expect(resultGetAccount.email).toBe(input.email);
    expect(resultGetAccount.cpf).toBe(input.cpf);
    expect(resultGetAccount.is_passenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
    expect(resultGetAccount.is_driver).toBe(input.isDriver);
    expect(resultGetAccount.car_plate).toBe(input.carPlate);
});

test("Deve dar email inválido", async function () {
    const input = {
        name: "Jane Doe",
        email: `jane${Math.random()}doe.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Deve dar senha inválida", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "12345678",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid password"));

});

test("Deve dar cpf inválido", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe@gmail.com`,
        cpf: "11111111111",
        password: "asdQWE123",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test("Deve dar conta já existente", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234"
    };
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});



