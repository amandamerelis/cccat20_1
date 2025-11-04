import {inject} from "../../infra/di/Registry";
import {RideRepository} from "../../infra/repository/RideRepository";
import {AccountRepository} from "../../infra/repository/AccountRepository";

export default class AcceptRide {

    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("accountRepository")
    accountRepository!: AccountRepository;

    constructor() {
    }

    async execute(input: Input): Promise<Output> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (!ride) throw new Error("Ride not found");
        const driverAccount = await this.accountRepository.getAccountById(input.driverId);
        if (!driverAccount || !driverAccount.isDriver) throw new Error("The account must be from a driver");
        ride.accept(driverAccount.getAccountId());
        await this.rideRepository.updateRide(ride);
        return {
            status: "accepted",
        }
    }
}

type Input = {
    rideId: string,
    driverId: string,
}

type Output = {
    status: string,
}