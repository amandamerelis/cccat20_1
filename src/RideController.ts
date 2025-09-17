import {inject} from "./Registry";
import HttpServer from "./HttpServer";
import RequestRide from "./RequestRide";
import GetRide from "./GetRide";

export default class RideController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("requestRide")
    requestRide!: RequestRide;
    @inject("getRide")
    getRide!: GetRide;

    constructor() {
        this.httpServer.register("post", "/rides", async (params: any, body: any) => {
            const input = body;
            return await this.requestRide.execute(input);
        });

        this.httpServer.register("get", "/rides/:rideId", async (params: any, body: any) =>  {
            const rideId = params.rideId;
            return await this.getRide.getRideById(rideId);
        });
    }
}


