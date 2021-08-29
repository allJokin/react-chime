import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import MeetingsPage from "./routes/meetings/MeetingsPage";
import MeetingNewPage from "./routes/meetings/MeetingNewPage";
import MeetingPage from "./routes/meetings/MeetingPage";

const Div = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <Div>
      <Router>
        <Switch>
          <Route path="/meetings/new">
            <MeetingNewPage />
          </Route>
          <Route path="/meetings/:id">
            <MeetingPage />
          </Route>
          <Route path="/meetings">
            <MeetingsPage />
          </Route>
        </Switch>
      </Router>
    </Div>
  );
}

export default App;
