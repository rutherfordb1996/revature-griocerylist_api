const groceryItemDao = require('./groceryDAO')

const express = require('express');
const server = express();
const PORT = 3000;

const uuid = require('uuid');

const bodyParser = require('body-parser');

server.use(bodyParser.json());

server.get('/', (req, res) => {
    res.send('Hello World');
});

function validateNewItem(req, res, next){
    if(!req.body.name || !req.body.quantity || !req.body.price){
        req.body.valid = false;
        next();
    }else{
        req.body.valid = true;
        next();
    }
}
server.post('/groceries',validateNewItem, (req, res) => {
    const body = req.body;
    if(req.body.valid){
        groceryItemDao.addGroceryItem(uuid.v4(), body.name, body.quantity, body.price, false)
            .then((data) => {
                res.send({
                    message: "Successfully Added Item!"
                })
            })
            .catch((err) => {
                res.send({
                    message: "Failed to Add Item!"
                })
            })
    }else{
        res.send({
            message: "Invalid Item properties"
        })
    }
})
server.get('/groceries', (req, res) => {
    groceryItemDao.retrieveAllGroceryItems()
        .then((data) => {
            res.send(data.Items);
        })
        .catch((err) => {
            res.send("failed to retrieve list!")
        })
})
server.patch('/groceries', (req,res) => {
    getItemID(req.query.index)
    .then((data) => {
        groceryItemDao.updateGroceryNameById(data)
        .then((data) => {
            res.send("Item updated!")
        })
        .catch((err) => {
            res.send("Failed to update")
        })
    })
    .catch((err)=>{
        res.send('failed to find item with that index')
    })
})
server.delete('/groceries', (req,res) => {
    getItemID(req.query.index)
    .then((data) => {
        groceryItemDao.deleteGroceryItemById(data)
        .then((data) => {
            res.send("Item deleted!")
        })
        .catch((err) => {
            res.send("Failed to delete")
        })
    })
    .catch((err)=>{
        res.send('failed to find item with that index')
    })
})

server.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
});

//const { createLogger, transports, format, add } = require('winston');

function getItemID(index){
    let res = new Promise((resolve, reject) => {
        groceryItemDao.retrieveAllGroceryItems()
        .then((data) => {
             resolve(data.Items[index-1].item_id);
        })
        .catch((err) => {
            reject(err);
        });
    });
    return(res)
}

function deleteItem(id){
    groceryItemDao.deleteGroceryItemById(id)
    .then((data) => {
        console.log(data);
        return("The item has been deleted");
    })
    .catch((err) => {
        console.error(err);
        return("there was an error: "+ err);
     });
}

/*
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
        printItems()
        .then((response) => {
            res.end(response);
            logger.info("GET: " + response);
        })
        .catch((err) => {
            res.end(err);
            logger.error("GET: " + err);
        })
        
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
            response = addItem(data.name,data.quantity,data.price);
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(response));
            logger.info("created new item: "+JSON.stringify(response));
        });
    }
    // toggle bought by sending a PATCH request to http://localhost:3000/api/shoppinglist?{entry#}
    else if(req.method === "PATCH" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        let response = toggleItemBought(requestUrl-1);
        res.end(JSON.stringify(response));
        
    }
    // delete an item by sending a DELETE request to http://localhost:3000/api/shoppinglist{entry#}
    else if(req.method === "DELETE" && url.parse(req.url).pathname === '/api/shoppinglist'){
        const requestUrl = parseInt(url.parse(req.url).query);
        console.log(requestUrl);
        let response = deleteItembyindex(requestUrl-1);
        res.end(JSON.stringify(response));
        
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }

})

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})
*/
//module.exports ={printItems, addItem, toggleItemBought, deleteItem};