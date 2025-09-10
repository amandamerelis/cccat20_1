import {AccountDAO, RideDAO} from "./data";
import {inject} from "./Registry";

export default class RequestRide {

    @inject("accountDAO")
    @inject("rideDAO")
    accountDatabase!: AccountDAO;
    rideDatabase!: RideDAO;

    constructor() {
    }

    async execute(input: any) {
        const passenger = await this.accountDatabase.getAccountById(input.passengerId);
        if (!passenger) throw new Error("Passenger not found");
        if (!passenger.isPassenger) throw new Error("User is not a passenger");
        const ongoingRide = await this.rideDatabase.existsOngoingRideForPassenger(passenger.accountId);
        if(ongoingRide){
            throw new Error("Passenger already has a ride in progress");
        }
        const ride = {
            ...input,
            rideId: crypto.randomUUID(),
            date: new Date(),
            status: "requested",
            distance: 1000,
        };
        await this.rideDatabase.saveRide(ride);
        return ride;
    };
}

