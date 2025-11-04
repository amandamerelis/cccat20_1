export default class Coordenate {
    private latitude: number;
    private longitude: number;

    constructor(latitude: number, longitude: number) {
        if(longitude < -180 || longitude > 180) throw new Error("The longitude is invalid");
        if(latitude < -90 || latitude > 90) throw new Error("The latitude is invalid");
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }
}