"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
// const { flights, reservations } = require("./data");

const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// returns a list of all flights
// from: /api/get-flights
const getFlights = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);

    console.log("Connecting to MongoDB...");

    await client.connect();
    const db = client.db("slingair");
    const result = await db.collection("flights").find().toArray();

    // console.log("get flights results..",result);

    res.status(200).json({ status: 200, flight_list: result, message: "the requested flight list" });

    client.close();

  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

// returns all the seats on a specified flight
// from: /api/get-flight/:flight
const getFlight = async (req, res) => {
  // console.log(req.params);

  const flightNumber = req.params.flight;

  try {
    const client = new MongoClient(MONGO_URI, options);

    console.log("Connecting to MongoDB...");

    await client.connect();

    const db = client.db("slingair");

    const result = await db
      .collection("flights")
      .findOne({ flight: flightNumber });
    // console.log("get flight info with number",result);

    res.status(200).json({ status: 200, flight_seats: result.seats, message: "the requested seats" });

    client.close();
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
};

// returns all reservations
// from: /api/get-reservations
const getReservations = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);

    console.log("Connecting to MongoDB...");

    await client.connect();
    const db = client.db("slingair");

    const result = await db.collection("reservations").find().toArray();

    // console.log("get reservations results..",result);

    res.status(200).json({ status: 200, reservation_list: result, message: "the requested data" });

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

// returns a single reservation
// from: /api/get-reservation/:reservation
const getSingleReservation = async (req, res) => {
  // console.log("get single reservation", req.params);

  const reservationId = req.params.reservation;
  // console.log("get single reservation", typeof reservationId);

  try {
    const client = new MongoClient(MONGO_URI, options);

    console.log("Connecting to MongoDB...");

    await client.connect();

    const db = client.db("slingair");

    const result = await db
      .collection("reservations")
      .findOne({ _id: ObjectId(reservationId) });

    // console.log("get single reservation result..",result);

    res.status(200).json({ status: 200, reservation: result, message: "the requested reservation data" });

    client.close();
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
};

// creates a new reservation
// from: /api/add-reservation
const addReservation = async (req, res) => {
  //   console.log("add reservation", req.body);

  const { flight, givenName, surName, email, seat } = req.body;

  // validation of data
  if (!flight || !givenName || !surName || !email || !seat) {
    res.status(400).json({ status: 400, message: "Missing required fields" });
    return;
  } // email validation
  else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    )
  ) {
    res.status(400).json({ status: 400, message: "Invalid email address" });
    return;
  } // if validation passes, create a new reservation
  else {
    try {
      const client = new MongoClient(MONGO_URI, options);
      console.log("Connecting to MongoDB...");
      await client.connect();
      const db = client.db("slingair");
      const result = await db.collection("reservations").insertOne({
        id: uuidv4(),
        flight: flight,
        seat: seat,
        givenName: givenName,
        surName: surName,
        email: email,
      });

      // console.log("add reservation result..",result);

      const result2 = await db
        .collection("flights")
        .updateOne(
          { _id: flight, "seats.id": seat },
          { $set: { "seats.$.isAvailable": false } }
        );

      res.status(201).json({
        status: 201,
        message: "Reservation successful!",
        reservation: result, // i use this for reference
        your_reservation_id: result.insertedId,
      });

      client.close();
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  }
};

// updates an existing reservation
// from: /api/update-reservation/
const updateReservation = async (req, res) => {
  // console.log("update reservation", req.body);

  const { id, flight, givenName, surName, email, seat } = req.body;

  // validation of data
  if (!id || !flight || !givenName || !surName || !email || !seat) {
    res.status(400).json({ status: 400, message: "Missing required fields" });
    return;
  } // email validation
  else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    )
  ) {
    res.status(400).json({ status: 400, message: "Invalid email address" });
    return;
  } // if validation passes, update the reservation
  else {
    try {
      const client = new MongoClient(MONGO_URI, options);
      console.log("Connecting to MongoDB...");
      await client.connect();
      const db = client.db("slingair");
      const result = await db.collection("reservations").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            flight: flight,
            seat: seat,
            givenName: givenName,
            surName: surName,
            email: email,
          },
        }
      );

      const result2 = await db
        .collection("flights")
        .updateOne(
          { _id: flight, "seats.id": seat },
          { $set: { "seats.$.isAvailable": false } }
        );

      // console.log("update reservation result..",result);

      res.status(200).json({
        status: 200,
        message: "Reservation updated successfully!",
        reservation: result,// i use this for reference
      });
      client.close();
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  }
};

// deletes a specified reservation
// from: /api/delete-reservation/:reservation
const deleteReservation = async (req, res) => {
  const reservationId = req.params.reservation;
  const { flight, seat } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db("slingair");
    const result = await db
      .collection("reservations")
      .deleteOne({ _id: ObjectId(reservationId) });
    // console.log("delete reservation result..",result);
    const result2 = await db
      .collection("flights")
      .findOneAndUpdate(
        { _id: flight, "seats.id": seat },
        { $set: { "seats.$.isAvailable": true } }
      );
    res.status(200).json({
      status: 200,
      message: "Reservation deleted!",
      reservation: result, // i use this for reference
    });

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
