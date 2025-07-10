import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import {SignUpRequest} from './types/SignUpRequest';

const app = express();
app.use(express.json());

enum ResponseCode{
	VALID = 0,
	INVALID_CPF = -1,
	INVALID_EMAIL = -2,
	INVALID_NAME = -3,
	USER_ALREADY_EXISTS = -4,
	INVALID_PASSWORD = -5,
	INVALID_CARPLATE = -6,
}

function validateSignupInput(input: SignUpRequest): ResponseCode {
	if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) return ResponseCode.INVALID_NAME;
	if (!input.email.match(/^(.+)@(.+)$/)) return ResponseCode.INVALID_EMAIL;
	if (!input.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)) return ResponseCode.INVALID_PASSWORD;
	if (!validateCpf(input.cpf)) return ResponseCode.INVALID_CPF;
	if (input.isDriver && (!input.carPlate?.match(/[A-Z]{3}[0-9]{4}/))) return ResponseCode.INVALID_CARPLATE;

	return ResponseCode.VALID;
}

app.post("/signup", async function (req, res) {
	const input = req.body as SignUpRequest;
	let result = validateSignupInput(input);
	if (result != ResponseCode.VALID) {
		res.status(422).json({message: result});
	} else {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		try {
			const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);
			if (acc) {
				res.status(422).json({message: ResponseCode.USER_ALREADY_EXISTS});
			} else {
				const newAccountId = crypto.randomUUID();
				await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [newAccountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
				const responseObject = {
					accountId: newAccountId
				};
				res.json(responseObject);
			}
		} finally {
			await connection.$pool.end();
		}
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountId = req.params.accountId;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [output] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
	res.json(output);
});

app.listen(3000);
