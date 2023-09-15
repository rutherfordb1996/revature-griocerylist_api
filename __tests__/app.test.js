const app = require('../app');
const requester = require("supertest");
const path = "http://localhost:3000"
describe("testing shopping list items", () =>{
    test('if you create an item with properties it should have them', () => {
        //Arrange
        const name = 'milk';
        const quantity = 2;
        const price = 3.00
        
        //Act
        let result = new app.createShoppinglistItem(name,quantity,price);
        console.log(result);
        //Assert
        expect(result.name).toBe(name);
        expect(result.quantity).toBe(quantity);
        expect(result.price).toBe(price);
        expect(result.bought).toBe(false);
    })
})
describe("testing GET functionality",() => {
    const newItem = {name: "milk", quantity: 2, price: 3.00};
    beforeAll(async () => {
        // set up an item
        await requester(path).post("/api/shoppinglist").send(newItem);
      });
    afterEach(async () => {
        await requester(path).delete("/api/shoppinglist?1");
    });
    test('it should return the list', async () => {
        const response = await requester(path).get("/api/shoppinglist");
        expect(response.body.length >= 1).toBe(true);
      })
    test('when the list is empty it shoud return an error string', async () => {
        const response = await requester(path).get("/api/shoppinglist");
        expect(response.body).toBe("the shopping list is empty, add some items why don't you?");
    })
})
describe("testing POST functionality",() => {
    const newItem = {name: "milk", quantity: 2, price: 3.00};
    test('when you send an item, it the server should say if it got it', async () => {
        const response = await requester(path).post("/api/shoppinglist").send(newItem);
        expect(response.body).toStrictEqual({"message":"Resource Created Successfully!"})
        expect(response.statusCode).toBe(201);
    })
})
describe("testing PATCH functionality", () => {
    const newItem = {name: "milk", quantity: 2, price: 3.00};
    beforeAll(async () => {
        // set up an item
        await requester(path).post("/api/shoppinglist").send(newItem);
    });
    test('after you patch an item that exists, bought should be set to true for that item', async () => {
        const response = await requester(path).patch("/api/shoppinglist").query("1");
        expect(response.text).toBe('{"message":"milk has been marked as bought!"}');
    })
    test('after you patch an item that doesnt exist, you should get an error string back', async () => {
        const response = await requester(path).patch("/api/shoppinglist").query("0");
        expect(response.text).toBe('{"message":"Sorry, there seems to be a problem"}');
    })
})
describe("testing DELETE functionality", () => {
    const newItem = {name: "milk", quantity: 2, price: 3.00};
    beforeAll(async () => {
        // set up an item
        await requester(path).post("/api/shoppinglist").send(newItem);
    })
    test('deleteing an item should send confirmation text', async () => {
        const response = await requester(path).delete("/api/shoppinglist").query("1");
        expect(response.text).toBe('{"message":"Resource Deleted Successfully!"}');
    })
    test('deleteing an item that doesnt exist should send error text', async () => {
        const response = await requester(path).delete("/api/shoppinglist").query("0");
        expect(response.text).toBe('{"message":"Sorry, there doesnt appear to be anything to delete"}');
    })
})
describe("testing unsupported features", () => {
    test("PUT requests should not work", async () => {
        const response = await requester(path).put("/api/shoppinglist");
        expect(response.statusCode).toBe(404)
    })
    test("HEAD requests should not work", async () => {
        const response = await requester(path).head("/api/shoppinglist");
        expect(response.statusCode).toBe(404)
    })
    test("OPTIONS requests should not work", async () => {
        const response = await requester(path).options("/api/shoppinglist");
        expect(response.statusCode).toBe(404)
    })
})
