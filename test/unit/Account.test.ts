import Account from "../../src/domain/Account";

test("Deve criar uma conta de motorista", function () {
    const account = Account.create(
        "Jane Doe",
        `janedoe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        false,
        true,
        "ABC1234"
    );
    expect(account).toBeDefined();
});

test("Não deve criar uma conta de motorista com placa inválida", function () {
    expect(() => Account.create(
        "Jane Doe",
        `janedoe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        false,
        true,
        "ABCD234"
    )).toThrow(new Error("Invalid car plate"));
});