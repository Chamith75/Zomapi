import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://127.0.0.1:27017'; // Use const or let

let db;

async function dbConnect() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db('restaurants');
    console.log('Connection successful');
}

//list of all city
async function getData(colName , query){
    let output;
    try{
        output = db.collection(colName).find(query).toArray();
    }catch(e){
        output = {'error' : "error in getting data"}
    }

    return output
} 


//sort the data
async function getDataSort(colName,query,sort){
    let output;
    try{
        output = await db.collection(colName).find(query).sort(sort).toArray()
    }catch(err){
        output = {"Error":"Error in getting data"}
    }

    return output
}

async function getDataSortLimit(colName , query , sort , skip , limit){
    let output;
    try{
        output = await db.collection(colName).find(query).sort(sort).skip(skip).limit(limit).toArray();

    }catch(e){
        output = {"Error" : "eror while getdatasortlimit"}
    }
    return output
}


async function postData(colName,data){
    let output;
    try{
        output = await db.collection(colName).insertOne(data).toArray();
    }catch(err){
        output = {"response":"Error In Post Data"}
    }
    return output
}
async function updateData(colName , condition , data ) {
    let output;
    try{
        output = await db.collection(colName).updateOne(condition , data)
    }catch(err){
        output = {"Error ":"Error in UpdateData"}
    }

    return output


    
}


async function deleteData(colName,condition){
    let output;
    try{
        output = await db.collection(colName).deleteOne(condition)
    }catch(err){
        output = {"response":"Error In Deleting Data"}
    }
    return output
}
export {
    dbConnect,
    getData,
    getDataSort,
    getDataSortLimit,
    postData,
    updateData,
    deleteData
};
