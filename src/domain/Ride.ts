import Uuid from "./vo/Uuid";
import Coordenate from "./vo/Coordenate";

export default class Ride {

    private rideId: Uuid;
    private passengerId: Uuid;
    private driverId?: Uuid;
    private fromCoordinate: Coordenate;
    private toCoordinate: Coordenate;

    constructor(
        rideId: string,
        passengerId: string,
        driverId: string | null,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        private distance: number,
        private fare: number,
        private status: string,
        readonly date: Date,
    ) {
        this.rideId = new Uuid(rideId);
        this.passengerId = new Uuid(passengerId);
        if (driverId) this.driverId = new Uuid(driverId);
        this.fromCoordinate = new Coordenate(fromLat, fromLong);
        this.toCoordinate = new Coordenate(toLat, toLong);
    }

    static create(passengerId: string,
                  fromLat: number,
                  fromLong: number,
                  toLat: number,
                  toLong: number) {
        const rideId = Uuid.create().getValue();
        const status = "requested";
        const date = new Date();
        const distance = 0;
        const fare = 0;
        return new Ride(rideId, passengerId, null, fromLat, fromLong, toLat, toLong, distance, fare, status, date);
    }

    calculateDistance() {
        const earthRadius = 6371;
        const degreesToRadians = Math.PI / 180;
        const deltaLat = (this.toCoordinate.getLatitude() - this.fromCoordinate.getLatitude()) * degreesToRadians;
        const deltaLon = (this.toCoordinate.getLongitude() - this.fromCoordinate.getLongitude()) * degreesToRadians;
        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(this.fromCoordinate.getLatitude() * degreesToRadians) *
            Math.cos(this.toCoordinate.getLatitude() * degreesToRadians) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return Math.round(distance);
    }

    calculateFare() {
        const distance = this.calculateDistance();
        return distance * 2.1;
    }

    getRideId() {
        return this.rideId.getValue();
    }

    getFromCoordinate() {
        return this.fromCoordinate;
    }

    getToCoordinate() {
        return this.toCoordinate;
    }

    getPassengerId() {
        return this.passengerId.getValue();
    }

    getStatus() {
        return this.status;
    }

    setStatus(status: string) {
        this.status = status;
    }

    getDistance() {
        return this.distance;
    }

    setDistance(distance: number) {
        this.distance = distance;
    }

    getFare() {
        return this.fare;
    }

    setFare(fare: number) {
        this.fare = fare;
    }

    getDriverId() {
        return this.driverId?.getValue();
    }

    setDriverId(driverId: string) {
        this.driverId = new Uuid(driverId);
    }

    accept(driverId: string){
        if (this.status !== "requested") throw new Error("Invalid status");
        this.driverId = new Uuid(driverId);
        this.status = "accepted";
    }

    start(){
        if (this.status !== "accepted") throw new Error("Invalid status");
        this.status = "in_progress";
    }
}