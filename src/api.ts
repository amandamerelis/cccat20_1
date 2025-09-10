import {SignUpRequest} from "./types/SignUpRequest";
import express from "express";
import {AccountDAODatabase, RideDAODatabase} from "./data";
import SignUp from "./signup";
import GetAccount from "./getAccount";
import GetRide from "./getRide";
import RequestRide from "./requestRide";
import Registry from "./Registry";

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase();
const rideDAO = new RideDAODatabase();
Registry.getInstance().provide("accountDAO", accountDAO);
Registry.getInstance().provide("rideDAO", rideDAO);
const signup = new SignUp();
const getAccount = new GetAccount();
const requestRide = new RequestRide();
const getRide = new GetRide();

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