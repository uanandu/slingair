import styled from "styled-components";

const SeatSelect = ({ flight }) => {
  // console.log("flight inside seatsection", flight);
  return (
    <Wrapper>
      <FlightSelect>
        <InstructionLabel>flight number :</InstructionLabel>
        <FlightNumber>
          <FlightNumberInstruction>Select a flight</FlightNumberInstruction>
          <Flights>{flight}</Flights>
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
  width: 125px;
`;
const FlightNumberInstruction = styled.option``;
const Flights = styled.option``;

export default SeatSelect;
