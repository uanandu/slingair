import styled from "styled-components";

import Plane from "./Plane";

const SeatSelect = ({}) => {
  return (
    <Wrapper>
      <FlightSelect>
        <InstructionLabel>flight number :</InstructionLabel>
        <FlightNumber>
          <FlightNumberInstruction>Select a flight</FlightNumberInstruction>
          <Flights>flight 1 {/* placeholder */}</Flights>
        </FlightNumber>
      </FlightSelect>
      <SeatWrapper>
        <SeatInfo>Select your seat and Provide your information!</SeatInfo>
        <SeatDiv>
          <Plane />
          <SeatForm>
            <InputFirstName placeholder="First Name" />
            <InputLastName placeholder="Last Name" />
            <InputEmail placeholder="Email" />
            <ConfirmButton>Confirm</ConfirmButton>
          </SeatForm>
        </SeatDiv>
      </SeatWrapper>
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

// for the seat select
const SeatWrapper = styled.div`
  position: "relative";
`;

const SeatInfo = styled.h2`
  text-align: center;
  margin-top: 20px;
`;

const SeatDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const SeatSection = styled.div`
  background: white;
  display: flex;
  align-items: center;
  margin: 50px;
  border-right: 10px solid var(--color-cadmium-red);
  border-left: 10px solid var(--color-cadmium-red);
  width: 300px;
  height: 500px;
  padding: 20px;
`;
const SeatForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border: 1px solid var(--color-cadmium-red);
  padding: 50px;
`;
const InputFirstName = styled.input``;
const InputLastName = styled.input``;
const InputEmail = styled.input``;
const ConfirmButton = styled.button`
  width: 285px;
  background: var(--color-cadmium-red);
`;

export default SeatSelect;
