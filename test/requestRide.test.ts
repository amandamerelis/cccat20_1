import SignUp from "../src/signup";
import {AccountDAOMemory, RideDAODatabase} from "../src/data";
import RequestRide from "../src/requestRide";
import GetRide from "../src/getRide";

let signup: SignUp;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
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
        from: {lat: 12, long: 500},
        to: {lat: 60, long: 600},
    };
    const saveRideResult = await requestRide.execute(rideInput);
    expect(saveRideResult.rideId).toBeDefined();
    const outputGetRide = await getRide.getRideById(saveRideResult.rideId);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.from_lat).toBe(rideInput.from.lat.toString());
    expect(outputGetRide.from_long).toBe(rideInput.from.long.toString());
    expect(outputGetRide.to_lat).toBe(rideInput.to.lat.toString());
    expect(outputGetRide.to_long).toBe(rideInput.to.long.toString());
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
        from: {lat: 12, long: 500},
        to: {lat: 60, long: 600},
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
        from: {lat: 12, long: 500},
        to: {lat: 60, long: 600},
    };
    await requestRide.execute(rideInput);
    await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("Passenger already has a ride in progress"));
})