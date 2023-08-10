import React, { useContext, useEffect, useState } from 'react';
import { Props, StoreContext } from '../stateStore';
import { MetricProps } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const MetricDisplay = ({ metricId }) => {
  const [metricData, setMetricData]: any = useState({});

  useEffect(() => {
    console.log('in use effect');
    fetch(`/api/data/metrics/${metricId}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => {
        console.log('fetched data', data);
        setMetricData(data);
      });

  }, []);

  console.log('metric data: ', metricData);
  return (
    <div>
      <h1>This is a metric named {metricId}</h1>
      {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
    </div>
  );
};

export default MetricDisplay;
