import React, { useContext, useEffect, useState } from 'react';
import { Props, StoreContext } from '../stateStore';
import { MetricProps, UserData } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors,
  Title,
  Tooltip,
  Legend,
);

const MetricDisplay = ({ metricId }) => {
  const userData = useRouteLoaderData('home') as UserData;
  const navigate = useNavigate();
  console.log('metric display', userData);

  const [metricData, setMetricData]: any = useState({});

  useEffect(() => {
    console.log('Current user in metric:', userData);
    fetch(`/api/data/metrics/${metricId}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => {
        console.log('fetched data', data);
        setMetricData(data);
      })
      .catch(err => console.log(err));
  }, []);


  const handleClick = () => navigate(`${metricId}`);

  console.log('metric data: ', metricData);
  return (
    <div className='metric-container' onClick={handleClick}>
      <h4 className='metric-title'>{userData.metrics[metricId].metricName}</h4>
      {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
    </div>
  );
};
// const MetricDisplay = ({ metricId }) => {
//   const { currentUser }: any = useContext(StoreContext);
//   const [metricData, setMetricData]: any = useState({});

//   useEffect(() => {
//     console.log('Current user:', currentUser);
//     fetch(`/api/data/metrics/${metricId}`, {
//       method: 'GET',
//     })
//       .then((data) => data.json())
//       .then((data) => {
//         console.log('fetched data', data);
//         setMetricData(data);
//       });
//   }, []);

//   console.log('metric data: ', metricData);
//   return (
//     <div className="metric-container">
//       <h4 className="metric-title">
//         {currentUser.metrics[metricId].metricName}
//       </h4>
//       {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
//     </div>
//   );
// };

export default MetricDisplay;
