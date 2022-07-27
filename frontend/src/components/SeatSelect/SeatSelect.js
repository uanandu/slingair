import styled from "styled-components";

const SeatSelect = ({ handleFlightSelect }) => {
  // console.log("flight inside seatsection", flight);
  return (
    <Wrapper>
      <FlightSelect>
        <InstructionLabel>flight number :</InstructionLabel>
        <FlightNumber onChange={handleFlightSelect}>
          <FlightNumberInstruction>Select a flight</FlightNumberInstruction>
          <Flights value="SA231">SA231</Flights>
        </FlightNumber>
      </FlightSelect>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// for the flight select
const FlightSelect = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  padding-left: 2rem;
  align-items: center;
  background: var(--color-cadmium-red);
`;
const InstructionLabel = styled.h3`
  text-transform: uppercase;
  margin-right: 20px;
`;
const FlightNumber = styled.select`
  height: 30px;
  width: 140px;
  border: 1px solid var(--color-cadmium-red);
  border-radius: 5px;
  text-align: center;
  font-size: 0.8rem;
  text-transform: uppercase;
`;
const FlightNumberInstruction = styled.option`
  height: 30px;
  width: 150px;
  border: 1px solid var(--color-cadmium-red);
  border-radius: 5px;
  text-align: center;
  font-size: 0.7rem;
  text-transform: uppercase;
`;
const Flights = styled.option``;

export default SeatSelect;
