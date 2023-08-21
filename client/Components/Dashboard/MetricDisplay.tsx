import React, { useEffect, useState } from 'react';
import { UserData } from '../../../types';
import { Modal } from 'react-responsive-modal';
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
import { useRouteLoaderData } from 'react-router-dom';

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

  //state to handle modal and handling fetched data router
  const [open, setOpen]: any = useState(false);
  const [metricData, setMetricData]: any = useState({});

  // display options for metrics
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  //fetching data from Prometheus
  function fetchFromProm() {
    //console.log('Current user in metric:', userData);
    fetch(`/api/data/metrics/${metricId}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => {
        setMetricData(data);
      })
      .catch(err => console.log(err));
  }

  useEffect(
    () => {
      //initial fetch request
      //this is made on the assumption of this structure:
      //{userData: metrics: metricId: queryOptions: stepSize/Refresh}
      fetchFromProm();
      // auto refresh section:
      // let intervalTime: number;
      // // check to see if it is a range metric
      // if (userData.metrics[metricId].scopeType === 'ScopeType.Range') {
      //   // find the interval time for that metric based on the stepSize
      //   intervalTime = userData.metrics[metricId].queryOptions.stepSize;
      // } else {
      //   // if it is not a range metric (i.e. no stepSize), use the refresh property
      //   intervalTime = userData.metrics[metricId].queryOptions.refresh;
      // }
      // // set interval to update data based on intervalTime in ms
      // const interval: NodeJS.Timer = setInterval(
      //   fetchFromProm,
      //   intervalTime * 1000
      // );
      // // clear interval so it only runs the setInterval when component is mounted
      // return () => clearInterval(interval);
    },
    [
      // userData.metrics[metricId].scopeType,
      // userData.metrics[metricId].queryOptions.stepSize,
      // userData.metrics[metricId].queryOptions.refresh,
    ],
  );

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='metric-container'>
      <h4 className='metric-title'>{userData.metrics[metricId].metricName}</h4>
      {metricData.hasOwnProperty('labels') && (
        <Line data={metricData} options={options} onClick={openModal} />
      )}
      <div className='modal'>
        {/* {metricId && <button onClick={openModal}>See more</button>} */}
        <Modal open={open} onClose={closeModal}>
          <h4 className='metric-title'>
            {userData.metrics[metricId].metricName}
          </h4>
          {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
        </Modal>
      </div>
    </div>
  );
};

export default MetricDisplay;
