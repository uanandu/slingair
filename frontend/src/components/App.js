import styled from "styled-components";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { HomePage } from "./SeatSelect";
import Confirmation from "./Confirmation";
import { ErrorPage } from "./ErrorPage";
import GlobalStyles from "./GlobalStyles";
import { Reservation } from "./Reservation";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <Main>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation />
          </Route>
          <Route path="/reservation">
            <Reservation />
          </Route>
          <Route path="*">
            <ErrorPage />
          </Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
`;

export default App;
