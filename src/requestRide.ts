import {RideRepository} from "./RideRepository";
import {inject} from "./Registry";
import Ride from "./Ride";
import {AccountRepository} from "./AccountRepository";

export default class RequestRide {

    @inject("accountRepository")
    accountRepository!: AccountRepository;

    @inject("rideRepository")
    rideRepository!: RideRepository;

    constructor() {
    }

    async execute(input: Input) {
        const passenger = await this.accountRepository.getAccountById(input.passengerId);
        if (!passenger) throw new Error("Passenger not found");
        if (!passenger.isPassenger) throw new Error("User is not a passenger");
        const ongoingRide = await this.rideRepository.existsOngoingRideForPassenger(passenger.accountId);
        if (ongoingRide) {
            throw new Error("Passenger already has a ride in progress");
        }
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride);
        return ride;
    };
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}