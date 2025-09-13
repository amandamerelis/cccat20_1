import pgp from 'pg-promise';
import Ride from "./Ride";

export interface RideRepository {
    existsOngoingRideForPassenger: (passengerId: string) => Promise<boolean>;
    getRideById: (rideId: string) => Promise<Ride>;
    saveRide: (ride: any) => Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {

    async existsOngoingRideForPassenger(passengerId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [has_ongoing] = await connection.query(
            "select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
            [passengerId]
        );
        await connection.$pool.end();
        return !!has_ongoing;
    }

    async getRideById(rideId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
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
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.ride (ride_id, passenger_id, status, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [ride.rideId, ride.passengerId, ride.status, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
        await connection.$pool.end();
    }
}