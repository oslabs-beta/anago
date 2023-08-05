import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../stateStore';
import MetricDisplay from './MetricDisplay';



const Dashboard = () => {

    useEffect(()=>{

    }, [])
  
    const metrics = [];

    return (
        <>
        {metrics}
        </>
    )
}

export default Dashboard;