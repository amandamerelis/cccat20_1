import Name from "./vo/Name";
import Email from "./vo/Email";
import Cpf from "./vo/Cpf";
import Password from "./vo/Password";
import CarPlate from "./vo/CarPlate";
import Uuid from "./vo/Uuid";

export default class Account {

    private accountId: Uuid;
    private name: Name;
    private email: Email;
    private cpf: Cpf;
    private password: Password;
    private carPlate?: CarPlate;

    constructor (
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        password: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        carPlate: string,
    ) {
        this.accountId = new Uuid(accountId);
        this.name = new Name(name);
        this.email = new Email(email);
        this.cpf = new Cpf(cpf);
        if (isDriver) this.carPlate = new CarPlate(carPlate);
        this.password = new Password(password);
    }

    static create(name: string,
                  email: string,
                  cpf: string,
                  password: string,
                  isPassenger: boolean,
                  isDriver: boolean,
                  carPlate: string,) {
        const accountId = Uuid.create().getValue();
        return new Account(accountId, name, email, cpf, password, isPassenger, isDriver, carPlate);
    }

    getName() {
        return this.name.getValue();
    }

    getEmail() {
        return this.email.getValue();
    }

    getCpf() {
        return this.cpf.getValue();
    }

    getPassword() {
        return this.password.getValue();
    }

    getCarPlate() {
        return this.carPlate?.getValue();
    }

    getAccountId() {
        return this.accountId.getValue();
    }
}