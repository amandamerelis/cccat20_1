import {AccountDAO, RideDAO} from "./data";
import {inject} from "./Registry";

export default class RequestRide {

    @inject("accountDAO")
    accountDatabase!: AccountDAO;

    @inject("rideDAO")
    rideDatabase!: RideDAO;

    constructor() {
    }

    calculateDistance(fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const earthRadius = 6371;
        const degreesToRadians = Math.PI / 180;
        const deltaLat = (toLat - fromLat) * degreesToRadians;
        const deltaLon = (toLong - fromLong) * degreesToRadians;
        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(fromLat * degreesToRadians) *
            Math.cos(toLat * degreesToRadians) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return Math.round(distance);
    }

    async execute(input: Input) {
        const passenger = await this.accountDatabase.getAccountById(input.passengerId);
        if (!passenger) throw new Error("Passenger not found");
        if (!passenger.isPassenger) throw new Error("User is not a passenger");
        if(input.fromLat < -90 || input.fromLat > 90) throw new Error("The latitude is invalid")
        if(input.toLat < -90 || input.toLat > 90) throw new Error("The latitude is invalid")
        if(input.fromLong < -180 || input.fromLong > 180) throw new Error("The longitude is invalid")
        if(input.toLong < -180 || input.toLong > 180) throw new Error("The longitude is invalid")
        const ongoingRide = await this.rideDatabase.existsOngoingRideForPassenger(passenger.accountId);
        if (ongoingRide) {
            throw new Error("Passenger already has a ride in progress");
        }
        const ride = {
            ...input,
            rideId: crypto.randomUUID(),
            date: new Date(),
            status: "requested",
            distance: 0,
            fare: 0
        };
        const distance = this.calculateDistance(input.fromLat, input.fromLong, input.toLat, input.toLong);
        const fare = distance * 2.1;
        ride.distance = distance;
        ride.fare = fare;
        await this.rideDatabase.saveRide(ride);
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