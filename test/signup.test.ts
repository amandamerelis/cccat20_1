import {AccountDAODatabase, AccountDAOMemory} from "../src/data";
import SignUp from "../src/signup";
import GetAccount from "../src/getAccount";
import sinon from "sinon";
import Registry from "../src/Registry";

let signup: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountDAOMemory();
    Registry.getInstance().provide("accountDAO", accountDAO);
    signup = new SignUp();
    getAccount = new GetAccount();
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
    expect(resultGetAccount.isPassenger).toBe(input.isPassenger);
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
    expect(resultGetAccount.isPassenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
    expect(resultGetAccount.isDriver).toBe(input.isDriver);
    expect(resultGetAccount.carPlate).toBe(input.carPlate);
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


//Test pattern com stub
test("Deve aprovar o cadastro de passageiro com stub", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
    const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves();
    const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input);
    const resultSignup = await signup.execute(input);
    expect(resultSignup.accountId).toBeDefined();
    const resultGetAccount = await getAccount.getById(resultSignup.accountId);
    expect(resultGetAccount.name).toBe(input.name);
    expect(resultGetAccount.email).toBe(input.email);
    expect(resultGetAccount.cpf).toBe(input.cpf);
    expect(resultGetAccount.isPassenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
    saveAccountStub.restore();
    getAccountByEmailStub.restore();
    getAccountByIdStub.restore();
});

test("Deve aprovar o cadastro de passageiro com spy", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const saveAccountSpy = sinon.spy(AccountDAOMemory.prototype, "saveAccount");
    const getAccountSpy = sinon.spy(AccountDAOMemory.prototype, "getAccountById");
    const resultSignup = await signup.execute(input);
    expect(saveAccountSpy.calledOnce).toBe(true);
    const resultGetAccount = await getAccount.getById(resultSignup.accountId);
    expect(getAccountSpy.calledWith(resultSignup.accountId)).toBe(true);
    expect(resultGetAccount.name).toBe(input.name);
    expect(resultGetAccount.email).toBe(input.email);
    expect(resultGetAccount.cpf).toBe(input.cpf);
    expect(resultGetAccount.isPassenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
    saveAccountSpy.restore();
    getAccountSpy.restore();
});

test("Deve aprovar o cadastro de passageiro com mock", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const accountDAOMock = sinon.mock(AccountDAOMemory.prototype);
    accountDAOMock.expects("saveAccount").once().resolves();
    accountDAOMock.expects("getAccountByEmail").once().resolves();
    const resultSignup = await signup.execute(input);
    accountDAOMock.expects("getAccountById").once().withArgs(resultSignup.accountId).resolves(input);
    const resultGetAccount = await getAccount.getById(resultSignup.accountId);
    expect(resultGetAccount.name).toBe(input.name);
    expect(resultGetAccount.email).toBe(input.email);
    expect(resultGetAccount.cpf).toBe(input.cpf);
    expect(resultGetAccount.isPassenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
    accountDAOMock.restore();
});