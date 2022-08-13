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

    res.status(200).json({
      status: 200,
      flight_list: result,
      message: "the requested flight list",
    });

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

  const client = new MongoClient(MONGO_URI, options);

  console.log("Connecting to MongoDB...");

  await client.connect();

  const db = client.db("slingair");

  const result = await db
    .collection("flights")
    .findOne({ flight: flightNumber });

  // console.log("get flight result..",result);

  if (result) {
    try {
      // console.log("get flight info with number",result);

      res.status(200).json({
        status: 200,
        flight_seats: result.seats,
        message: "the requested seats",
      });

      client.close();
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  } else {
    res.status(404).json({ status: 404, message: "flight not found" });
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

    res.status(200).json({
      status: 200,
      reservation_list: result,
      message: "the requested data",
    });

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

  const client = new MongoClient(MONGO_URI, options);

  console.log("Connecting to MongoDB...");

  await client.connect();

  const db = client.db("slingair");

  const query = { _id: ObjectId(reservationId) };

  const result = await db.collection("reservations").findOne({ _id: query });

  if (result) {
    try {
      // console.log("get single reservation result..",result);

      res.status(200).json({
        status: 200,
        reservation: result,
        message: "the requested reservation data",
      });

      client.close();
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  } else {
    res.status(404).json({ status: 404, message: "reservation not found" });
  }
};

// creates a new reservation
// from: /api/add-reservation
const addReservation = async (req, res) => {
  //   console.log("add reservation", req.body);

  const { flight, givenName, surName, email, seat } = req.body;

  const client = new MongoClient(MONGO_URI, options);

  console.log("Connecting to MongoDB...");

  await client.connect();

  const db = client.db("slingair");

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
    let availableSeat = false;

    const seatAvailability = await db
      .collection("flights")
      .findOne({ _id: flight });

    seatAvailability.seats.forEach((seat) => {
      if (seat.isAvailable && seat.id === req.body.seat) {
        seat.isAvailable = false;
        availableSeat = true;
      }
    });

    const newReservationHelp = {
      _id: uuidv4(),
      ...req.body,
    };

    const setNewSeatValue = {
      $set: {
        seats: seatAvailability.seats,
      },
    };

    if (availableSeat) {
      try {
        const result = await db
          .collection("flights")
          .updateOne({ _id: flight }, setNewSeatValue);

        const newReservation = await db
          .collection("reservations")
          .insertOne(newReservationHelp);

        // console.log("add reservation result..",result);

        res.status(200).json({
          status: 200,
          reservation: newReservationHelp,
          message: "reservaton has been successfully created",
        });

        client.close();
      } catch (err) {
        res.status(400).json({ status: 500, message: err.message });
      }
    } else {
      res.status(400).json({ status: 400, message: "Seat is not available" });
      return;
    }
  }
};

// updates an existing reservation
// from: /api/update-reservation/
const updateReservation = async (req, res) => {
  // console.log("update reservation", req.body);
  // console.log("update reservation", req.params.reservation);

  const { flight, givenName, surName, email, seat } = req.body;

  const reservationId = req.params.reservation;

  const query = { _id: reservationId };

  console.log("query for reservation", query);

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
  } // if validation passes, update the reservation
  else {
    try {
      const client = new MongoClient(MONGO_URI, options);
      console.log("Connecting to MongoDB...");
      await client.connect();
      const db = client.db("slingair");

      const selectedResult = await db.collection("reservations").findOne(query);

      console.log("selected seat result..", selectedResult);

      if (seat !== selectedResult.seat) {
        const flight = selectedResult.flight;
        const flightInformation = await db
          .collection("flights")
          .findOne({ _id: flight });

        // console.log("flight information..", flightInformation);

        // check new seat availability
        const newSeatTest = flightInformation.seats.find(
          (item) => item.id === seat
        );

        console.log("new seat test", newSeatTest);

        if (!newSeatTest.isAvailable) {
          res
            .status(404)
            .json({ status: 404, message: "Seat is not available" });
          return;
        } else {
          const newSeat = await db
            .collection("flights")
            .updateOne(
              { _id: flight, "seats.id": seat },
              { $set: { "seats.$.isAvailable": false } }
            );

          const OldSeat = await db
            .collection("flights")
            .updateOne(
              { _id: flight, "seats.id": selectedResult.seat },
              { $set: { "seats.$.isAvailable": true } }
            );
        }
      }

      // update the collection

      const finalResult = await db.collection("reservations").updateOne(query, {
        $set: {
          flight: flight,
          seat: seat,
          givenName: givenName,
          surName: surName,
          email: email,
        },
      });

      // console.log("update reservation result..",result);

      res.status(200).json({
        status: 200,
        message: "Reservation updated successfully!",
        reservation: finalResult, // i use this for reference
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

  const client = new MongoClient(MONGO_URI, options);
  console.log("Connecting to MongoDB...");
  await client.connect();
  const db = client.db("slingair");

  const query = { _id: reservationId };

  const findReservation = await db.collection("reservations").findOne(query);

  if (findReservation) {
    try {

      const updateFlightSeating = await db
        .collection("flights")
        .updateOne(
          { _id: findReservation.flight, "seats.id": findReservation.seat },
          { $set: { "seats.$.isAvailable": true } }
        );

      const deleteReservedOne = await db
        .collection("reservations")
        .deleteOne(query);

      res.status(200).json({
        status: 200,
        message: "Reservation deleted successfully!",
        reservation: deleteReservedOne,
        flight: updateFlightSeating,
      });

      client.close();
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  } else {
    res.status(404).json({ status: 404, message: "Reservation not found" });
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
