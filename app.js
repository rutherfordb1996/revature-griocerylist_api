let shoppinglist = [];
const http = require("http");
const url = require('node:url');
const PORT = 3000;
function createShoppinglistItem(name, quantity, price){
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.bought = false;
}
const { createLogger, transports, format } = require('winston');

function addItem(name, quantity, price, list){
    list.push(new createShoppinglistItem(name,quantity,price));
    shoppinglist = list;
    return(list[list.length -1]);
}
function printlist(list){
    let data = '';
    if(list.length > 0){
        for( let i = 0; i < list.length; i++){
            data += `${i+1} | name: ${list[i].name} | quantity: ${list[i].quantity} | Price: ${list[i].price} | Purchased? ${list[i].bought}.`;
        }
    }
    else{
        data += "the shopping list is empty, add some items why don't you?";
    }
    return(JSON.stringify(data));
}
function toggleItemBought(index, list){
    if(index < list.length){
        list[index].bought = true;
        logger.info("toggled: "+`${list[index].name}`);
        shoppinglist = list;
        return(list[index]);
    }
    else{
        logger.error("toggle:" +`user attempted to toggle item ${index} but it was not found, the list was ${list.length} long`);
        return({"response":"the index you requested to delete does not exist"});
    }   
}
function deleteItem(index, list){
    if(index < list.length){
        logger.info("deleted: "+`${list[index].name}`);
        list.splice(index,1);
        shoppinglist = list;
        return(shoppinglist);
    }
    else{
        logger.error("delete:" +`user attempted to delete item ${index+1} but it was not found, the list was ${list.length} long`);
        return({message: 'Sorry, there doesnt appear to be anything to delete'})
    }
}

// create the logger
const logger = createLogger({
    level: 'info', // this will log only messages with the level 'info' and above
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'infolog.txt', level: 'info' }),
        new transports.File({ filename: 'errorlog.txt', level: 'error' }),
    ]
})
const server = http.createServer((req, res) => {

    // view the list by sending a GET request to http://localhost:3000/api/shoppinglist
    if (req.method === 'GET' && url.parse(req.url).pathname === '/api/shoppinglist'){
        res.writeHead(200, { 'Content-Type': 'application/json'});
        const response = printlist(shoppinglist)
        res.end(response);
        logger.info("GET: " + response);
    }
        
    //add an item by sending a POST request to http://localhost:3000/api/shoppinglist with the body containing a JSON shoppinglist item
    //example: {"name": "milk" , "quantity": "4", "price": "2.00"}
    else if(req.method === 'POST'&& url.parse(req.url).pathname === '/api/shoppinglist'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            console.log(data);
            let response;
            shoppinglist, response = addItem(data.name,data.quantity,data.price, shoppinglist);
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(response));
            logger.info("created new item: "+JSON.stringify(response));
        });
    }
    // toggle bought by sending a PATCH request to http://localhost:3000/api/shoppinglist?{entry#}
    else if(req.method === "PATCH" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        let response;
        shoppinglist, response = toggleItemBought(requestUrl-1, shoppinglist);
        res.end(JSON.stringify(response));
        
    }
    // delete an item by sending a DELETE request to http://localhost:3000/api/shoppinglist{entry#}
    else if(req.method === "DELETE" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        let response;
        shoppinglist, response = deleteItem(requestUrl-1, shoppinglist);
        res.end(JSON.stringify(response));
        
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }

})

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})
module.exports ={createShoppinglistItem, printlist, addItem, toggleItemBought, deleteItem};