const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const {flights, reservations} = require("./data");

const batchImport = async () => {

    let flightsList = [];
    
    flightsList.push(
      {
        _id: Object.keys(flights).toString(),
        flight: Object.keys(flights).toString(),
        seats: Object.values(flights.SA231),
      }
    );
    
    // console.log(flightsList)

  try {
    const client = new MongoClient(MONGO_URI, options);

    await client.connect(); // connect to the client

    console.log("Connected to MongoDB");

    const db = client.db("slingair"); // declare the database
    
    const result = await db.collection("flightsList").insertOne(flightsList); // insert the flight info into the database as a new collection

    // const result2 = await db.collection("flightsList").insertMany(Object.values(reservations)); // insert the reservation info into the database as a new collection

    // console.log("result here", result);
    
    client.close();
  } catch (error) {
    console.log(error.stack, "error");
  }
};

batchImport();