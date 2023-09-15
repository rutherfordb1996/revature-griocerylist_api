const app = require('../app');
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
describe("testing printing the list", () => {
    test('when a list has elements it should return a string describing the contents', () => {
        //Arrange
        const testListExists = [{"name":"milk", "quantity":"1", "price":"3.00","bought":"false"}];
        // ACT
        const result = app.printlist(testListExists);
        //Assert
        expect(result).toBe("\"1 | name: milk | quantity: 1 | Price: 3.00 | Purchased? false.\"")
    })
    test('when a list is empty it should say so', () => {
        //Arrange
        const testListNoExists = [];
        // ACT
        const result = app.printlist(testListNoExists);
        //Assert
        expect(result).toBe("\"the shopping list is empty, add some items why don't you?\"")
    })
    
})
describe("testing adding to the list", () => {
    test('when you add an object the item you added should be there', () => {
        //Arrange
        const list = [];
        const name = "milk";
        const quantity = 1;
        const price = 3.00;
        // ACT
        let r2;
        r2 = app.addItem(name, quantity, price, list);
        //Assert
        expect(r2).toEqual({"name":"milk", "quantity":1, "price":3,"bought":false});
    })
})
describe("testing toggling the list", () => {
    test('when you toggle an object the item you toggled should be set to bought', () => {
        //Arrange
        const testListExists = [{"name":"milk", "quantity":"1", "price":"3.00","bought":"false"}];
        // ACT
        let r1 = app.toggleItemBought(0, testListExists);
        result = r1.bought;
        //Assert
        expect(result).toEqual(true);
    })
    test('when you toggle an object that does not exist you should get an error', () => {
        //Arrange
        const testListExists = [{"name":"milk", "quantity":"1", "price":"3.00","bought":"false"}];
        // ACT
        let r1 = app.toggleItemBought(2, testListExists);
        //Assert
        expect(r1).toEqual({"response":"the index you requested to delete does not exist"});
    })
})
describe("testing deleting from the list", () => {
    test('when you delete an entry it should be gone', () => {
        //Arrange
        const testListExists = [{"name":"milk", "quantity":"1", "price":"3.00","bought":"false"}];
        // ACT
        let r1 = app.deleteItem(0, testListExists);
        console.log(r1);
        //Assert
        expect(r1).toStrictEqual([]);
    })
    test('when you delete an entry that does not exist you should get an error', () => {
        //Arrange
        const testListExists = [{"name":"milk", "quantity":"1", "price":"3.00","bought":"false"}];
        // ACT
        let r1 = app.deleteItem(2, testListExists);
        console.log(r1);
        //Assert
        expect(r1).toStrictEqual({message: 'Sorry, there doesnt appear to be anything to delete'});
    })
})
//describe("testing printing the list", () => {
    //Arrange

    // ACT

    //Assert
//})
