import DatabaseConnection, {PgPromiseAdapter} from "../../src/infra/database/DatabaseConnection";
import Signup from "../../src/application/usecase/Signup";
import RequestRide from "../../src/application/usecase/RequestRide";
import GetRide from "../../src/application/usecase/GetRide";
import {AccountRepositoryMemory} from "../../src/infra/repository/AccountRepository";
import {RideRepositoryDatabase} from "../../src/infra/repository/RideRepository";
import Registry from "../../src/infra/di/Registry";
import AcceptRide from "../../src/application/usecase/AcceptRide";

let databaseConnection: DatabaseConnection;
let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryMemory();
    const rideRepository = new RideRepositoryDatabase();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    Registry.getInstance().provide("accountRepository", accountRepository);
    Registry.getInstance().provide("rideRepository", rideRepository);
    signup = new Signup();
    requestRide = new RequestRide();
    getRide = new GetRide();
    acceptRide = new AcceptRide();
});

test("Deve aceitar a corrida", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    }
    const driver = {
        name: "John Doe",
        email: `john${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234"
    }
    const savePassengerResult = await signup.execute(passenger);
    const saveDriverResult = await signup.execute(driver);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        driverId: null,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const saveRideResult = await requestRide.execute(rideInput);
    const acceptRideInput = {
        rideId: saveRideResult.getRideId(),
        driverId: saveDriverResult.accountId,
    }
    const acceptRideResult = await acceptRide.execute(acceptRideInput);
    expect(acceptRideResult.status).toBe("accepted");
})

test("Deve dar erro porque usuário não é motorista", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    }
    const driver = {
        name: "John Doe",
        email: `john${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    }
    const savePassengerResult = await signup.execute(passenger);
    const saveDriverResult = await signup.execute(driver);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        driverId: null,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const saveRideResult = await requestRide.execute(rideInput);
    const acceptRideInput = {
        rideId: saveRideResult.getRideId(),
        driverId: saveDriverResult.accountId,
    }
    await expect(() => acceptRide.execute(acceptRideInput)).rejects.toThrow(new Error("The account must be from a driver"));
})

test("Deve dar erro porque usuário (motorista) não existe", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    }
    const savePassengerResult = await signup.execute(passenger);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        driverId: null,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const saveRideResult = await requestRide.execute(rideInput);
    const acceptRideInput = {
        rideId: saveRideResult.getRideId(),
        driverId: crypto.randomUUID(),
    }
    await expect(() => acceptRide.execute(acceptRideInput)).rejects.toThrow(new Error("The account must be from a driver"));
})

test("Deve dar erro de corrida não encontrada", async function () {
    const driver = {
        name: "John Doe",
        email: `john${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    }
    const saveDriverResult = await signup.execute(driver);
    const acceptRideInput = {
        rideId: crypto.randomUUID(),
        driverId: saveDriverResult.accountId,
    }
    await expect(() => acceptRide.execute(acceptRideInput)).rejects.toThrow(new Error("Ride not found"));
})

afterEach(async () => {
    await databaseConnection.close();
})

