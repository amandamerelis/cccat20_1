import {RideRepository} from "../../infra/repository/RideRepository";
import {inject} from "../../infra/di/Registry";

export default class GetRide {

    @inject("rideRepository")
    rideRepository!: RideRepository;

    async getRideById(passengerId: string) {
        return await this.rideRepository.getRideById(passengerId);
    }

}