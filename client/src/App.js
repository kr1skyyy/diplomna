import "bootstrap/dist/css/bootstrap.min.css"
import * as React from 'react';
import Login from "./Login"
import Dashboard from "./Dashboard"
import SignIn from './pages/SignIn';
import { BrowserRouter as Router } from "react-router-dom";
import useLoggedIn from './hooks/useLoggedIn';
import { css } from "@emotion/react";
import { RingLoader } from 'react-spinners';

const code = new URLSearchParams(window.location.search).get("code");

const loaderCss = css
`position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
transform: -webkit-translate(-50%, -50%);
transform: -moz-translate(-50%, -50%);
transform: -ms-translate(-50%, -50%);`;

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const loggedIn = useLoggedIn(setIsLoading);
  const [isLogged, setIsLogged] = React.useState(loggedIn);

  React.useEffect(() => {
    if (loggedIn) setIsLogged(loggedIn);
  }, [loggedIn]);

  if (isLoading) return <RingLoader css={loaderCss} size={100} />;

  if (!isLogged) return <SignIn isLogged={isLogged} setIsLogged={setIsLogged} />;

  return <Router>
    {code ? <Dashboard code={code} /> : <Login />}
  </Router>;
}

export default App;
