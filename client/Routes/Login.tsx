import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../stateStore';
import { Form } from 'react-router-dom';

const Login = () => {

  return(<div className="login">
    <form method='GET' action='/api/user'>
      <input type='text' name='username' placeholder='username'/>
      <input type='password' name='password'/>
      <button type='submit'>Log In</button>
    </form>
  </div>)
};

export default Login;
