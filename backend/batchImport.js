const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const {flights, reservations} = require("./data");

const batchImport = async () => {

    let flightSeats = [];
    
    flightSeats.push(flights);
    


  try {
    const client = new MongoClient(MONGO_URI, options);

    await client.connect(); // connect to the client

    const db = client.db("slingair"); // declare the database
    
    // const result = await db.collection("flightSeats").insertMany(flightSeats); // insert the flight into the database as a new collection

    const result2 = await db.collection("reservations").insertMany(Object.values(reservations)); // insert the seats into the database as a new collection

    // console.log("result here", result);
    
    client.close();
  } catch (error) {
    console.log(error.stack, "error");
  }
};

batchImport();