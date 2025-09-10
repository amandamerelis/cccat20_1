import SignUp from "../src/signup";
import RequestRide from "../src/requestRide";
import GetRide from "../src/getRide";
import Registry from "../src/Registry";
import {AccountDAOMemory, RideDAODatabase} from "../src/data";

let signup: SignUp;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    const accountDAO = new AccountDAOMemory();
    const rideDAO = new RideDAODatabase();
    Registry.getInstance().provide("accountDAO", accountDAO);
    Registry.getInstance().provide("rideDAO", rideDAO);
    signup = new SignUp();
    requestRide = new RequestRide();
    getRide = new GetRide();
});

test("Deve criar a corrida", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    const savePassengerResult = await signup.execute(passenger);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const saveRideResult = await requestRide.execute(rideInput);
    expect(saveRideResult.rideId).toBeDefined();
    const outputGetRide = await getRide.getRideById(saveRideResult.rideId);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.fromLat).toBe(rideInput.fromLat);
    expect(outputGetRide.fromLong).toBe(rideInput.fromLong);
    expect(outputGetRide.toLat).toBe(rideInput.toLat);
    expect(outputGetRide.toLong).toBe(rideInput.toLong);
    expect(outputGetRide.date).toBeDefined();
})

test("Deve dar erro ao criar corrida: usuário não é passageiro", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: false
    }
    const savePassengerResult = await signup.execute(passenger);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("User is not a passenger"));
})

test("Deve dar erro ao criar corrida: usuário possui corrida em andamento", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    const savePassengerResult = await signup.execute(passenger);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    await requestRide.execute(rideInput);
    await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("Passenger already has a ride in progress"));
})

test("Deve dar erro ao criar corrida: latitude inválida", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    const savePassengerResult = await signup.execute(passenger);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        fromLat: -93,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("The latitude is invalid"));
})

test("Deve dar erro ao criar corrida: longitude inválida", async function () {
    const passenger = {
        name: "Jane Doe",
        email: `janedoe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    const savePassengerResult = await signup.execute(passenger);
    const rideInput = {
        passengerId: savePassengerResult.accountId,
        fromLat: -90,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -248.522234807851476
    };
    await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("The longitude is invalid"));
})