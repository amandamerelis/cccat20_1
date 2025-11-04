import Ride from "../../src/domain/Ride";
import Uuid from "../../src/domain/vo/Uuid";

test("Deve criar a corrida e calcular corretamente a distância e a tarifa", function () {
    const fromLat = -27.584905257808835;
    const fromLong = -48.545022195325124;
    const toLat = -27.496887588317275;
    const toLong = -48.522234807851476;
    const ride = Ride.create(Uuid.create().getValue(), fromLat, fromLong, toLat, toLong);
    expect(ride.calculateDistance()).toBe(10);
    expect(ride.calculateFare()).toBe(21);
})