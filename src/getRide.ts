import {RideDAO} from "./data";
import {inject} from "./Registry";

export default class GetRide {

    @inject("rideDAO")
    rideDAO!: RideDAO;

    async getRideById(passengerId: string) {
        return await this.rideDAO.getRideById(passengerId);
    }

}