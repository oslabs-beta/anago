import { useEffect, useState } from 'react';
import { UserData } from '../../../types';
import { Modal } from 'react-responsive-modal';
import { ScopeType } from '../../../types';
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
import React from 'react';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors,
  Title,
  Tooltip,
  Legend
);

const MetricDisplay = ({ metricId, editMode }) => {
  // current userData
  const userData = useRouteLoaderData('home') as UserData;
  //state to handle modal and handling fetched data router
  const [open, setOpen]: any = useState(false);
  const [metricData, setMetricData]: any = useState({});
  //button to delete metrics from userData
  const [trashCanClicked, setTrashCanClicked] = useState<Boolean>(false);

  // display options for metrics
  const options: any = {
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };
  // Most axes should always start at 0, but some may not -- uncomment next line and add items that may not need 0-basis for plotting
  // if (![].includes(userData.metrics[metricId].lookupType))
  Object.assign(options, { scales: { y: { beginAtZero: true } } });
  // Some axes should go up to ~100
  if ([4, 7].includes(userData.metrics[metricId].lookupType))
    Object.assign(options, {
      scales: { y: { suggestedMax: 100, suggestedMin: 0 } },
    });

  //fetching data from Prometheus
  function fetchFromProm() {
    fetch(`/api/data/metrics/${metricId}`, {
      method: 'GET',
    })
      .then((data) => data.json())
      .then((data) => {
        setMetricData(data);
      })
      .catch((err) => console.log(err));
  }

  // send delete request to backend
  async function deleteMetric() {
    try {
      const response = await fetch(`/api/user/metrics/${metricId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('failed to delete metric from user data');
      } else {
        setTrashCanClicked(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(
    () => {
      //initial fetch request
      fetchFromProm();
      // auto refresh section:
      let intervalTime: number;
      // if the metric is a range metric and has a stepSize property, refresh by the stepSize property
      if (
        userData.metrics[metricId].scopeType === ScopeType.Range &&
        userData.metrics[metricId].queryOptions.hasOwnProperty('stepSize')
      ) {
        intervalTime = userData.metrics[metricId].queryOptions.stepSize;
      } else if (
        userData.metrics[metricId].scopeType === ScopeType.Instant &&
        userData.metrics[metricId].queryOptions.hasOwnProperty('refresh')
      ) {
        // if it is not a range metric and has a refresh property, refresh by the refresh property
        intervalTime = userData.metrics[metricId].queryOptions.refresh;
      } else {
        intervalTime = 300;
      }

      // set interval to update data based on intervalTime in ms
      const interval: NodeJS.Timer = setInterval(
        fetchFromProm,
        intervalTime * 1000
      );
      // clear interval so it only runs the setInterval when component is mounted
      return () => clearInterval(interval);
    },
    []
  );

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div>
      <div
        className={`metric-container${
          trashCanClicked ? '-trash-can-clicked' : ''
        }`}
      >
        <h4 className='metric-title'>
          {userData.metrics[metricId].metricName}{' '}
          {editMode && !trashCanClicked && (
            <img
              id='trash-can'
              src='client/assets/images/trash-can.png'
              onClick={deleteMetric}
              height='22px'
              width='20px'
            />
          )}
        </h4>
        {metricData.hasOwnProperty('labels') && (
          <Line data={metricData} options={options} onClick={openModal} />
        )}
        <div className='modal'>
          <Modal open={open} onClose={closeModal}>
            <h4 className='metric-title'>
              {userData.metrics[metricId].metricName}
            </h4>
            {metricData.hasOwnProperty('labels') && (
              <Line
                data={metricData}
                options={{
                  ...options,
                  plugins: { legend: { display: true } },
                }}
              />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MetricDisplay;
