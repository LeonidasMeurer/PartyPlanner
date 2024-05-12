import React, { Fragment } from 'react';
import { useCookies } from 'react-cookie';

import './styles.css';

import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import NavBar from './components/NavBar';
import Auth from './components/Auth';
import HomePage from './pages/HomePage';
import LogInPage from './pages/LogInPage';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.userEmail;
  const authToken = cookies.authToken;


  return (

    <Fragment>
      {!authToken && <LogInPage/>}
      {authToken &&
        <HomePage/>
      }
    </Fragment>
  );
}

export default App;
