import {SignUpRequest} from "./types/SignUpRequest";
import express from "express";
import {AccountDAODatabase} from "./data";
import SignUp from "./signup";
import GetAccount from "./getAccount";

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase();
const signup = new SignUp(accountDAO);
const getAccount = new GetAccount(accountDAO);

app.post("/signup", async function (req, res) {
    const input = req.body as SignUpRequest;
    try {
        const response = await signup.execute(input);
        res.status(201).json(response);
    } catch (e: any) {
        console.error(e.message);
        return res.status(422).json({error: e.message});
    }

});

app.get("/accounts/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccount.getById(accountId);
    res.json(output);
});

app.listen(3000);