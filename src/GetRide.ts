import {RideRepository} from "./RideRepository";
import {inject} from "./Registry";

export default class GetRide {

    @inject("rideRepository")
    rideRepository!: RideRepository;

    async getRideById(passengerId: string) {
        return await this.rideRepository.getRideById(passengerId);
    }

}