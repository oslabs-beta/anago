import React, { useContext, useEffect, useState } from 'react';
import { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Props, StoreContext } from '../stateStore';
import { Metric } from '../../server/models/userDataClass';
import MetricDisplay from './MetricDisplay';

const Dashboard = () => {
//   const { currentDashboard }: any = useContext(StoreContext);

//   console.log('in dashboard component', currentDashboard);
  
//   const metricIds = [...currentDashboard.metrics];
//   console.log(metricIds);

//   const metrics: React.ReactNode = [];

//   metricIds.forEach(metricId => {
//     try {
//       fetch(`/api/metrics:${metricId}`, {
//         method: 'GET',
//       })
//         .then(data => data.json())
//         .then(data => metrics.push(<MetricDisplay {...data} />));
//     } catch (err) {
//       console.log(err);
//     }
//   });



  return (
    <div>
      
      "I am in the dashboard"
    </div>
  );

  
};

export default Dashboard;
//<h2>{currentDashboard.dashboardName}</h2>


