import styled from "styled-components";

export const Form = ({ formData, disabled, handleChange, handleSubmit }) => {
  return (
    <>
      <SeatForm onSubmit={handleSubmit}>
        <InputFirstName
          type="text"
          placeholder="First Name"
          value={formData.givenName}
          name="givenName"
          onChange={(e)=>handleChange(e)}
        />
        <InputLastName
          type="text"
          placeholder="Last Name"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />
        <InputEmail
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <ConfirmButton
          type="submit"
          disabled={disabled}
        >
          Confirm
        </ConfirmButton>
      </SeatForm>
    </>
  );
};

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
