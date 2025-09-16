import express from "express";
import {RideRepositoryDatabase} from "./RideRepository";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import RequestRide from "./RequestRide";
import Registry from "./Registry";
import {AccountRepositoryDatabase} from "./AccountRepository";
import {PgPromiseAdapter} from "./DatabaseConnection";

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
const rideRepository = new RideRepositoryDatabase();
const databaseConnection = new PgPromiseAdapter();
Registry.getInstance().provide("databaseConnection", databaseConnection);
Registry.getInstance().provide("accountRepository", accountRepository);
Registry.getInstance().provide("rideRepository", rideRepository);
const signup = new Signup();
const getAccount = new GetAccount();
const requestRide = new RequestRide();
const getRide = new GetRide();

app.post("/signup", async function (req, res) {
    const input = req.body;
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

app.post("/rides", async function (req, res) {
    const input = req.body;
    try {
        const response = await requestRide.execute(input);
        res.status(201).json(response);
    } catch (e: any) {
        console.error(e.message);
        return res.status(422).json({error: e.message});
    }

});

app.get("/rides/:rideId", async function (req, res) {
    const rideId = req.params.rideId;
    const output = await getRide.getRideById(rideId);
    res.json(output);
});

app.listen(3000);