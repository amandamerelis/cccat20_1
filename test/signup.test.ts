//para se inscrever vai nome, email, account_id, cpf, placa do carro, bool é passageiro, bool é motorista, senha
//email n pode ser repetido
//nome só pode ter letras e deve ser nome e sobrenome
//email tem que ter o @
//id, name, email, cpf, carPlate, !!isPassenger, !!isDriver, password
import axios from 'axios';

axios.defaults.validateStatus = function () {
    return true; //trata todas as respostas http como sucesso, independente do status
}

test("Deve aprovar o cadastro", async function () {
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

