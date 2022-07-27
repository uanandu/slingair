import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

export const Reservation = () => {
  const [reservation, setReservation] = useState({});

  const reservedId = localStorage.getItem("reservationId");

  // fet the reservation from the backend to set confirmation page
  useEffect(() => {
    axios.get(`api/get-reservation/${reservedId}`).then((res) => {
      console.log("get reservation results..", res.data.reservation);

      setReservation(res.data.reservation);
    });
  }, [reservedId]);
  return (
    <>
      <h1 style={{margin: "20px"}}>View Reservation</h1>
      <Wrapper>
        <h3>
          Hi there {reservation.givenName} {reservation.surName}!
        </h3>
        <ReservationInfo>
          <ReservedInfo id={reservedId}></ReservedInfo>
          <ReservedInfo>
            <strong>Reservation #:</strong>
            {reservedId}
          </ReservedInfo>
          <ReservedInfo>
            <strong>Flight #:</strong> {reservation.flight}
          </ReservedInfo>
          <ReservedInfo>
            <strong>Seat #:</strong> {reservation.seat}
          </ReservedInfo>
          <ReservedInfo>
            <strong>Name:</strong> {reservation.givenName} {reservation.surName}
          </ReservedInfo>
          <ReservedInfo>
            <strong>Email:</strong> {reservation.email}
          </ReservedInfo>
        </ReservationInfo>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--color-cadmium-red);
  border-radius: 10px;
  width: 40vw;
  height: 40vh;
  padding: 20px;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  position: relative;
`;

const ReservationInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  margin: 20px;
`;
const ReservedInfo = styled.p``;
