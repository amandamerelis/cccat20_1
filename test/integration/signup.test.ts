import Signup from "../../src/application/usecase/Signup";
import GetAccount from "../../src/application/usecase/GetAccount";
import sinon from "sinon";
import Registry from "../../src/infra/di/Registry";
import {AccountRepositoryDatabase, AccountRepositoryMemory} from "../../src/infra/repository/AccountRepository";
import DatabaseConnection, {PgPromiseAdapter} from "../../src/infra/database/DatabaseConnection";
import Account from "../../src/domain/Account";

let databaseConnection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryMemory();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    Registry.getInstance().provide("accountRepository", accountRepository);
    signup = new Signup();
    getAccount = new GetAccount();
});

test("Deve aprovar o cadastro de passageiro", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    };
    const resultSignup = await signup.execute(input);
    expect(resultSignup.accountId).toBeDefined();
    const resultGetAccount = await getAccount.execute(resultSignup.accountId);
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
    const resultGetAccount = await getAccount.execute(resultSignup.accountId);
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
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Deve dar senha inválida", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "12345678",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid password"));

});

test("Deve dar cpf inválido", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe@gmail.com`,
        cpf: "11111111111",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
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
        isPassenger: true,
        carPlate: "",
        isDriver: false,
    };
    const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
    const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves();
    const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById")
        .resolves(Account.create(
            input.name, input.email, input.cpf, input.password ,input.isPassenger, input.isDriver, input.carPlate
        ));
    const resultSignup = await signup.execute(input);
    expect(resultSignup.accountId).toBeDefined();
    const resultGetAccount = await getAccount.execute(resultSignup.accountId);
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
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    };
    const saveAccountSpy = sinon.spy(AccountRepositoryMemory.prototype, "saveAccount");
    const getAccountSpy = sinon.spy(AccountRepositoryMemory.prototype, "getAccountById");
    const resultSignup = await signup.execute(input);
    expect(saveAccountSpy.calledOnce).toBe(true);
    const resultGetAccount = await getAccount.execute(resultSignup.accountId);
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
        isPassenger: true,
        carPlate: "",
        isDriver: false,
    };
    const accountDAOMock = sinon.mock(AccountRepositoryMemory.prototype);
    accountDAOMock.expects("saveAccount").once().resolves();
    accountDAOMock.expects("getAccountByEmail").once().resolves();
    const resultSignup = await signup.execute(input);
    accountDAOMock.expects("getAccountById").once().withArgs(resultSignup.accountId)
        .resolves(Account.create(
            input.name, input.email, input.cpf, input.password, input.isPassenger, input.isDriver, input.carPlate
        ));
    const resultGetAccount = await getAccount.execute(resultSignup.accountId);
    expect(resultGetAccount.name).toBe(input.name);
    expect(resultGetAccount.email).toBe(input.email);
    expect(resultGetAccount.cpf).toBe(input.cpf);
    expect(resultGetAccount.isPassenger).toBe(input.isPassenger);
    expect(resultGetAccount.password).toBe(input.password);
    accountDAOMock.restore();
});

afterEach(async () => {
    await databaseConnection.close();
});