import {RideRepository} from "../../infra/repository/RideRepository";
import {inject} from "../../infra/di/Registry";

export default class GetRide {

    @inject("rideRepository")
    rideRepository!: RideRepository;

    async getRideById(passengerId: string): Promise<Output> {
        const ride = await this.rideRepository.getRideById(passengerId);
        if (!ride) throw new Error("Ride not found");
        return {
            rideId: ride.getRideId(),
            passengerId: ride.getPassengerId(),
            driverId: ride.getDriverId(),
            fromLat: ride.getFromCoordinate().getLatitude(),
            fromLong: ride.getFromCoordinate().getLongitude(),
            toLat: ride.getToCoordinate().getLatitude(),
            toLong: ride.getToCoordinate().getLongitude(),
            fare: ride.getFare(),
            distance: ride.getDistance(),
            status: ride.getStatus(),
            date: ride.date,
        }
    }

}

type Output = {
    rideId: string,
    passengerId: string,
    driverId?: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date
}