import crypto from "crypto";
import express from "express";
import {validateCpf} from "./validateCpf";
import {SignUpRequest} from './types/SignUpRequest';
import {AccountDAODatabase} from "./data";

const app = express();
app.use(express.json());

function validateSignupInput(input: SignUpRequest): void {
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    if (!input.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)) throw new Error("Invalid password");
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF");
    if (input.isDriver && (!input.carPlate?.match(/[A-Z]{3}[0-9]{4}/))) throw new Error("Invalid car plate");
}

app.post("/signup", async function (req, res) {
    const database = new AccountDAODatabase();
    const input = req.body as SignUpRequest;
    try {
        validateSignupInput(input);
        const existingAccount = await database.getAccountByEmail(input.email);
        if (existingAccount) throw new Error("Account already exists");
        const newAccount = {
            accountId: crypto.randomUUID(),
            name: input.name,
            email: input.email,
            cpf: input.cpf,
            carPlate: input.carPlate,
            isPassenger: input.isPassenger,
            isDriver: input.isDriver,
            password: input.password,
        };
        await database.saveAccount(newAccount);
        const responseObject = {
            accountId: newAccount.accountId
        };
        res.status(201).json(responseObject);
    } catch (e: any) {
        return res.status(400).json({error: e.message});
    }

});

app.get("/accounts/:accountId", async function (req, res) {
    const database = new AccountDAODatabase();
    const accountId = req.params.accountId;
    const output = await database.getAccountById(accountId);
    res.json(output);
});

app.listen(3000);
