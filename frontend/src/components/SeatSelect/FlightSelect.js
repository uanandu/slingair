import styled from "styled-components";
import Plane from "./Plane";

export const FlightSelect = ({
  seats,
  selectedSeats,
  setSelectedSeats,
  formData,
  handleChange,
  handleSeatSelect,
}) => {
  return (
    <>
      <SeatDiv>
        <Plane
          seats={seats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          formData={formData}
          handleChange={handleChange}
          handleSeatSelect={handleSeatSelect}
        />
      </SeatDiv>
    </>
  );
};

const SeatDiv = styled.div`
  display: flex;
`;
