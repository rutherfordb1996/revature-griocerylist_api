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
const { createLogger, transports, format } = require('winston');


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
        let data = "";
        if(shoppinglist.length > 0){
            for( let i = 0; i < shoppinglist.length; i++){
                data += `${i+1} | name: ${shoppinglist[i].name} | quantity: ${shoppinglist[i].quantity} | Price: ${shoppinglist[i].price} | Purchased? ${shoppinglist[i].bought}.          `
            }
            res.end(JSON.stringify(data));
            logger.info("GET: " + JSON.stringify(data));
        }
        else{
            data += "the shopping list is empty, add some items why don't you?";
            res.end(JSON.stringify(data));
            logger.info("GET: " + JSON.stringify(data));
        }
        
    //add an item by sending a POST request to http://localhost:3000/api/shoppinglist with the body containing a JSON shoppinglist item
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
            logger.info("created new item: "+JSON.stringify(new createShoppinglistItem(data.name,data.quantity,data.price)));
        });
    }
    // toggle bought by sending a PATCH request to http://localhost:3000/api/shoppinglist?{entry#}
    else if(req.method === "PATCH" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        if(requestUrl && requestUrl <= shoppinglist.length){
            shoppinglist[requestUrl-1].bought = true;
            res.end(JSON.stringify({message: `${shoppinglist[requestUrl -1].name} has been marked as bought!`}))
            logger.info("toggled: "+`${shoppinglist[requestUrl -1].name}`);
        }
        else{
            res.end(JSON.stringify({message: 'Sorry, there seems to be a problem'}));
            logger.error("toggle:" +`user attempted to toggle item ${requestUrl} but it was not found, the list was ${shoppinglist.length} long`);
        }
        
    }
    // delete an item by sending a DELETE request to http://localhost:3000/api/shoppinglist{entry#}
    else if(req.method === "DELETE" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        if(requestUrl && requestUrl <= shoppinglist.length){
            logger.info("deleted: "+`${shoppinglist[requestUrl -1].name}`);
            shoppinglist.splice(requestUrl - 1,1)
            res.end(JSON.stringify({message: 'Resource Deleted Successfully!'}))
        }
        else{
            res.end(JSON.stringify({message: 'Sorry, there doesnt appear to be anything to delete'}));
            logger.error("delete:" +`user attempted to delete item ${requestUrl} but it was not found, the list was ${shoppinglist.length} long`);
        }
        
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }

})

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})