import styled from "styled-components";

export const Form = ({ formData, disabled, handleChange, handleSubmit }) => {
  // console.log("disabled value inside form", disabled);
  return (
    <>
      <SeatForm onSubmit={handleSubmit}>
        <InputFirstName
          type="text"
          placeholder="First Name"
          value={formData.givenName}
          name="givenName"
          onChange={(e) => handleChange(e)}
          autoFocus
          required
        />
        <InputLastName
          type="text"
          placeholder="Last Name"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <InputEmail
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <ConfirmButton type="submit" disabled={disabled} value="Confirm"/>
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
const ConfirmButton = styled.input`
  width: 285px;
  background: var(--color-cadmium-red);
  :disabled {
    background: var(--color-cadmium-red-light);
  }
`;
