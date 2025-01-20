import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect, getData  , getDataSort, getDataSortLimit, postData, updateData ,deleteData} from './controler/dbcontroler';
import { ObjectId } from 'mongodb';


dotenv.config();

const app = express();
let port = process.env.PORT;



app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {

    res.send('ok')
})

app.get('/location', async (req, res) => {
    let query = {};
    let collection = 'location'
    let output = await getData(collection, query);
    res.status(200).send(output)
})
app.get('/restaurants', async (req, res) => {
    let stateId = Number(req.query.stateId)
    let query = {};
    let colName = 'restaurants';
    if (stateId) {
        query = { "state_id": stateId }
    }
    let output = await getData(colName, query)
    res.status(200).send(output)

})
app.get('/mealtype', async (req, res) => {
    let query = {};
    let colName = 'mealType';
    let output = await getData(colName, query)
    res.status(200).send(output)
})

//filters
app.get('/filters/:mealId', async (req, res) => {
    let mealId = Number(req.params.mealId);
    let query = {"mealTypes.mealtype_id": mealId};
    let sort = {cost :1}
    let skip = Number(req.query.skip);
    let limit = Number(req.query.limit)


    if(req.query.sort){
        sort={cost : req.query.sort}
    }

   
    let cusineId = Number(req.query.cusineId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    
    let colName = 'restaurants';
    
    
    if (cusineId) {
        query = {
            "mealTypes.mealtype_id": mealId,
            "cuisines.cuisine_id": cusineId
        }
    } 
    if (lcost && hcost) {
        query = {
            "mealTypes.mealtype_id": mealId,
            "$and": [{ cost: { $gt: lcost, $lt: hcost } }]
        }
    }
    if(skip && limit){
        query = {}
    }
        
        
    let output = await getDataSortLimit(colName, query, sort , skip ,limit )
    res.status(200).send(output)

})

app.get('/menu/:id' , async(req , res) => {
    let id = Number(req.params.id);
    let query ={ 
        "menu_id" : id   
    };
    let colName = 'menu';
    let output = await getData(colName, query)
    res.status(200).send(output);

})

app.post('/placeorder', async (req , res) => {
    let data = req.body;
    console.log(data)
    let colName = 'orders';
    let output = await postData(colName , data);
    res.status(200).send(`Order Placed ${output}`)

})

app.get('/orders' , async(req , res) => {
    let query = {};
    let colName = 'orders';
    let email = req.query.email;
    if(email){
        query ={
            "email" : email
        }
    }

    let output =await getData(colName , query)
    res.status(200).send(output)

})

app.put('/updateorder' , async(req ,res) => {
    let colName = "orders";
    let id = req.body._id;
    console.log(id);
    let condition = {
        "_id" : req.body._id
    }
    let data = {
        $set : {
            "status" : req.body.status
        }
    }
    let output = await updateData(colName , condition , data);
    res.status(200).send(output)
    
})


app.delete('/deleteorder' , async (req, res) => {
    let colName = "orders";
    
    let condition = {_id:new ObjectId(req.body._id)}
    let row = await getData(colName,condition)
    console.log(condition)
    if(row.length > 0){
        await deleteData(colName,condition)
        res.status(200).send('Data Deleted')
    }else{
        res.status(200).send('No Record Found')
    }
})



app.listen(port, () => {
    dbConnect();
    console.log(`server is running on port ${port}`);
})