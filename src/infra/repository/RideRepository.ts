import Ride from "../../domain/Ride";
import {inject} from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";

export interface RideRepository {
    existsOngoingRideForPassenger: (passengerId: string) => Promise<boolean>;
    getRideById: (rideId: string) => Promise<Ride>;
    saveRide: (ride: any) => Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {

    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async existsOngoingRideForPassenger(passengerId: string): Promise<any> {
        const [has_ongoing] = await this.connection.query(
            "select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
            [passengerId]
        );
        return !!has_ongoing;
    }

    async getRideById(rideId: string): Promise<any> {
        const [output] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        return {
            rideId: output.ride_id,
            passengerId: output.passenger_id,
            fromLat: parseFloat(output.from_lat),
            fromLong: parseFloat(output.from_long),
            toLat: parseFloat(output.to_lat),
            toLong: parseFloat(output.to_long),
            date: output.date,
            distance: parseFloat(output.distance),
            status: output.status,
            driverId: output.driver_id,
        };
    }

    async saveRide(ride: any): Promise<void> {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, status, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [ride.rideId, ride.passengerId, ride.status, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
    }
}