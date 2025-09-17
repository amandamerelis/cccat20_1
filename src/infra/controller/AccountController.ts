import {inject} from "../di/Registry";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";
import GetAccount from "../../application/usecase/GetAccount";

export default class AccountController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("signup")
    signup!: Signup;
    @inject("getAccount")
    getAccount!: GetAccount;

    constructor() {
        this.httpServer.register("post", "/signup", async (params: any, body: any) => {
            const input = body;
            return await this.signup.execute(input);
        });

        this.httpServer.register("get", "/accounts/:accountId", async (params: any, body: any) => {
            const accountId = params.accountId;
            return await this.getAccount.getById(accountId);
        });
    }
}

