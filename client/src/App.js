import "bootstrap/dist/css/bootstrap.min.css"
import * as React from 'react';
import Login from "./Login"
import Dashboard from "./Dashboard"
import Loader from './Loader';
import SignIn from './pages/SignIn';
import { BrowserRouter as Router } from "react-router-dom";
import useLoggedIn from './hooks/useLoggedIn';

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const loggedIn = useLoggedIn(setIsLoading);
  const [isLogged, setIsLogged] = React.useState(loggedIn);

  React.useEffect(() => {
    if (loggedIn) setIsLogged(loggedIn);
  }, [loggedIn]);

  if (isLoading) return <Loader />

  if (!isLogged) return <SignIn isLogged={isLogged} setIsLogged={setIsLogged} />;

  return <Router>
    {code ? <Dashboard code={code} /> : <Login />}
  </Router>;
}

export default App;
