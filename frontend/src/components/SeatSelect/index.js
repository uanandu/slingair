import styled from "styled-components";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import SeatSelect from "./SeatSelect";
import Plane from "./Plane";

import axios from "axios";
import { FlightSelect } from "./FlightSelect";
import { Form } from "./Form";
import Confirmation from "../Confirmation";
// here we get the data for seats from the backend

export const HomePage = () => {
  const history = useHistory();

  const [seating, setSeating] = useState([]);
  const [flight, setFlight] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [formData, setFormData] = useState({
    seat: "",
    givenName: "",
    surname: "",
    email: "",
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    axios.get("api/get-flights").then((res) => {
      // console.log("get flights results..",res.data.flight_list[0].flight);
      // console.log("the type of data", typeof(res.data.flight_list[0].flight))
      setFlight(res.data.flight_list[0].flight);
      setSeating(res.data.flight_list[0].seats);
    });
  }, []);

  //   console.log("seating", seating);
  //   console.log("flight", flight);

  const handleSeatSelect = (seat) => {
    setSelectedSeats(seat);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let data= {}
  // console.log(formData);
  // console.log(selectedSeats);

  // form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log("this is e from confirm button", e);

    data = {
      flight: flight,
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
      history.push("/confirmed");
      }
    });
  };

  return (
    <MainWrapper>
      <SeatSelect flight={flight} />
      <SeatInfo>Select your seat and Provide your information!</SeatInfo>
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
          setDisabled={setDisabled}
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
