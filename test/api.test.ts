import axios from 'axios';

axios.defaults.validateStatus = function () {
    return true; //trata todas as respostas http como sucesso, independente do status
}

test("Deve aprovar o cadastro de passageiro", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const result = await axios.post("http://localhost:3000/signup", input);
    expect(result.status).toBe(201);
    const newAccount = result.data;
    expect(newAccount.accountId).toBeDefined();
    const output = await axios.get(`http://localhost:3000/accounts/${newAccount.accountId}`);
    const account = output.data;
    expect(account.name).toBe(input.name);
    expect(account.email).toBe(input.email);
    expect(account.cpf).toBe(input.cpf);
    expect(account.is_passenger).toBe(input.isPassenger);
    expect(account.password).toBe(input.password);
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
    const result = await axios.post("http://localhost:3000/signup", input);
    expect(result.status).toBe(201);
    const newAccount = result.data;
    expect(newAccount.accountId).toBeDefined();
    const output = await axios.get(`http://localhost:3000/accounts/${newAccount.accountId}`);
    const account = output.data;
    expect(account.name).toBe(input.name);
    expect(account.email).toBe(input.email);
    expect(account.cpf).toBe(input.cpf);
    expect(account.password).toBe(input.password);
    expect(account.is_driver).toBe(input.isDriver);
    expect(account.car_plate).toBe(input.carPlate);
});

test("Deve dar email inválido", async function () {
    const input = {
        name: "Jane Doe",
        email: `jane${Math.random()}doe.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const result = await axios.post("http://localhost:3000/signup", input);
    expect(result.status).toBe(422);
    expect(result.data.error).toBe("Invalid email");
});

test("Deve dar senha inválida", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "12345678",
        isPassenger: true
    };
    const result = await axios.post("http://localhost:3000/signup", input);
    expect(result.status).toBe(422);
    expect(result.data.error).toBe("Invalid password");
});

test("Deve dar cpf inválido", async function () {
    const input = {
        name: "Jane Doe",
        email: `janedoe@gmail.com`,
        cpf: "11111111111",
        password: "asdQWE123",
        isPassenger: true
    };
    const result = await axios.post("http://localhost:3000/signup", input);
    expect(result.status).toBe(422);
    expect(result.data.error).toBe("Invalid CPF");
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
    const firstResult = await axios.post("http://localhost:3000/signup", input);
    const secondResult = await axios.post("http://localhost:3000/signup", input);
    expect(secondResult.status).toBe(422);
    expect(secondResult.data.error).toBe("Account already exists");
});



