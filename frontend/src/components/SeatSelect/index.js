import styled from "styled-components";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import SeatSelect from "./SeatSelect";

import axios from "axios";
import { FlightSelect } from "./FlightSelect";
import { Form } from "./Form";
// here we get the data for seats from the backend

export const HomePage = () => {
  const history = useHistory();

  const [seating, setSeating] = useState([]);
  const [flight, setFlight] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [flightSelect, setFlightSelect] = useState("");
  const [disabled, setDisabled] = useState(true);

  const [formData, setFormData] = useState({
    seat: "",
    givenName: "",
    surname: "",
    email: "",
  });


  const handleFlightSelect = (flight) => {
    // console.log("flight inside handleflight function", flight.target.value);
    setFlightSelect(flight.target.value);
  };

  // console.log("here is the selected flight info", flightSelect);

  useEffect(() => {
    axios.get("api/get-flights").then((res) => {
      console.log("get flights results..", res.data.flight_list);
      // console.log("the type of data", typeof(res.data.flight_list[0].flight))

      const flightList = res.data.flight_list;
      flightList.find((flight) => {
        if (flight.flight === flightSelect) {
          setSeating(flight.seats);
        } else {
          setSeating([]);
        }
      });
    });
  }, [flightSelect]);

  // console.log("seating", seating);
  //   console.log("flight", flight);

  const handleSeatSelect = (seat) => {
    setSelectedSeats(seat);
    if(seat){
      setDisabled(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let data = {};
  console.log("here is the form data", formData);
  console.log("here is the selected seat", selectedSeats);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log("this is e from confirm button", e);

    data = {
      flight: flightSelect,
      seat: selectedSeats,
      givenName: e.target[0].value,
      surName: e.target[1].value,
      email: e.target[2].value,
    };
    // console.log("data", data);

    axios.post("/api/add-reservation", data).then((res) => {
      console.log("response from the server", res);
      if (res.status === 201) {
        localStorage.setItem("reservationId", res.data.your_reservation_id);
        localStorage.setItem("reserved", true);
      }
      history.push("/confirmed");
      window.location.reload()
      if (res.status === 400) {
        setError(true);
        setErrorMessage(res.data.message);
      }
    });
  };

  return (
    <MainWrapper>
      <SeatSelect handleFlightSelect={handleFlightSelect} />
      <SeatInfo>Select your seat and Provide your information!</SeatInfo>
      {error ? <h3>{errorMessage}</h3> : null}
      <Wrapper>
        <FlightSelect
          seats={seating}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          formData={formData}
          handleChange={handleChange}
          handleSeatSelect={handleSeatSelect}
        />
        <Form
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          disabled={disabled}
        />
      </Wrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SeatInfo = styled.h2`
  text-align: center;
  margin-top: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 15%;
`;

export default SeatSelect;
