import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../stateStore';
import MetricDisplay from './MetricDisplay';

const NavBar = () => {
  return (
    <>
      <MetricDisplay />
    </>
  );
};

export default NavBar;
