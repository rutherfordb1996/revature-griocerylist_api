const shoppinglist = [];
const http = require("http");
const url = require('node:url');
const PORT = 3000;
function createShoppinglistItem(name, quantity, price){
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.bought = false;
}
const server = http.createServer((req, res) => {

    // view the list by sending a GET request to http://localhost:3000/api/shoppinglist
    if (req.method === 'GET' && url.parse(req.url).pathname === '/api/shoppinglist'){
        res.writeHead(200, { 'Content-Type': 'application/json'});
        let data = "";
        if(shoppinglist.length > 0){
            for( let i = 0; i < shoppinglist.length; i++){
                data += `${i+1} | name: ${shoppinglist[i].name} | quantity: ${shoppinglist[i].quantity} | Price: ${shoppinglist[i].price} | Purchased? ${shoppinglist[i].bought}.          `
            }
            res.end(JSON.stringify(data));
        }
        else{
            data += "the shopping list is empty, add some items why don't you?";
            res.end(JSON.stringify(data));
        }
        
    //add an item by sending a PUT request to http://localhost:3000/api/shoppinglist with the body containing a JSON shoppinglist item
    //example: {"name": "milk" , "quantity": "4", "price": "2.00"}
    }else if(req.method === 'POST'&& url.parse(req.url).pathname === '/api/shoppinglist'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            console.log(data);
            shoppinglist.push(new createShoppinglistItem(data.name,data.quantity,data.price))
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Resource Created Successfully!'}));
        });
    }
    // toggle bought by sending a PATCH request to http://localhost:3000/api/shoppinglist?{entry#}
    else if(req.method === "PATCH" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        if(requestUrl && requestUrl <= shoppinglist.length){
            shoppinglist[requestUrl-1].bought = true;
            res.end(JSON.stringify({message: `${shoppinglist[requestUrl -1].name} has been marked as bought!`}))
        }
        else{
            res.end(JSON.stringify({message: 'Sorry, there seems to be a problem'}));
        }
        
    }
    // delete an item by sending a DELETE request to http://localhost:3000/api/shoppinglist{entry#}
    else if(req.method === "DELETE" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        if(requestUrl && requestUrl <= shoppinglist.length){
            shoppinglist.splice(requestUrl - 1,1)
            res.end(JSON.stringify({message: 'Resource Deleted Successfully!'}))
        }
        else{
            res.end(JSON.stringify({message: 'Sorry, there doesnt appear to be anything to delete'}));
        }
        
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }

})

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})