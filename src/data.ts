import pgp from 'pg-promise';

export interface AccountDAO {
    getAccountByEmail: (email: string) => Promise<any>;
    getAccountById: (accountId: string) => Promise<any>;
    saveAccount: (account: any) => Promise<void>;
}

export interface RideDAO {
    existsOngoingRideForPassenger: (passengerId: string) => Promise<boolean>;
    getRideById: (rideId: string) => Promise<any>;
    saveRide: (ride: any) => Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {

    async getAccountByEmail(email: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select * from ccca.account where email = $1", [email]);
        await connection.$pool.end();
        return output;
    }

    async getAccountById(accountId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        await connection.$pool.end();
        return output;
    }

    async saveAccount(account: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
        await connection.$pool.end();
    }

}

export class AccountDAOMemory implements AccountDAO {
    accounts: any[] = [];

    getAccountByEmail(email: string): Promise<any> {
        return this.accounts.find(account => account.email === email);
    }

    getAccountById(accountId: string): Promise<any> {
        return this.accounts.find(account => account.accountId === accountId);
    }

    saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
        return Promise.resolve();
    }

}

export class RideDAODatabase implements RideDAO {

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