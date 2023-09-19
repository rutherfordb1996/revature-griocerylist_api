const AWS = require('aws-sdk');
require('dotenv').config({ path: require('find-config')('.env') });

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_1,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_1
});

const dynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
// CRUD
// Create
// Read
// Update
// Delete

// Create
// addGroceryItem function
function addGroceryItem(item_id, name, quantity, price,bought){

    const params = {
        TableName: 'grocery_items',
        Item: {
            'item_id' : item_id,
            'name' : name,
            'quantity' : quantity,
            'price' : price,
            'bought' : bought
        }
    }

    return docClient.put(params).promise();
};

// Read
// retrieve by id
function retrieveGroceryItemById(grocery_item_id){
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
        }
    }

    return docClient.get(params).promise();
}

// retrieve a list
// scan operation
// this operation is inefficient as it will go through the entire list
// Do not use this often

function retrieveAllGroceryItems(){
    const params = {
        TableName: 'grocery_items'
    }

    return docClient.scan(params).promise();
}

// O(N)
function retrieveGroceryItemsByCategory(category){
    const params = {
        TableName: 'grocery_items',
        FilterExpression: '#c = :value',
        ExpressionAttributeNames: {
            '#c': 'category'
        },
        ExpressionAttributeValues: {
            ':value': category
        },
        Limit: 1
    };

    return docClient.scan(params).promise();
}

// O(1)
//  This requires you to setup your local secondary index using the same partition key
// but different sort key on the category
// function retrieveGroceryItemByCategory(){
//     const params = {
//         TableName: 'grocery_items',
//         IndexName: 'category-index',
//         KeyConditionExpression: '#c = :value',
//         ExpressionAttributeNames: {
//             '#c': 'category'
//         },
//         ExpressionAttributeValues: {
//             ':value': category
//         }
//     }

//     return docClient.query(params).promise();
// }

// Update

function updateGroceryNameById(item_id){
    const params = {
        TableName: 'grocery_items',
        Key: {
            item_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames:{
            '#n': 'bought'
        },
        ExpressionAttributeValues:{
            ':value': 'true'
        }
    }

    return docClient.update(params).promise();
}

// Delete
function deleteGroceryItemById(item_id){
    const params = {
        TableName: 'grocery_items',
        Key: {
            item_id
        }
    }

    return docClient.delete(params).promise();
}


module.exports = {
    addGroceryItem,
    retrieveGroceryItemById,
    retrieveAllGroceryItems,
    retrieveGroceryItemsByCategory,
    updateGroceryNameById,
    deleteGroceryItemById
};